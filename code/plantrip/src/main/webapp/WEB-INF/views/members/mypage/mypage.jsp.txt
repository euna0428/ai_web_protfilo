<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
		<%@ include file="/WEB-INF/views/common/theme.jspf" %>
			<!DOCTYPE html>
			<html lang="ko">

			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>마이페이지</title>

				<link rel="stylesheet" href="/css/header.css" />
				<link rel="stylesheet" href="${pageContext.request.contextPath}/css/mypage.css">
				<link rel="stylesheet" href="/css/redesign.css" />
				<link rel="stylesheet" href="/css/ui-toast.css" />

				<script defer src="/js/ui-toast.js"></script>
				<script defer src="/js/theme.js"></script>
				<script defer src="/js/nav-wave.js"></script>
				<script>
					/* contextPath를 JS에서 쓸 수 있게 주입 */
					window.__ctx = "${pageContext.request.contextPath}";
				</script>
				<script defer src="/js/mypage-withdraw.js"></script>
			</head>

			<body>

				<jsp:include page="/WEB-INF/views/common/header.jsp" />

				<c:set var="displayName" value="사용자" />
				<c:choose>
					<c:when test="${not empty sessionScope.loginUserName}">
						<c:set var="displayName" value="${sessionScope.loginUserName}" />
					</c:when>
					<c:when test="${not empty sessionScope.loginMember and not empty sessionScope.loginMember.MName}">
						<c:set var="displayName" value="${sessionScope.loginMember.MName}" />
					</c:when>
					<c:when test="${not empty sessionScope.member and not empty sessionScope.member.MName}">
						<c:set var="displayName" value="${sessionScope.member.MName}" />
					</c:when>
					<c:when test="${not empty pageContext.request.userPrincipal}">
						<c:set var="displayName" value="${pageContext.request.userPrincipal.name}" />
					</c:when>
				</c:choose>

				<div class="mp-shell">

					<aside class="mp-side">
						<nav class="mp-nav">
							<a class="active" href="${pageContext.request.contextPath}/members/mypage">
								<span class="mp-ico" aria-hidden="true">
									<svg viewBox="0 0 24 24" fill="none">
										<path d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-16v5h7V4h-7Z"
											stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
									</svg>
								</span>대시보드
							</a>
							<a href="${pageContext.request.contextPath}/members/mypage/check">
								<span class="mp-ico" aria-hidden="true">
									<svg viewBox="0 0 24 24" fill="none">
										<path d="M12 20h9" stroke="currentColor" stroke-width="1.8"
											stroke-linecap="round" />
										<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
											stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
									</svg>
								</span>회원정보 수정
							</a>
							<a href="${pageContext.request.contextPath}/members/mypage/plans">
								<span class="mp-ico" aria-hidden="true">
									<svg viewBox="0 0 24 24" fill="none">
										<path d="M7 3v3M17 3v3" stroke="currentColor" stroke-width="1.8"
											stroke-linecap="round" />
										<path d="M4 8h16" stroke="currentColor" stroke-width="1.8"
											stroke-linecap="round" />
										<path
											d="M5 6h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
											stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
									</svg>
								</span>내 여행 계획
							</a>
							<a href="${pageContext.request.contextPath}/members/mypage/reviews">
								<span class="mp-ico" aria-hidden="true">
									<svg viewBox="0 0 24 24" fill="none">
										<path d="M7 3h8l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
											stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
										<path d="M15 3v5h5" stroke="currentColor" stroke-width="1.8"
											stroke-linejoin="round" />
										<path d="M8 13h8M8 17h8" stroke="currentColor" stroke-width="1.8"
											stroke-linecap="round" />
									</svg>
								</span>내 여행 후기
							</a>
							<a href="${pageContext.request.contextPath}/members/mypage/wishlist">
								<span class="mp-ico" aria-hidden="true">
									<svg viewBox="0 0 24 24" fill="none">
										<path
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
											stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"
											stroke-linecap="round" />
									</svg>
								</span>내 찜 목록
							</a>
						</nav>
					</aside>

					<main class="mp-main">

						<section class="mp-card mp-info-card">
							<div class="info-body">
								<div class="avatar-wrap">
									<div class="css-avatar">
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
										</svg>
									</div>
								</div>

								<div class="info-content">
									<div class="info-title-wrap">
										<h3 class="info-title">내 정보</h3>
										<span class="role-badge">
											<c:choose>
												<c:when test="${sessionScope.loginMember.MRole == 9}">관리자</c:when>
												<c:otherwise>일반 회원</c:otherwise>
											</c:choose>
										</span>
									</div>

									<div class="info-table">
										<div class="info-row">
											<span class="lbl">이름</span>
											<span class="val">
												<c:out value="${displayName}" />
											</span>
										</div>
										<div class="info-row">
											<span class="lbl">아이디</span>
											<span class="val" style="display:flex; align-items:center; gap:8px;">
												<c:out value="${sessionScope.loginMember.MId}" default="아이디 정보 없음" />
												<c:if test="${not empty sessionScope.loginMember.snsId}">
													<span class="social-badge kakao">Social</span>
												</c:if>
											</span>
										</div>
										<div class="info-row">
											<span class="lbl">이메일</span>
											<span class="val">
												<c:out value="${sessionScope.loginMember.MEmail}" default="이메일 정보 없음" />
											</span>
										</div>
									</div>
								</div>
							</div>

							<div class="info-footer">
								<button type="button" class="btn-withdraw" data-action="withdraw">회원 탈퇴</button>
							</div>
						</section>

						<section class="mp-card mp-grow">
							<div class="mp-card-head">
								<div>
									<div class="mp-card-title">최근 찜한 장소</div>
									<div class="mp-card-sub">내가 가장 최근에 관심 등록한 8곳입니다.</div>
								</div>
							</div>

							<div class="mp-card-body">
								<c:if test="${empty recentWishList}">
									<div style="padding: 40px; text-align: center; color: #999;">아직 찜한 장소가 없습니다. 여행지를
										둘러보고 찜 기능을 사용해 보세요.</div>
								</c:if>

								<c:if test="${not empty recentWishList}">
									<div class="mp-deck">
										<c:forEach var="spot" items="${recentWishList}">
											<a href="${pageContext.request.contextPath}/spots/detail/${spot.id}"
												class="item wish-card-item">

												<c:set var="defaultImg"
													value="${pageContext.request.contextPath}/img/hero.jpg" />

												<%-- 장소 번호(${spot.id})를 사용하여 1_1.jpg를 불러오고, 없으면 hero.jpg가 나오도록 설정 --%>
													<div class="thumb" style="background-image: url('${pageContext.request.contextPath}/img/spot/${spot.id}_1.jpg'), url('${defaultImg}'); 
				              background-size: cover; background-position: center;">
													</div>

													<div class="meta">
														<div class="tag-wrap">
															<span class="tag-city">${spot.city != null ? spot.city.name
																: '기타'}</span>
															<c:choose>
																<c:when test="${spot.catCode == 'TOUR'}"><span
																		class="tag-cat tag-tour">TOUR</span></c:when>
																<c:when test="${spot.catCode == 'STAY'}"><span
																		class="tag-cat tag-stay">STAY</span></c:when>
																<c:when test="${spot.catCode == 'ACT'}"><span
																		class="tag-cat tag-act">ACT</span></c:when>
																<c:when test="${spot.catCode == 'FOOD'}"><span
																		class="tag-cat tag-food">FOOD</span></c:when>
																<c:otherwise><span
																		class="tag-cat">${spot.catCode}</span>
																</c:otherwise>
															</c:choose>
														</div>

														<div class="ttl">${spot.name}</div>
														<div class="sub">${spot.addr}</div>
													</div>
											</a>
										</c:forEach>
									</div>
								</c:if>
							</div>
						</section>
					</main>
				</div>

				<%@ include file="/WEB-INF/views/common/footer.jspf" %>

			</body>

			</html>