<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>비밀번호 찾기 | 지출메이트</title>

  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/login.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/auth-modal.css">
</head>
<body>

<div class="auth-wrap">
  <div class="auth-left">
    <div class="brand">
      <div class="logo">지</div>
      <div class="title">비밀번호 찾기</div>
    </div>

    <form
            class="form"
            id="findPasswordForm"
            action="${pageContext.request.contextPath}/auth/find-password"
            method="post"
    >
      <label class="label" for="findPasswordEmail">가입 이메일</label>
      <input
              class="input"
              id="findPasswordEmail"
              name="email"
              type="email"
              placeholder="example@email.com"
              required
      >

      <div style="margin-top:8px; font-size:13px; color:#666; line-height:1.5;">
        입력하신 이메일로 비밀번호 재설정 링크를 보내드립니다.<br>
        링크는 일정 시간 후 만료됩니다.
      </div>

      <button class="primary-btn" type="submit" style="margin-top:14px;">
        재설정 링크 받기
      </button>

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