<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>
<!doctype html>
<html lang="ko" data-page="support">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>문의 상세 | 고객센터</title>

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
<c:set var="supportActive" value="home" />

<div class="support-shell">

  <%@ include file="/WEB-INF/views/support/_sidebar.jspf" %>

  <main class="support-main" aria-label="고객센터 내용">

    <div class="support-top">
      <div class="support-tabs" role="tablist" aria-label="고객센터 탭">
        <a class="support-tab is-active" role="tab" aria-selected="true" href="${pageContext.request.contextPath}/support">나의 문의 내역</a>
        <a class="support-tab" role="tab" aria-selected="false" href="${pageContext.request.contextPath}/support/notice">공지사항</a>
        <a class="support-tab" role="tab" aria-selected="false" href="${pageContext.request.contextPath}/support/faq">자주 묻는 질문</a>
      </div>

      <!--<div class="support-actions">
        <a class="btn" href="${pageContext.request.contextPath}/support/qna">목록</a>
      </div>-->
    </div>

    <section class="support-card" aria-label="문의 상세">
      <div class="support-card__head" style="align-items:flex-start;">
        <div>
          <div class="support-card__title">${qna['qTitle']}</div>
          <div class="support-card__sub">등록일: ${qna['qRegDate']} · 상태: ${qna['qStatusLabel']}</div>
        </div>

        <div style="display:flex; gap:8px;">
          <a class="btn" href="${pageContext.request.contextPath}/support/qna/${qna['qIdx']}/edit">수정</a>

          <form action="${pageContext.request.contextPath}/support/qna/${qna['qIdx']}/delete"
                method="post" style="margin:0;"
                onsubmit="return confirm('정말 삭제할까요?');">
            <button class="btn" type="submit">삭제</button>
          </form>
        </div>
      </div>

      <div style="white-space:pre-wrap; line-height:1.7;">
        ${qna['qCont']}
      </div>
    </section>

    <section class="support-card" aria-label="관리자 답변" style="margin-top:14px;">
      <div class="support-card__head" style="margin-bottom:10px;">
        <div>
          <div class="support-card__title">관리자 답변</div>
          <div class="support-card__sub">답변이 등록되면 여기에서 확인할 수 있어요.</div>
        </div>
      </div>

      <c:choose>
        <c:when test="${not empty qna['qAnswer']}">
          <div style="white-space:pre-wrap; line-height:1.7;">${qna['qAnswer']}</div>
        </c:when>
        <c:otherwise>
          <div class="support-muted">아직 답변이 없습니다.</div>
        </c:otherwise>
      </c:choose>
    </section>

  </main>
</div>

<%@ include file="/WEB-INF/views/common/footer.jspf" %>


</body>
</html>
