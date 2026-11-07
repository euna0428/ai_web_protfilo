<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>후기 상세</title>

  <link rel="stylesheet" href="/css/header.css" />
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/community.css" />
  <link rel="stylesheet" href="/css/ui-toast.css" />
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/community-review-view.css" />

  <script defer src="/js/ui-toast.js"></script>
  <script defer src="/js/theme.js"></script>
  <script defer src="/js/nav-wave.js"></script>
</head>
<body class="page-solid">

<jsp:include page="/WEB-INF/views/common/header.jsp" />
<div class="cm-shell">
  <main class="cm-main">
    <div class="rv-card">

      <div class="rv-header">
        <div class="rv-title">
          <h1 class="rv-h1">${review.rvTitle}</h1>
          <div class="rv-sub">
            <span class="rv-muted">${review.member.MName}</span>
            <span class="rv-dot">·</span>
            <span class="rv-muted">장소: ${review.rvRegion}</span>
            <span class="rv-dot">·</span>
            <span class="rv-muted">조회 ${review.rvVCount}</span>
          </div>
        </div>
        <button class="rv-btn rv-btn-ghost" type="button" onclick="location.href='${pageContext.request.contextPath}/community'">목록</button>
      </div>

      <div class="rv-grid">
		<section class="rv-left">
			        <c:choose>
		            <c:when test="${not empty photos}">
		              <div class="rv-photo">
						<div class="rv-photo-main">
						    <img id="rvMainImg" src="${pageContext.request.contextPath}/uploads/reviews/${photos[0].rpStoredName}" alt="후기 사진" 
						         onerror="this.src='${pageContext.request.contextPath}/img/hero.jpg';"/>
						    <button class="rv-nav rv-prev" type="button" aria-label="이전">‹</button>
						    <button class="rv-nav rv-next" type="button" aria-label="다음">›</button>
						    <div class="rv-photo-count" id="rvPhotoCount">1 / ${fn:length(photos)}</div>
						</div>

						<div class="rv-thumbs">
						    <c:forEach var="p" items="${photos}" varStatus="st">
						        <%-- ✅ 경로를 /uploads/reviews/ 로 정확히 맞춥니다 --%>
						        <c:url var="pSrc" value="/uploads/reviews/${p.rpStoredName}"/>
								<button type="button" class="rv-thumb ${st.index==0 ? 'is-active' : ''}" 
								        data-idx="${st.index}" data-src="${pSrc}">
								    <img src="${pSrc}" alt="thumb" onerror="this.closest('.rv-thumb').remove();"/>
								</button>
						    </c:forEach>
						</div>
		              </div>
		            </c:when>

		            <c:when test="${empty photos and not empty review.rvImg}">
		               </c:when>
		            
		            <c:otherwise>
		               <div class="rv-photo-empty">
		                 <div class="rv-photo-empty-box">후기 사진</div>
		                 <div class="rv-muted">등록된 사진이 없습니다.</div>
		               </div>
		            </c:otherwise>
		          </c:choose>
		        </section>

        <aside class="rv-side">
          <div class="rv-side-head">
            <div class="rv-user">
              <div class="rv-user-avatar">
                <c:choose>
                  <c:when test="${not empty review.member and not empty review.member.MName}">${fn:substring(review.member.MName,0,1)}</c:when>
                  <c:otherwise>?</c:otherwise>
                </c:choose>
              </div>
              <div class="rv-user-meta">
                <div class="rv-user-name">${review.member.MName}</div>
                <div class="rv-user-sub">
                  작성일:
                  <c:choose>
                    <c:when test="${not empty review.rvRegDate}">${fn:replace(fn:substring(review.rvRegDate,0,10),'-','.')}</c:when>
                    <c:otherwise>-</c:otherwise>
                  </c:choose>
                </div>
              </div>
            </div>

            <div class="rv-rating" style="display: flex; align-items: center;">
              <c:set var="starCount" value="${review.rvStar != null && review.rvStar > 0 ? review.rvStar : 5}" />
              <span class="rv-stars" style="color: #ffc107; font-size: 18px; letter-spacing: 2px;">
                <c:forEach begin="1" end="${starCount}">★</c:forEach><c:forEach begin="${starCount + 1}" end="5"><span style="color: #eee;">★</span></c:forEach>
              </span>
              <span class="rv-score" style="margin-left: 8px; font-weight: bold; font-size: 15px; color: #333;">${starCount} / 5</span>
            </div>
          </div>

          <div class="rv-body">
            <div class="rv-body-title">후기 내용</div>
            <div class="rv-content">
              ${fn:escapeXml(review.rvCont)}
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>
</div>

<script>
(function(){
  const thumbs = Array.from(document.querySelectorAll('.rv-thumb'));
  const mainImg = document.getElementById('rvMainImg');
  const countEl = document.getElementById('rvPhotoCount');
  const prevBtn = document.querySelector('.rv-prev');
  const nextBtn = document.querySelector('.rv-next');

  if(!mainImg || thumbs.length === 0) return;

  let cur = 0;
  const total = thumbs.length;

  function setActive(idx){
    cur = (idx + total) % total;
    const src = thumbs[cur].dataset.src;
    mainImg.src = src;

    thumbs.forEach(t => t.classList.remove('is-active'));
    thumbs[cur].classList.add('is-active');

    if(countEl) countEl.textContent = (cur + 1) + " / " + total;
    thumbs[cur].scrollIntoView({block:'nearest', inline:'nearest', behavior:'smooth'});
  }

  thumbs.forEach(t => {
    t.addEventListener('click', () => setActive(parseInt(t.dataset.idx, 10)));
  });
  if(prevBtn) prevBtn.addEventListener('click', () => setActive(cur - 1));
  if(nextBtn) nextBtn.addEventListener('click', () => setActive(cur + 1));
})();
</script>

<%@ include file="/WEB-INF/views/common/footer.jspf" %>
</body>
</html>