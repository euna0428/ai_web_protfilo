<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>
<!doctype html>
<html lang="ko" data-page="support">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>문의 작성 | 고객센터</title>

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
<c:set var="supportActive" value="qnaNew" />

<div class="support-shell">

  <%@ include file="/WEB-INF/views/support/_sidebar.jspf" %>

  <main class="support-main" aria-label="고객센터 내용">

    <div class="support-top">
      <div class="support-tabs" role="tablist" aria-label="고객센터 탭">
        <a class="support-tab is-active" role="tab" aria-selected="true" href="${pageContext.request.contextPath}/support">나의 문의 내역</a>
        <a class="support-tab" role="tab" aria-selected="false" href="${pageContext.request.contextPath}/support/notice">공지사항</a>
        <a class="support-tab" role="tab" aria-selected="false" href="${pageContext.request.contextPath}/support/faq">자주 묻는 질문</a>
      </div>

      <div class="support-actions">
        <a class="btn" href="${pageContext.request.contextPath}/support/qna">목록으로</a>
      </div>
    </div>

    <section class="support-card" aria-label="문의 작성">
      <div class="support-card__head">
        <div>
          <div class="support-card__title">문의 작성</div>
          <div class="support-card__sub">문의 내용을 작성해주세요.</div>
        </div>
      </div>

      <form class="support-form" action="${pageContext.request.contextPath}/support/qna" method="post">
        <label class="support-label" for="qTitle">제목</label>
        <input id="qTitle" name="qTitle" type="text" required maxlength="200" class="support-input" />

        <label class="support-label" for="qCont" style="margin-top:14px;">내용</label>
        <textarea id="qCont" name="qCont" required class="support-textarea"></textarea>

        <div class="support-foot" style="margin-top:14px; gap:10px;">
          <a class="btn" href="${pageContext.request.contextPath}/support/qna">취소</a>
          <button class="btn solid" type="submit">등록</button>
        </div>
      </form>
    </section>

  </main>

</div>

<%@ include file="/WEB-INF/views/common/footer.jspf" %>


</body>
</html>
