<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>
<!doctype html>
<html lang="ko" data-page="support">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>고객센터</title>

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
      <div class="support-headbar">
        <div class="support-headbar__title">고객센터</div>
        <div class="support-headbar__sub">문의/공지/FAQ</div>
      </div>

      <div class="support-topbar">
      <div class="support-tabs" role="tablist" aria-label="고객센터 탭">
        <a class="support-tab is-active" role="tab" aria-selected="true" href="${pageContext.request.contextPath}/support">나의 문의 내역</a>
        <a class="support-tab" role="tab" aria-selected="false" href="${pageContext.request.contextPath}/support/notice">공지사항</a>
        <a class="support-tab" role="tab" aria-selected="false" href="${pageContext.request.contextPath}/support/faq">자주 묻는 질문</a>
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

    <c:if test="${not empty msg}">
      <div class="support-alert">${msg}</div>
    </c:if>

    <section class="support-card" aria-label="문의 목록">
      <div class="support-card__head">
        <div>
          <div class="support-card__title">나의 문의 내역</div>
          <div class="support-card__sub">최근 문의를 확인할 수 있어요.</div>
        </div>
      </div>

      <div class="support-tablewrap">
        <table class="support-table" aria-label="문의 목록 테이블">
          <thead>
          <tr>
            <th style="width:120px;">상태</th>
            <th>제목</th>
            <th style="width:160px;">등록일</th>
          </tr>
          </thead>
          <tbody>

          <c:choose>
            <c:when test="${empty sessionScope.loginMember}">
              <tr>
                <td colspan="3" class="support-empty">
                  문의 내역은 로그인 후 확인할 수 있어요.
                  <a class="support-inline" href="#" data-auth-open="login" data-auth-redirect="/support">로그인</a>
                </td>
              </tr>
            </c:when>

            <c:when test="${empty qnaPreview}">
              <tr>
                <td colspan="3" class="support-empty">아직 작성한 문의가 없습니다.</td>
              </tr>
            </c:when>

            <c:otherwise>
              <c:forEach var="q" items="${qnaPreview}">
                <tr>
                  <td>	
					<c:choose>
					  <c:when test="${q['qStatus'] == 1}">
					    <span class="support-pill is-done">처리완료</span>
					  </c:when>
					  <c:otherwise>
					    <span class="support-pill is-wait">답변대기</span>
					  </c:otherwise>
					</c:choose>

                  </td>
                  <td class="support-ellipsis">
                    <a class="support-link" href="${pageContext.request.contextPath}/support/qna/${q['qIdx']}">${q['qTitle']}</a>
                  </td>
                  <td class="support-muted">${fn:replace(fn:substring(q['qRegDate'],0,10),'-','.')}</td>
                </tr>
              </c:forEach>
            </c:otherwise>
          </c:choose>

          </tbody>
        </table>
      </div>

      <div class="support-foot">
        <c:choose>
          <c:when test="${not empty sessionScope.loginMember}">
            <a class="btn" href="${pageContext.request.contextPath}/support/qna">전체 보기</a>
          </c:when>
          <c:otherwise>
            <a class="btn" href="#" data-auth-open="login" data-auth-redirect="/support/qna">전체 보기</a>
          </c:otherwise>
        </c:choose>
      </div>
    </section>
  </main>

</div>

<%@ include file="/WEB-INF/views/common/footer.jspf" %>


</body>
</html>
