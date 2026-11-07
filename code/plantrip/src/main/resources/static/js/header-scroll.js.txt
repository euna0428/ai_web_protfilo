/*
  header-scroll.js
  - 모든 페이지 공통: 스크롤 아래로 내리면 헤더 숨김, 위로 올리거나 맨 위로 오면 헤더 표시
  - 드롭다운(햄버거/교통수단) 열려있으면 스크롤 시 자동 닫기
*/
(function(){
  var lastY = 0;
  var ticking = false;

  function getHeader(){
    return document.getElementById('header') || document.querySelector('.header');
  }

  function closeMenus(){
    var hm = document.getElementById('hm');
    var hmBtn = document.getElementById('hmBtn');
    var transportWrap = document.getElementById('transportWrap');
    var transportBtn = document.getElementById('transportBtn');

    if (hm) hm.classList.remove('open');
    if (transportWrap) transportWrap.classList.remove('open');
    if (hmBtn) hmBtn.setAttribute('aria-expanded','false');
    if (transportBtn) transportBtn.setAttribute('aria-expanded','false');
  }

  function update(){
    ticking = false;
    var header = getHeader();
    if(!header) return;

    var y = window.scrollY || document.documentElement.scrollTop || 0;
    var goingDown = y > lastY;

    // 맨 위에서는 무조건 표시
    if (y <= 8){
      header.classList.remove('is-hidden');
      closeMenus();
      lastY = y;
      return;
    }

    // 아주 살짝 내리는 구간에서는 깜빡임 방지
    if (Math.abs(y - lastY) < 10){
      lastY = y;
      return;
    }

    if (goingDown){
      header.classList.add('is-hidden');
      closeMenus();
    } else {
      header.classList.remove('is-hidden');
    }

    lastY = y;
  }

  function onScroll(){
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  document.addEventListener('DOMContentLoaded', function(){
    lastY = window.scrollY || 0;
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', update);
    update();
  });
})();
