(function(){
  var root = document.documentElement;
  var key = "plantrip-theme";

  function applyRouteClass(){
    try{
      var path = (location && location.pathname) ? location.pathname : "";
      var isHome =
        path === "/" ||
        /\/index(\.jsp)?$/.test(path) ||
        /\/home$/.test(path) ||
        /\/main$/.test(path);

      if(document.body){
        document.body.classList.toggle("is-home", !!isHome);
      }
    }catch(e){}
  }

  /* =====================================================
     ✅ 테마(라이트/다크) 기능 임시 보류 (2026-02-25)
     - 항상 light 고정
     - 토글 버튼은 화면에서 숨김
     ===================================================== */
  function lockLightTheme(){
    try{ localStorage.setItem(key, "light"); }catch(e){}
    root.dataset.theme = "light";

    var btn = document.getElementById("themeToggle");
    if(btn){
      // UI는 남겨두되(복구용) 화면에서만 숨김
      btn.style.display = "none";
      btn.setAttribute("aria-hidden","true");
      btn.setAttribute("tabindex","-1");
    }
  }

  // =========================
  // Nav hover magnify (cursor-driven)
  // - 로그인/회원가입 버튼은 건드리지 않음 (header-auth는 제외)
  // =========================
  function initNavMagnify(){
    var nav = document.querySelector('header .nav');
    if(!nav) return;

    var items = Array.prototype.slice.call(
      nav.querySelectorAll(':scope > a, :scope > .nav-dropdown > .nav-drop-btn')
    );
    if(!items.length) return;

    var raf = 0;
    var lastX = 0;

    function apply(){
      raf = 0;
      items.forEach(function(el){
        var r = el.getBoundingClientRect();
        var cx = r.left + r.width/2;
        var dist = Math.abs(lastX - cx);

        var t = Math.max(0, 1 - dist/240);
        var scale = 1 + 0.28 * (t*t);
        var ty = -5 * t;

        el.style.transition = 'transform 120ms cubic-bezier(.2,.85,.2,1)';
        el.style.transform = 'translate(0px,' + ty.toFixed(2) + 'px) scale(' + scale.toFixed(3) + ')';
      });
    }

    function onMove(e){
      lastX = e.clientX;
      if(!raf) raf = requestAnimationFrame(apply);
    }

    function reset(){
      if(raf){ cancelAnimationFrame(raf); raf = 0; }
      items.forEach(function(el){
        el.style.transition = 'transform 360ms cubic-bezier(.2,.85,.2,1)';
        el.style.transform = '';
      });
    }

    nav.addEventListener('mousemove', onMove);
    nav.addEventListener('mouseleave', reset);
  }

  function init(){
    applyRouteClass();
    lockLightTheme();
    initNavMagnify();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
})();
