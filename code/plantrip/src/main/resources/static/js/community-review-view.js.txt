// community-review-view.js
// - 썸네일 클릭 시 대표 이미지 교체
// - 이미지가 1장일 때는 썸네일 바가 있어도 자연스럽게 동작

(function(){
  function ready(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function(){
    var main = document.getElementById('rvMainImg');
    if(!main) return;

    var thumbs = document.querySelectorAll('.rv-thumb-img');
    if(!thumbs || thumbs.length === 0) return;

    thumbs.forEach(function(img){
      img.addEventListener('click', function(){
        var src = img.getAttribute('data-src') || img.getAttribute('src');
        if(!src) return;
        main.setAttribute('src', src);

        // active 표시
        thumbs.forEach(function(t){ t.parentElement && t.parentElement.classList.remove('is-active'); });
        if(img.parentElement) img.parentElement.classList.add('is-active');
      });
    });

    // 첫 썸네일을 active로
    if(thumbs[0] && thumbs[0].parentElement){
      thumbs[0].parentElement.classList.add('is-active');
    }
  });
})();
