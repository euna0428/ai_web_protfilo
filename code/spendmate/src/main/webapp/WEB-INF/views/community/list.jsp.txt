<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/community.css">
    <%@ include file="/WEB-INF/views/common/include/head.jspf" %>
    <title>${categoryLabel} 게시판 | 지출메이트</title>

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

        body.community-body .site-header {
            opacity: 1 !important;
            transform: translate3d(0,0,0) !important;
            pointer-events: auto !important;
            background: rgba(25, 59, 96, 0.96) !important;
            box-shadow: 0 10px 26px rgba(25,59,96,0.18) !important;
            transition: none !important;
            animation: none !important;
        }

        body.community-body .site-header.is-locked {
            opacity: 1 !important;
            transform: translate3d(0,0,0) !important;
            pointer-events: auto !important;
        }

        .community-page {
            padding-top: 94px;
            background: #ffffff;
            min-height: calc(100vh - 94px);
            flex: 1 0 auto;
        }

        .board-list-wrap {
            width: min(1100px, calc(100% - 80px));
            margin: 0 auto;
             padding-top: 2.5rem;
            padding-bottom: 4rem;
        }

        .board-page-title {
            text-align: center;
            font-size: 32px;
            font-weight: 400;
            color: #1a1a1a;
            margin: 0 0 1.8rem;
            letter-spacing: -0.02em;
        }

        .board-search-wrap {
            display: flex;
            justify-content: center;
            margin-bottom: 1.8rem;
        }

        .board-search-box {
            display: flex;
            align-items: center;
            width: 100%;
            max-width: 560px;
            background: #f2f2f2;
            border-radius: 30px;
            padding: 0 8px 0 22px;
            height: 52px;
        }

        .board-search-box input {
            flex: 1;
            border: none;
            background: transparent;
            outline: none;
            font-size: 16px;
            color: #333;
            font-family: inherit;
        }

        .board-search-box input::placeholder {
            color: #aaa;
        }

        .board-search-submit {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: #193b60;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            flex-shrink: 0;
        }

        .board-search-submit i {
            color: #fff;
            font-size: 17px;
        }

        .board-category-bar {
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 2px solid #e0e0e0;
            margin-bottom: 0;
            gap: 0;
            padding-bottom: 0;
        }

        .board-category-tabs {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
        }

        .board-category-tabs a {
            padding: 13px 18px;
            font-size: 16px;
            font-weight: 500;
            color: #888;
            text-decoration: none;
            border-bottom: 2.5px solid transparent;
            margin-bottom: -2px;
            white-space: nowrap;
        }

        .board-category-tabs a:hover {
            color: #333;
        }

        .board-category-tabs a.is-active {
            color: #1a1a1a;
            border-bottom: 2.5px solid #1a1a1a;
            font-weight: 700;
        }

        .tab-sep {
            color: #ddd;
            font-size: 16px;
            padding: 0 2px;
            user-select: none;
        }

        .board-guide-text {
            font-size: 15px;
            color: #193b60;
            padding: 10px 0 0;
            margin: 0;
            font-weight: 500;
        }

        .board-guide-warning {
            color: #193b60;
        }

        .board-header-row {
            display: grid;
            grid-template-columns: 70px 0.8fr 110px 120px 100px;
            padding: 14px 10px;
            border-bottom: 2px solid #333;
            font-size: 15px;
            font-weight: 600;
            color: #666;
            margin-top: 1.2rem;
        }

        .board-header-row div {
            text-align: center;
        }

        .board-header-row .sortable {
            cursor: pointer;
            user-select: none;
        }

        .board-header-row .sortable:hover {
            color: #193b60;
        }

        .board-header-row .sort-asc::after {
            content: ' ▲';
            font-size: 11px;
        }

        .board-header-row .sort-desc::after {
            content: ' ▼';
            font-size: 11px;
        }

        .board-list-box {
            min-height: 520px;
            border: none;
            border-radius: 0;
            padding: 0;
        }

        .board-line {
            display: grid;
            grid-template-columns: 70px 0.8fr 110px 120px 100px;
            align-items: center;
            min-height: 52px;
            border-bottom: 0.5px solid #e8e8e8;
            color: #333;
            text-decoration: none;
            font-size: 14px;
        }

        .board-line > div {
            text-align: center;
        }

        .board-link-line:hover {
            background: #f9f9f9;
        }

        .board-title-cell {
            text-align: center !important;
            font-weight: 500;
            font-size: 14px;
            padding: 0 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .board-date-cell,
        .board-views-cell {
            font-size: 13px;
            color: #888;
            text-align: center;
        }

        .board-empty-line {
            pointer-events: none;
        }

        .board-bottom-bar {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            padding: 1.8rem 0 2rem;
        }

        .board-pagination {
            position: static;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 15px;
        }

        .board-page-arrow {
            color: #888;
            text-decoration: none;
            padding: 4px 2px;
            font-size: 15px;
            display: flex;
            align-items: center;
        }

        .board-page-arrow:hover {
            color: #333;
        }

        .board-page-link {
            color: #888;
            text-decoration: none;
            padding: 4px 3px;
            font-size: 15px;
        }

        .board-page-link:hover {
            color: #333;
        }

        .board-page-link.is-active {
            color: #1a1a1a;
            font-weight: 700;
            border-bottom: 2px solid #1a1a1a;
            padding-bottom: 2px;
        }

        .board-write-btn {
            position: absolute;
            right: 0;
            min-width: auto;
            height: auto;
            background: #193b60;
            color: #fff;
            border: none;
            border-radius: 20px;
            padding: 8px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .board-write-btn.is-disabled {
            background: #ccc;
            color: #888;
            cursor: not-allowed;
            pointer-events: none;
        }

        .board-back-btn {
            display: none;
        }

        body.community-body .footer {
            margin-top: auto;
            flex-shrink: 0;
        }
    </style>
</head>

<body class="community-body is-header-ready is-opening-loaded is-fab-ready">

<%@ include file="/WEB-INF/views/common/layout/header.jspf" %>
<%@ include file="/WEB-INF/views/common/include/flash-message.jspf" %>

<main class="community-page">
    <section class="board-list-wrap">

        <h1 class="board-page-title">${categoryLabel} 게시판</h1>

        <form class="board-search-wrap" method="get" action="${pageContext.request.contextPath}/community">
            <input type="hidden" name="category" value="${category}">
            <input type="hidden" name="sort" value="${sort}">

            <div class="board-search-box">
                <input type="text" name="keyword" value="${keyword}" placeholder="검색">
                <button type="submit" class="board-search-submit">
                    <i class="bi bi-search"></i>
                </button>
            </div>
        </form>

        <div class="board-category-bar">
            <nav class="board-category-tabs" aria-label="게시판 카테고리">
                <a href="${pageContext.request.contextPath}/community?category=FREE"
                   class="${category == 'FREE' ? 'is-active' : ''}">자유</a>
                <span class="tab-sep">|</span>

                <a href="${pageContext.request.contextPath}/community?category=SECRET"
                   class="${category == 'SECRET' ? 'is-active' : ''}">비밀</a>
                <span class="tab-sep">|</span>

                <a href="${pageContext.request.contextPath}/community?category=TEENS"
                   class="${category == 'TEENS' ? 'is-active' : ''}">10대</a>
                <span class="tab-sep">|</span>

                <a href="${pageContext.request.contextPath}/community?category=TWENTIES"
                   class="${category == 'TWENTIES' ? 'is-active' : ''}">20대</a>
                <span class="tab-sep">|</span>

                <a href="${pageContext.request.contextPath}/community?category=THIRTIES"
                   class="${category == 'THIRTIES' ? 'is-active' : ''}">30대</a>
                <span class="tab-sep">|</span>

                <a href="${pageContext.request.contextPath}/community?category=FORTIES"
                   class="${category == 'FORTIES' ? 'is-active' : ''}">40대</a>
                <span class="tab-sep">|</span>

                <a href="${pageContext.request.contextPath}/community?category=FIFTIES"
                   class="${category == 'FIFTIES' ? 'is-active' : ''}">50대 이상</a>
            </nav>
        </div>

        <div class="board-header-row">
            <div>순번</div>
            <div>제목</div>
            <div>작성자</div>
            <div class="sortable" id="sort-date-btn" onclick="toggleSort('date')">
                게시일
            </div>
            <div class="sortable" id="sort-views-btn" onclick="toggleSort('views')">
                조회수
            </div>
        </div>

        <div class="board-list-box">
            <c:choose>
                <c:when test="${empty posts}">
                    <c:forEach begin="1" end="${pageSize}" var="line">
                        <div class="board-line board-empty-line">
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
                        <a href="${pageContext.request.contextPath}/community/detail/${post.boardId}"
                           class="board-line board-link-line">
                            <div>${startNo + status.index + 1}</div>
                            <div class="board-title-cell">${post.title}</div>
                            <div>${post.writerName}</div>
                            <div class="board-date-cell">${post.createdAtText}</div>
                            <div class="board-views-cell">${post.viewsCount}</div>
                        </a>
                    </c:forEach>

                    <c:if test="${emptyLineCount > 0}">
                        <c:forEach begin="1" end="${emptyLineCount}" var="line">
                            <div class="board-line board-empty-line">
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
        </div>

        <div class="board-bottom-bar">
            <nav class="board-pagination" aria-label="게시판 페이지 이동">

                <c:if test="${hasPrevBlock}">
                    <c:url var="prevBlockUrl" value="/community">
                        <c:param name="category" value="${category}"/>
                        <c:param name="keyword" value="${keyword}"/>
                        <c:param name="sort" value="${sort}"/>
                        <c:param name="page" value="${prevBlockPage}"/>
                    </c:url>

                    <a href="${prevBlockUrl}" class="board-page-arrow">
                        <i class="bi bi-chevron-double-left"></i>
                    </a>
                </c:if>

                <c:forEach var="pageNo" begin="${startPage}" end="${endPage}">
                    <c:url var="pageUrl" value="/community">
                        <c:param name="category" value="${category}"/>
                        <c:param name="keyword" value="${keyword}"/>
                        <c:param name="sort" value="${sort}"/>
                        <c:param name="page" value="${pageNo}"/>
                    </c:url>

                    <a href="${pageUrl}"
                       class="board-page-link ${pageNo == currentPage ? 'is-active' : ''}"
                       aria-current="${pageNo == currentPage ? 'page' : 'false'}">
                        ${pageNo}
                    </a>
                </c:forEach>

                <c:if test="${hasNextBlock}">
                    <c:url var="nextBlockUrl" value="/community">
                        <c:param name="category" value="${category}"/>
                        <c:param name="keyword" value="${keyword}"/>
                        <c:param name="sort" value="${sort}"/>
                        <c:param name="page" value="${nextBlockPage}"/>
                    </c:url>

                    <a href="${nextBlockUrl}" class="board-page-arrow">
                        <i class="bi bi-chevron-double-right"></i>
                    </a>
                </c:if>
            </nav>

            <c:choose>
                <c:when test="${not empty loginUserId and not canWriteCurrentCategory}">
                    <span class="board-write-btn is-disabled" title="${categoryWriteGuideMessage}">
                        조회 전용
                    </span>
                </c:when>

                <c:otherwise>
                    <a href="${pageContext.request.contextPath}/community/write?category=${category}"
                       class="board-write-btn"
                       data-auth-required="true">
                        게시글 작성
                    </a>
                </c:otherwise>
            </c:choose>
        </div>

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

<script>
(function() {
    var currentSort = '${sort}';

    function updateSortUI() {
        var dateBtn = document.getElementById('sort-date-btn');
        var viewsBtn = document.getElementById('sort-views-btn');

        if (!dateBtn || !viewsBtn) {
            return;
        }

        dateBtn.className = 'sortable';
        viewsBtn.className = 'sortable';

        if (currentSort === 'date_asc') {
            dateBtn.classList.add('sort-asc');
        } else if (currentSort === 'date_desc') {
            dateBtn.classList.add('sort-desc');
        } else if (currentSort === 'views_desc') {
            viewsBtn.classList.add('sort-desc');
        } else if (currentSort === 'views_asc') {
            viewsBtn.classList.add('sort-asc');
        }
    }

    window.toggleSort = function(field) {
        var nextSort;

        if (field === 'date') {
            if (currentSort === 'date_asc') {
                nextSort = 'date_desc';
            } else {
                nextSort = 'date_asc';
            }
        } else {
            if (currentSort === 'views_desc') {
                nextSort = 'views_asc';
            } else {
                nextSort = 'views_desc';
            }
        }

        var ctx = '${pageContext.request.contextPath}';
        var category = '${category}';
        var keyword = '${keyword}';

        var url = ctx + '/community?category=' + encodeURIComponent(category)
                + '&keyword=' + encodeURIComponent(keyword)
                + '&sort=' + encodeURIComponent(nextSort)
                + '&page=1';

        location.href = url;
    };

    updateSortUI();
})();
</script>

</body>
</html>