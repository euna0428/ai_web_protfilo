<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>내 찜 목록</title>
  
  <link rel="stylesheet" href="/css/header.css" />
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/mypage.css">
  <link rel="stylesheet" href="/css/redesign.css" />
  <link rel="stylesheet" href="/css/ui-toast.css" />

  <script defer src="/js/ui-toast.js"></script>
  <script defer src="/js/theme.js"></script>
  <script defer src="/js/nav-wave.js"></script>
</head>
<body class="page-solid">

<jsp:include page="/WEB-INF/views/common/header.jsp" />

<div class="mp-shell">
  <aside class="mp-side">
    <div class="sec" style="padding-top: 20px;">
      <nav class="mp-nav">
        <a href="${pageContext.request.contextPath}/members/mypage">
          <span class="mp-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-16v5h7V4h-7Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></span>대시보드
        </a>
        <a href="${pageContext.request.contextPath}/members/mypage/check">
          <span class="mp-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></span>회원정보 수정
        </a>
        <a href="${pageContext.request.contextPath}/members/mypage/plans">
          <span class="mp-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M7 3v3M17 3v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M4 8h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M5 6h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></span>내 여행 계획
        </a>
        <a href="${pageContext.request.contextPath}/members/mypage/reviews">
          <span class="mp-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M7 3h8l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M15 3v5h5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 13h8M8 17h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>내 여행 후기
        </a>
        <a class="active" href="${pageContext.request.contextPath}/members/mypage/wishlist">
          <span class="mp-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg></span>내 찜 목록
        </a>
      </nav>
    </div>
  </aside>

  <main class="mp-main">
    <div class="wish-filter-container">
      <div class="city-tabs-wrapper">
        <div class="city-tabs" id="cityTabs">
          <div class="city-tab active" data-filter-city="ALL">모든 도시</div>
        </div>
      </div>
      
      <div class="cat-buttons-wrapper">
        <div class="cat-buttons" id="catButtons">
          <button class="cat-btn active" data-filter-cat="ALL">전체보기</button>
          <button class="cat-btn" data-filter-cat="TOUR">관광지</button>
          <button class="cat-btn" data-filter-cat="STAY">숙소</button>
          <button class="cat-btn" data-filter-cat="ACT">문화/액티비티</button>
          <button class="cat-btn" data-filter-cat="FOOD">맛집</button>
        </div>
      </div>
    </div>

    <section class="mp-card mp-grow">
      <div class="mp-card-body">
        <c:if test="${empty allWishList}">
          <div class="wish-empty-msg">아직 찜한 장소가 없습니다. 여행지를 둘러보세요!</div>
        </c:if>

        <c:if test="${not empty allWishList}">
          <div class="mp-deck">
            <c:forEach var="spot" items="${allWishList}">
              <div class="item wish-card-item" 
                   data-city="${spot.city != null ? spot.city.name : '기타'}" 
                   data-cat="${spot.catCode}">
                
                <a href="${pageContext.request.contextPath}/spots/detail/${spot.id}" class="wish-link-wrapper">
                  <c:set var="defaultImg" value="${pageContext.request.contextPath}/img/hero.jpg" />
				  <div class="thumb" 
				       style="background-image: url('${pageContext.request.contextPath}/img/spot/${spot.id}_1.jpg'), url('${defaultImg}'); 
				              background-size: cover; background-position: center;">
				  </div>
                  <div class="meta">
                    <div class="tag-wrap">
                      <span class="tag-city">${spot.city != null ? spot.city.name : '기타'}</span>
                      <c:choose>
                        <c:when test="${spot.catCode == 'TOUR'}"><span class="tag-cat tag-tour">TOUR</span></c:when>
                        <c:when test="${spot.catCode == 'STAY'}"><span class="tag-cat tag-stay">STAY</span></c:when>
                        <c:when test="${spot.catCode == 'ACT'}"><span class="tag-cat tag-act">ACT</span></c:when>
                        <c:when test="${spot.catCode == 'FOOD'}"><span class="tag-cat tag-food">FOOD</span></c:when>
                        <c:otherwise><span class="tag-cat">${spot.catCode}</span></c:otherwise>
                      </c:choose>
                    </div>
                    <div class="ttl">${spot.name}</div>
                    <div class="sub">${spot.addr}</div>
                  </div>
                </a>
              </div>
            </c:forEach>
          </div>
        </c:if>
      </div>
    </section>
  </main>
</div>

<%@ include file="/WEB-INF/views/common/footer.jspf" %>
<script src="/js/list.js"></script>
</body>
</html>