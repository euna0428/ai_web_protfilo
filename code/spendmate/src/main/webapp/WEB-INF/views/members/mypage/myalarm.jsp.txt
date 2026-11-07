<%@ page contentType="text/html; charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<c:set var="menu" value="alarm"/>

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/common/include/head.jspf" %>

    <meta charset="UTF-8">
    <title>지출메이트 - 알림</title>

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/mypage.css?v=31">

    <style>
        .alarm-main {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .alarm-page-header {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 18px;
            margin-bottom: 2px;
        }

        .alarm-title-area {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .alarm-title-area .page-title {
            margin: 0;
        }

        .alarm-subtitle {
            margin: 0;
            color: #6b7280;
            font-size: 15px;
            font-weight: 600;
            line-height: 1.5;
        }

        .email-setting {
            height: 46px;
            padding: 0 16px;
            border: 1px solid #e2e4ea;
            border-radius: 999px;
            background: #ffffff;
            display: inline-flex;
            align-items: center;
            gap: 12px;
            color: #333333;
            font-size: 14px;
            font-weight: 800;
            box-shadow: 0 6px 18px rgba(17, 24, 39, 0.04);
            white-space: nowrap;
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 46px;
            height: 24px;
            flex: 0 0 auto;
        }

        .switch input {
            width: 0;
            height: 0;
            opacity: 0;
        }

        .slider {
            position: absolute;
            inset: 0;
            cursor: pointer;
            background-color: #c7cbd4;
            border-radius: 999px;
            transition: background-color 0.25s ease;
        }

        .slider::before {
            content: "";
            position: absolute;
            width: 18px;
            height: 18px;
            left: 3px;
            top: 3px;
            border-radius: 50%;
            background: #ffffff;
            transition: transform 0.25s ease;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
        }

        .switch input:checked + .slider {
            background-color: #243864;
        }

        .switch input:checked + .slider::before {
            transform: translateX(22px);
        }

        .alarm-card {
            width: 100%;
            min-height: 620px;
            padding: 30px 34px;
            border: 1px solid #e2e4ea;
            border-radius: 24px;
            background: #ffffff;
            box-shadow: 0 8px 24px rgba(17, 24, 39, 0.04);
            display: flex;
            flex-direction: column;
        }

        .alarm-table {
            flex: 1;
            width: 100%;
            display: flex;
            flex-direction: column;
        }

        .alarm-row {
            width: 100%;
            min-height: 76px;
            padding: 18px 4px;
            border-bottom: 1px solid #eef0f4;
            display: flex;
            align-items: center;
            transition: background 0.2s ease;
        }

        .alarm-row:hover {
            background: #fafafa;
        }

        .alarm-row:last-child {
            border-bottom: none;
        }

        .alarm-left {
            width: 100%;
            min-width: 0;
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .alarm-icon {
            flex: 0 0 auto;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .icon-badge {
            min-width: 54px;
            height: 30px;
            padding: 0 12px;
            border-radius: 999px;
            background: #eef2f8;
            color: #243864;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 900;
            white-space: nowrap;
        }

        .alarm-text {
            min-width: 0;
            color: #333333;
            font-size: 15px;
            font-weight: 600;
            line-height: 1.65;
            word-break: keep-all;
        }

        .danger-text {
            color: #ff4d4d;
            font-weight: 900;
        }

        .empty-msg {
            flex: 1;
            min-height: 360px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #8a8f98;
            font-size: 16px;
            font-weight: 700;
            text-align: center;
        }

        /* 페이지네이션 디자인 */
        .pagination {
            width: 100%;
            margin-top: 28px;
            padding-top: 26px;
            border-top: 1px solid #eef0f4;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }

        .page-link {
            min-width: 36px;
            height: 36px;
            padding: 0 12px;
            border: 1px solid #d8dce5;
            border-radius: 10px;
            background: #ffffff;
            color: #4b5563;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 800;
            text-decoration: none;
            transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }

        .page-link:hover {
            background: #f4f6fa;
        }

        .page-link.active {
            background: #243864;
            border-color: #243864;
            color: #ffffff;
        }

        @media (max-width: 768px) {
            .alarm-page-header {
                align-items: flex-start;
                flex-direction: column;
            }

            .email-setting {
                align-self: flex-start;
            }

            .alarm-card {
                min-height: 520px;
                padding: 24px 20px;
                border-radius: 20px;
            }

            .alarm-row {
                align-items: flex-start;
                padding: 16px 0;
            }

            .alarm-left {
                align-items: flex-start;
                gap: 12px;
            }

            .icon-badge {
                min-width: 48px;
                height: 28px;
                font-size: 12px;
            }

            .alarm-text {
                font-size: 14px;
            }
        }
    </style>
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

    <main class="alarm-main">

        <div class="alarm-page-header">
            <div class="alarm-title-area">
                <h1 class="page-title">알림</h1>
                <p class="alarm-subtitle">
                    구독, 결제, 문의 답변 등 주요 알림을 확인할 수 있습니다.
                </p>
            </div>

            <div class="email-setting">
                <span>이메일 알림</span>

                <label class="switch">
                    <input type="checkbox" checked>
                    <span class="slider"></span>
                </label>
            </div>
        </div>

        <section class="alarm-card">

            <div class="alarm-table">
                <c:choose>
                    <c:when test="${not empty alarms and not empty alarms.content}">
                        <c:forEach var="noti" items="${alarms.content}">
                            <div class="alarm-row">
                                <div class="alarm-left">
                                    <span class="alarm-icon">
                                        <span class="icon-badge">알림</span>
                                    </span>

                                    <span class="alarm-text">
                                            ${noti.content}
                                    </span>
                                </div>
                            </div>
                        </c:forEach>
                    </c:when>

                    <c:otherwise>
                        <div class="empty-msg">
                            도착한 알림이 없습니다.
                        </div>
                    </c:otherwise>
                </c:choose>
            </div>

            <c:if test="${not empty salesPage and salesPage.totalPages > 0}">
                <div class="pagination">
                    <c:forEach begin="1" end="${salesPage.totalPages}" var="i">
                        <a href="?page=${i - 1}"
                            class="page-link ${salesPage.number == (i - 1) ? 'active' : ''}">
                                 ${i}
                        </a>
                    </c:forEach>
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