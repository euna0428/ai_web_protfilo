(function(){
  // ✅ admin 화면은 별도 권한/레이아웃을 쓰는 경우가 많아서 가드에서 제외
  try{
    if(location && location.pathname && location.pathname.indexOf('/admin') === 0){
      return;
    }
  }catch(e){}

  var cache = { value: null, ts: 0 };
  var TTL = 5000;

  var PROTECTED = [
    /^\/community\/write(\b|\/|\?|#)/,
    /^\/community\/my-reviews(\b|\/|\?|#)/,
    /^\/community\/edit(\b|\/|\?|#)/,
    /^\/members\/mypage(\b|\/|\?|#)/,
    // ✅ 여행 계획(비회원 접근 차단)
    /^\/plans(\b|\/|\?|#)/,
    /^\/plan(\b|\/|\?|#)/,
    /^\/support\/qna(\b|\/|\?|#)/,
    /^\/support\/qna\/new(\b|\/|\?|#)/
  ];

  function getCtx(){
    try{
      var c = document && document.body ? document.body.getAttribute('data-ctx') : '';
      if(!c) return '';
      // '/'는 컨텍스트 경로로 쓰지 않음
      if(c === '/') return '';
      return c;
    }catch(e){
      return '';
    }
  }

  function normalizePath(path){
    var ctx = getCtx();
    if(!ctx) return path;
    // 예: ctx='/plantrip' , path='/plantrip/plans/planRoute' -> '/plans/planRoute'
    if(path && path.indexOf(ctx) === 0){
      return path.substring(ctx.length) || '/';
    }
    return path;
  }

  function isProtectedPath(path){
    var p = normalizePath(path);
    return PROTECTED.some(function(rx){ return rx.test(p); });
  }

  function getPathFromHref(href){
    try{
      var u = new URL(href, location.origin);
      if(u.origin !== location.origin) return null;
      return u.pathname + u.search + u.hash;
    }catch(e){
      return null;
    }
  }

  function isLoggedIn(){
    var now = Date.now();
    if(cache.value !== null && (now - cache.ts) < TTL) return Promise.resolve(cache.value);
    return fetch('/api/auth/status', { credentials:'same-origin' })
      .then(function(r){ return r.ok ? r.json() : { loggedIn:false }; })
      .then(function(j){
        cache.value = !!j.loggedIn;
        cache.ts = Date.now();
        return cache.value;
      })
      .catch(function(){
        cache.value = false;
        cache.ts = Date.now();
        return false;
      });
  }

  // protected 링크는 "먼저" 이동을 막고, 로그인 여부에 따라 이동/모달을 결정
  document.addEventListener('click', function(e){
    if(e.defaultPrevented) return;

    // 새 탭/우클릭/특수키는 기본 동작 유지
    if(typeof e.button === 'number' && e.button !== 0) return;
    if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if(!a) return;

    // auth-modal.js가 처리하는 data-auth-open 링크는 여기서 건드리지 않음
    if(a.hasAttribute('data-auth-open') || a.hasAttribute('data-auth-switch')) return;
    if(a.getAttribute('target') === '_blank') return;

    var rawHref = a.getAttribute('href');
    if(!rawHref) return;

    var path = getPathFromHref(rawHref);
    if(!path) return;
    if(!isProtectedPath(path)) return;

    // 여기서 바로 막아야 "커뮤니티 화면 위에" 모달이 뜸
    e.preventDefault();

    isLoggedIn().then(function(loggedIn){
      if(loggedIn){
        location.href = rawHref;
        return;
      }

      try{ sessionStorage.setItem('authRedirect', path); }catch(err){}

      // 커스텀 UI 경고 → 확인 시 로그인 모달
      if(window.LoginRequiredPrompt && typeof window.LoginRequiredPrompt.open === 'function'){
        window.LoginRequiredPrompt.open({
          message: '로그인이 필요한 작업입니다.\n계속하려면 로그인해 주세요.',
          onConfirm: function(){
            if(window.AuthModal && typeof window.AuthModal.open === 'function'){
              window.AuthModal.open('login');
            }
          }
        });
        return;
      }

      // 혹시 프롬프트 UI가 로드되지 않은 페이지라도 기본 alert/confirm은 쓰지 않고 로그인만 오픈
      if(window.AuthModal && typeof window.AuthModal.open === 'function'){
        window.AuthModal.open('login');
      }
    });
  }, true);

})();
