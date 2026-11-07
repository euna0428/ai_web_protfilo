(function(){
  try{
    var key = "plantrip-theme";

    /* =====================================================
       ✅ 테마(라이트/다크) 기능 임시 보류 (2026-02-25)
       - 전체 페이지를 'light'로 고정
       - 기존 로직은 아래 주석에 보관 (다시 살릴 때 참고)
       ===================================================== */

    // [기존]
    // var t = localStorage.getItem(key) || "dark";
    // document.documentElement.dataset.theme = t;

    var t = "light";
    try{ localStorage.setItem(key, t); }catch(e){}
    document.documentElement.dataset.theme = t;

    // 페이지별 스타일 분기용(배경/카드 톤 등)
    var p = (location && location.pathname) ? location.pathname : "";
    var page = "default";
    if(p === "/" || p === "" || p.indexOf("/index") === 0){
      page = "home";
    }else if(p.indexOf("/support") === 0){
      page = "support";
    }else if(p.indexOf("/admin") === 0){
      page = "admin";
    }else if(p.indexOf("/community") === 0){
      page = "community";
    }else if(p.indexOf("/members") === 0){
      page = "members";
    }
    document.documentElement.dataset.page = page;
  }catch(e){}
})();
