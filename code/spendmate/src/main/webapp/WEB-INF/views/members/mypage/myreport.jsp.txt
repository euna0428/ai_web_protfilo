<%@ page contentType="text/html; charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<c:set var="menu" value="reports"/>

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/common/include/head.jspf" %>

    <meta charset="UTF-8">
    <title>지출메이트 - 내 신고 목록</title>

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/mypage.css?v=31">

    <style>
        .report-main {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .report-page-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 18px;
        }

        .report-title-area {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .report-title-area .page-title {
            margin: 0;
        }

        .report-subtitle {
            margin: 0;
            color: #6b7280;
            font-size: 15px;
            font-weight: 600;
            line-height: 1.5;
        }

        .filter-container {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }

        .filter-btn {
            min-width: 86px;
            height: 40px;
            padding: 0 15px;
            border: 1px solid #d8dce5;
            border-radius: 999px;
            background: #ffffff;
            color: #4b5563;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 800;
            text-decoration: none;
            transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }

        .filter-btn:hover {
            background: #f4f6fa;
            transform: translateY(-1px);
        }

        .filter-btn.active {
            background: #243864;
            border-color: #243864;
            color: #ffffff;
        }

        .report-card {
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

        .report-table-wrap {
            width: 100%;
            overflow-x: auto;
        }

        .report-table {
            width: 100%;
            min-width: 780px;
            display: flex;
            flex-direction: column;
        }

        .table-header,
        .table-row {
            width: 100%;
            display: grid;
            grid-template-columns: 80px minmax(280px, 1fr) 130px 170px 130px;
            align-items: center;
        }

        .table-header {
            min-height: 54px;
            border-top: 1px solid #e2e4ea;
            border-bottom: 1px solid #e2e4ea;
            background: #f8fafc;
            color: #222222;
            font-size: 14px;
            font-weight: 900;
            text-align: center;
        }

        .table-row {
            min-height: 68px;
            border-bottom: 1px solid #eef0f4;
            background: #ffffff;
            color: #333333;
            font-size: 14px;
            font-weight: 600;
            transition: background 0.2s ease;
        }

        .table-row:hover {
            background: #fbfcff;
        }

        .col-no,
        .col-answer,
        .col-date,
        .col-manage {
            text-align: center;
        }

        .col-title {
            min-width: 0;
            padding: 0 20px;
        }

        .report-title-link {
            display: block;
            width: 100%;
            border: none;
            background: transparent;
            color: #111111;
            font-size: 15px;
            font-weight: 800;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            transition: color 0.2s ease;
        }

        .report-title-link:hover {
            color: #243864;
            text-decoration: underline;
        }

        .status-badge {
            min-width: 76px;
            height: 30px;
            padding: 0 10px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 900;
        }

        .status-badge.done {
            background: #e9f8ef;
            color: #1f9d55;
        }

        .status-badge.wait {
            background: #fff4df;
            color: #d48600;
        }

        .btn-delete {
            min-width: 64px;
            height: 34px;
            padding: 0 12px;
            border: 1px solid #ff4d4d;
            border-radius: 10px;
            background: #ffffff;
            color: #ff4d4d;
            font-size: 13px;
            font-weight: 800;
            cursor: pointer;
            transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }

        .btn-delete:hover {
            background: #ff4d4d;
            color: #ffffff;
            transform: translateY(-1px);
        }

        .empty-msg {
            min-height: 360px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #8a8f98;
            font-size: 16px;
            font-weight: 700;
            text-align: center;
        }

        .pagination {
            width: 100%;
            margin-top: auto;
            padding-top: 28px;
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

        .report-modal-overlay {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 10000;
            padding: 24px;
            background: rgba(0, 0, 0, 0.45);
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(3px);
        }

        .report-modal-content {
            width: min(100%, 720px);
            max-height: min(760px, calc(100vh - 48px));
            overflow-y: auto;
            background: #ffffff;
            border-radius: 24px;
            padding: 34px;
            position: relative;
            box-shadow: 0 20px 46px rgba(0, 0, 0, 0.2);
            animation: modalPop 0.25s ease both;
        }

        @keyframes modalPop {
            from {
                opacity: 0;
                transform: translateY(18px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .report-close-btn {
            position: absolute;
            top: 20px;
            right: 22px;
            color: #888888;
            font-size: 28px;
            font-weight: 900;
            line-height: 1;
            cursor: pointer;
        }

        .report-close-btn:hover {
            color: #111111;
        }

        .report-detail-title {
            margin: 0 34px 18px 0;
            color: #111111;
            font-size: 24px;
            font-weight: 900;
            line-height: 1.35;
            word-break: keep-all;
        }

        .report-divider {
            width: 100%;
            height: 1px;
            background: #eef0f4;
            margin-bottom: 22px;
        }

        .modal-label {
            margin: 0 0 8px;
            color: #4b5563;
            font-size: 14px;
            font-weight: 900;
        }

        .report-box,
        .answer-box {
            width: 100%;
            min-height: 120px;
            padding: 20px;
            border: 1px solid #eef0f4;
            border-radius: 14px;
            background: #fcfcfd;
            color: #333333;
            font-size: 15px;
            font-weight: 600;
            line-height: 1.75;
            word-break: keep-all;
            white-space: pre-wrap;
            margin-bottom: 22px;
        }

        .answer-box {
            background: #f4f7ff;
            border-color: #dfe7ff;
        }

        .confirm-btn {
            min-width: 120px;
            height: 46px;
            margin-left: auto;
            border: none;
            border-radius: 14px;
            background: #243864;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            font-weight: 900;
            cursor: pointer;
            transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .confirm-btn:hover {
            opacity: 0.92;
            transform: translateY(-1px);
        }

        @media (max-width: 768px) {
            .report-page-header {
                align-items: flex-start;
                flex-direction: column;
            }

            .filter-container {
                width: 100%;
            }

            .filter-btn {
                flex: 1;
                min-width: 0;
            }

            .report-card {
                min-height: 520px;
                padding: 24px 20px;
                border-radius: 20px;
            }

            .table-header,
            .table-row {
                grid-template-columns: 70px minmax(240px, 1fr) 120px 150px 110px;
            }

            .report-modal-content {
                padding: 28px 22px;
                border-radius: 20px;
            }

            .report-detail-title {
                font-size: 21px;
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

    <main class="report-main">

        <div class="report-page-header">
            <div class="report-title-area">
                <h1 class="page-title">내 신고 목록</h1>
                <p class="report-subtitle">
                    내가 접수한 신고 내역과 관리자 답변 상태를 확인할 수 있습니다.
                </p>
            </div>

            <div class="filter-container">
                <a href="?filter=all"
                   class="filter-btn ${param.filter == 'all' || empty param.filter ? 'active' : ''}">
                    전체
                </a>

                <a href="?filter=completed"
                   class="filter-btn ${param.filter == 'completed' ? 'active' : ''}">
                    답변 완료
                </a>

                <a href="?filter=pending"
                   class="filter-btn ${param.filter == 'pending' ? 'active' : ''}">
                    답변 전
                </a>
            </div>
        </div>

        <section class="report-card">

            <div class="report-table-wrap">
                <div class="report-table">

                    <div class="table-header">
                        <div class="col-no">순번</div>
                        <div class="col-title">제목</div>
                        <div class="col-answer">답변여부</div>
                        <div class="col-date">신고시각</div>
                        <div class="col-manage">관리</div>
                    </div>

                    <c:choose>
                        <c:when test="${not empty reports and not empty reports.content}">
                            <c:forEach var="r" items="${reports.content}" varStatus="status">
                                <div class="table-row">
                                    <div class="col-no">
                                            ${(reports.number * reports.size) + status.count}
                                    </div>

                                    <div class="col-title">
                                        <button type="button"
                                                class="report-title-link"
                                                onclick="openReportModal(this)"
                                                data-title="${fn:escapeXml(r.title)}"
                                                data-content="${fn:escapeXml(r.content)}"
                                                data-answer="${fn:escapeXml(r.answerContent)}">
                                                ${r.title}
                                        </button>
                                    </div>

                                    <div class="col-answer">
                                        <span class="status-badge ${r.status == 'ANSWERED' ? 'done' : 'wait'}">
                                                ${r.status == 'ANSWERED' ? '답변 완료' : '답변 전'}
                                        </span>
                                    </div>

                                    <div class="col-date">
                                            ${r.createdAt}
                                    </div>

                                    <div class="col-manage">
                                        <button type="button"
                                                class="btn-delete"
                                                onclick="deleteReport(${r.reportId})">
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            </c:forEach>
                        </c:when>

                        <c:otherwise>
                            <div class="empty-msg">
                                신고하신 내역이 없습니다.
                            </div>
                        </c:otherwise>
                    </c:choose>

                </div>
            </div>

            <c:if test="${not empty reports and reports.totalPages > 0}">
                <div class="pagination">

                    <c:if test="${reports.number > 0}">
                        <a href="?filter=${param.filter}&page=${reports.number - 1}"
                           class="page-link">
                            이전
                        </a>
                    </c:if>

                    <c:forEach begin="0" end="${reports.totalPages - 1}" var="i">
                        <a href="?filter=${param.filter}&page=${i}"
                           class="page-link ${reports.number == i ? 'active' : ''}">
                                ${i + 1}
                        </a>
                    </c:forEach>

                    <c:if test="${reports.number < reports.totalPages - 1}">
                        <a href="?filter=${param.filter}&page=${reports.number + 1}"
                           class="page-link">
                            다음
                        </a>
                    </c:if>

                </div>
            </c:if>

        </section>

    </main>

</div>

<div id="reportModal" class="report-modal-overlay">
    <div class="report-modal-content">
        <span class="report-close-btn" onclick="closeReportModal()">&times;</span>

        <h2 class="report-detail-title" id="modalTitle">신고 상세 내용</h2>

        <div class="report-divider"></div>

        <p class="modal-label">신고 내용</p>
        <div class="report-box" id="modalReport"></div>

        <p class="modal-label">관리자 답변</p>
        <div class="answer-box" id="modalAnswer"></div>

        <button type="button"
                class="confirm-btn"
                onclick="closeReportModal()">
            확인
        </button>
    </div>
</div>

<%@ include file="/WEB-INF/views/common/layout/footer.jspf" %>
<%@ include file="/WEB-INF/views/common/include/scripts.jspf" %>

<script>
    function openReportModal(element) {
        const title = element.getAttribute('data-title') || '신고 상세 내용';
        const report = element.getAttribute('data-content') || '';
        const answer = element.getAttribute('data-answer') || '';

        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalReport').innerText = report;
        document.getElementById('modalAnswer').innerText =
            answer.trim() !== '' ? answer : '아직 답변이 등록되지 않았습니다.';

        document.getElementById('reportModal').style.display = 'flex';
    }

    function closeReportModal() {
        document.getElementById('reportModal').style.display = 'none';
    }

    function deleteReport(reportId) {
        if (!confirm('정말로 이 신고 내역을 삭제하시겠습니까?')) {
            return;
        }

        fetch('${pageContext.request.contextPath}/mypage/reports/delete/' + reportId, {
            method: 'DELETE'
        })
            .then(function (res) {
                if (res.ok) {
                    alert('삭제되었습니다.');
                    location.reload();
                } else {
                    alert('삭제에 실패했습니다.');
                }
            })
            .catch(function (err) {
                console.error(err);
                alert('서버 오류가 발생했습니다.');
            });
    }

    window.addEventListener('click', function (event) {
        const modal = document.getElementById('reportModal');

        if (event.target === modal) {
            closeReportModal();
        }
    });

    document.addEventListener("DOMContentLoaded", function () {
    });
</script>

</body>
</html>