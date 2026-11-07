<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>회원정보 수정</title>
  
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
    <nav class="mp-nav">
      <a href="${pageContext.request.contextPath}/members/mypage">
        <span class="mp-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-16v5h7V4h-7Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></span>대시보드
      </a>
      <a class="active" href="${pageContext.request.contextPath}/members/mypage/check">
        <span class="mp-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></span>회원정보 수정
      </a>
      <a href="${pageContext.request.contextPath}/members/mypage/plans">
        <span class="mp-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M7 3v3M17 3v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M4 8h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M5 6h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></span>내 여행 계획
      </a>
      <a href="${pageContext.request.contextPath}/members/mypage/reviews">
        <span class="mp-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M7 3h8l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M15 3v5h5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 13h8M8 17h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>내 여행 후기
      </a>
      <a href="${pageContext.request.contextPath}/members/mypage/wishlist">
        <span class="mp-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg></span>내 찜 목록
      </a>
    </nav>
  </aside>

  <main class="mp-main">
    <section class="mp-card mp-grow" style="width: 100%;">
      <div class="mp-card-head">
        <div>
          <div class="mp-card-title">회원정보 수정</div>
          <div class="mp-card-sub">기본 정보와 비밀번호를 변경할 수 있어요</div>
        </div>
      </div>

      <div class="mp-card-body" style="width: 100%; text-align: center; padding: 50px 20px;">
        <c:if test="${not empty error}">
          <div class="mp-error-text" style="color: #ef4444; font-size: 14px; font-weight: 600; margin-bottom: 12px; display: block;"><c:out value="${error}"/></div>
        </c:if>
        
		<form class="mp-form" action="${pageContext.request.contextPath}/members/mypage/edit" method="post">

		  <div class="mp-field" style="text-align: left; display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
		    <label style="font-weight: 700; font-size: 14px;">이름</label>
		    <input type="text" name="mName" value="${member.MName}" required style="padding: 14px; border: 1px solid #e2e8f0; border-radius: 10px;" />
		  </div>

		  <div class="mp-field" style="text-align: left; display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
		    <label style="font-weight: 700; font-size: 14px;">이메일</label>
		    <input type="email" name="mEmail" value="${member.MEmail}" required style="padding: 14px; border: 1px solid #e2e8f0; border-radius: 10px;" />
		  </div>

		  <div class="mp-field" style="text-align: left; display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
		    <label style="font-weight: 700; font-size: 14px;">새 비밀번호</label>
		    <input type="password" name="mPw" placeholder="변경할 경우에만 입력하세요" style="padding: 14px; border: 1px solid #e2e8f0; border-radius: 10px;" />
		  </div>
		  
		  <div class="mp-field" style="text-align: left; display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
		    <label style="font-weight: 700; font-size: 14px;">새 비밀번호 확인</label>
		    <input type="password" name="mPwConfirm" placeholder="새 비밀번호를 한 번 더 입력하세요" style="padding: 14px; border: 1px solid #e2e8f0; border-radius: 10px;" />
		  </div>

          <div class="mp-actions" style="display: flex; gap: 12px; margin-top: 20px;">
            <button class="mp-btn danger" type="button" onclick="location.href='${pageContext.request.contextPath}/members/mypage'" style="flex: 1; padding: 15px; background: #fff; color: #555; border: 1px solid #e2e8f0; border-radius: 10px; cursor: pointer; font-weight: 800;">취소</button>
            <button class="mp-btn" type="submit" style="flex: 1; padding: 15px; background: #3264ff; color: #fff; border: none; border-radius: 10px; cursor: pointer; font-weight: 800;">수정하기</button>
          </div>

		</form>
      </div>
    </section>
  </main>
</div>

<%@ include file="/WEB-INF/views/common/footer.jspf" %>

</body>
</html>