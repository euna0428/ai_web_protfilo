/* 마이페이지 - 회원 탈퇴
   - 취소: 그대로 mypage 유지
   - 확인: POST /members/mypage/withdraw
   - 성공: "회원 정보가 삭제 되었습니다." 토스트 후 메인으로 이동
   - UIToast(공통) 사용
*/

(function(){
  function toast(message, duration){
    if (window.UIToast && typeof window.UIToast.show === 'function') {
      window.UIToast.show(message, { duration: duration || 2200 });
    } else {
      alert(message);
    }
  }

  function ctx(){
    var v = (window.__ctx != null ? String(window.__ctx) : '');
    return v.replace(/\/$/, '');
  }

  function getCsrf(){
    var tokenMeta = document.querySelector('meta[name="_csrf"]');
    var headerMeta = document.querySelector('meta[name="_csrf_header"]');
    if (!tokenMeta || !headerMeta) return null;
    return { header: headerMeta.getAttribute('content'), token: tokenMeta.getAttribute('content') };
  }

  function openConfirmModal(onYes){
    // 기존 모달이 있으면 제거
    var old = document.querySelector('.pt-confirm');
    if (old) old.remove();

    var wrap = document.createElement('div');
    wrap.className = 'pt-confirm';
    wrap.innerHTML = "\
      <div class=\"pt-confirm__backdrop\" role=\"presentation\"></div>\
      <div class=\"pt-confirm__panel\" role=\"dialog\" aria-modal=\"true\" aria-label=\"회원 탈퇴 확인\">\
        <h3 class=\"pt-confirm__title\">회원 탈퇴</h3>\
        <p class=\"pt-confirm__desc\">기존 데이터와 아이디가 영구 삭제가 됩니다.<br>정말로 회원 탈퇴를 하시겠습니까?</p>\
        <div class=\"pt-confirm__actions\">\
          <button type=\"button\" class=\"pt-confirm__btn pt-confirm__btn--ghost\" data-act=\"cancel\">취소</button>\
          <button type=\"button\" class=\"pt-confirm__btn pt-confirm__btn--danger\" data-act=\"ok\">탈퇴</button>\
        </div>\
      </div>\
    ";
    document.body.appendChild(wrap);

    function close(){ wrap.remove(); }
    wrap.addEventListener('click', function(e){
      if (e.target.classList.contains('pt-confirm__backdrop')) close();
      var act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
      if (act === 'cancel') close();
      if (act === 'ok') {
        close();
        onYes && onYes();
      }
    });
  }

  function bind(){
    var btn = document.querySelector('[data-action="withdraw"]');
    if (!btn) return;

    btn.addEventListener('click', async function(){
      // UI 통일: 브라우저 confirm 대신 커스텀 모달 사용
      openConfirmModal(async function(){

        btn.disabled = true;

        try{
          var headers = {
            'X-Requested-With': 'fetch',
            'Accept': 'application/json'
          };
        var csrf = getCsrf();
        if (csrf && csrf.header && csrf.token) headers[csrf.header] = csrf.token;

        var res = await fetch(ctx() + '/members/mypage/withdraw', {
          method: 'POST',
          headers: headers,
          credentials: 'same-origin'
        });

        // JSON이 아니어도(redirect/html/empty) 성공 흐름이 깨지지 않도록 처리
        var data = null;
        try { data = await res.json(); } catch(e) { /* ignore */ }

        if (res.ok && (data == null || data.ok === true)) {
          toast('회원 정보가 삭제 되었습니다.', 1800);
          setTimeout(function(){ window.location.href = ctx() + '/'; }, 900);
          return;
        }

        var msg = (data && data.message) ? data.message : ('요청이 실패했습니다. (HTTP ' + res.status + ')');
        toast(msg);
        btn.disabled = false;
        }catch(e){
          toast('네트워크 오류가 발생했습니다.');
          btn.disabled = false;
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
