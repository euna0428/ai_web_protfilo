<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>

<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>관리자 메인 | PlanTrip</title>

  <!-- admin 전용 UI (사용자 페이지 CSS와 분리) -->
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
        <h1 class="admin-title">대시보드</h1>
        <p class="admin-subtitle">관리자 통계와 최근 현황을 확인할 수 있어요.</p>
      </div>
      <div class="admin-actions">
        <span class="admin-userchip">
          <c:choose>
            <c:when test="${not empty sessionScope.loginMember}">
              ${sessionScope.loginMember.MName}님 (ADMIN)
            </c:when>
            <c:otherwise>
              ADMIN
            </c:otherwise>
          </c:choose>
        </span>
        <%-- <button type="button" class="theme-toggle theme-toggle--pill" id="themeToggle" aria-label="테마 전환">
          <span class="tt-icon" aria-hidden="true">☀️</span>
          <span class="tt-icon" aria-hidden="true">🌙</span>
          <span class="tt-indicator" aria-hidden="true"></span>
        </button> --%>
      </div>
    </div>

    <c:if test="${not empty msg}">
      <div class="admin-alert admin-card padded">${msg}</div>
    </c:if>

    <section class="admin-stats">
      <div class="admin-stat">
        <div class="admin-stat__label">미처리 문의</div>
        <div class="admin-stat__value is-red"><c:out value="${pendingQnaCount}" default="0"/>건</div>
      </div>
      <div class="admin-stat">
        <div class="admin-stat__label">오늘 가입 회원</div>
        <div class="admin-stat__value is-blue"><c:out value="${todayJoinCount}" default="0"/>명</div>
      </div>
      <div class="admin-stat">
        <div class="admin-stat__label">최근 공지 수</div>
        <div class="admin-stat__value is-green"><c:out value="${noticeCount}" default="0"/>건</div>
      </div>
      <div class="admin-stat">
        <div class="admin-stat__label">최근 들어온 질문</div>
        <div class="admin-stat__value is-green"><c:out value="${faqCount}" default="0"/>건</div>
      </div>
    </section>

    <!-- ✅ (요청) 최근 문의/FAQ 박스들이 위로 붙어 보여서 아래로 조금 내림 -->
    <section class="admin-card padded" style="margin-top:26px;">
      <div class="admin-section-head">
        <h2 class="admin-h2">최근 들어온 문의</h2>
        <a class="admin-btn" href="${pageContext.request.contextPath}/admin/inquiries">전체 보기</a>
      </div>

      <div class="admin-tablewrap">
        <table class="admin-table" aria-label="최근 미처리 문의">
          <thead>
            <tr>
              <th style="width:90px;">순서</th>
              <th style="width:140px;">상태</th>
              <th>제목</th>
              <th style="width:160px;">작성자</th>
              <th style="width:140px;">작성일</th>
            </tr>
          </thead>
          <tbody>
            <c:set var="pendingShown" value="0" />
            <c:forEach var="q" items="${recentQnaList}" varStatus="st">
              <c:if test="${q['qStatus'] == 0}">
                <tr>
                  <td>${pendingShown + 1}</td>
                  <td><span class="admin-status is-pending">미처리</span></td>
                  <td class="admin-ellipsis">
                    <a class="admin-link" href="${pageContext.request.contextPath}/admin/inquiries/${q['qIdx']}">${q['qTitle']}</a>
                  </td>
                  <td>${q['mName']}</td>
                  <td>${q['qRegDateText']}</td>
                </tr>
                <c:set var="pendingShown" value="${pendingShown + 1}" />
              </c:if>
            </c:forEach>

            <c:if test="${pendingShown == 0}">
              <tr>
                <td colspan="5" class="admin-empty">
                  최근 미처리 문의가 없습니다. (전체 목록은 <a class="admin-linktext" href="${pageContext.request.contextPath}/admin/inquiries">문의 관리</a>에서 확인)
                </td>
              </tr>
            </c:if>
          </tbody>
        </table>
      </div>
    </section>

    <section class="admin-card padded" style="margin-top:22px;">
      <div class="admin-section-head">
        <h2 class="admin-h2">최근 들어온 FAQ</h2>
        <a class="admin-btn" href="${pageContext.request.contextPath}/admin/faqs">전체 보기</a>
      </div>

      <div class="admin-tablewrap">
        <table class="admin-table" aria-label="최근 FAQ">
          <thead>
            <tr>
              <th style="width:90px;">순서</th>
              <th>제목</th>
              <th style="width:140px;">등록일</th>
            </tr>
          </thead>
          <tbody>
            <c:if test="${empty recentFaqList}">
              <tr><td colspan="3" class="admin-empty">최근 FAQ가 없습니다.</td></tr>
            </c:if>
            <c:forEach var="f" items="${recentFaqList}" varStatus="st">
              <tr>
                <td>${st.index + 1}</td>
                <td class="admin-ellipsis">
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
          </tbody>
        </table>
      </div>
    </section>
  </main>
</div>

</body>
</html>
