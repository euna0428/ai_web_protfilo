<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/community.css">
    <%@ include file="/WEB-INF/views/common/include/head.jspf" %>
    <title>${post.title} | 지출메이트 게시판</title>
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
    <section class="board-detail-wrap">
        <div class="board-detail-card">
            <header class="board-detail-head">
                <div>
                    <p class="board-detail-category">${categoryLabel} 게시판</p>
                    <h1>${post.title}</h1>

                    <div class="board-detail-meta">
                        <span>작성자: ${post.writerName}</span>
                        <span>조회: ${post.viewsCount}</span>
                        <span>게시일: ${post.createdAtText}</span>
                    </div>
                </div>

                <div class="board-detail-actions">
                    <a href="${pageContext.request.contextPath}/community?category=${category}"
                       class="board-list-btn">
                        목록
                    </a>

                    <button type="button" class="board-report-btn">신고</button>
                </div>
            </header>

            <div class="board-detail-grid">
                <section class="board-photo-zone">
                    <c:choose>
                        <c:when test="${not empty attachments}">
                            <div class="board-main-photo">
                                <img id="mainCommunityPhoto"
                                     src="${pageContext.request.contextPath}${attachments[0].filePath}"
                                     alt="${attachments[0].orgFileName}">

                                <span class="jm-photo-count">1 / ${fn:length(attachments)}</span>
                            </div>

                            <div class="board-thumb-list">
                                <c:forEach var="file" items="${attachments}" varStatus="status">
                                    <button type="button"
                                            class="jm-thumb-btn ${status.first ? 'is-active' : ''}">
                                        <img src="${pageContext.request.contextPath}${file.filePath}"
                                             data-src="${pageContext.request.contextPath}${file.filePath}"
                                             alt="${file.orgFileName}">
                                    </button>
                                </c:forEach>
                            </div>
                        </c:when>

                        <c:otherwise>
                            <div class="board-photo-empty">
                                첨부된 사진이 없습니다.
                            </div>
                        </c:otherwise>
                    </c:choose>
                </section>

                <aside class="board-content-zone">
                    <div class="board-profile-box">
                        <div class="board-profile-avatar ${post.avatarClass}">
                            ${post.avatarText}
                        </div>

                        <div>
                            <strong>${post.writerName}</strong>
                            <p>게시일: ${post.createdAtText}</p>
                        </div>
                    </div>

                    <div class="board-content-box">
                        <strong>게시글 내용</strong>
                        <pre>${post.content}</pre>
                    </div>
                </aside>
            </div>
        </div>

        <section class="board-comment-card">
            <div class="board-comment-head">
                <h2>댓글</h2>
                <p>총 ${fn:length(comments)}개의 댓글이 있습니다.</p>
            </div>

            <c:choose>
                <c:when test="${not empty loginUserId and canComment}">
                    <form class="board-comment-form"
                          method="post"
                          action="${pageContext.request.contextPath}/community/detail/${post.boardId}/comments">
                        <input type="text"
                               name="content"
                               maxlength="500"
                               placeholder="댓글을 입력하세요."
                               aria-label="댓글 입력"
                               required>

                        <button type="submit" class="board-submit-btn">등록</button>
                    </form>
                </c:when>

                <c:when test="${not empty loginUserId and not canComment}">
                    <div class="board-comment-login-guide">
                            ${commentGuideMessage}
                    </div>
                </c:when>

                <c:otherwise>
                    <div class="board-comment-login-guide">
                        댓글을 작성하려면 로그인이 필요합니다.
                    </div>
                </c:otherwise>
            </c:choose>

            <c:choose>
                <c:when test="${not empty comments}">
                    <div class="board-comment-list">
                        <c:forEach var="comment" items="${comments}">
                            <article class="board-comment-item">
                                <div class="board-comment-avatar ${comment.avatarClass}">
                                        ${comment.avatarText}
                                </div>

                                <div class="board-comment-body">
                                    <div class="board-comment-meta">
                                        <strong>${comment.writerName}</strong>
                                        <span>${comment.createdAtText}</span>
                                    </div>

                                    <p>${comment.content}</p>
                                </div>

                                <c:if test="${comment.userId eq loginUserId}">
                                    <form method="post"
                                          action="${pageContext.request.contextPath}/community/detail/${post.boardId}/comments/${comment.commentId}/delete"
                                          class="board-comment-delete-form"
                                          onsubmit="return confirm('댓글을 삭제하시겠습니까?');">
                                        <button type="submit" class="board-comment-delete-btn">삭제</button>
                                    </form>
                                </c:if>
                            </article>
                        </c:forEach>
                    </div>
                </c:when>

                <c:otherwise>
                    <div class="board-comment-empty">
                        아직 등록된 댓글이 없습니다.
                    </div>
                </c:otherwise>
            </c:choose>
        </section>
    </section>
</main>

<%@ include file="/WEB-INF/views/common/layout/floatingBtn.jspf" %>
<%@ include file="/WEB-INF/views/common/modal/faqModal.jspf" %>
<%@ include file="/WEB-INF/views/common/layout/footer.jspf" %>
<%@ include file="/WEB-INF/views/common/modal/authModal.jspf" %>
<%@ include file="/WEB-INF/views/common/include/scripts.jspf" %>
<script src="${pageContext.request.contextPath}/js/pages/faq.js"></script>
<script src="${pageContext.request.contextPath}/js/pages/community-detail.js"></script>

</body>
</html>