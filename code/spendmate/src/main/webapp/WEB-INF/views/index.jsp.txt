<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <title>지출메이트</title>
    <%@ include file="/WEB-INF/views/common/include/head.jspf" %>
</head>
<body>

<%@ include file="/WEB-INF/views/common/layout/header.jspf" %>

<main>
    <section class="hero-section">
        <div class="hero-bg" aria-hidden="true">
            <video id="heroBgVideo"
                   class="hero-bg-video"
                   autoplay
                   muted
                   loop
                   playsinline
                   preload="auto"
                   poster="${pageContext.request.contextPath}/images/main-bg.jpg?v=1">
                <source src="${pageContext.request.contextPath}/images/main-bg.mp4?v=2" type="video/mp4">
            </video>
        </div>

        <div class="hero-title" aria-label="지출메이트 메인 소개">
            <p>모든 서비스를 한눈에</p>
            <p>지출 메이트</p>
        </div>

        <button type="button"
                class="hero-scroll-cue"
                aria-label="아래 서비스 영역으로 이동">
            <span class="hero-scroll-arrow" aria-hidden="true"></span>
        </button>
    </section>

    <section class="scroll-card-section">
        <div class="card-sticky">

            <article class="service-card card-01">
                <div class="card-content feature-card">
                    <div class="feature-text">
                        <span class="feature-label">AI MENTORING</span>
                        <h2>AI 멘토링</h2>
                        <p>
                            AI가 내 소비 패턴을 분석해<br>
                            맞춤형 절약 조언을 제공합니다
                        </p>
                    </div>
                    <div class="feature-icon-wrap">
                        <img src="${pageContext.request.contextPath}/images/ai_modal.jpg?v=2"
                             alt="AI 멘토링"
                             class="feature-icon ai-mentoring-icon">
                    </div>
                </div>
            </article>

            <article class="service-card card-02">
                <div class="card-content feature-card">
                    <div class="feature-text">
                        <span class="feature-label">DASHBOARD</span>
                        <h2>대시보드</h2>
                        <p>
                            카테고리별 지출 현황과 월별 흐름을<br>
                            한 화면에서 한눈에 확인합니다
                        </p>
                    </div>
                    <div class="feature-icon-wrap chat-icon-shape">
                        <span>···</span>
                    </div>
                </div>
            </article>

            <article class="service-card card-03">
                <div class="card-content feature-card">
                    <div class="feature-text">
                        <span class="feature-label">OTT SHARING</span>
                        <h2>OTT 공유</h2>
                        <p>
                            구독 서비스를 함께 나눠 쓰고<br>
                            매달 고정 지출을 절반으로 줄입니다
                        </p>
                    </div>
                    <div class="feature-icon-wrap subscription-icon">
                        <span>₩</span>
                    </div>
                </div>
            </article>

        </div>
    </section>

    <section class="fan-card-section">
        <div class="fan-title">
            <h2>지출메이트와 함께 관리하세요</h2>
            <p>복잡한 소비와 구독 내역을 더 쉽고 명확하게 정리합니다.</p>
        </div>

        <div class="fan-card-wrap">
            <article class="fan-card fan-card-left">
                <h3>AI 멘토링</h3>
                <p>
                    내 지출 데이터를 AI가 꼼꼼하게 분석해드립니다.<br>
                    이번 달 어디서 돈이 새고 있는지 바로 짚어드리고,<br>
                    소비 패턴에 맞는 절약 방법을 구체적인 수치로 안내해드려요.<br>
                    단순한 기록을 넘어 AI와 함께 더 똑똑한 소비 습관을 만들어 보세요.
                </p>
            </article>

            <article class="fan-card fan-card-center">
                <h3>대시보드</h3>
                <p>
                    카테고리별 지출 현황, 월별 소비 흐름, 예산 달성률을 한눈에 볼 수 있어요.<br>
                    매달 나가는 고정 지출이 얼마인지 바로 확인할 수 있고,<br>
                    복잡한 가계부 없이도 내 돈의 흐름을 깔끔하게 정리해서 보여드려요.
                </p>
            </article>

            <article class="fan-card fan-card-right">
                <h3>OTT 구독 공유</h3>
                <p>
                    넷플릭스, 유튜브 프리미엄 등 16개 서비스를 함께 나눠 쓸 수 있어요.<br>
                    정식 구독료보다 훨씬 저렴한 가격으로 원하는 서비스를 이용해 보세요.<br>
                    믿을 수 있는 메이트를 플랫폼에서 안전하게 찾을 수 있어요.<br>
                    복잡한 절차 없이 간편하게 구독 비용을 줄여보세요.
                </p>
            </article>
        </div>
    </section>
</main>

<%@ include file="/WEB-INF/views/common/layout/floatingBtn.jspf" %>

<%@ include file="/WEB-INF/views/common/layout/footer.jspf" %>

<%@ include file="/WEB-INF/views/common/modal/authModal.jspf" %>
<%@ include file="/WEB-INF/views/common/modal/faqModal.jspf" %>

<%@ include file="/WEB-INF/views/common/include/scripts.jspf" %>
<script src="${pageContext.request.contextPath}/js/pages/faq.js"></script>
<script src="${pageContext.request.contextPath}/js/pages/index.js?v=4"></script>

</body>
</html>