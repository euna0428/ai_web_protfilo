<%@ page contentType="text/html; charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<c:set var="menu" value="sales"/>

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/common/include/head.jspf" %>

    <meta charset="UTF-8">
    <title>지출메이트 - 내 판매 목록 리스트</title>

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/mypage.css?v=31">

    <style>
        .sales-list-main {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .sales-list-page-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 18px;
        }

        .sales-list-title-area {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .sales-list-title-area .page-title {
            margin: 0;
        }

        .sales-list-subtitle {
            margin: 0;
            color: #6b7280;
            font-size: 15px;
            font-weight: 600;
            line-height: 1.5;
        }

        .register-post-btn {
            height: 46px;
            padding: 0 18px;
            border: none;
            border-radius: 999px;
            background: #243864;
            color: #ffffff;
            font-size: 14px;
            font-weight: 900;
            cursor: pointer;
            white-space: nowrap;
            transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .register-post-btn:hover {
            opacity: 0.92;
            transform: translateY(-1px);
        }

        .sales-list-card {
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

        .empty-box {
            min-height: 460px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 22px;
            text-align: center;
        }

        .empty-box h1 {
            margin: 0;
            color: #111111;
            font-size: 26px;
            font-weight: 900;
            letter-spacing: -0.04em;
        }

        .empty-box p {
            margin: 0;
            color: #6b7280;
            font-size: 15px;
            font-weight: 600;
            line-height: 1.6;
        }

        .primary-btn {
            min-width: 160px;
            height: 48px;
            padding: 0 20px;
            border: none;
            border-radius: 14px;
            background: #243864;
            color: #ffffff;
            font-size: 15px;
            font-weight: 900;
            cursor: pointer;
            transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .primary-btn:hover {
            opacity: 0.92;
            transform: translateY(-1px);
        }

        .sales-list-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .sale-item {
            width: 100%;
            padding: 22px 24px;
            border: 1px solid #e8eaf0;
            border-radius: 20px;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            transition: box-shadow 0.2s ease, transform 0.2s ease;
        }

        .sale-item:hover {
            box-shadow: 0 10px 28px rgba(17, 24, 39, 0.07);
            transform: translateY(-1px);
        }

        .item-left-group {
            min-width: 0;
            display: flex;
            align-items: center;
            gap: 18px;
        }

        .item-logo-area {
            width: 64px;
            height: 64px;
            flex: 0 0 64px;
            border-radius: 18px;
            background: #f4f6fa;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            color: #243864;
            font-size: 13px;
            font-weight: 900;
            text-align: center;
        }

        .item-logo-area img {
            max-width: 46px;
            max-height: 46px;
            object-fit: contain;
        }

        .item-info {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 9px;
        }

        .item-name {
            color: #111111;
            font-size: 19px;
            font-weight: 900;
            letter-spacing: -0.03em;
        }

        .item-desc-text {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            color: #6b7280;
            font-size: 14px;
            font-weight: 700;
            line-height: 1.5;
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
            white-space: nowrap;
        }

        .status-badge.selling {
            background: #e9f8ef;
            color: #1f9d55;
        }

        .status-badge.waiting {
            background: #fff4df;
            color: #d48600;
        }

        .status-badge.full {
            background: #eeeeee;
            color: #666666;
        }

        .status-badge.rejected {
            background: #ffe8e8;
            color: #e53935;
        }

        .price-text {
            color: #111111;
            font-weight: 900;
        }

        .item-right-stat {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .created-text {
            color: #555555;
            font-size: 14px;
            font-weight: 800;
            white-space: nowrap;
        }

        .detail-btn {
            height: 36px;
            padding: 0 14px;
            border: 1px solid #243864;
            border-radius: 10px;
            background: #ffffff;
            color: #243864;
            font-size: 13px;
            font-weight: 900;
            cursor: pointer;
            transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }

        .detail-btn:hover {
            background: #243864;
            color: #ffffff;
            transform: translateY(-1px);
        }

        .pagination {
            width: 100%;
            margin-top: auto;
            padding-top: 28px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .page-link {
            min-width: 36px;
            height: 36px;
            padding: 0 12px;
            border: 1px solid #243864;
            border-radius: 10px;
            background: #243864;
            color: #ffffff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 800;
            text-decoration: none;
        }

        @media (max-width: 1024px) {
            .sale-item {
                align-items: flex-start;
                flex-direction: column;
            }

            .item-right-stat {
                width: 100%;
                justify-content: space-between;
            }
        }

        @media (max-width: 768px) {
            .sales-list-page-header {
                align-items: flex-start;
                flex-direction: column;
            }

            .register-post-btn {
                width: 100%;
            }

            .sales-list-card {
                min-height: 520px;
                padding: 24px 20px;
                border-radius: 20px;
            }

            .empty-box {
                min-height: 380px;
            }

            .empty-box h1 {
                font-size: 22px;
            }

            .sale-item {
                padding: 20px;
                border-radius: 18px;
            }

            .item-left-group {
                align-items: flex-start;
                width: 100%;
            }

            .item-logo-area {
                width: 56px;
                height: 56px;
                flex-basis: 56px;
            }

            .item-name {
                font-size: 17px;
            }

            .item-desc-text {
                font-size: 13px;
            }

            .item-right-stat {
                align-items: stretch;
                flex-direction: column;
                gap: 10px;
            }

            .created-text {
                white-space: normal;
            }

            .detail-btn {
                width: 100%;
            }
        }

        @media (max-width: 480px) {
            .item-left-group {
                flex-direction: column;
            }

            .item-logo-area {
                width: 60px;
                height: 60px;
            }
        }

        /* ★ 상세 팝업창(모달) 전용 스타일 */
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.4); /* 반투명 배경 */
            display: flex; justify-content: center; align-items: center;
            z-index: 9999;
        }
        .modal-content {
            background: #ffffff;
            border-radius: 20px; /* 둥근 테두리 */
            width: 340px;
            padding: 30px 24px;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .modal-close-btn {
            position: absolute; top: 16px; right: 20px;
            font-size: 24px; font-weight: bold; color: #999;
            background: none; border: none; cursor: pointer;
        }
        .modal-header {
            text-align: center; margin-bottom: 24px;
        }
        .modal-header img { max-height: 36px; }

        .info-group { margin-bottom: 16px; }
        .info-group label {
            display: block; font-size: 16px; font-weight: 800;
            color: #111; margin-bottom: 8px; text-align: left;
        }
        .info-box {
            border: 1px solid #ddd;
            border-radius: 12px; /* 둥근 입력창 모양 */
            padding: 10px 14px;
            font-size: 14px; color: #333;
            text-align: center; /* 텍스트 가운데 정렬 */
            background: #fff;
            font-weight: 600;
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
                '#sidebar', '#sideBar', '#sideMenu', '#sidebarMenu',
                '#mobileMenu', '#menuDrawer', '.sidebar', '.side-bar',
                '.side-nav', '.side-menu', '.sidebar-menu', '.mobile-menu',
                '.mobile-sidebar', '.menu-drawer', '.drawer-menu', '.nav-drawer',
                '.header-sidebar', '.global-sidebar', '.layout-sidebar'
            ];

            const overlaySelectors = [
                '#sidebarOverlay', '#sideOverlay', '#menuOverlay',
                '.sidebar-overlay', '.side-overlay', '.menu-overlay',
                '.drawer-overlay', '.nav-overlay', '.global-dim', '.dimmed-layer'
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

    <main class="sales-list-main">

        <div class="sales-list-page-header">
            <div class="sales-list-title-area">
                <h1 class="page-title">내 판매 목록</h1>
                <p class="sales-list-subtitle">
                    판매자로 등록한 구독 공유 상품을 카드형 목록으로 확인할 수 있습니다.
                </p>
            </div>

            <c:if test="${isSeller}">
                <button type="button"
                        class="register-post-btn"
                        onclick="location.href='${pageContext.request.contextPath}/party/form'">
                    판매글 등록하기
                </button>
            </c:if>
        </div>

        <section class="sales-list-card">

            <c:choose>

                <c:when test="${not isSeller}">
                    <div class="empty-box">
                        <h1>판매자 등록을 먼저 해주세요!</h1>
                        <p>
                            구독 공유 판매글을 등록하려면 판매자 인증이 필요합니다.<br>
                            판매자 등록 후 판매 목록을 확인할 수 있습니다.
                        </p>

                        <button type="button"
                                class="primary-btn"
                                onclick="location.href='${pageContext.request.contextPath}/mypage/sales/register-identity'">
                            판매자 등록하기
                        </button>
                    </div>
                </c:when>

                <c:when test="${isSeller and empty salesList}">
                    <div class="empty-box">
                        <h1>등록된 판매글이 없습니다.</h1>
                        <p>
                            판매할 구독 서비스를 등록하면 이곳에서 목록으로 확인할 수 있습니다.
                        </p>

                        <button type="button"
                                class="primary-btn"
                                onclick="location.href='${pageContext.request.contextPath}/party/form'">
                            판매글 등록하기
                        </button>
                    </div>
                </c:when>

                <c:otherwise>
                    <div class="sales-list-content">

                        <c:forEach var="s" items="${salesList}">
                            <article class="sale-item">

                                <div class="item-left-group">

                                    <div class="item-logo-area">
                                        <c:choose>
                                            <c:when test="${s.serviceName eq '유튜브 프리미엄'}">
                                                <img src="${pageContext.request.contextPath}/images/youtube_premium_logo.png"
                                                     alt="유튜브 프리미엄 로고">
                                            </c:when>

                                            <c:when test="${fn:contains(serviceLower, 'netflix') or fn:contains(serviceLower, '넷플릭스')}">
                                                <img src="${pageContext.request.contextPath}/images/netflix.png"
                                                     alt="넷플릭스"
                                                     onerror="this.parentElement.classList.add('logo-fallback'); this.remove();">
                                            </c:when>

                                            <c:when test="${s.serviceName eq '티빙'}">
                                                <img src="${pageContext.request.contextPath}/images/tving.png"
                                                     alt="티빙 로고">
                                            </c:when>

                                            <c:when test="${s.serviceName eq '웨이브'}">
                                                <img src="${pageContext.request.contextPath}/images/wavve.png"
                                                     alt="웨이브 로고">
                                            </c:when>

                                            <c:when test="${s.serviceName eq '왓챠'}">
                                                <img src="${pageContext.request.contextPath}/images/watcha.png"
                                                     alt="왓챠 로고">
                                            </c:when>

                                            <c:otherwise>
                                                <span>
                                                        ${s.serviceName}
                                                </span>
                                            </c:otherwise>
                                        </c:choose>
                                    </div>

                                    <div class="item-info">
                                        <div class="item-name">
                                                ${s.serviceName}
                                        </div>

                                        <div class="item-desc-text">
                                            <c:choose>
                                                <c:when test="${s.status eq 'APPROVED'}">
                                                    <span class="status-badge selling">판매중</span>
                                                </c:when>

                                                <c:when test="${s.status eq 'WAITING'}">
                                                    <span class="status-badge waiting">승인대기</span>
                                                </c:when>

                                                <c:when test="${s.status eq 'FULL'}">
                                                    <span class="status-badge full">모집완료</span>
                                                </c:when>

                                                <c:when test="${s.status eq 'REJECTED'}">
                                                    <span class="status-badge rejected">반려</span>
                                                </c:when>

                                                <c:otherwise>
                                                    <span class="status-badge full">${s.status}</span>
                                                </c:otherwise>
                                            </c:choose>

                                            <span class="price-text">
                                                ${s.monthlyPrice}원
                                            </span>

                                            <span>
                                                ${not empty s.saleMonths ? s.saleMonths : '-'}개월 판매
                                            </span>

                                            <span>
                                                공유 ID:
                                                ${not empty s.shareId ? s.shareId : '-'}
                                            </span>
                                        </div>
                                    </div>

                                </div>

                                <div class="item-right-stat">
                                    <span class="created-text">
                                        등록일:
                                        ${not empty s.createdAt ? s.createdAt : '-'}
                                    </span>

                                    <button type="button" class="btn-detail"
                                        onclick="openDetailModal('${s.serviceName}', ${s.monthlyPrice}, '${s.shareId}', '${s.sharePassword}', '${s.createdAt}')"                                        상세
                                    </button>
                                </div>

                            </article>
                        </c:forEach>

                    </div>

                    <div class="pagination">
                        <span class="page-link">1</span>
                    </div>
                </c:otherwise>

            </c:choose>

        </section>

    </main>

</div>

<%@ include file="/WEB-INF/views/common/layout/footer.jspf" %>
<%@ include file="/WEB-INF/views/common/include/scripts.jspf" %>
<div id="detailModal" class="modal-overlay" style="display: none;">
    <div class="modal-content">
        <button type="button" class="modal-close-btn" onclick="closeDetailModal()">×</button>

        <div class="modal-header">
            <img id="modalLogo" src="" alt="OTT 로고">
        </div>

        <div class="modal-body">
            <div class="info-group">
                <label>OTT 명</label>
                <div class="info-box" id="modalServiceName"></div>
            </div>
            <div class="info-group">
                <label>가격</label>
                <div class="info-box" id="modalPrice"></div>
            </div>
            <div class="info-group">
                <label>아이디</label>
                <div class="info-box" id="modalShareId"></div>
            </div>
            <div class="info-group">
                <label>비밀번호</label>
                <div class="info-box" id="modalSharePassword"></div>
            </div>
            <div class="info-group">
                <label>판매 기간</label>
                <div class="info-box" id="modalPeriod"></div>
            </div>
        </div>
    </div>
</div>
<script>
    document.addEventListener("DOMContentLoaded", function () {
    });

    // 팝업창 열기 함수
        function openDetailModal(serviceName, price, shareId, sharePw, regDate) {
            // 1. 로고 이미지 세팅
            let logoSrc = '';
            if(serviceName === '유튜브 프리미엄') logoSrc = '${pageContext.request.contextPath}/images/youtube_premium_logo.png';
            else if(serviceName === '넷플릭스') logoSrc = '${pageContext.request.contextPath}/images/netflix.png';
            else if(serviceName === '티빙') logoSrc = '${pageContext.request.contextPath}/images/tving.png';
            else if(serviceName === '웨이브') logoSrc = '${pageContext.request.contextPath}/images/wavve.png';
            else if(serviceName === '왓챠') logoSrc = '${pageContext.request.contextPath}/images/watcha.png';

            document.getElementById('modalLogo').src = logoSrc;

            // 2. 데이터 세팅
            document.getElementById('modalServiceName').innerText = serviceName;
            document.getElementById('modalPrice').innerText = price.toLocaleString() + '원';
            document.getElementById('modalShareId').innerText = shareId || '정보 없음';
            document.getElementById('modalSharePassword').innerText = sharePw || '정보 없음';

            // 날짜가공 (시작일 ~)
            let periodText = regDate ? regDate.substring(0, 10) + ' ~ (진행중)' : '-';
            document.getElementById('modalPeriod').innerText = periodText;

            // 3. 모달창 띄우기
            document.getElementById('detailModal').style.display = 'flex';
        }

        // 팝업창 닫기 함수
        function closeDetailModal() {
            document.getElementById('detailModal').style.display = 'none';
        }
</script>

</body>
</html>