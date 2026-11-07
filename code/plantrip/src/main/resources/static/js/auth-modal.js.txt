/*
  auth-modal.js
  - 로그인/회원가입을 메인 위에 모달로 띄우기
  - ESC 닫기, 배경 클릭 닫기, 포커스 트랩, body 스크롤 잠금
  - 기존 컨트롤러/폼 action/name 은 건드리지 않음
*/

(function(){
  if(window.__PT_AUTH_MODAL_INIT) return;
  window.__PT_AUTH_MODAL_INIT = true;

  const q = (sel, el=document) => el.querySelector(sel);
  const qa = (sel, el=document) => Array.from(el.querySelectorAll(sel));


  // ✅ 페이지마다 레이아웃 wrapper에 transform/scale 등이 걸려있으면
  // position:fixed 모달이 작아보이거나 위치가 달라질 수 있음.
  // 모달을 document.body 최하단으로 강제 이동해서 "메인 화면과 동일한 크기"로 통일합니다.
  function ensureModalsOnBody(){
    try{
      document.querySelectorAll('.auth-modal').forEach(function(modal){
        if(modal.parentElement !== document.body){
          document.body.appendChild(modal);
        }
      });
    }catch(e){}
  }

  ensureModalsOnBody();

  // 스와이프 전환(모달 2개가 잠깐 공존) 시 잔상/겹침 방지용
  // ✅ Toast/알림 UI가 항상 더 위에 보이도록 모달 z-index 기준을 올림
  let zCounter = 30000;

  // 전환/애니메이션 충돌 방지용 시퀀스
  // 클릭을 연속으로 해도 이전 애니메이션 콜백이 뒤늦게 실행되며 모달이 꼬이지 않도록 막습니다.
  let transitionSeq = 0;

  function bumpTransitionSeq(){
    transitionSeq += 1;
    return transitionSeq;
  }

  function resetDialogState(modal){
    const dialog = q('.auth-modal__dialog', modal);
    if(!dialog) return;

    dialog.classList.remove(
      'is-exiting',
      'is-swipe-out-left','is-swipe-in-right','is-swipe-out-right','is-swipe-in-left',
      'is-flip-in-fwd','is-flip-in-back','is-flip-out-fwd','is-flip-out-back',
      'sign-in','sign-up','sign-in-prep','sign-up-prep'
    );
  }

  function onAnimEnd(el, cb, timeoutMs){
    if(!el) return;
    const seq = transitionSeq;
    let done = false;

    const finish = () => {
      if(done) return;
      done = true;
      el.removeEventListener('animationend', onEnd);
      if(timer) clearTimeout(timer);
      // 중간에 다른 전환이 시작됐으면 무시
      if(seq !== transitionSeq) return;
      cb && cb();
    };

    const onEnd = (e) => {
      // 자식 animationend 버블링으로 여러 번 들어오는 것 방지
      if(e && e.target !== el) return;
      finish();
    };

    el.addEventListener('animationend', onEnd, { once:false });
    const timer = setTimeout(finish, timeoutMs || 650);
  }

  function getOpenModals(){
    return qa('.auth-modal.is-open');
  }
  function hardClose(modal, keepBodyLock=true){
    if(!modal) return;
    // 즉시 닫기(애니메이션/리스너/클래스 정리)
    closeModal(modal, { keepBodyLock, keepRedirect: true });
    modal.classList.remove('no-backdrop');
    const dialog = q('.auth-modal__dialog', modal);
    if(dialog){
      dialog.classList.remove('is-exiting',
        'is-swipe-out-left','is-swipe-in-right','is-swipe-out-right','is-swipe-in-left',
        'is-flip-in-fwd','is-flip-in-back','is-flip-out-fwd','is-flip-out-back'
      );
    }
  }

  function toast(msg){
    // ✅ 브라우저 기본 alert(= "localhost:8700 ..." 팝업) 절대 사용하지 않음
    if(window.UIToast && typeof window.UIToast.show === 'function'){
      window.UIToast.show(msg);
      return;
    }

    // ui-toast.js가 로드되지 않은 페이지(예외 상황)에서도 화면 내 토스트로만 처리
    try{
      var wrap = document.querySelector('.ui-toast-wrap');
      if(!wrap){
        wrap = document.createElement('div');
        wrap.className = 'ui-toast-wrap';
        wrap.style.zIndex = '40000';
        document.body.appendChild(wrap);
      }
      var t = document.createElement('div');
      t.className = 'ui-toast is-show';
      t.textContent = msg;
      wrap.appendChild(t);
      setTimeout(function(){
        t.classList.remove('is-show');
        setTimeout(function(){ try{ t.remove(); }catch(e){} }, 260);
      }, 2200);
    }catch(e){}
  }

  // ✅ 새로고침/리다이렉트 이후에도 토스트가 보이도록 플래그 처리
  (function showPendingToast(){
    try{
      var raw = sessionStorage.getItem('pt_pending_toast');
      if(!raw) return;
      sessionStorage.removeItem('pt_pending_toast');

      var msg = raw;
      // JSON으로 저장했을 수도 있으니 안전하게 파싱
      try{
        var j = JSON.parse(raw);
        if(j && j.msg) msg = String(j.msg);
      }catch(_){ }

      // ui-toast.js defer 로딩 타이밍 때문에 한 틱 뒤에 출력
      setTimeout(function(){ toast(msg); }, 50);
    }catch(e){}
  })();

  function errorBox(modal){
    if(!modal) return null;
    return q('[data-auth-error]', modal);
  }

  function fieldErrorEl(modal, field){
    if(!modal || !field) return null;
    return q(`[data-auth-field-error="${field}"]`, modal);
  }

  function clearFieldErrors(modal){
    if(!modal) return;
    qa('[data-auth-field-error]', modal).forEach(function(el){
      el.textContent = '';
      el.classList.remove('is-show');
    });
  }

  function setFieldError(modal, field, message){
    const el = fieldErrorEl(modal, field);
    if(!el) return false;
    const msg = message ? String(message) : '';
    el.textContent = msg;
    if(msg){
      el.classList.add('is-show');
    }else{
      el.classList.remove('is-show');
    }
    return true;
  }

  function setError(modal, message){
    const box = errorBox(modal);
    if(!box) return;
    if(!message){
      box.style.display = 'none';
      box.textContent = '';
      return;
    }
    box.textContent = message;
    box.style.display = 'block';
  }

  function getFocusable(root){
    return qa(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      root
    ).filter(el => el.offsetParent !== null);
  }

  function applyEntryAnimation(modal, dialog){
    if(!dialog) return;

    const isSignup = (modal && modal.id && modal.id.includes('signup'));
    const enter = isSignup ? 'sign-up' : 'sign-in';
    const prep  = isSignup ? 'sign-up-prep' : 'sign-in-prep';

    dialog.classList.remove('sign-in','sign-up','sign-in-prep','sign-up-prep');
    dialog.classList.add(prep);

    requestAnimationFrame(() => {
      dialog.classList.remove(prep);
      dialog.classList.add(enter);
    });
  }

  function openModal(modal, opts={}){
    if(!modal) return;

    resetDialogState(modal);

    // 기본: 다른 열린 모달은 닫고(겹침/두 개 뜸 방지) 이 모달만 띄움
    const closeOthers = (opts.closeOthers !== false);
    if(closeOthers){
      getOpenModals().forEach(m => { if(m !== modal) hardClose(m, true); });
    }

    // 이미 열려있으면 다시 띄우지 말고 위로만 올림
    if(modal.classList.contains('is-open')){
      modal.style.zIndex = String(++zCounter);
      const dialog = q('.auth-modal__dialog', modal);
      setTimeout(() => (dialog || modal).focus(), 0);
      return;
    }

    // 가장 위에 뜨도록 z-index를 올림
    modal.style.zIndex = String(++zCounter);

    // 전환 중(스와이프)에는 백드롭을 중복으로 깔지 않기
    if(opts.noBackdrop) modal.classList.add('no-backdrop');
    else modal.classList.remove('no-backdrop');

    modal.classList.add('is-open');
    document.body.classList.add('is-modal-open');

    // 열릴 때 이전 에러 메시지 정리
    setError(modal, null);
    clearFieldErrors(modal);

    const dialog = q('.auth-modal__dialog', modal);

    resetDialogState(modal);

    if(dialog){
      dialog.classList.remove('is-flip-in-fwd','is-flip-in-back','is-flip-out-fwd','is-flip-out-back');
    }

    // ✅ 전환 중(openModal이 switch로 호출될 때)은 entry 애니메이션을 스킵(flip이 메인)
    if(!opts.skipEntryAnimation){
      applyEntryAnimation(modal, dialog);
    }

    const focusables = dialog ? getFocusable(dialog) : [];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if(!opts.skipAutoFocus){
      setTimeout(() => (first || dialog).focus(), 0);
    }

    modal.__focusTrap = function(e){
      if(e.key !== 'Tab') return;
      const f = getFocusable(dialog);
      if(!f.length) return;
      const f1 = f[0];
      const f2 = f[f.length - 1];

      if(e.shiftKey && document.activeElement === f1){
        e.preventDefault();
        f2.focus();
      }else if(!e.shiftKey && document.activeElement === f2){
        e.preventDefault();
        f1.focus();
      }
    };

    modal.__escClose = function(e){
      if(e.key === 'Escape') closeModalAnimated(modal);
    };

    document.addEventListener('keydown', modal.__escClose);
    dialog && dialog.addEventListener('keydown', modal.__focusTrap);
  }

  function closeModal(modal, opts={}){
    if(!modal) return;

    // 사용자가 모달을 닫고 나가면(로그인 안 하고) 이전 페이지로 강제 이동되는 현상을 막기 위해
    // 리다이렉트 값은 기본적으로 제거
    if(!opts.keepRedirect){
      try{ sessionStorage.removeItem('authRedirect'); }catch(e){}
    }

    modal.classList.remove('is-open');
    if(!opts.keepBodyLock) document.body.classList.remove('is-modal-open');

    const dialog = q('.auth-modal__dialog', modal);

    if(dialog){
      dialog.classList.remove(
        'is-flip-in-fwd','is-flip-in-back','is-flip-out-fwd','is-flip-out-back',
        'sign-in','sign-up','sign-in-prep','sign-up-prep'
      );
    }

    if(modal.__escClose) document.removeEventListener('keydown', modal.__escClose);
    if(modal.__focusTrap) dialog && dialog.removeEventListener('keydown', modal.__focusTrap);
  }
  function closeModalAnimated(modal, opts={}){
    if(!modal) return;

    if(!opts.keepRedirect){
      try{ sessionStorage.removeItem('authRedirect'); }catch(e){}
    }

    const dialog = q('.auth-modal__dialog', modal);
    if(!dialog){
      closeModal(modal, opts);
      return;
    }

    // 이미 닫는 중이면 중복 방지
    if(dialog.classList.contains('is-exiting')) return;

    // 닫기 애니메이션이 안정적으로 적용되도록
    // entry( sign-in / sign-up ) 관련 클래스를 먼저 정리하고
    // reflow 후 is-exiting을 붙여 애니메이션이 꼭 재생되게 함
    dialog.classList.remove('sign-in','sign-up','sign-in-prep','sign-up-prep');
    void dialog.offsetWidth;
    dialog.classList.add('is-exiting');

    onAnimEnd(dialog, function(){
      dialog.classList.remove('is-exiting');
      closeModal(modal, opts);
    }, 950);
  }


  // 1) data-auth-open="login|signup"
  document.addEventListener('click', function(e){
    const opener = e.target.closest('[data-auth-open]');
    if(opener){
      e.preventDefault();

      const target = opener.getAttribute('data-auth-open');

      const redirect = opener.getAttribute('data-auth-redirect');
      if(redirect){
        try{ sessionStorage.setItem('authRedirect', redirect); }catch(err){}
      }

      bumpTransitionSeq();
      openModal(q(`#authModal-${target}`), { closeOthers: true });
      return;
    }

    const closer = e.target.closest('[data-auth-close]');
    if(closer){
      e.preventDefault();
      bumpTransitionSeq();
      closeModalAnimated(closer.closest('.auth-modal'));
      return;
    }

    const openWrapper = e.target.closest('.auth-modal.is-open');
    if(openWrapper){
      const inDialog = e.target.closest('.auth-modal__dialog');
      if(!inDialog){
        bumpTransitionSeq();
        getOpenModals().forEach(m => closeModalAnimated(m));
      }
    }
  });

  // 2) 모달 전환
  // - 로그인 <-> 회원가입 : 180도 flip
  // - 로그인 <-> 비밀번호 찾기 : 스와이프
  document.addEventListener('click', function(e){
    const link = e.target.closest('a[data-auth-switch]');
    if(!link) return;

    const to = link.getAttribute('data-auth-switch');
    const currentModal = link.closest('.auth-modal');
    if(!currentModal) return;

    e.preventDefault();
    bumpTransitionSeq();

    const nextModal = q(`#authModal-${to}`);
    if(!nextModal){
      closeModal(currentModal);
      return;
    }

    const isFindSwipe = (to === 'find') || (currentModal && currentModal.id === 'authModal-find');
    const dir = (to === 'signup') ? 'fwd' : 'back';

    const curDialog = q('.auth-modal__dialog', currentModal);
    const nextDialog = q('.auth-modal__dialog', nextModal);

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !curDialog || !nextDialog){
      closeModal(currentModal, { keepBodyLock: true, keepRedirect: true });
      openModal(nextModal, { skipAutoFocus: false, closeOthers: false });
      return;
    }

    // ✅ 로그인 <-> 비밀번호 찾기 : 스와이프 (중간에 사라지는 느낌 제거)
    if(isFindSwipe){
      const forward = (to === 'find');

      // 다음 모달을 먼저 열어(백드롭 유지) 깜빡임 없이 교체
      openModal(nextModal, { skipEntryAnimation: true, skipAutoFocus: true, noBackdrop: true, closeOthers: false });

      // 현재는 나가고, 다음은 들어오게
      curDialog.classList.remove('is-swipe-out-left','is-swipe-in-right','is-swipe-out-right','is-swipe-in-left');
      nextDialog.classList.remove('is-swipe-out-left','is-swipe-in-right','is-swipe-out-right','is-swipe-in-left');

      curDialog.classList.add(forward ? 'is-swipe-out-left' : 'is-swipe-out-right');
      nextDialog.classList.add(forward ? 'is-swipe-in-right' : 'is-swipe-in-left');

      // 현재 애니메이션 끝나면 현재 모달만 닫고(바디락 유지), 다음은 열린 상태 유지
      onAnimEnd(curDialog, function(){
        closeModal(currentModal, { keepBodyLock: true, keepRedirect: true });

        // 이제 다음 모달이 단독이 되었으니 백드롭 복구
        nextModal.classList.remove('no-backdrop');

        nextDialog.classList.remove('is-swipe-in-right','is-swipe-in-left');
        // 포커스는 다음 모달로 이동
        setTimeout(function(){

          const focusables = nextDialog ? getFocusable(nextDialog) : [];
          if(focusables[0]) focusables[0].focus();
        }, 0);
      }, 700);

      return;
    }

    curDialog.classList.remove('is-flip-in-fwd','is-flip-in-back','is-flip-out-fwd','is-flip-out-back');
    curDialog.classList.add(dir === 'fwd' ? 'is-flip-out-fwd' : 'is-flip-out-back');

    onAnimEnd(curDialog, function(){
      closeModal(currentModal, { keepBodyLock: true, keepRedirect: true });

      // ✅ 전환으로 열 때는 entry 애니메이션 스킵 (flip이 확실히 보이게)
      openModal(nextModal, { skipAutoFocus: true, skipEntryAnimation: true, closeOthers: false });

      nextDialog.classList.remove('is-flip-in-fwd','is-flip-in-back','is-flip-out-fwd','is-flip-out-back');
      nextDialog.classList.add(dir === 'fwd' ? 'is-flip-in-fwd' : 'is-flip-in-back');

      onAnimEnd(nextDialog, function(){
        nextDialog.classList.remove('is-flip-in-fwd','is-flip-in-back');
      }, 650);

      setTimeout(() => {
        const focusables = getFocusable(nextDialog);
        (focusables[0] || nextDialog).focus();
      }, 0);
    }, 650);
  });

  // 3) 비밀번호 보기 토글
  // 비밀번호 보기(eye) 토글: SVG 버튼용
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".auth-modal .eye");
    if (!btn) return;

    const row = btn.closest(".input-row");
    const input = row?.querySelector('input[type="password"], input[type="text"]');
    if (!input) return;

    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";

    btn.setAttribute("aria-pressed", String(isPassword));
  });
  function toParams(form){
    const fd = new FormData(form);
    const p = new URLSearchParams();
    fd.forEach((v,k) => p.append(k, v));
    return p.toString();
  }

  function readRedirect(target){
    try{
      const r = sessionStorage.getItem('authRedirect');
      if(r){
        sessionStorage.removeItem('authRedirect');
        return r;
      }
    }catch(e){}
    return target || '/';
  }

  function loginAjax(form, modal){
    const action = form.getAttribute('action') || '/members/login';
    const id = (new FormData(form).get('id') || '').toString().trim();

    setError(modal, null);
    clearFieldErrors(modal);

    return fetch(action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'same-origin',
      body: toParams(form)
    }).then(async function(res){
      // ✅ 프로젝트에 따라 /members/login 이 (AJAX용 JSON이 아니라) 302 redirect + HTML로 응답할 수 있음.
      //    이 경우 fetch는 redirect를 따라가며 res.ok=true지만 JSON 파싱이 실패해서
      //    "로그인 실패" 문구가 뜨는 문제가 발생함.
      //    - JSON(ok:true)이면 그대로 성공 처리
      //    - redirect 발생(res.redirected=true)이면 성공으로 간주
      const ctype = (res.headers.get('content-type') || '').toLowerCase();
      let data = {};
      if(ctype.includes('application/json')){
        data = await res.json().catch(function(){ return {}; });
      }

      const isJsonSuccess = (res.ok && data && data.ok);
      const isRedirectSuccess = (res.ok && res.redirected);

      if(isJsonSuccess || isRedirectSuccess){
        // 로그인 성공 시에는 authRedirect 값을 사용해야 하므로, 닫을 때 제거하지 않도록 keepRedirect 유지
        closeModalAnimated(modal, { keepRedirect: true });
        // ✅ 로그인 성공 토스트는 "현재 페이지 유지"를 위해 새로고침/리다이렉트 이후에 보여줌
        // (reload 직전에 띄우면 바로 사라져서 "어떤 페이지는 보이고 어떤 페이지는 안 보이는" 현상이 생김)
        try{
          sessionStorage.setItem('pt_pending_toast', JSON.stringify({ msg: '로그인이 완료되었습니다.' }));
        }catch(e){}
        
        // ✅ 로그인 후에도 현재 페이지 유지 (관리자/일반 모두 동일)
        // - 모달 로그인은 페이지 이동 없이 header 상태만 갱신하면 되므로 reload로 처리
        // - 단, 현재가 로그인 페이지면 redirectTo(또는 "/")로 이동
        const curPath = (location.pathname || '');
        // JSON 성공이면 redirectTo를 활용, redirect 성공(HTML)인 경우엔 현재 페이지 유지 reload로 통일
        if(isJsonSuccess && (curPath.startsWith('/members/login') || curPath.startsWith('/members/join') || curPath.startsWith('/members/register'))){
          location.href = readRedirect(data.redirectTo) || '/';
        }else{
          location.reload();
        }
		return;
      }

      if(res.status === 401){
        if(!id){
          setFieldError(modal, 'id', '아이디를 입력해 주세요.');
          return;
        }
        // 아이디/비밀번호 구분
        const exists = await fetch('/api/auth/id-exists?id=' + encodeURIComponent(id), { credentials:'same-origin' })
          .then(function(r){ return r.ok ? r.json() : { exists:false }; })
          .then(function(j){ return !!j.exists; })
          .catch(function(){
 return false; });

        if(exists){
          setFieldError(modal, 'password', '비밀번호가 틀렸습니다.');
        }else{
          setFieldError(modal, 'id', '존재 하지 않는 아이디 입니다.');
        }
        return;
      }

      // 기타 에러는 공통 영역에(텍스트만) 표시
      setError(modal, data.message || '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }).catch(function(){

      setError(modal, '로그인에 실패했습니다. 네트워크 상태를 확인해 주세요.');
    });
  }

  function registerAjax(form, modal){
    const action = form.getAttribute('action') || '/members/register';
    setError(modal, null);
    clearFieldErrors(modal);

    return fetch(action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'same-origin',
      body: toParams(form)
    }).then(async function(res){
      const data = await res.json().catch(function(){
 return {}; });
      if(res.ok && data.ok){
        // 회원가입 성공 후에도 동일하게 authRedirect를 사용
        closeModalAnimated(modal, { keepRedirect: true });
        toast('회원가입이 완료되었습니다.');
        location.href = readRedirect(data.redirectTo);
        return;
      }

      const msg = (data && data.message) ? String(data.message) : '';
      // ✅ 요청: 중복 아이디/이메일 문구는 각 필드 옆에 표시
      if(msg.includes('아이디') && setFieldError(modal, 'mId', msg)) return;
      if(msg.includes('이메일') && setFieldError(modal, 'mEmail', msg)) return;
      if(msg.includes('비밀번호') && setFieldError(modal, 'mPw', msg)) return;

      setError(modal, msg || '회원가입에 실패했습니다. 입력값을 다시 확인해 주세요.');
    }).catch(function(){

      setError(modal, '회원가입에 실패했습니다. 네트워크 상태를 확인해 주세요.');
    });
  }

  // 4) AJAX 제출 (모달 안의 로그인/회원가입 폼)
  document.addEventListener('submit', function(e){
    const form = e.target;
    if(!(form instanceof HTMLFormElement)) return;
    const modal = form.closest('.auth-modal');
    if(!modal) return;

    const action = (form.getAttribute('action') || '');
    if(action.includes('/members/login')){
      e.preventDefault();
      loginAjax(form, modal);
      return;
    }

    if(action.includes('/members/register')){
      e.preventDefault();
      registerAjax(form, modal);
      return;
    }

    if(action.includes('/members/find-password')){
      e.preventDefault();

      setError(modal, null);
      fetch(action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'same-origin',
        body: toParams(form)
      }).then(async function(res){
        const data = await res.json().catch(function(){
 return {}; });
        if(res.ok && data.ok){
          toast(data.message || '재설정 링크를 발송했습니다.');
          setError(modal, data.message || '입력하신 이메일로 재설정 링크를 발송했습니다.');
          return;
        }
        setError(modal, data.message || '요청에 실패했습니다. 이메일을 확인해 주세요.');
      }).catch(function(){

        setError(modal, '요청에 실패했습니다. 네트워크 상태를 확인해 주세요.');
      });
      return;
    }
  });

  // 5) 입력하면 에러 문구 자동 숨김
  document.addEventListener('input', function(e){
    const input = e.target;
    if(!(input instanceof HTMLInputElement) && !(input instanceof HTMLTextAreaElement)) return;
    const modal = input.closest('.auth-modal');
    if(!modal) return;
    if(input.closest('[data-auth-error]')) return;

    // 입력한 필드의 에러만 지움(레이아웃 흔들림 최소화)
    const name = input.getAttribute('name');
    if(name) setFieldError(modal, name, null);
    setError(modal, null);
  }, true);

  // 로그인 필요 안내(커스텀 UI)
  // - auth-guard.js에서 호출
  // - 브라우저 기본 confirm/alert 대신 사용
  (function initLoginRequiredPrompt(){
    const modal = q('#loginRequiredModal');
    if(!modal) return;

    const backdrop = q('.lr-backdrop', modal);
    const dialog   = q('.lr-dialog', modal);
    const descEl   = q('#lrDesc', modal);
    const btnOk    = q('[data-lr-confirm]', modal);
    const btnCancel= q('[data-lr-cancel]', modal);

    let onConfirm = null;
    let onCancel  = null;
    let isOpen = false;

    function anyAuthModalOpen(){
      return !!q('.auth-modal.is-open');
    }

    function open(opts){
      const msg = (opts && opts.message) ? String(opts.message) : '';
      onConfirm = opts && typeof opts.onConfirm === 'function' ? opts.onConfirm : null;
      onCancel  = opts && typeof opts.onCancel === 'function' ? opts.onCancel : null;

      if(descEl) descEl.textContent = msg || '계속하려면 로그인해 주세요.';

      modal.classList.remove('is-closing');
      modal.classList.add('is-open');
      document.body.classList.add('is-modal-open');
      isOpen = true;

      // 트랜지션 시작
      requestAnimationFrame(() => {
        modal.classList.add('is-ready');
        setTimeout(() => { (dialog || modal).focus(); }, 0);
      });
    }

    function close(reason){
      if(!isOpen) return;
      isOpen = false;
      modal.classList.remove('is-ready');
      modal.classList.add('is-closing');

      // 닫힘 트랜지션 종료 후 display none
      setTimeout(() => {
        modal.classList.remove('is-open','is-closing');
        if(!anyAuthModalOpen()) document.body.classList.remove('is-modal-open');
        if(reason === 'cancel' && onCancel) onCancel();
        onConfirm = null;
        onCancel = null;
      }, 260);
    }

    function confirm(){
      const fn = onConfirm;
      close('confirm');
      if(fn) fn();
    }

    modal.addEventListener('click', function(e){
      if(e.target && (e.target.matches('[data-lr-close]') || e.target.matches('.lr-backdrop'))) close('cancel');
    });

    btnCancel && btnCancel.addEventListener('click', function(){ close('cancel'); });
    btnOk && btnOk.addEventListener('click', function(){ confirm(); });

    document.addEventListener('keydown', function(e){
      if(!isOpen) return;
      if(e.key === 'Escape') close('cancel');
    });

    window.LoginRequiredPrompt = { open, close };
  })();

  // 외부에서 JS로 열고 싶을 때
  window.AuthModal = {
    open: (name) => openModal(q(`#authModal-${name}`)),
    close: (name) => closeModalAnimated(q(`#authModal-${name}`)),
    setError: (name, msg) => setError(q(`#authModal-${name}`), msg),
    toast
  };
})()
