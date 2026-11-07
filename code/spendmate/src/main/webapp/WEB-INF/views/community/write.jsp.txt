<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/community.css">
    <%@ include file="/WEB-INF/views/common/include/head.jspf" %>
    <title>게시글 작성 | 지출메이트</title>

    <style>
        html,
        body {
            min-height: 100%;
        }

        body.community-body {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .community-page {
            padding-top: 94px;
            background: #fff;
            flex: 1 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .community-page > .board-form-wrap {
            width: min(640px, calc(100% - 80px));
            margin: 0;           /* flex 안에서는 auto margin 불필요 */
            padding-bottom: 2rem;
            padding-top: 2rem;
        }

        .board-form-wrap {
            width: min(640px, calc(100% - 80px));
            margin: 0 auto;
            padding-bottom: 4rem;
        }

        .board-page-title {
            text-align: center;
            font-size: 28px;
            font-weight: 400;
            color: #1a1a1a;
            margin: 0 0 2rem;
            letter-spacing: -0.02em;
        }

        .board-form {
            border: none;
            border-radius: 0;
            padding: 0;
            background: #fff;
            display: flex;
            flex-direction: column;
            gap: 1.4rem;
        }

        .board-field {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .board-field label {
            font-size: 15px;
            color: #888;
            font-weight: 500;
            margin-bottom: 4px;
        }

        .custom-select-wrap {
            position: relative;
        }

        .custom-select-trigger {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #ddd;
            font-size: 18px;
            color: #333;
            cursor: pointer;
            user-select: none;
            background: #fff;
        }

        .custom-select-trigger::after {
            content: '▾';
            font-size: 14px;
            color: #999;
        }

        .custom-select-list {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            z-index: 100;
            box-shadow: 0 4px 16px rgba(0,0,0,0.08);
            overflow: hidden;
        }

        .custom-select-list.on {
            display: block;
        }

        .custom-select-item {
            padding: 12px 16px;
            font-size: 17px;
            color: #333;
            cursor: pointer;
            background: #fff;
        }

        .custom-select-item:hover {
            background: #f5f5f5;
        }

        .custom-select-item.disabled {
            color: #bbb;
            cursor: not-allowed;
            pointer-events: none;
        }

        .custom-select-item.selected {
            color: #193b60;
            font-weight: 600;
        }

        .real-select {
            display: none;
        }

        .board-field input[type="text"] {
            border: none;
            border-bottom: 1px solid #ddd;
            border-radius: 0;
            padding: 10px 0;
            font-size: 18px;
            background: #fff;
            outline: none;
            width: 100%;
        }

        .board-field input[type="text"]:focus {
            border-bottom: 1px solid #193b60;
        }

        .board-field textarea {
            border: none;
            border-bottom: 1px solid #ddd;
            border-radius: 0;
            padding: 10px 0;
            font-size: 18px;
            background: #fff;
            outline: none;
            width: 100%;
            min-height: 160px;
            resize: none;
            line-height: 1.7;
            overflow: hidden;
        }

        .board-field textarea:focus {
            border-bottom: 1px solid #193b60;
        }

        .board-field input[type="file"] {
            border: none;
            padding: 10px 0;
            font-size: 16px;
        }

        .board-textarea-wrap {
            position: relative;
        }

        .board-counter {
            position: absolute;
            right: 0;
            bottom: 8px;
            color: #bbb;
            font-size: 12px;
            background: #fff;
            padding: 2px 6px;
        }

        .board-form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 0.5rem;
        }

        .board-submit-btn {
            background: #193b60;
            color: #fff;
            border: none;
            border-radius: 20px;
            padding: 10px 32px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
        }

        .board-light-btn {
            background: #f2f2f2;
            color: #555;
            border: none;
            border-radius: 20px;
            padding: 10px 32px;
            font-size: 15px;
            font-weight: 600;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
        }

        body.community-body .footer {
            margin-top: auto;
            flex-shrink: 0;
        }
    </style>
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
        <h1 class="board-page-title">게시글 작성</h1>

        <form method="post"
              action="${pageContext.request.contextPath}/community/write"
              enctype="multipart/form-data"
              class="board-form"
              id="writeForm">

            <div class="board-field">
                <label>게시판 선택</label>

                <div class="custom-select-wrap" id="categorySelectWrap">
                    <div class="custom-select-trigger" id="categoryTrigger" onclick="toggleCategoryList()">
                        <span id="categoryTriggerText">자유게시판</span>
                    </div>

                    <div class="custom-select-list" id="categoryList">
                        <div class="custom-select-item selected" data-value="FREE" onclick="selectCategory(this)">자유게시판</div>
                        <div class="custom-select-item" data-value="SECRET" onclick="selectCategory(this)">비밀게시판</div>
                        <div class="custom-select-item ${userAgeCategory != 'TEENS' ? 'disabled' : ''}" data-value="TEENS" onclick="selectCategory(this)">10대 게시판</div>
                        <div class="custom-select-item ${userAgeCategory != 'TWENTIES' ? 'disabled' : ''}" data-value="TWENTIES" onclick="selectCategory(this)">20대 게시판</div>
                        <div class="custom-select-item ${userAgeCategory != 'THIRTIES' ? 'disabled' : ''}" data-value="THIRTIES" onclick="selectCategory(this)">30대 게시판</div>
                        <div class="custom-select-item ${userAgeCategory != 'FORTIES' ? 'disabled' : ''}" data-value="FORTIES" onclick="selectCategory(this)">40대 게시판</div>
                        <div class="custom-select-item ${userAgeCategory != 'FIFTIES' ? 'disabled' : ''}" data-value="FIFTIES" onclick="selectCategory(this)">50대 이상 게시판</div>
                    </div>
                </div>

                <select class="real-select" id="category" name="category" required>
                    <option value="FREE" ${category == 'FREE' ? 'selected' : ''}>자유게시판</option>
                    <option value="SECRET" ${category == 'SECRET' ? 'selected' : ''}>비밀게시판</option>
                    <option value="TEENS" ${category == 'TEENS' ? 'selected' : ''}>10대 게시판</option>
                    <option value="TWENTIES" ${category == 'TWENTIES' ? 'selected' : ''}>20대 게시판</option>
                    <option value="THIRTIES" ${category == 'THIRTIES' ? 'selected' : ''}>30대 게시판</option>
                    <option value="FORTIES" ${category == 'FORTIES' ? 'selected' : ''}>40대 게시판</option>
                    <option value="FIFTIES" ${category == 'FIFTIES' ? 'selected' : ''}>50대 이상 게시판</option>
                </select>
            </div>

            <div class="board-field">
                <label for="title">제목</label>
                <input type="text"
                       id="title"
                       name="title"
                       maxlength="150"
                       required
                       placeholder="제목을 입력하세요.">
            </div>

            <div class="board-field">
                <label for="content">내용</label>

                <div class="board-textarea-wrap">
                    <textarea id="content"
                              name="content"
                              maxlength="4000"
                              required
                              placeholder="내용을 입력하세요."></textarea>

                    <span class="board-counter">
                        <strong id="contentCount">0</strong> / 4000
                    </span>
                </div>
            </div>

            <div class="board-field">
                <label for="photos">사진 첨부</label>
                <input type="file"
                       id="photos"
                       name="photos"
                       accept="image/*"
                       multiple>
                <div id="previewArea" class="board-preview-area"></div>
            </div>

            <div class="board-form-actions">
                <a href="${pageContext.request.contextPath}/community?category=${category}"
                   class="board-light-btn">취소</a>
                <button type="submit" class="board-submit-btn">등록</button>
            </div>
        </form>
    </section>
</main>

<%@ include file="/WEB-INF/views/common/layout/floatingBtn.jspf" %>
<%@ include file="/WEB-INF/views/common/modal/faqModal.jspf" %>
<%@ include file="/WEB-INF/views/common/layout/footer.jspf" %>

<style>
    body.community-body .footer {
        display: block !important;
        text-align: left !important;
        align-items: stretch !important;
        justify-content: flex-start !important;
        margin-top: auto !important;
        flex-shrink: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
    }

    body.community-body .footer-nav,
    body.community-body .footer-body,
    body.community-body .footer-bottombar {
        text-align: left !important;
    }

    body.community-body .footer-nav-inner,
    body.community-body .footer-body-inner,
    body.community-body .footer-bottombar-inner {
        text-align: left !important;
    }

    body.community-body .footer-body-inner {
        align-items: flex-start !important;
    }

    body.community-body .footer-brand,
    body.community-body .footer-info,
    body.community-body .footer-info-row,
    body.community-body .footer-contact,
    body.community-body .footer-sns,
    body.community-body .footer-copy,
    body.community-body .footer-note,
    body.community-body .footer-brand-desc {
        text-align: left !important;
    }

    body.community-body .footer-info {
        align-items: flex-start !important;
    }
</style>

<%@ include file="/WEB-INF/views/common/modal/authModal.jspf" %>
<%@ include file="/WEB-INF/views/common/include/scripts.jspf" %>

<script src="${pageContext.request.contextPath}/js/pages/faq.js"></script>
<script src="${pageContext.request.contextPath}/js/pages/community-form.js"></script>

<script>
    function toggleCategoryList() {
        document.getElementById('categoryList').classList.toggle('on');
    }

    function selectCategory(el) {
        if (el.classList.contains('disabled')) {
            return;
        }

        document.querySelectorAll('.custom-select-item').forEach(function(i) {
            i.classList.remove('selected');
        });

        el.classList.add('selected');
        document.getElementById('categoryTriggerText').textContent = el.textContent;
        document.getElementById('category').value = el.dataset.value;
        document.getElementById('categoryList').classList.remove('on');
    }

    (function() {
        var initVal = '${category}';

        if (initVal) {
            var item = document.querySelector('.custom-select-item[data-value="' + initVal + '"]');

            if (item) {
                document.querySelectorAll('.custom-select-item').forEach(function(i) {
                    i.classList.remove('selected');
                });

                item.classList.add('selected');
                document.getElementById('categoryTriggerText').textContent = item.textContent;
                document.getElementById('category').value = initVal;
            }
        }
    })();

    document.addEventListener('click', function(e) {
        var categorySelectWrap = document.getElementById('categorySelectWrap');
        var categoryList = document.getElementById('categoryList');

        if (categorySelectWrap && categoryList && !categorySelectWrap.contains(e.target)) {
            categoryList.classList.remove('on');
        }
    });

    var textarea = document.getElementById('content');

    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
</script>

</body>
</html>