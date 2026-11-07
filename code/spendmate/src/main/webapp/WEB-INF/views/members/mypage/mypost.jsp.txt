<%@ page contentType="text/html; charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<c:set var="menu" value="posts"/>

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/common/include/head.jspf" %>

    <meta charset="UTF-8">
    <title>지출메이트 - 내 게시글 보기</title>

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/mypage.css?v=42">

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/mypost.css?v=42">
</head>

<body class="mypage is-header-ready is-opening-loaded is-fab-ready">

<%@ include file="/WEB-INF/views/common/layout/header.jspf" %>

<script id="mypageHeaderInit">
    (function () {
        function initMypageCommonHeaderFallback() {
            const hamburger = document.querySelector('.hamburger-btn');

            if (!hamburger || hamburger.dataset.mypageSidebarBound === 'true') {
                return;
            }

            hamburger.dataset.mypageSidebarBound = 'true';
            hamburger.setAttribute('aria-expanded', 'false');

            const sidebarSelectors = [
                '#sidebar',
                '#sideBar',
                '#sideMenu',
                '#sidebarMenu',
                '#mobileMenu',
                '#menuDrawer',
                '.sidebar',
                '.side-bar',
                '.side-nav',
                '.side-menu',
                '.sidebar-menu',
                '.mobile-menu',
                '.mobile-sidebar',
                '.menu-drawer',
                '.drawer-menu',
                '.nav-drawer',
                '.header-sidebar',
                '.global-sidebar',
                '.layout-sidebar'
            ];

            const overlaySelectors = [
                '#sidebarOverlay',
                '#sideOverlay',
                '#menuOverlay',
                '.sidebar-overlay',
                '.side-overlay',
                '.menu-overlay',
                '.drawer-overlay',
                '.nav-overlay',
                '.global-dim',
                '.dimmed-layer'
            ];

            function getElements(selectors) {
                return selectors
                    .flatMap(function (selector) {
                        return Array.from(document.querySelectorAll(selector));
                    })
                    .filter(function (element, index, array) {
                        return element && array.indexOf(element) === index;
                    });
            }

            function isOpened() {
                return document.body.classList.contains('is-sidebar-open')
                    || document.body.classList.contains('sidebar-open')
                    || hamburger.classList.contains('is-open')
                    || hamburger.classList.contains('active');
            }

            function setSidebarOpen(open) {
                document.body.classList.toggle('is-sidebar-open', open);
                document.body.classList.toggle('sidebar-open', open);
                document.documentElement.classList.toggle('is-sidebar-open', open);

                hamburger.classList.toggle('is-open', open);
                hamburger.classList.toggle('active', open);
                hamburger.setAttribute('aria-expanded', String(open));

                getElements(sidebarSelectors).forEach(function (element) {
                    element.hidden = false;
                    element.classList.toggle('is-open', open);
                    element.classList.toggle('open', open);
                    element.classList.toggle('active', open);
                    element.classList.toggle('show', open);
                    element.setAttribute('aria-hidden', String(!open));
                });

                getElements(overlaySelectors).forEach(function (element) {
                    element.hidden = false;
                    element.classList.toggle('is-open', open);
                    element.classList.toggle('open', open);
                    element.classList.toggle('active', open);
                    element.classList.toggle('show', open);
                    element.setAttribute('aria-hidden', String(!open));
                });
            }

            hamburger.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                setSidebarOpen(!isOpened());
            }, true);

            document.addEventListener('click', function (event) {
                if (!isOpened()) {
                    return;
                }

                const closeTarget = event.target.closest(
                    '.sidebar-overlay, .side-overlay, .menu-overlay, .drawer-overlay, .nav-overlay, ' +
                    '.sidebar-close, .side-close, .menu-close, .drawer-close, ' +
                    '[data-sidebar-close], [data-menu-close]'
                );

                if (closeTarget) {
                    setSidebarOpen(false);
                }
            });

            document.addEventListener('keydown', function (event) {
                if (event.key === 'Escape' && isOpened()) {
                    setSidebarOpen(false);
                }
            });
        }

        document.querySelector('.site-header')?.classList.add('is-solid');
        document.body.classList.add('is-header-ready');
        document.body.classList.add('is-opening-loaded');
        document.body.classList.add('is-fab-ready');

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initMypageCommonHeaderFallback);
        } else {
            initMypageCommonHeaderFallback();
        }
    })();
</script>

<div class="mypage-container">

    <aside class="mypage-sidebar">
        <%@ include file="/WEB-INF/views/members/mypage/mypage-sidebar.jspf" %>
    </aside>

    <main class="mypost-main">

        <div class="post-page-header">
            <div class="post-title-area">
                <h1 class="page-title">내 게시글 보기</h1>
                <p class="post-subtitle">
                    내가 작성한 게시글을 확인하고 수정하거나 삭제할 수 있습니다.
                </p>
            </div>
</div>

        <section class="mypost-card">

            <div class="post-table-wrap">
                <div class="post-table">

                    <div class="table-header">
                        <div class="col-no">순번</div>
                        <div class="col-title">제목</div>
                        <div class="col-board">게시판</div>
                        <div class="col-view">조회수</div>
                        <div class="row-right">관리</div>
                    </div>

                    <c:choose>
                        <c:when test="${not empty boards and not empty boards.content}">
                            <c:forEach var="board" items="${boards.content}" varStatus="status">
                                <div class="table-row">
                                    <div class="col-no">
                                            ${(boards.number * boards.size) + status.count}
                                    </div>

                                    <div class="col-title">
                                        <a href="${pageContext.request.contextPath}/community/detail/${board.boardId}">
                                                ${board.title}
                                        </a>
                                    </div>

                                    <div class="col-board">
                                            ${board.boardType}
                                    </div>

                                    <div class="col-view">
                                            ${board.viewsCount}
                                    </div>

                                    <div class="row-right">
                                        <button type="button"
                                                class="btn-edit"
                                                onclick="location.href='${pageContext.request.contextPath}/community/edit/${board.boardId}'">
                                            수정
                                        </button>

                                        <form action="${pageContext.request.contextPath}/community/delete/${board.boardId}"
                                              method="post"
                                              
                                              onsubmit="return confirm('정말로 이 게시글을 삭제하시겠습니까?');">
                                            <button type="submit"
                                                    class="btn-delete">
                                                삭제
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </c:forEach>
                        </c:when>

                        <c:otherwise>
                            <div class="empty-msg">
                                작성하신 게시글이 없습니다.
                            </div>
                        </c:otherwise>
                    </c:choose>

                </div>
            </div>

            <c:if test="${not empty boards and boards.totalPages > 0}">
                <div class="pagination">

                    <c:if test="${boards.number > 0}">
                        <a href="?page=${boards.number - 1}"
                           class="page-link">
                            이전
                        </a>
                    </c:if>

                    <c:forEach begin="0" end="${boards.totalPages - 1}" var="i">
                        <a href="?page=${i}"
                           class="page-link ${boards.number == i ? 'active' : ''}">
                                ${i + 1}
                        </a>
                    </c:forEach>

                    <c:if test="${boards.number < boards.totalPages - 1}">
                        <a href="?page=${boards.number + 1}"
                           class="page-link">
                            다음
                        </a>
                    </c:if>

                </div>
            </c:if>

        </section>

    </main>

</div>

<%@ include file="/WEB-INF/views/common/layout/footer.jspf" %>
<%@ include file="/WEB-INF/views/common/include/scripts.jspf" %>

<script>
    document.addEventListener("DOMContentLoaded", function () {
    });
</script>

</body>
</html>