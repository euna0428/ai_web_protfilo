<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>

<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>공지 상세 | PlanTrip</title>

  <link rel="stylesheet" href="/css/admin-console.css" />
  <link rel="stylesheet" href="/css/admin-components.css" />

  <script defer src="/js/theme.js"></script>
</head>

<body class="admin-page">

<div class="admin-shell">
  <%@ include file="/WEB-INF/views/admin/admin_sidebar.jspf" %>

  <main class="admin-main">
    <div class="admin-topbar">
      <div>
        <h1 class="admin-title">공지 상세</h1>
        <p class="admin-subtitle">공지 내용을 확인하고 수정/삭제할 수 있어요.</p>
      </div>
      <div class="admin-actions">
        <span class="admin-userchip">
          <c:choose>
            <c:when test="${not empty sessionScope.loginMember}">
              ${sessionScope.loginMember.MName}님 (ADMIN)
            </c:when>
            <c:otherwise>ADMIN</c:otherwise>
          </c:choose>
        </span>
        <%-- <button type="button" class="theme-toggle theme-toggle--pill" id="themeToggle" aria-label="테마 전환">
          <span class="tt-icon" aria-hidden="true">☀️</span>
          <span class="tt-icon" aria-hidden="true">🌙</span>
          <span class="tt-indicator" aria-hidden="true"></span>
        </button> --%>
        <a class="admin-btn" href="${pageContext.request.contextPath}/admin/notices">목록</a>
        <a class="admin-btn is-primary" href="${pageContext.request.contextPath}/admin/notices/${notice.BIdx}/edit">수정</a>
      </div>
    </div>

    <div class="admin-pagewrap">
      <section class="admin-card padded">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <h2 style="margin:0;font-size:18px;font-weight:1000;">${notice.BTitle}</h2>
          <c:if test="${notice.BIsTop eq 1}">
            <span class="admin-status">TOP</span>
          </c:if>
          <div class="admin-right"></div>
          <div class="admin-userchip">
            <c:choose>
              <c:when test="${empty notice.BRegDate}">-</c:when>
              <c:otherwise>${fn:substring(notice.BRegDate,0,10)}</c:otherwise>
            </c:choose>
          </div>
        </div>

        <div style="margin-top:14px;white-space:pre-wrap;line-height:1.7;">
          ${notice.BCont}
        </div>

        <div class="admin-row" style="margin-top:16px;">
          <div class="admin-right"></div>
          <form action="${pageContext.request.contextPath}/admin/notices/${notice.BIdx}/delete" method="post" style="margin:0;">
            <button class="admin-btn is-danger" type="submit" onclick="return confirm('삭제할까요?');">삭제</button>
          </form>
        </div>
      </section>
    </div>
  </main>
</div>

</body>
</html>
