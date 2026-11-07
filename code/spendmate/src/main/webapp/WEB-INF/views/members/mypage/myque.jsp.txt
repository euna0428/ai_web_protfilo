<%@ page contentType="text/html; charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<c:set var="menu" value="questions"/>

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/common/include/head.jspf" %>

    <meta charset="UTF-8">
    <title>지출메이트 - 내 문의</title>

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/mypage.css?v=42">

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/myque.css?v=42">
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

    <main class="question-main">

        <div class="question-page-header">
            <div class="question-title-area">
                <h1 class="page-title">내 문의</h1>
                <p class="question-subtitle">
                    내가 등록한 문의와 관리자 답변 상태를 확인할 수 있습니다.
                </p>
            </div>

            <div class="filter-group">
                <a href="?status=ALL"
                   class="btn-filter ${currentStatus eq 'ALL' ? 'active' : ''}">
                    전체
                </a>

                <a href="?status=ANSWERED"
                   class="btn-filter ${currentStatus eq 'ANSWERED' ? 'active' : ''}">
                    답변 완료
                </a>

                <a href="?status=WAITING"
                   class="btn-filter ${currentStatus eq 'WAITING' ? 'active' : ''}">
                    답변 전
                </a>
            </div>
        </div>

        <section class="question-card">

            <div class="question-table-wrap">
                <div class="question-table">

                    <div class="table-header">
                        <div class="col-no">순번</div>
                        <div class="col-title">제목</div>
                        <div class="col-status">답변여부</div>
                        <div class="col-date">문의시각</div>
                        <div class="col-manage">관리</div>
                    </div>

                    <c:choose>
                        <c:when test="${not empty inquiries and not empty inquiries.content}">
                            <c:forEach var="inq" items="${inquiries.content}" varStatus="status">
                                <div class="table-row">
                                    <div class="col-no">
                                            ${(inquiries.number * inquiries.size) + status.count}
                                    </div>

                                    <div class="col-title">
                                        <a href="javascript:void(0);"
                                           class="inq-link"
                                           onclick="openQuestionModal(this)"
                                           data-title="${fn:escapeXml(inq.title)}"
                                           data-content="${fn:escapeXml(inq.content)}"
                                           data-answer="${fn:escapeXml(inq.answerContent)}">
                                                ${inq.title}
                                        </a>
                                    </div>

                                    <div class="col-status">
                                        <span class="status-badge ${inq.status eq 'ANSWERED' ? 'done' : 'wait'}">
                                                ${inq.status eq 'ANSWERED' ? '답변 완료' : '답변 전'}
                                        </span>
                                    </div>

                                    <div class="col-date">
                                            ${inq.createdAt}
                                    </div>

                                    <div class="col-manage">
                                        <form action="${pageContext.request.contextPath}/mypage/questions/delete/${inq.id}"
                                              method="post"
                                              style="margin:0; display:flex; justify-content:center;"
                                              onsubmit="return confirm('삭제하시겠습니까?');">
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
                                문의하신 내역이 없습니다.
                            </div>
                        </c:otherwise>
                    </c:choose>

                </div>
            </div>

            <c:if test="${not empty inquiries and inquiries.totalPages > 0}">
                <div class="pagination">

                    <c:if test="${inquiries.number > 0}">
                        <a href="?status=${currentStatus}&page=${inquiries.number - 1}"
                           class="page-link">
                            이전
                        </a>
                    </c:if>

                    <c:forEach begin="0" end="${inquiries.totalPages - 1}" var="i">
                        <a href="?status=${currentStatus}&page=${i}"
                           class="page-link ${inquiries.number == i ? 'active' : ''}">
                                ${i + 1}
                        </a>
                    </c:forEach>

                    <c:if test="${inquiries.number < inquiries.totalPages - 1}">
                        <a href="?status=${currentStatus}&page=${inquiries.number + 1}"
                           class="page-link">
                            다음
                        </a>
                    </c:if>

                </div>
            </c:if>

        </section>

    </main>

</div>

<div id="questionModal" class="question-modal-overlay">
    <div class="question-modal-content">
        <span class="question-close-btn" onclick="closeQuestionModal()">&times;</span>

        <h2 class="question-detail-title" id="modalTitle">문의 내용</h2>

        <div class="question-divider"></div>

        <p class="modal-label">문의 내용</p>
        <div class="question-box" id="modalQuestion"></div>

        <p class="modal-label">관리자 답변</p>
        <div class="answer-box" id="modalAnswer"></div>

        <button type="button"
                class="confirm-btn"
                onclick="closeQuestionModal()">
            확인
        </button>
    </div>
</div>

<%@ include file="/WEB-INF/views/common/layout/footer.jspf" %>
<%@ include file="/WEB-INF/views/common/include/scripts.jspf" %>

<script>
    function openQuestionModal(element) {
        const title = element.getAttribute('data-title') || '문의 내용';
        const question = element.getAttribute('data-content') || '';
        const answer = element.getAttribute('data-answer') || '';

        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalQuestion').innerText = question;
        document.getElementById('modalAnswer').innerText =
            answer.trim() !== '' ? answer : '아직 답변이 등록되지 않았습니다.';

        document.getElementById('questionModal').style.display = 'flex';
    }

    function closeQuestionModal() {
        document.getElementById('questionModal').style.display = 'none';
    }

    window.addEventListener('click', function (event) {
        const modal = document.getElementById('questionModal');

        if (event.target === modal) {
            closeQuestionModal();
        }
    });

    document.addEventListener("DOMContentLoaded", function () {
    });
</script>

</body>
</html>