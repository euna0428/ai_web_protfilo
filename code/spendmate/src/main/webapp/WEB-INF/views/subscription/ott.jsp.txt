<%@ page contentType="text/html; charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>지출메이트 - 서비스 선택</title>

    <%@ include file="/WEB-INF/views/common/include/head.jspf" %>

    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">

    <link rel="stylesheet"
          as="style"
          crossorigin
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">

    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/subscription.css?v=6">
</head>

<body class="ott-page is-header-ready is-opening-loaded is-fab-ready">

<%@ include file="/WEB-INF/views/common/layout/header.jspf" %>
<script>
    document.querySelector('.site-header')?.classList.add('is-solid');
    document.body.classList.add('is-header-ready');
    document.body.classList.add('is-opening-loaded');
    document.body.classList.add('is-fab-ready');
</script>

<main class="main-container" id="mainContainer">
    <section class="column">
        <div class="category-name">Video</div>

        <div class="swiper-container-wrapper">
            <div class="swiper mySwiper" data-category="video">
                <div class="swiper-wrapper" id="videoSlides"></div>
            </div>
        </div>
    </section>

    <section class="column">
        <div class="category-name">AI Tech</div>

        <div class="swiper-container-wrapper">
            <div class="swiper mySwiper" data-category="ai">
                <div class="swiper-wrapper" id="aiSlides"></div>
            </div>
        </div>
    </section>

    <section class="column">
        <div class="category-name">Software</div>

        <div class="swiper-container-wrapper">
            <div class="swiper mySwiper" data-category="software">
                <div class="swiper-wrapper" id="softwareSlides"></div>
            </div>
        </div>
    </section>
</main>

<div class="ott-detail-modal-overlay" id="ottDetailModalOverlay">
    <div class="ott-detail-modal-content">
        <div class="selected-service-preview" id="selectedServicePreview"></div>

        <section class="subscription-detail" id="subscriptionDetail">
            <div class="detail-header">
                <img id="detailLogo" src="" alt="선택 서비스 로고">

                <div>
                    <h2 id="detailTitle">서비스를 선택하세요</h2>
                    <p id="detailPrice">가격 정보</p>
                </div>
            </div>

            <div class="detail-description">
                <p id="detailDescription">
                    서비스를 선택하면 구독 상세 정보가 표시됩니다.
                </p>
            </div>

            <div class="month-buttons">
                <button type="button" onclick="selectMonth(1, this)">
                    <div>1개월</div>
                    <div class="month-price">0원</div>
                </button>

                <button type="button" onclick="selectMonth(3, this)">
                    <div>3개월</div>
                    <div class="month-price">0원</div>
                </button>

                <button type="button" onclick="selectMonth(6, this)">
                    <div>6개월</div>
                    <div class="month-price">0원</div>
                </button>
            </div>

            <div class="detail-buttons">
                <button type="button"
                        class="back-btn"
                        onclick="closeDetail()">
                    이전으로
                </button>

                <button type="button"
                        class="buy-btn"
                        onclick="openPaymentModal()">
                    결제하기
                </button>
            </div>
        </section>
    </div>
</div>

<div class="ott-payment-modal" id="ottPaymentModal">
    <section class="payment-box">
        <h2>결제 확인</h2>

        <hr>

        <div class="payment-info">
            <div class="payment-row">
                <span class="label">서비스</span>
                <span id="payService">-</span>
            </div>

            <div class="payment-row">
                <span class="label">구독기간</span>
                <span id="payMonth">-</span>
            </div>

            <div class="payment-row">
                <span class="label">결제금액</span>
                <span id="payPrice">-</span>
            </div>

            <div class="payment-row">
                <span class="label">은행</span>
                <span id="payBankName">
                    <c:choose>
                        <c:when test="${not empty primaryAccount}">
                            ${primaryAccount.bankName}
                        </c:when>
                        <c:otherwise>
                            등록된 계좌 없음
                        </c:otherwise>
                    </c:choose>
                </span>
            </div>

            <div class="payment-row">
                <span class="label">계좌번호</span>
                <span id="payAccountNumber">
                    <c:choose>
                        <c:when test="${not empty primaryAccount}">
                            ${primaryAccount.accountNumber}
                        </c:when>
                        <c:otherwise>
                            마이페이지에서 계좌 등록 필요
                        </c:otherwise>
                    </c:choose>
                </span>
            </div>
        </div>

        <div class="payment-buttons">
            <button type="button"
                    onclick="closePaymentModal()">
                취소
            </button>

            <button type="button"
                    onclick="confirmPayment()">
                결제하기
            </button>
        </div>
    </section>
</div>

<form id="purchaseForm"
      action="${pageContext.request.contextPath}/subscription/ott"
      method="post">

    <input type="hidden"
           name="partyId"
           id="partyId">

    <input type="hidden"
           name="monthlyFee"
           id="monthlyFee">

    <input type="hidden"
           name="periodMonths"
           id="periodMonths">

    <input type="hidden"
           name="accountId"
           id="accountId"
           value="${not empty primaryAccount ? primaryAccount.id : ''}">
</form>

<%@ include file="/WEB-INF/views/common/layout/floatingBtn.jspf" %>
<%@ include file="/WEB-INF/views/common/layout/footer.jspf" %>
<%@ include file="/WEB-INF/views/common/modal/authModal.jspf" %>
<%@ include file="/WEB-INF/views/common/modal/faqModal.jspf" %>
<%@ include file="/WEB-INF/views/common/include/scripts.jspf" %>

<script src="${pageContext.request.contextPath}/js/pages/faq.js"></script>
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="${pageContext.request.contextPath}/js/nav-wave.js"></script>

<script>
    const OTT_CONTEXT_PATH = '${pageContext.request.contextPath}';
    const HAS_PAYMENT_ACCOUNT = ${hasPaymentAccount};

    <c:if test="${not empty errorMessage}">
    alert('${errorMessage}');
    </c:if>

    const serviceData = {
        youtube: {
            serviceName: '유튜브 프리미엄',
            title: '유튜브 프리미엄',
            image: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg',
            prices: { month1: 5490, month3: 14700, month6: 27720 },
            description: '광고 없이 YouTube와 YouTube Music을 이용할 수 있으며, 백그라운드 재생과 오프라인 저장 기능을 제공합니다.'
        },
        netflix: {
            serviceName: '넷플릭스',
            title: '넷플릭스',
            image: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
            prices: { month1: 5980, month3: 16800, month6: 31920 },
            description: '영화, 드라마, 예능, 다큐멘터리 등 다양한 콘텐츠를 시청할 수 있는 글로벌 OTT 서비스입니다.'
        },
        tving: {
            serviceName: '티빙',
            title: '티빙',
            image: OTT_CONTEXT_PATH + '/images/tving.png',
            prices: { month1: 7500, month3: 21000, month6: 40320 },
            description: '국내 드라마, 예능, 영화, 스포츠 중계 등 다양한 콘텐츠를 제공하는 OTT 서비스입니다.'
        },
        disney: {
            serviceName: '디즈니+',
            title: '디즈니+',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/3840px-Disney%2B_logo.svg.png',
            prices: { month1: 3330, month3: 9240, month6: 17640 },
            description: '디즈니, 마블, 픽사, 스타워즈 등의 콘텐츠를 제공하는 글로벌 스트리밍 서비스입니다.'
        },
        laftel: {
            serviceName: '라프텔',
            title: '라프텔',
            image: 'https://oopy.lazyrockets.com/api/rest/cdn/image/19dda27a-9593-47d3-b5de-e8f30d465142.png',
            prices: { month1: 2500, month3: 7500, month6: 15000 },
            description: '애니메이션 콘텐츠를 중심으로 제공하는 국내 대표 애니메이션 스트리밍 플랫폼입니다.'
        },
        wavve: {
            serviceName: '웨이브',
            title: '웨이브',
            image: OTT_CONTEXT_PATH + '/images/wavve.png',
            prices: { month1: 5360, month3: 14700, month6: 27720 },
            description: '지상파 방송 콘텐츠와 드라마, 예능, 영화 등을 제공하는 국내 스트리밍 서비스입니다.'
        },
        watcha: {
            serviceName: '왓챠',
            title: '왓챠',
            image: OTT_CONTEXT_PATH + '/images/watcha.png',
            prices: { month1: 3715, month3: 11145, month6: 22290 },
            description: '영화와 드라마 중심의 콘텐츠를 제공하며 개인 취향 기반 추천을 지원하는 구독 서비스입니다.'
        },
        chatgpt: {
            serviceName: 'ChatGPT',
            title: 'ChatGPT Plus',
            image: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
            prices: { month1: 5280, month3: 21294, month6: 45276 },
            description: '문서 작성, 번역, 코딩, 학습, 아이디어 정리 등 다양한 작업을 지원하는 생성형 AI 서비스입니다.'
        },
        gemini: {
            serviceName: 'Gemini',
            title: 'Gemini Advanced',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
            prices: { month1: 5140, month3: 14280, month6: 26880 },
            description: 'Google의 생성형 AI 서비스로 문서 작성, 요약, 검색, 코딩 지원 등 다양한 작업을 수행할 수 있습니다.'
        },
        claude: {
            serviceName: 'Claude',
            title: 'Claude Pro',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Claude_AI_logo.svg/960px-Claude_AI_logo.svg.png',
            prices: { month1: 7690, month3: 21420, month6: 40320 },
            description: '긴 문서 분석과 자연스러운 대화에 강점을 가진 생성형 AI 구독 서비스입니다.'
        },
        capcut: {
            serviceName: '캡컷',
            title: 'CapCut Pro',
            image: OTT_CONTEXT_PATH + '/images/capcut.png',
            prices: { month1: 7000, month3: 19500, month6: 36000 },
            description: '영상 편집, 자막 생성, AI 효과, 템플릿 기능 등을 제공하는 영상 제작 플랫폼입니다.'
        },
        adobe: {
            serviceName: '어도비',
            title: 'Adobe Creative Cloud',
            image: OTT_CONTEXT_PATH + '/images/adobe.png',
            prices: { month1: 14000, month3: 39000, month6: 72000 },
            description: 'Photoshop, Illustrator, Premiere Pro 등 디자인 및 영상 편집 프로그램을 제공하는 구독 서비스입니다.'
        },
        duolingo: {
            serviceName: '듀오링고',
            title: 'Duolingo Super',
            image: OTT_CONTEXT_PATH + '/images/duolingo.png',
            prices: { month1: 2500, month3: 7500, month6: 15000 },
            description: '다양한 외국어를 게임처럼 학습할 수 있는 언어 교육 플랫폼입니다.'
        },
        millie: {
            serviceName: '밀리의 서재',
            title: '밀리의 서재',
            image: OTT_CONTEXT_PATH + '/images/mille.png',
            prices: { month1: 4460, month3: 13380, month6: 26760 },
            description: '전자책과 오디오북 등 다양한 독서 콘텐츠를 제공하는 국내 독서 구독 서비스입니다.'
        },
        microsoft: {
            serviceName: '마이크로소프트',
            title: 'Microsoft 365',
            image: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
            prices: { month1: 2000, month3: 6000, month6: 12000 },
            description: 'Word, Excel, PowerPoint, OneDrive 등 오피스 프로그램과 클라우드 기능을 제공하는 서비스입니다.'
        },
        polaris: {
            serviceName: '폴라리스 오피스',
            title: '폴라리스 오피스',
            image: 'https://shareditassets.s3.ap-northeast-2.amazonaws.com/production/uploads/business/profile_photo/1630/low_Polaris_Office_200.106.png',
            prices: { month1: 3400, month3: 10200, month6: 20400 },
            description: '문서 작성, 스프레드시트, 프레젠테이션 기능을 제공하는 오피스 소프트웨어 서비스입니다.'
        }
    };

    const categories = {
        video: [
            'youtube', 'netflix', 'tving', 'disney', 'laftel', 'wavve', 'watcha',
            'youtube', 'netflix', 'tving', 'disney', 'laftel', 'wavve', 'watcha'
        ],
        ai: [
            'chatgpt', 'gemini', 'claude',
            'chatgpt', 'gemini', 'claude',
            'chatgpt', 'gemini', 'claude'
        ],
        software: [
            'capcut', 'adobe', 'duolingo', 'millie', 'microsoft', 'polaris',
            'capcut', 'adobe', 'duolingo', 'millie', 'microsoft', 'polaris'
        ]
    };

    let currentPrices = {
        month1: 0,
        month3: 0,
        month6: 0
    };

    let selectedKey = null;
    let selectedMonth = 1;
    let selectedTotalPrice = 0;
    let selectedPartyPost = null;

    function renderSlides() {
        Object.keys(categories).forEach(function (categoryKey) {
            const wrapper = document.getElementById(categoryKey + 'Slides');

            if (!wrapper) {
                return;
            }

            let html = '';

            categories[categoryKey].forEach(function (serviceKey) {
                const service = serviceData[serviceKey];

                if (!service) {
                    return;
                }

                html += '<div class="swiper-slide" data-name="' + serviceKey + '">';
                html += '    <div class="logo-box">';
                html += '        <img src="' + service.image + '" alt="' + service.title + '">';
                html += '    </div>';
                html += '</div>';
            });

            wrapper.innerHTML = html;
        });
    }

    function bindSlideClickEvents() {
        document.querySelectorAll('.mySwiper').forEach(function (swiperElement) {
            if (swiperElement.dataset.clickBound === 'true') {
                return;
            }

            swiperElement.dataset.clickBound = 'true';

            swiperElement.addEventListener('click', function (event) {
                const slide = event.target.closest('.swiper-slide');

                if (!slide) {
                    return;
                }

                const name = slide.getAttribute('data-name');

                if (name) {
                    showSubscription(name);
                }
            });
        });
    }

    function initSwipers() {
        bindSlideClickEvents();

        if (typeof Swiper === 'undefined') {
            return;
        }

        document.querySelectorAll('.mySwiper').forEach(function (el) {
            const swiper = new Swiper(el, {
                direction: 'vertical',
                slidesPerView: 5,
                centeredSlides: true,
                centeredSlidesBounds: true,
                spaceBetween: -120,
                speed: 1000,
                loop: true,
                mousewheel: false,
                slideToClickedSlide: true,
                observer: true,
                observeParents: true
            });

            let isLocked = false;

            el.addEventListener('wheel', function (event) {
                event.preventDefault();

                if (isLocked || swiper.animating) {
                    return;
                }

                if (Math.abs(event.deltaY) < 15) {
                    return;
                }

                isLocked = true;

                if (event.deltaY > 0) {
                    swiper.slideNext();
                } else {
                    swiper.slidePrev();
                }

                setTimeout(function () {
                    isLocked = false;
                }, 350);
            }, { passive: false });

            swiper.update();
        });
    }

    async function findPartyPost(serviceName) {
        try {
            const response = await fetch(OTT_CONTEXT_PATH + '/api/party/posts');

            if (!response.ok) {
                throw new Error('판매글 목록 조회 실패');
            }

            const posts = await response.json();

            const matchedPosts = posts.filter(function (post) {
                return post.serviceName === serviceName;
            });

            return matchedPosts.length > 0 ? matchedPosts[0] : null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function showSubscription(name) {
        const service = serviceData[name];

        if (!service) {
            return;
        }

        selectedKey = name;
        selectedPartyPost = await findPartyPost(service.serviceName);

        document.getElementById('mainContainer').classList.add('blur-background');

        document.querySelectorAll('.swiper-slide').forEach(function (slide) {
            slide.classList.remove('selected-card');

            if (slide.getAttribute('data-name') === name) {
                slide.classList.add('selected-card');
            }
        });

        const preview = document.getElementById('selectedServicePreview');

        preview.innerHTML =
            '<img src="' + service.image + '" alt="' + service.title + '">';

        document.getElementById('detailLogo').src = service.image;
        document.getElementById('detailTitle').innerText = service.title;
        document.getElementById('detailDescription').innerText = service.description;

        currentPrices = service.prices;
        updatePriceButtons();

        document.getElementById('ottDetailModalOverlay').style.display = 'flex';

        const firstMonthButton = document.querySelector('.month-buttons button');

        if (firstMonthButton) {
            selectMonth(1, firstMonthButton);
        }
    }

    function updatePriceButtons() {
        const prices = document.querySelectorAll('.month-price');

        if (prices.length < 3) {
            return;
        }

        prices[0].innerText = currentPrices.month1.toLocaleString() + '원';
        prices[1].innerText = currentPrices.month3.toLocaleString() + '원';
        prices[2].innerText = currentPrices.month6.toLocaleString() + '원';
    }

    function closeDetail() {
        document.getElementById('ottDetailModalOverlay').style.display = 'none';
        document.getElementById('mainContainer').classList.remove('blur-background');

        document.querySelectorAll('.swiper-slide').forEach(function (slide) {
            slide.classList.remove('selected-card');
        });
    }

    function selectMonth(month, button) {
        document.querySelectorAll('.month-buttons button').forEach(function (monthButton) {
            monthButton.classList.remove('active');
        });

        button.classList.add('active');

        if (month === 1) {
            selectedTotalPrice = currentPrices.month1;
        } else if (month === 3) {
            selectedTotalPrice = currentPrices.month3;
        } else if (month === 6) {
            selectedTotalPrice = currentPrices.month6;
        }

        selectedMonth = month;

        document.getElementById('detailPrice').innerText =
            selectedTotalPrice.toLocaleString() + '원 / ' + month + '개월';
    }

    function openPaymentModal() {
        if (!HAS_PAYMENT_ACCOUNT) {
            alert('마이페이지에서 결제 계좌를 먼저 등록해 주세요.');
            location.href = OTT_CONTEXT_PATH + '/mypage';
            return;
        }

        if (!selectedKey) {
            alert('먼저 구독 서비스를 선택해 주세요.');
            return;
        }

        if (!selectedPartyPost || !selectedPartyPost.id) {
            alert('선택한 서비스의 판매글 정보가 없습니다. 판매글 등록 상태를 확인해 주세요.');
            return;
        }

        const service = serviceData[selectedKey];
        const monthlyFee = Math.round(selectedTotalPrice / selectedMonth);

        document.getElementById('partyId').value = selectedPartyPost.id;
        document.getElementById('monthlyFee').value = monthlyFee;
        document.getElementById('periodMonths').value = selectedMonth;

        document.getElementById('payService').innerText = service.title;
        document.getElementById('payMonth').innerText = selectedMonth + '개월';
        document.getElementById('payPrice').innerText = selectedTotalPrice.toLocaleString() + '원';

        document.getElementById('ottDetailModalOverlay').style.display = 'none';
        document.getElementById('ottPaymentModal').style.display = 'flex';
    }

    function closePaymentModal() {
        document.getElementById('ottPaymentModal').style.display = 'none';
        document.getElementById('ottDetailModalOverlay').style.display = 'flex';
    }

    function confirmPayment() {
        if (!HAS_PAYMENT_ACCOUNT) {
            alert('마이페이지에서 결제 계좌를 먼저 등록해 주세요.');
            location.href = OTT_CONTEXT_PATH + '/mypage';
            return;
        }

        document.getElementById('purchaseForm').submit();
    }

    function initOttPage() {
        const detailOverlay = document.getElementById('ottDetailModalOverlay');

        if (detailOverlay && detailOverlay.dataset.bound !== 'true') {
            detailOverlay.dataset.bound = 'true';

            detailOverlay.addEventListener('click', function (event) {
                if (event.target === detailOverlay) {
                    closeDetail();
                }
            });
        }

        renderSlides();

        setTimeout(function () {
            initSwipers();
        }, 0);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOttPage);
    } else {
        initOttPage();
    }
</script>

<script>
    (function () {
        function initOttCommonHeaderFallback() {
            const hamburger = document.querySelector('.hamburger-btn');

            if (!hamburger || hamburger.dataset.ottSidebarBound === 'true') {
                return;
            }

            hamburger.dataset.ottSidebarBound = 'true';
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

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initOttCommonHeaderFallback);
        } else {
            initOttCommonHeaderFallback();
        }
    })();
</script>

</body>
</html>