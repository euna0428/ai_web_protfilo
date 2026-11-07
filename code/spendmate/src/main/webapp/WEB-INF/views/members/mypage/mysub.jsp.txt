<%@ page contentType="text/html; charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<c:set var="menu" value="subscriptions"/>

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/common/include/head.jspf" %>

    <meta charset="UTF-8">
    <title>지출메이트 - 내 구독 관리</title>

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/mypage.css?v=31">
    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/mysub.css?v=31">
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

    <main class="manage-container">

        <h2 class="page-title">내 구독 관리</h2>

        <div class="tab-menu" role="tablist" aria-label="내 구독 관리 탭">
            <button type="button" class="tab active" onclick="switchTab(0)" role="tab" aria-selected="true">
                구독 중
            </button>
            <button type="button" class="tab" onclick="switchTab(1)" role="tab" aria-selected="false">
                주문 내역
            </button>
        </div>

        <div id="sub-active-content" class="tab-content active">
            <div class="manage-grid">

                <c:if test="${empty subscriptions}">
                    <div class="empty-subscription-card">
                        현재 구독 중인 서비스가 없습니다.
                    </div>
                </c:if>

                <c:forEach var="sub" items="${subscriptions}">
                    <c:set var="serviceTitle" value="${not empty sub.serviceName ? sub.serviceName : '서비스'}"/>
                    <c:set var="serviceLower" value="${fn:toLowerCase(serviceTitle)}"/>

                    <c:if test="${sub.status eq 'ACTIVE' or sub.status eq 'PENDING' or sub.status eq 'PREPARING'}">
                        <section class="subscription-card-wrap">
                            <div class="sub-manage-card ${sub.status eq 'ACTIVE' ? 'is-active-subscription' : 'is-pending-subscription'}">

                                <div class="card-top-content">
                                    <div class="card-header">
                                        <div class="service-info">
                                            <div class="sub-logo-small" data-initial="${fn:substring(serviceTitle, 0, 1)}" aria-hidden="true">
                                                <c:choose>
                                                    <c:when test="${fn:contains(serviceLower, 'youtube') or fn:contains(serviceLower, '유튜브')}">
                                                        <img src="${pageContext.request.contextPath}/images/youtube_premium_logo.png" alt="" onerror="this.style.display='none'; this.parentElement.classList.add('logo-fallback');">
                                                    </c:when>
                                                    <c:when test="${fn:contains(serviceLower, 'netflix') or fn:contains(serviceLower, '넷플릭스')}">
                                                        <img src="${pageContext.request.contextPath}/images/netflix.png" alt="" onerror="this.style.display='none'; this.parentElement.classList.add('logo-fallback');">
                                                    </c:when>
                                                    <c:when test="${fn:contains(serviceLower, 'tving') or fn:contains(serviceLower, '티빙')}">
                                                        <img src="${pageContext.request.contextPath}/images/tving.png" alt="" onerror="this.style.display='none'; this.parentElement.classList.add('logo-fallback');">
                                                    </c:when>
                                                    <c:when test="${fn:contains(serviceLower, 'wavve') or fn:contains(serviceLower, '웨이브')}">
                                                        <img src="${pageContext.request.contextPath}/images/wavve.png" alt="" onerror="this.style.display='none'; this.parentElement.classList.add('logo-fallback');">
                                                    </c:when>
                                                    <c:when test="${fn:contains(serviceLower, 'watcha') or fn:contains(serviceLower, '왓챠')}">
                                                        <img src="${pageContext.request.contextPath}/images/watcha.png" alt="" onerror="this.style.display='none'; this.parentElement.classList.add('logo-fallback');">
                                                    </c:when>
                                                    <c:when test="${fn:contains(serviceLower, 'claude')}">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Claude_AI_logo.svg/960px-Claude_AI_logo.svg.png" alt="" onerror="this.style.display='none'; this.parentElement.classList.add('logo-fallback');">
                                                    </c:when>
                                                    <c:when test="${fn:contains(serviceLower, 'chatgpt') or fn:contains(serviceLower, 'gpt') or fn:contains(serviceLower, 'openai')}">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" alt="" onerror="this.style.display='none'; this.parentElement.classList.add('logo-fallback');">
                                                    </c:when>
                                                    <c:otherwise>
                                                        <span>${fn:substring(serviceTitle, 0, 1)}</span>
                                                    </c:otherwise>
                                                </c:choose>
                                            </div>

                                            <div class="service-text">
                                                <h3>${serviceTitle}</h3>
                                                <p class="order-num">주문 번호: ${sub.serialCode}</p>
                                            </div>
                                        </div>

                                        <div class="card-btns">
                                            <button type="button" class="btn-extend">연장하기</button>

                                            <form id="cancelForm_${sub.id}"
                                                  action="${pageContext.request.contextPath}/subscription/cancel/${sub.id}"
                                                  method="post"
                                                  onsubmit="return confirmCancel(event)">
                                                <button type="submit" class="btn-cancel">
                                                    <c:choose>
                                                        <c:when test="${sub.status eq 'PENDING' or sub.status eq 'PREPARING'}">취소하기</c:when>
                                                        <c:otherwise>해지하기</c:otherwise>
                                                    </c:choose>
                                                </button>
                                            </form>
                                        </div>
                                    </div>

                                    <div class="order-log-box">
                                        <p class="log-title">주문 완료 (${sub.serialCode})</p>

                                        <table class="log-table">
                                            <tr>
                                                <td>계정 충전 정보/확인</td>
                                                <td class="text-right">${not empty sub.startDate ? sub.startDate : '-'}</td>
                                            </tr>
                                            <tr>
                                                <td>결제 완료</td>
                                                <td class="text-right success-text">성공</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>

                                <button type="button" class="view-terms" onclick="openTermsModal()">이용약관 보기</button>

                                <table class="detail-info-table">
                                    <tr>
                                        <th class="share-label">공유 계정 ID</th>
                                        <td class="share-value">
                                            <span>:</span>${not empty sub.sharedId ? sub.sharedId : '-'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="share-label">공유 비밀번호</th>
                                        <td class="share-value">
                                            <span>:</span>${not empty sub.sharedPwd ? sub.sharedPwd : '-'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>결제 방식</th>
                                        <td>계좌이체</td>
                                    </tr>
                                    <tr>
                                        <th>남은 기간</th>
                                        <td>${not empty sub.endDate ? sub.endDate : '-'}까지</td>
                                    </tr>
                                    <tr>
                                        <th>가격</th>
                                        <td>${sub.monthlyFee}원</td>
                                    </tr>
                                    <tr>
                                        <th>총 결제금액</th>
                                        <td>${sub.totalAmount}원</td>
                                    </tr>
                                </table>
                            </div>
                        </section>
                    </c:if>
                </c:forEach>

            </div>
        </div>

        <div id="order-history-content" class="tab-content">
            <div class="history-card">

                <c:if test="${empty subscriptions}">
                    <div class="empty-history-message">
                        주문 내역이 없습니다.
                    </div>
                </c:if>

                <c:forEach var="sub" items="${subscriptions}">
                    <c:set var="serviceTitle" value="${not empty sub.serviceName ? sub.serviceName : '서비스'}"/>
                    <c:set var="serviceLower" value="${fn:toLowerCase(serviceTitle)}"/>

                    <div class="history-item">
                        <div class="history-left">
                            <div class="sub-logo-small history-logo" data-initial="${fn:substring(serviceTitle, 0, 1)}" aria-hidden="true">
                                <c:choose>
                                    <c:when test="${fn:contains(serviceLower, 'youtube') or fn:contains(serviceLower, '유튜브')}">
                                        <img src="${pageContext.request.contextPath}/images/youtube_premium_logo.png" alt="" onerror="this.style.display='none'; this.parentElement.classList.add('logo-fallback');">
                                    </c:when>
                                    <c:when test="${fn:contains(serviceLower, 'netflix') or fn:contains(serviceLower, '넷플릭스')}">
                                        <img src="${pageContext.request.contextPath}/images/netflix.png" alt="" onerror="this.style.display='none'; this.parentElement.classList.add('logo-fallback');">
                                    </c:when>
                                    <c:when test="${fn:contains(serviceLower, 'tving') or fn:contains(serviceLower, '티빙')}">
                                        <img src="${pageContext.request.contextPath}/images/tving.png" alt="" onerror="this.style.display='none'; this.parentElement.classList.add('logo-fallback');">
                                    </c:when>
                                    <c:when test="${fn:contains(serviceLower, 'wavve') or fn:contains(serviceLower, '웨이브')}">
                                        <img src="${pageContext.request.contextPath}/images/wavve.png" alt="" onerror="this.style.display='none'; this.parentElement.classList.add('logo-fallback');">
                                    </c:when>
                                    <c:when test="${fn:contains(serviceLower, 'watcha') or fn:contains(serviceLower, '왓챠')}">
                                        <img src="${pageContext.request.contextPath}/images/watcha.png" alt="" onerror="this.style.display='none'; this.parentElement.classList.add('logo-fallback');">
                                    </c:when>
                                    <c:when test="${fn:contains(serviceLower, 'claude')}">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Claude_AI_logo.svg/960px-Claude_AI_logo.svg.png" alt="" onerror="this.style.display='none'; this.parentElement.classList.add('logo-fallback');">
                                    </c:when>
                                    <c:when test="${fn:contains(serviceLower, 'chatgpt') or fn:contains(serviceLower, 'gpt') or fn:contains(serviceLower, 'openai')}">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" alt="" onerror="this.style.display='none'; this.parentElement.classList.add('logo-fallback');">
                                    </c:when>
                                    <c:otherwise>
                                        <span>${fn:substring(serviceTitle, 0, 1)}</span>
                                    </c:otherwise>
                                </c:choose>
                            </div>

                            <div class="history-info">
                                <strong>
                                    ${serviceTitle}
                                    <c:choose>
                                        <c:when test="${sub.status eq 'CANCELLED'}">
                                            <span class="history-status cancelled">취소/해지</span>
                                        </c:when>
                                        <c:when test="${sub.status eq 'EXPIRED'}">
                                            <span class="history-status expired">만료</span>
                                        </c:when>
                                        <c:when test="${sub.status eq 'REFUNDED'}">
                                            <span class="history-status refunded">환불</span>
                                        </c:when>
                                        <c:when test="${sub.status eq 'ACTIVE'}">
                                            <span class="history-status active">이용중</span>
                                        </c:when>
                                    </c:choose>
                                </strong>

                                <span>${not empty sub.startDate ? sub.startDate : '-'} ~ ${not empty sub.endDate ? sub.endDate : '-'}</span>
                            </div>
                        </div>

                        <div class="history-right">
                            <span class="order-code">주문코드 : ${sub.serialCode}</span>
                            <button type="button" class="btn-re-sub">재구독하기</button>
                        </div>
                    </div>

                    <hr class="history-divider">
                </c:forEach>

            </div>
        </div>

    </main>
</div>

<div id="termsModal" class="terms-modal-overlay">
    <div class="terms-modal-content">
        <span class="terms-close-btn" onclick="closeTermsModal()">&times;</span>

        <h2 class="terms-title">이용 약관</h2>

        <div class="terms-divider"></div>

        <div class="terms-text">
            <p>
                구독 파티란 OTT 등 정기 결제 서비스를 회원 간에 공동으로 이용하고 비용을 분담하기 위해 서비스 내에서 결성된 그룹을 의미합니다.
            </p>

            <p>
                지출메이트 플랫폼은 회원 간의 구독 쉐어 매칭을 지원할 뿐, 실제 분할 결제 이행 여부 및 사기 등 회원 간의 사적 거래에서 발생하는 금전적 피해에 대해서는 회사가 일체 법적 책임을 지지 않습니다.
            </p>
        </div>

        <div class="terms-bottom-line"></div>

        <button type="button" class="terms-confirm-btn" onclick="closeTermsModal()">확인</button>
    </div>
</div>

<%@ include file="/WEB-INF/views/common/layout/footer.jspf" %>
<%@ include file="/WEB-INF/views/common/include/scripts.jspf" %>

<script>
    function switchTab(index) {
        const tabs = document.querySelectorAll('.tab-menu .tab');
        const contents = document.querySelectorAll('.manage-container > .tab-content');

        tabs.forEach(function (tab, i) {
            const isActive = i === index;

            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        contents.forEach(function (content, i) {
            content.classList.toggle('active', i === index);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        switchTab(0);
    });

    function openTermsModal() {
        document.getElementById('termsModal').style.display = 'flex';
    }

    function closeTermsModal() {
        document.getElementById('termsModal').style.display = 'none';
    }

    window.addEventListener('click', function (event) {
        const modal = document.getElementById('termsModal');

        if (event.target === modal) {
            closeTermsModal();
        }
    });

    function confirmCancel(event) {
        event.preventDefault();

        if (confirm('정말 구독을 해지 또는 취소하시겠습니까?\n처리 후에도 주문 내역에서 확인할 수 있습니다.')) {
            event.target.submit();
        }

        return false;
    }
</script>

</body>
</html>
