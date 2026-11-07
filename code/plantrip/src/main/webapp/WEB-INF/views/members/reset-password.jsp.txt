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

      <form class="form" action="/members/password/reset" method="post">
        <!-- 토큰은 URL로 받은 걸 hidden으로 넘김 -->
        <input type="hidden" name="token" value="${token}" />

        <div class="label">새 비밀번호</div>
        <div class="input-row">
          <input class="input" name="password" type="password" placeholder="새 비밀번호" required />
          <span class="eye">👁</span>
        </div>

        <div class="label">새 비밀번호 확인</div>
        <div class="input-row">
          <input class="input" name="passwordConfirm" type="password" placeholder="새 비밀번호 확인" required />
          <span class="eye">👁</span>
        </div>

        <div style="margin-top:8px; font-size:13px; color:#666; line-height:1.5;">
          안전을 위해 8자 이상, 영문/숫자 조합을 권장합니다.
        </div>

        <button class="primary-btn" type="submit" style="margin-top:14px;">비밀번호 변경</button>

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

  <!-- eye(비밀번호 보기) 토글: login.css와 동일 UX 원하면 아래 JS로 동작 -->
  


  <%@ include file="/WEB-INF/views/common/footer.jspf" %>


</body>
</html>

