<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>
<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>문의 관리 | PlanTrip</title>

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
        <h1 class="admin-title">문의 관리</h1>
        <p class="admin-subtitle">
          대기 먼저, 최신순 기준으로 보여줘요.
          <c:if test="${not empty qnaTotal}">
            <span class="admin-muted">(총 ${qnaTotal}건 · 완료 ${qnaDoneCount}건 · ${qnaDonePct}%)</span>
          </c:if>
        </p>
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
      </div>
    </div>

    
<div class="admin-pagewrap">
  <!-- 미처리 -->
  <section class="admin-card padded">
    <div class="admin-section-head">
      <h2 class="admin-h2">미처리 문의 <span class="admin-muted" style="font-weight:700;">(${qnaPendingCount}건)</span></h2>
    </div>

    <div class="admin-tablewrap">
      <table class="admin-table" aria-label="미처리 문의 목록">
        <thead>
          <tr>
            <th style="width:140px;">상태</th>
            <th>제목</th>
            <th style="width:200px;">작성자</th>
            <th style="width:200px;">등록일</th>
            <th style="width:140px;">관리</th>
          </tr>
        </thead>
        <tbody>
          <c:if test="${empty qnaPendingList}">
            <tr><td colspan="5" class="admin-empty">미처리 문의가 없습니다.</td></tr>
          </c:if>

          <c:forEach var="q" items="${qnaPendingList}">
            <tr>
              <td><span class="admin-status is-pending">미처리</span></td>
              <td class="admin-ellipsis">
                <a class="admin-link" href="${pageContext.request.contextPath}/admin/inquiries/${q['qIdx']}">${q['qTitle']}</a>
              </td>
              <td>${q['mName']}</td>
              <td>${fn:substring(q['qRegDate'],0,10)}</td>
              <td>
                <a class="admin-btn is-primary" href="${pageContext.request.contextPath}/admin/inquiries/${q['qIdx']}">답변하기</a>
              </td>
            </tr>
          </c:forEach>
        </tbody>
      </table>
    </div>
  </section>

  <!-- 완료 -->
  <section class="admin-card padded" style="margin-top:16px;">
    <div class="admin-section-head">
      <h2 class="admin-h2">완료 문의 <span class="admin-muted" style="font-weight:700;">(${qnaDoneCount}건)</span></h2>
    </div>

    <div class="admin-tablewrap">
      <table class="admin-table" aria-label="완료 문의 목록">
        <thead>
          <tr>
            <th style="width:140px;">상태</th>
            <th>제목</th>
            <th style="width:200px;">작성자</th>
            <th style="width:200px;">등록일</th>
            <th style="width:140px;">관리</th>
          </tr>
        </thead>
        <tbody>
          <c:if test="${empty qnaDoneList}">
            <tr><td colspan="5" class="admin-empty">완료된 문의가 없습니다.</td></tr>
          </c:if>

          <c:forEach var="q" items="${qnaDoneList}">
            <tr>
              <td><span class="admin-status is-done">완료</span></td>
              <td class="admin-ellipsis">
                <a class="admin-link" href="${pageContext.request.contextPath}/admin/inquiries/${q['qIdx']}">${q['qTitle']}</a>
              </td>
              <td>${q['mName']}</td>
              <td>${fn:substring(q['qRegDate'],0,10)}</td>
              <td>
                <span class="admin-btn is-ghost" aria-disabled="true">완료</span>
              </td>
            </tr>
          </c:forEach>
        </tbody>
      </table>
    </div>
  </section>
</div>
</main>
</div>

</body>
</html>
