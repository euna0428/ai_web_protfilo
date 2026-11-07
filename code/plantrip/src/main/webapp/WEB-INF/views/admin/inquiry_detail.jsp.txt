<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>
<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>문의 상세 | PlanTrip</title>

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
        <h1 class="admin-title">문의 상세</h1>
        <p class="admin-subtitle">상태: ${qna['qStatusLabel']} · 등록일: ${qna['qRegDateText']}</p>
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
        <a class="admin-btn" href="${pageContext.request.contextPath}/admin/inquiries">목록</a>
      </div>
    </div>

    <div class="admin-pagewrap">
      <section class="admin-card padded">
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
          <h2 style="margin:0;font-size:18px;font-weight:1000;">${qna['qTitle']}</h2>
          <div class="admin-right"></div>
          <span class="admin-userchip">작성자: ${qna['mName']} (${qna['mId']})</span>
        </div>

        <div style="margin-top:14px;white-space:pre-wrap;line-height:1.7;">
          ${qna['qCont']}
        </div>
      </section>

      <section class="admin-card padded">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <div style="font-weight:1000;">관리자 답변</div>
          <div style="color:var(--admin-muted);font-size:12px;">저장하면 상태가 자동으로 완료로 바뀝니다.</div>
        </div>

        <form action="${pageContext.request.contextPath}/admin/inquiries/${qna['qIdx']}/answer" method="post" style="margin-top:12px;">
          <textarea class="admin-textarea" name="qAnswer" rows="10" placeholder="답변을 입력하세요.">${qna['qAnswer']}</textarea>

          <div class="admin-row" style="margin-top:12px;">
            <div class="admin-right"></div>
            <a class="admin-btn" href="${pageContext.request.contextPath}/admin/inquiries">취소</a>
            <button class="admin-btn is-primary" type="submit">답변 저장</button>
          </div>
        </form>
      </section>
    </div>
  </main>
</div>

</body>
</html>
