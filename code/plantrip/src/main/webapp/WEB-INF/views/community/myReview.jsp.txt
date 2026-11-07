<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>
<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>내 여행 후기</title>
  
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
          <span class="mp-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-16v5h7V4h-7Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
          </span>대시보드
        </a>
        <a href="${pageContext.request.contextPath}/members/mypage/check">
          <span class="mp-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
          </span>회원정보 수정
        </a>
        <a href="${pageContext.request.contextPath}/members/mypage/plans">
          <span class="mp-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M7 3v3M17 3v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M4 8h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M5 6h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
          </span>내 여행 계획
        </a>
        <a class="active" href="${pageContext.request.contextPath}/members/mypage/reviews">
          <span class="mp-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M7 3h8l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M15 3v5h5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 13h8M8 17h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </span>내 여행 후기
        </a>
        <a href="${pageContext.request.contextPath}/members/mypage/wishlist">
          <span class="mp-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg>
          </span>내 찜 목록
        </a>
      </nav>
    </div>
  </aside>

  <main class="mp-main">
    <section class="mp-card mp-grow" style="width: 100%;">
      <div class="mp-card-head" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div class="mp-card-title">내 여행 후기</div>
          <div class="mp-card-sub">내가 작성한 후기만 모아 볼 수 있어요.</div>
        </div>
        <div style="font-size: 14px; color: #555;">
          총 <b style="color: #3264ff;"><c:out value="${fn:length(myReviews)}"/></b>건
        </div>
      </div>

      <div class="mp-card-body" style="width: 100%;">
        <c:choose>
          <c:when test="${empty myReviews}">
            <div style="padding: 60px 20px; text-align: center; color: #888;">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 15px; opacity: 0.5;">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <p>아직 작성한 후기가 없습니다.<br>여행 다녀오신 후 즐거운 경험을 공유해 보세요!</p>
            </div>
          </c:when>

          <c:otherwise>
            <table class="mp-table" id="reviewsTable">
              <thead>
                <tr>
                  <th style="width: 60px;">번호</th>
                  <th style="width: 120px;">여행지</th>
                  <th>제목</th>
                  <th style="width: 80px;">별점</th>
                  <th style="width: 110px;">등록일</th>
                  <th style="width: 70px;">조회</th>
                  <th style="width: 160px;">관리</th>
                </tr>
              </thead>
              <tbody>
                <c:forEach var="r" items="${myReviews}">
                  <tr>
                    <td>${r.rvIdx}</td>
                    <td><c:out value="${r.spot.city.name}" /></td>
                    <td class="td-title">
                      <a href="${pageContext.request.contextPath}/community/view?rvIdx=${r.rvIdx}">
                        <c:out value="${r.rvTitle}" />
                      </a>
                    </td>
                    <td>
                      <span style="color: #ffc107; font-size: 14px;">★</span>
                      <span style="font-weight: 600;">${r.rvStar != null ? r.rvStar : 5}</span>
                    </td>
                    <td style="color: #888;">
                      <c:choose>
                        <c:when test="${empty r.rvRegDate}">-</c:when>
                        <c:otherwise>${fn:replace(fn:substring(r.rvRegDate,0,10),'-','.')}</c:otherwise>
                      </c:choose>
                    </td>
                    <td style="color: #888;"><c:out value="${empty r.rvVCount ? 0 : r.rvVCount}"/></td>
                    <td>
                      <div style="display: flex; gap: 6px; justify-content: center; align-items: center;">
                          <a href="${pageContext.request.contextPath}/community/edit?rvIdx=${r.rvIdx}" class="btn-edit">수정</a>
                          <form action="${pageContext.request.contextPath}/community/delete" method="post" style="margin:0;">
                            <input type="hidden" name="rvIdx" value="${r.rvIdx}">
                            <button type="submit" class="btn-delete" onclick="return confirm('정말 이 후기를 삭제하시겠습니까?');">삭제</button>
                          </form>
                      </div>
                    </td>
                  </tr>
                </c:forEach>
              </tbody>
            </table>

            <div class="mp-pagination" id="reviewsPagination" aria-label="페이지네이션"></div>
            
            <script>
            (function(){
              const table = document.getElementById('reviewsTable');
              if(!table) return;
              const tbody = table.querySelector('tbody');
              if(!tbody) return;
              const rows = Array.from(tbody.querySelectorAll('tr'));
              const pager = document.getElementById('reviewsPagination');
              const pageSize = 10;
              const total = rows.length;
              const pages = Math.max(1, Math.ceil(total / pageSize));
              let current = 1;

              function render(){
                rows.forEach((r, idx)=>{
                  const p = Math.floor(idx / pageSize) + 1;
                  r.style.display = (p === current) ? '' : 'none';
                });
                if(!pager) return;
                pager.innerHTML = '';
                if(pages <= 1) return; // 1페이지뿐이면 버튼 숨김

                for(let p=1; p<=pages; p++){
                  const b = document.createElement('button');
                  b.type = 'button';
                  b.className = 'mp-page' + (p === current ? ' is-active' : '');
                  b.textContent = p;
                  b.addEventListener('click', ()=>{ current = p; render(); });
                  pager.appendChild(b);
                }
              }
              render();
            })();
            </script>
          </c:otherwise>
        </c:choose>
      </div>
    </section>
  </main>
</div>

<%@ include file="/WEB-INF/views/common/footer.jspf" %>

</body>
</html>