<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="j" uri="jakarta.tags.core" %>
<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PlanTrip</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/home.css" />
  <script defer src="${pageContext.request.contextPath}/js/nav-wave.js"></script>
  <script defer src="${pageContext.request.contextPath}/js/index.js"></script>
</head>

<body data-context="${pageContext.request.contextPath}">

<header class="header" id="header">
  <div class="container header-inner">
    <div class="brand-top">
      <a class="brand-top" href="/" title="홈으로 돌아가기" aria-label="홈으로 돌아가기">
        <img class="brand-logo-img" src="/img/PlanTriplog.png" alt="PlanTrip">
      </a>
    </div>

    <nav class="nav">
      <a href="${pageContext.request.contextPath}/spots/spot">추천 여행지 목록</a>
      <a href="${pageContext.request.contextPath}/plans/planRoute">여행 계획</a>
      <a href="/community">커뮤니티</a>
      <a href="/maps">지도</a>
      <a href="${pageContext.request.contextPath}/transport/flight" class="pt-wave">교통수단</a>

      <j:if test="${not empty sessionScope.loginMember}">
        <a href="/members/mypage">마이페이지</a>
      </j:if>
    </nav>

    <div class="header-right">
      <j:if test="${empty sessionScope.loginMember}">
        <a class="header-auth" href="/members/login" data-auth-open="login">로그인</a>
        <a class="header-auth" href="/members/register" data-auth-open="signup">회원가입</a>
      </j:if>

      <j:if test="${not empty sessionScope.loginMember}">
        <%-- <a class="header-link" href="/reservations">내 예약</a> --%>

        <div class="hamburger" id="hmWrap">
          <button class="hamburger-btn ${sessionScope.loginMember.MRole == 9 ? 'is-admin' : ''} ${not empty sessionScope.loginMember.snsId ? 'is-social' : ''}" type="button" id="hmBtn" aria-label="메뉴" aria-haspopup="true" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>

          <div class="hamburger-menu" id="hm" role="menu" aria-label="메뉴">
            <div class="hm-title">
              ${sessionScope.loginMember.MName}님
              <span class="hm-role">
                <j:if test="${sessionScope.loginMember.MRole == 9}">(관리자)</j:if>
                <j:if test="${sessionScope.loginMember.MRole != 9}">(회원)</j:if>
              </span>
            </div>

            <j:if test="${sessionScope.loginMember.MRole == 9}">
              <a class="menu-item" href="/admin">관리자</a>
            </j:if>

            <a class="menu-item" href="/members/mypage">마이페이지</a>
            

            <div class="hm-divider"></div>

            <form action="/members/logout" method="post" style="margin:0;">
              <button class="menu-btn" type="submit">로그아웃</button>
            </form>
          </div>
        </div>
      </j:if>
    </div>
  </div>
</header>

<main>
  <section class="hero">
    <div class="hero-copy hero-copy--center">
      <div class="hero-pill hero-title">Welcome to the PlanTrip</div>
    </div>
    <a class="scroll-down" href="#sheet" aria-label="아래로 스크롤"></a>
  </section>

  <section class="sheet" id="sheet">
    <div class="container">

      <section class="block">
        <div class="block-head">
          <h2 class="block-title">오늘의 인기 여행지</h2>
          <p class="block-sub">매일 새로운 6곳의 여행지를 추천해 드립니다.</p>
        </div>

        <div class="marquee" data-marquee>
          <div class="marquee__track" data-marquee-track>
            <j:forEach var="s" items="${popularSpots}">
              <a class="post-card post-card--overlay" href="${pageContext.request.contextPath}/spots/detail/${s.id}">
                <img class="card-bg"
                     src="${pageContext.request.contextPath}/img/spot/${s.id}_1.jpg"
                     alt="${s.name}"
                     onerror="this.onerror=null; this.src='${pageContext.request.contextPath}/img/hero.jpg';" />
                <div class="card-grad"></div>

                <button class="wish-btn ${s.isHearted ? 'active' : ''}" data-sidx="${s.id}"
                        onclick="toggleWish(event, ${s.id}, this)">
                  ${s.isHearted ? '❤️' : '🤍'}
                </button>

                <div class="card-body">
                  <div class="card-title">${s.name}</div>
                  <div class="card-sub">${s.city.name} · 인기</div>
                </div>
              </a>
            </j:forEach>

            <!-- 기존처럼 2번 반복(무한 루프용) 유지 -->
            <j:forEach var="s" items="${popularSpots}">
              <a class="post-card post-card--overlay" href="${pageContext.request.contextPath}/spots/detail/${s.id}">
                <img class="card-bg"
                     src="${pageContext.request.contextPath}/img/spot/${s.id}_1.jpg"
                     alt="${s.name}"
                     onerror="this.onerror=null; this.src='${pageContext.request.contextPath}/img/hero.jpg';" />
                <div class="card-grad"></div>

                <button class="wish-btn ${s.isHearted ? 'active' : ''}" data-sidx="${s.id}"
                        onclick="toggleWish(event, ${s.id}, this)">
                  ${s.isHearted ? '❤️' : '🤍'}
                </button>

                <div class="card-body">
                  <div class="card-title">${s.name}</div>
                  <div class="card-sub">${s.city.name} · 인기</div>
                </div>
              </a>
            </j:forEach>
          </div>
        </div>
      </section>

      <section class="block block-recommend" id="recommendSection">
        <!-- (기존 추천 섹션 구조 그대로) -->
        <div class="course-head" style="margin-bottom: 20px;">
          <div class="course-head-left block-head">
            <h2 class="block-title">오늘의 맞춤형 여행 코스</h2>
          </div>
        </div>

        <div class="course-head-right" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
          <div class="segmented" role="tablist">
            <button class="seg-btn active" type="button" onclick="loadRecommend('TOUR', this)">관광지</button>
            <button class="seg-btn" type="button" onclick="loadRecommend('STAY', this)">숙소</button>
            <button class="seg-btn" type="button" onclick="loadRecommend('ACT', this)">문화/액티비티</button>
            <button class="seg-btn" type="button" onclick="loadRecommend('FOOD', this)">맛집</button>
          </div>

          <p class="block-sub" style="margin:0; color:#888; font-size:14px; font-weight:400;">
            카테고리를 선택하시면 매일 새로운 장소를 추천해드려요!
          </p>
        </div>

        <div class="recommend-wrap">
          <button class="arrow-btn arrow-left" type="button" aria-label="이전" onclick="scrollRecommend(-1)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div class="recommend-cards" id="recommendCards"></div>

          <button class="arrow-btn arrow-right" type="button" aria-label="다음" onclick="scrollRecommend(1)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </section>

    </div>
  </section>
</main>

<%@ include file="/WEB-INF/views/common/footer.jspf" %>

</body>
</html>