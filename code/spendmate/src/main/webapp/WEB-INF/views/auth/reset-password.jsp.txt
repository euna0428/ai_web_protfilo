<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>비밀번호 재설정 | 지출메이트</title>

  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/login.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/auth-modal.css">
</head>
<body>

<div class="auth-wrap">
  <div class="auth-left">
    <div class="brand">
      <div class="logo">지</div>
      <div class="title">비밀번호 재설정</div>
    </div>

    <form
            class="form"
            id="resetPasswordForm"
            action="${pageContext.request.contextPath}/auth/password/reset"
            method="post"
    >
      <input type="hidden" name="token" value="${token}">

      <label class="label" for="resetPassword">새 비밀번호</label>
      <div class="input-row">
        <input
                class="input"
                id="resetPassword"
                name="password"
                type="password"
                placeholder="새 비밀번호"
                required
        >
      </div>

      <label class="label" for="resetPasswordConfirm">새 비밀번호 확인</label>
      <div class="input-row">
        <input
                class="input"
                id="resetPasswordConfirm"
                name="passwordConfirm"
                type="password"
                placeholder="새 비밀번호 확인"
                required
        >
      </div>

      <div style="margin-top:8px; font-size:13px; color:#666; line-height:1.5;">
        안전을 위해 8자 이상으로 입력해 주세요.
      </div>

      <button class="primary-btn" type="submit" style="margin-top:14px;">
        비밀번호 변경
      </button>

      <c:if test="${not empty error}">
        <div style="margin-top:12px; font-size:14px; color:#c00;">
            ${error}
        </div>
      </c:if>

      <div class="auth-footer" style="margin-top:10px;">
        <a class="underline" href="${pageContext.request.contextPath}/auth/login">
          <b>로그인으로</b>
        </a>
      </div>

      <div class="auth-footer" style="margin-top:6px;">
        <a class="underline" href="${pageContext.request.contextPath}/">
          <b>홈으로</b>
        </a>
      </div>
    </form>
  </div>

  <div class="auth-right bg-mountain"></div>
</div>

<script src="${pageContext.request.contextPath}/js/auth-modal.js?v=4"></script>
</body>
</html>