<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/community.css">
    <%@ include file="/WEB-INF/views/common/include/head.jspf" %>
    <title>내 커뮤니티 글 | 지출메이트</title>
</head>
<body class="community-body">

<%@ include file="/WEB-INF/views/common/layout/header.jspf" %>
<script>
    document.querySelector('.site-header')?.classList.add('is-solid');
    document.body.classList.add('is-header-ready');
    document.body.classList.add('is-opening-loaded');
    document.body.classList.add('is-fab-ready');
</script>
<%@ include file="/WEB-INF/views/common/include/flash-message.jspf" %>

<main class="community-page">
    <section class="board-list-wrap">
        <h1 class="board-page-title">내가 쓴 게시글</h1>

        <div class="board-category-bar">
            <nav class="board-category-tabs" aria-label="내 게시글 메뉴">
                <a href="${pageContext.request.contextPath}/community/my" class="is-active">전체</a>
            </nav>

            <a href="${pageContext.request.contextPath}/community/write?category=FREE"
               class="board-write-btn"
               data-auth-required="true">
                게시글 작성
            </a>
        </div>

        <div class="board-header-row board-my-header-row">
            <div>순번</div>
            <div>제목</div>
            <div>조회수</div>
            <div>게시일</div>
            <div>관리</div>
        </div>

        <div class="board-list-box">
            <c:choose>
                <c:when test="${empty posts}">
                    <c:forEach begin="1" end="${pageSize}" var="line">
                        <div class="board-line board-my-line board-empty-line">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </c:forEach>
                </c:when>

                <c:otherwise>
                    <c:forEach var="post" items="${posts}" varStatus="status">
                        <div class="board-line board-my-line">
                            <div>${startNo + status.index + 1}.</div>

                            <div class="board-title-cell">
                                <a href="${pageContext.request.contextPath}/community/detail/${post.boardId}">
                                        ${post.title}
                                </a>
                            </div>

                            <div>${post.viewsCount}조회</div>
                            <div>${post.createdAtText}</div>

                            <div>
                                <a href="${pageContext.request.contextPath}/community/edit/${post.boardId}"
                                   class="board-manage-link"
                                   data-auth-required="true">
                                    수정
                                </a>
                            </div>
                        </div>
                    </c:forEach>

                    <c:if test="${emptyLineCount > 0}">
                        <c:forEach begin="1" end="${emptyLineCount}" var="line">
                            <div class="board-line board-my-line board-empty-line">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </c:forEach>
                    </c:if>
                </c:otherwise>
            </c:choose>

            <nav class="board-pagination" aria-label="내 게시글 페이지 이동">
                <c:if test="${hasPrevBlock}">
                    <c:url var="prevBlockUrl" value="/community/my">
                        <c:param name="page" value="${prevBlockPage}" />
                    </c:url>

                    <a href="${prevBlockUrl}"
                       class="board-page-arrow"
                       aria-label="이전 페이지 묶음">←</a>
                </c:if>

                <c:forEach var="pageNo" begin="${startPage}" end="${endPage}">
                    <c:url var="pageUrl" value="/community/my">
                        <c:param name="page" value="${pageNo}" />
                    </c:url>

                    <a href="${pageUrl}"
                       class="board-page-link ${pageNo == currentPage ? 'is-active' : ''}"
                       aria-current="${pageNo == currentPage ? 'page' : 'false'}">
                            ${pageNo}
                    </a>
                </c:forEach>

                <c:if test="${hasNextBlock}">
                    <c:url var="nextBlockUrl" value="/community/my">
                        <c:param name="page" value="${nextBlockPage}" />
                    </c:url>

                    <a href="${nextBlockUrl}"
                       class="board-page-arrow"
                       aria-label="다음 페이지 묶음">→</a>
                </c:if>
            </nav>
        </div>

        <a href="${pageContext.request.contextPath}/community" class="board-back-btn">목록으로</a>
    </section>
</main>

<%@ include file="/WEB-INF/views/common/layout/floatingBtn.jspf" %>
<%@ include file="/WEB-INF/views/common/modal/faqModal.jspf" %>
<%@ include file="/WEB-INF/views/common/layout/footer.jspf" %>
<%@ include file="/WEB-INF/views/common/modal/authModal.jspf" %>
<%@ include file="/WEB-INF/views/common/include/scripts.jspf" %>
<script src="${pageContext.request.contextPath}/js/pages/faq.js"></script>

</body>
</html>