<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>

<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>FAQ 관리 | PlanTrip</title>

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
        <h1 class="admin-title">FAQ 관리</h1>
        <p class="admin-subtitle">자주 묻는 질문을 관리할 수 있어요.</p>
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
        <a class="admin-btn is-primary" href="${pageContext.request.contextPath}/admin/faq">+ FAQ 작성</a>
      </div>
    </div>

    <div class="admin-pagewrap">
      <section class="admin-card padded">
        <div class="admin-tablewrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width:110px;">번호</th>
                <th>질문</th>
                <th style="width:200px;">등록일</th>
              </tr>
            </thead>
            <tbody>
              <c:forEach var="f" items="${faqList}">
                <tr>
                  <td>${f.BIdx}</td>
                  <td>
                    <a class="admin-link" href="${pageContext.request.contextPath}/admin/faqs/${f.BIdx}">${f.BTitle}</a>
                  </td>
                  <td>
                    <c:choose>
                      <c:when test="${empty f.BRegDate}">-</c:when>
                      <c:otherwise>${fn:substring(f.BRegDate,0,10)}</c:otherwise>
                    </c:choose>
                  </td>
                </tr>
              </c:forEach>

              <c:if test="${empty faqList}">
                <tr>
                  <td colspan="3" class="admin-empty">등록된 FAQ가 없습니다.</td>
                </tr>
              </c:if>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>
</div>

</body>
</html>
