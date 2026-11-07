<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>비밀번호 재설정 | 여행 플래너</title>

  <link rel="stylesheet" href="/css/header.css" />
  
<link rel="stylesheet" href="/css/login.css">
  <link rel="stylesheet" href="/css/ui-toast.css" />

  <script defer src="/js/ui-toast.js"></script>
  <script defer src="/js/theme.js"></script>
  <script defer src="/js/nav-wave.js"></script>

</head>
<body>

<jsp:include page="/WEB-INF/views/common/header.jsp" />

  <div class="auth-wrap">
    <div class="auth-left">
      <div class="brand">
        <div class="logo">TP</div>
        <div class="title">여행 플래너</div>
      </div>

      <form class="form" action="/members/find-password" method="post">
        <div class="label">가입 이메일</div>
        <input class="input" name="email" type="email" placeholder="example@email.com" required />

        <div style="margin-top:8px; font-size:13px; color:#666; line-height:1.5;">
          입력하신 이메일로 <b>비밀번호 재설정 링크</b>를 보내드립니다.<br/>
          링크는 일정 시간 후 만료됩니다.
        </div>

        <button class="primary-btn" type="submit" style="margin-top:14px;">재설정 링크 받기</button>

        <!-- 서버에서 message를 내려주면 표시 -->
        <c:if test="${not empty message}">
          <div style="margin-top:12px; font-size:14px;">
            ${message}
          </div>
        </c:if>

        <!-- 서버에서 error를 내려주면 표시 -->
        <c:if test="${not empty error}">
          <div style="margin-top:12px; font-size:14px; color:#c00;">
            ${error}
          </div>
        </c:if>

        <div class="auth-footer" style="margin-top:10px;">
          <a class="underline" href="/members/login"><b>로그인으로</b></a>
        </div>

        <div class="auth-footer" style="margin-top:6px;">
          <a class="underline" href="/"><b>홈으로</b></a>
        </div>
      </form>
    </div>

    <div class="auth-right bg-mountain"></div>
  </div>

  <!-- alert.js로 띄우고 싶으면 아래처럼 param으로 트리거 가능 -->
  <c:if test="${param.sent eq 'true'}">
    
  </c:if>


  <%@ include file="/WEB-INF/views/common/footer.jspf" %>


</body>
</html>
