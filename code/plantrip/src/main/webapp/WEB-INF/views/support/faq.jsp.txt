<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>
<!doctype html>
<html lang="ko" data-page="support">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>자주 묻는 질문 | 고객센터</title>

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
      <div class="support-headbar">
        <div class="support-headbar__title">고객센터</div>
        <div class="support-headbar__sub">문의/공지/FAQ</div>
      </div>

      <div class="support-topbar">
      <div class="support-tabs" role="tablist" aria-label="고객센터 탭">
        <a class="support-tab" role="tab" aria-selected="false" href="${pageContext.request.contextPath}/support">나의 문의 내역</a>
        <a class="support-tab" role="tab" aria-selected="false" href="${pageContext.request.contextPath}/support/notice">공지사항</a>
        <a class="support-tab is-active" role="tab" aria-selected="true" href="${pageContext.request.contextPath}/support/faq">자주 묻는 질문</a>
      </div>

      <div class="support-actions">
        <c:choose>
          <c:when test="${not empty sessionScope.loginMember}">
            <a class="btn solid" href="${pageContext.request.contextPath}/support/qna/new"><span class="btn-ico"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>새 문의 작성하기</a>
          </c:when>
          <c:otherwise>
            <a class="btn solid" href="#" data-auth-open="login" data-auth-redirect="/support/qna/new"><span class="btn-ico"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>새 문의 작성하기</a>
          </c:otherwise>
        </c:choose>
      </div>
      </div>
    </div>

    <section class="support-card" aria-label="FAQ 목록">
      <div class="support-card__head">
        <div>
          <div class="support-card__title">자주 묻는 질문</div>
          <div class="support-card__sub">질문을 누르면 답변이 펼쳐져요.</div>
        </div>
      </div>

      <div class="support-stack">
        <c:if test="${empty faqList}">
          <div class="support-empty">등록된 FAQ가 없습니다.</div>
        </c:if>

        <c:forEach var="f" items="${faqList}" varStatus="st">
          <details class="support-faq">
            <summary class="support-faq__q">
              <span class="support-faq__qText">Q${st.count}. ${f.getBTitle()}</span>
              <c:if test="${f.getBIsTop() == 1}">
                <span class="support-pill support-pill--plain">TOP</span>
              </c:if>
            </summary>
            <div class="support-faq__meta">${f.getBRegDate()}</div>
            <div class="support-faq__a">${f.getBCont()}</div>
          </details>
        </c:forEach>
      </div>
    </section>

  </main>
</div>

<%@ include file="/WEB-INF/views/common/footer.jspf" %>


</body>
</html>
