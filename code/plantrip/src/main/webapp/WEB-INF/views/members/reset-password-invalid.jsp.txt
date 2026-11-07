<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>재설정 링크 오류 | 여행 플래너</title>

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

      <div class="form">
        <div style="font-size:15px; font-weight:700; margin-bottom:8px;">
          재설정 링크를 사용할 수 없습니다.
        </div>

        <div style="margin-top:8px; font-size:14px; color:#c00; line-height:1.6;">
          링크가 유효하지 않거나 만료되었습니다.
          <c:if test="${not empty error}">
            <div style="margin-top:6px; font-size:13px; color:#666;">
              (사유: ${error})
            </div>
          </c:if>
        </div>

        <div style="margin-top:14px; font-size:13px; color:#666; line-height:1.5;">
          아래 버튼을 눌러 재설정 링크를 다시 받아주세요.
        </div>

        <a class="primary-btn" href="/members/find-password" style="display:inline-block; text-align:center; margin-top:14px;">
          재설정 링크 다시 받기
        </a>

        <div class="auth-footer" style="margin-top:10px;">
          <a class="underline" href="/members/login"><b>로그인으로</b></a>
        </div>

        <div class="auth-footer" style="margin-top:6px;">
          <a class="underline" href="/"><b>홈으로</b></a>
        </div>
      </div>
    </div>

    <div class="auth-right bg-mountain"></div>
  </div>


  <%@ include file="/WEB-INF/views/common/footer.jspf" %>


</body>
</html>
