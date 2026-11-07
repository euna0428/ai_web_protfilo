<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>
<!doctype html>
<html lang="ko" data-page="support">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>FAQ 상세 | 고객센터</title>

    <link rel="stylesheet" href="/css/header.css" />
  <link rel="stylesheet" href="/css/support-console.css" />
  <link rel="stylesheet" href="/css/redesign.css" />
  <link rel="stylesheet" href="/css/ui-toast.css" />

  <script defer src="/js/ui-toast.js"></script>
  <script defer src="/js/theme.js"></script>
    <script defer src="/js/nav-wave.js"></script>
</head>
<body class="page-solid">


    <jsp:include page="/WEB-INF/views/common/header.jsp" />
<c:set var="supportActive" value="faq" />

<div class="support-shell">

  <%@ include file="/WEB-INF/views/support/_sidebar.jspf" %>

  <main class="support-main" aria-label="고객센터 내용">

    <div class="support-top">
      <div class="support-tabs" role="tablist" aria-label="고객센터 탭">
        <a class="support-tab" role="tab" aria-selected="false" href="${pageContext.request.contextPath}/support">나의 문의 내역</a>
        <a class="support-tab" role="tab" aria-selected="false" href="${pageContext.request.contextPath}/support/notice">공지사항</a>
        <a class="support-tab is-active" role="tab" aria-selected="true" href="${pageContext.request.contextPath}/support/faq">자주 묻는 질문</a>
      </div>

      <div class="support-actions">
        <a class="btn" href="${pageContext.request.contextPath}/support/faq">목록으로</a>
      </div>
    </div>

    <section class="support-card" aria-label="FAQ 상세">
      <div class="support-card__head">
        <div>
          <div class="support-card__title">Q. ${faq.getBTitle()}</div>
          <div class="support-card__sub">
            등록일: ${faq.getBRegDate()}
            <c:if test="${faq.getBIsTop() == 1}">
              <span class="support-badge" style="margin-left:8px;">TOP</span>
            </c:if>
          </div>
        </div>
      </div>

      <div class="support-content">A. ${faq.getBCont()}</div>
    </section>

  </main>
</div>

<%@ include file="/WEB-INF/views/common/footer.jspf" %>


</body>
</html>
