<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>
<!doctype html>
<html lang="ko">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>커뮤니티</title>
    <link rel="stylesheet" href="/css/header.css" />
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/community.css">
	<link rel="stylesheet" href="/css/redesign.css" />
	<link rel="stylesheet" href="/css/ui-toast.css" />
	<script defer src="/js/ui-toast.js"></script>
	<script defer src="/js/theme.js"></script>
    <script defer src="/js/nav-wave.js"></script>

  <style>
    /* ✅ 헤더(고정) + 로고 돌출 높이만큼 콘텐츠를 아래로 내림 (이 JSP 전용) */
    body{ padding-top: 0 !important; }
    .cm-shell{
      margin-top: calc(var(--headerH, 72px) + var(--logoOffset, 35px) - 20px) !important;
    }
  </style>
</head>
<body class="page-solid">

<jsp:include page="/WEB-INF/views/common/header.jsp" />
<div class="cm-shell">
	<main class="cm-main">
		<section class="mp-card">
			<div class="mp-card-head">
				<div>
					<div class="mp-card-title">여행 후기 목록</div>
					<div class="mp-card-sub">모든 사용자의 후기를 확인할 수 있어요</div>
				</div>
				<div class="cm-head-right">
					<div class="cm-total">총 <b><c:out value="${fn:length(reviews)}"/></b>건</div>
				</div>
			</div>

			<div class="mp-card-body">
				<form action="${pageContext.request.contextPath}/community" method="get">
					<div class="cm-toolbar">
						<div class="mp-search cm-search">
							<input type="text" name="keyword" value="${keyword}" placeholder="작성자 또는 제목으로 검색">
							<button class="mp-btn" type="submit" style="padding:10px 14px;">검색</button>
						</div>
						<div class="cm-filters">
							<div class="cm-filter-row">
								<select class="cm-select" name="sort">
									<option value="latest" <c:if test="${sort == 'latest'}">selected</c:if>>최신순</option>
									<option value="star" <c:if test="${sort == 'star'}">selected</c:if>>별점순</option>
								</select>
								<button class="mp-btn" type="submit" style="padding:10px 14px;">적용</button>
							</div>
						</div>
					</div>
				</form>

				<div class="cm-write-row">
					<a class="cm-write-link" href="${pageContext.request.contextPath}/community/write">후기 작성</a>
				</div>

				<c:choose>
					<c:when test="${empty reviews}">
						<div class="cm-empty">
							아직 등록된 후기가 없습니다.
							<div class="sub">첫 번째 후기를 작성해 보세요.</div>
						</div>
					</c:when>

					<c:otherwise>
						<div class="cm-table-wrap">
							<table class="cm-table">
								<thead>
									<tr>
										<th style="width:80px; text-align: center;">별점</th>
										<th style="width:160px;">여행지</th>
										<th>제목</th>
										<th style="width:120px;">작성자</th>
										<th style="width:120px;">등록일</th>
										<th style="width:80px;">조회</th>
									</tr>
								</thead>
								<tbody>
									<c:forEach var="r" items="${reviews}">
										<tr>
											<td style="text-align: center;">
												<span style="color: #ffc107; font-size: 15px;">★</span>
												<span style="font-weight: 600; color: #333;">${r.rvStar != null ? r.rvStar : 5}</span>
											</td>
											<td class="cm-wrap"><c:out value="${r.spot.city.name}" /></td>
											<td class="cm-wrap" style="max-width:520px;">
												<a class="cm-title-link" href="${pageContext.request.contextPath}/community/view?rvIdx=${r.rvIdx}">
													<c:out value="${r.rvTitle}" />
												</a>
											</td>
											<td class="cm-col-date"><c:out value="${r.member.MName}" /></td>
											<td>
												<c:choose>
													<c:when test="${empty r.rvRegDate}"><span class="cm-muted">-</span></c:when>
													<c:otherwise>
														<span class="cm-muted">${fn:replace(fn:substring(r.rvRegDate,0,10),'-','.')}</span>
													</c:otherwise>
												</c:choose>
											</td>
											<td><c:out value="${empty r.rvVCount ? 0 : r.rvVCount}"/></td>
										</tr>
									</c:forEach>
								</tbody>
							</table>
						</div>

						<div class="cm-pagination" id="cmPagination" aria-label="페이지네이션"></div>
						<script>
						(function(){
						  const table = document.querySelector('.cm-table');
						  if(!table) return;
						  const tbody = table.querySelector('tbody');
						  if(!tbody) return;
						  const rows = Array.from(tbody.querySelectorAll('tr'));
						  const pager = document.getElementById('cmPagination');
						  const pageSize = 10;
						  const total = rows.length;
						  const pages = Math.max(1, Math.ceil(total / pageSize));
						  let current = 1;
						  function render(){
						    rows.forEach((row, idx)=>{
						      const page = Math.floor(idx / pageSize) + 1;
						      row.style.display = (page === current) ? '' : 'none';
						    });
						    if(!pager) return;
						    pager.innerHTML = '';
						    for(let i=1;i<=pages;i++){
						      const a = document.createElement('button');
						      a.type = 'button';
						      a.className = 'cm-page' + (i===current ? ' is-active' : '');
						      a.textContent = String(i);
						      a.addEventListener('click', ()=>{ current=i; render(); window.scrollTo({top:0, behavior:'smooth'}); });
						      pager.appendChild(a);
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