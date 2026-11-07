<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/community.css">
    <%@ include file="/WEB-INF/views/common/include/head.jspf" %>
    <title>게시글 수정 | 지출메이트</title>
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
    <section class="board-form-wrap">
        <h1 class="board-page-title">게시글 수정</h1>

        <c:if test="${not empty userAgeCategoryLabel}">
            <p class="board-guide-text">
                내 나이대 게시판: ${userAgeCategoryLabel} 게시판
            </p>
        </c:if>

        <form method="post"
              action="${pageContext.request.contextPath}/community/edit/${post.boardId}"
              enctype="multipart/form-data"
              class="board-form">

            <div class="board-field">
                <label for="category">게시판 선택</label>

                <select id="category" name="category" required>
                    <option value="FREE" ${category == 'FREE' ? 'selected' : ''}>자유게시판</option>
                    <option value="SECRET" ${category == 'SECRET' ? 'selected' : ''}>비밀게시판</option>
                    <option value="TEENS" ${category == 'TEENS' ? 'selected' : ''} ${userAgeCategory != 'TEENS' and category != 'TEENS' ? 'disabled' : ''}>10대 게시판</option>
                    <option value="TWENTIES" ${category == 'TWENTIES' ? 'selected' : ''} ${userAgeCategory != 'TWENTIES' and category != 'TWENTIES' ? 'disabled' : ''}>20대 게시판</option>
                    <option value="THIRTIES" ${category == 'THIRTIES' ? 'selected' : ''} ${userAgeCategory != 'THIRTIES' and category != 'THIRTIES' ? 'disabled' : ''}>30대 게시판</option>
                    <option value="FORTIES" ${category == 'FORTIES' ? 'selected' : ''} ${userAgeCategory != 'FORTIES' and category != 'FORTIES' ? 'disabled' : ''}>40대 게시판</option>
                    <option value="FIFTIES" ${category == 'FIFTIES' ? 'selected' : ''} ${userAgeCategory != 'FIFTIES' and category != 'FIFTIES' ? 'disabled' : ''}>50대 이상 게시판</option>
                </select>
            </div>

            <div class="board-field">
                <label for="title">제목</label>

                <input type="text"
                       id="title"
                       name="title"
                       maxlength="150"
                       value="${post.title}"
                       required>
            </div>

            <div class="board-field">
                <label for="content">내용</label>

                <div class="board-textarea-wrap">
                    <textarea id="content"
                              name="content"
                              maxlength="4000"
                              required>${post.content}</textarea>

                    <span class="board-counter">
                        <strong id="contentCount">0</strong> / 4000
                    </span>
                </div>
            </div>

            <c:if test="${not empty attachments}">
                <div class="board-field">
                    <label>현재 첨부 사진</label>

                    <div class="board-preview-area">
                        <c:forEach var="file" items="${attachments}">
                            <div class="jm-preview-item">
                                <img src="${pageContext.request.contextPath}${file.filePath}"
                                     alt="${file.orgFileName}">
                            </div>
                        </c:forEach>
                    </div>
                </div>
            </c:if>

            <div class="board-field">
                <label for="photos">사진 추가</label>

                <input type="file"
                       id="photos"
                       name="photos"
                       accept="image/*"
                       multiple>

                <div id="previewArea" class="board-preview-area"></div>
            </div>

            <div class="board-form-actions">
                <a href="${pageContext.request.contextPath}/community/detail/${post.boardId}"
                   class="board-light-btn">
                    취소
                </a>

                <button type="submit" class="board-submit-btn">수정</button>
            </div>
        </form>
    </section>
</main>

<%@ include file="/WEB-INF/views/common/layout/floatingBtn.jspf" %>
<%@ include file="/WEB-INF/views/common/modal/faqModal.jspf" %>
<%@ include file="/WEB-INF/views/common/layout/footer.jspf" %>
<%@ include file="/WEB-INF/views/common/modal/authModal.jspf" %>
<%@ include file="/WEB-INF/views/common/include/scripts.jspf" %>
<script src="${pageContext.request.contextPath}/js/pages/faq.js"></script>
<script src="${pageContext.request.contextPath}/js/pages/community-form.js"></script>

</body>
</html>