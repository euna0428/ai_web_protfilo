<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>

<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>FAQ 작성 | PlanTrip</title>

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
        <h1 class="admin-title">FAQ 작성</h1>
        <p class="admin-subtitle">새 FAQ를 등록해요.</p>
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
        <a class="admin-btn" href="${pageContext.request.contextPath}/admin/faqs">목록</a>
      </div>
    </div>

    <div class="admin-pagewrap">
      <section class="admin-card padded">
        <form method="post" action="${pageContext.request.contextPath}/admin/faq" class="admin-formgrid">
          <div class="admin-field">
            <label for="q">제목</label>
            <input id="q" class="admin-input" type="text" name="title" required />
          </div>

          <div class="admin-field">
            <label for="a">내용</label>
            <textarea id="a" class="admin-textarea" name="cont" rows="8" required></textarea>
          </div>

          <div class="admin-row">
            <div class="admin-right"></div>
            <button type="submit" class="admin-btn is-primary">등록</button>
          </div>
        </form>
      </section>
    </div>
  </main>
</div>

</body>
</html>
