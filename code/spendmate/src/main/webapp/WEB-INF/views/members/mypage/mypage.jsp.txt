<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<c:set var="menu" value="mypage"/>

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/common/include/head.jspf" %>

    <meta charset="UTF-8">
    <title>지출메이트 - 마이페이지</title>

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/mypage.css?v=11">
</head>

<body class="mypage">

<%@ include file="/WEB-INF/views/common/layout/header.jspf" %>

<div class="mypage-container">

    <aside class="mypage-sidebar">
        <%@ include file="/WEB-INF/views/members/mypage/mypage-sidebar.jspf" %>
    </aside>

    <main class="dashboard">

        <section class="profile-combined-card">

            <div class="info-side">
                <h3 class="card-title-center">내 정보</h3>

                <div class="info-body">

                    <div class="profile-section">
                        <div class="profile-img-box">
                            <c:choose>
                                <c:when test="${not empty profileImageUrl}">
                                    <img src="${pageContext.request.contextPath}${profileImageUrl}"
                                         alt="프로필 이미지">
                                </c:when>

                                <c:otherwise>
                                    <img src="${pageContext.request.contextPath}/images/clover-logo.png"
                                         alt="기본 프로필 이미지">
                                </c:otherwise>
                            </c:choose>
                        </div>

                        <button type="button"
                                class="edit-info-btn"
                                onclick="location.href='${pageContext.request.contextPath}/mypage/editprofile'">
                            내 정보 수정
                        </button>
                    </div>

                    <div class="text-area">

                        <div class="info-row">
                            <span>닉네임</span>
                            <strong>${not empty summary.nickname ? summary.nickname : '-'}</strong>
                        </div>

                        <div class="info-row">
                            <span>생년월일</span>
                            <strong>
                                ${not empty summary.birthDate ? summary.birthDate : '-'}
                                (${not empty summary.gender ? summary.gender : '-'})
                            </strong>
                        </div>

                        <div class="info-row">
                            <span>이메일</span>
                            <strong>${not empty summary.email ? summary.email : '-'}</strong>
                        </div>

                        <div class="withdraw-container">
                            <a href="#"
                               class="withdraw-link"
                               onclick="openWithdrawModal(); return false;">
                                회원 탈퇴
                            </a>
                        </div>

                    </div>

                </div>
            </div>

            <div class="alert-side">
                <h3 class="card-title-center">입금 계좌</h3>

                <div class="single-account-box">

                    <c:choose>
                        <c:when test="${not empty accounts}">
                            <c:set var="primaryAcc" value="${accounts[0]}"/>

                            <div class="account-info-card">
                                <div class="account-top">
                                    <div class="main-bank-logo">
                                            ${not empty primaryAcc.bankName ? fn:substring(primaryAcc.bankName, 0, 1) : '?'}
                                    </div>

                                    <div class="main-bank-info">
                                        <strong>${primaryAcc.bankName}</strong>
                                        <span>${primaryAcc.accountNumber}</span>
                                    </div>
                                </div>

                                <p class="account-notice">
                                    구독 환불 및 정산 시 사용되는 대표 계좌입니다.
                                </p>

                                <button type="button"
                                        class="change-account-btn"
                                        onclick="openEditAccountModal()">
                                    계좌 변경하기
                                </button>
                            </div>
                        </c:when>

                        <c:otherwise>
                            <p class="no-account">
                                등록된 계좌가 없습니다.
                            </p>

                            <button type="button"
                                    class="add-account-btn"
                                    onclick="openAccountModal()">
                                + 새 계좌 등록하기
                            </button>
                        </c:otherwise>
                    </c:choose>

                </div>
            </div>

        </section>

        <div class="bottom-row">

            <section class="mypost-card">
                <div class="card-header-group">
                    <h2 class="card-title">내 구독</h2>

                    <a href="${pageContext.request.contextPath}/mypage/subscriptions"
                       class="more-link">
                        전체보기 &gt;
                    </a>
                </div>

                <div class="subscription-list">
                    <c:choose>
                        <c:when test="${empty top3Subscriptions}">
                            <div class="empty-card-message">
                                현재 이용 중인 구독 서비스가 없습니다.
                            </div>
                        </c:when>

                        <c:otherwise>
                            <c:forEach var="sub" items="${top3Subscriptions}">
                                <c:set var="serviceTitle" value="${not empty sub.serviceName ? sub.serviceName : '서비스'}"/>
                                <c:set var="serviceLower" value="${fn:toLowerCase(serviceTitle)}"/>

                                <div class="sub-item dashboard-sub-item">

                                    <div class="sub-list-logo dashboard-sub-logo"
                                         data-initial="${fn:substring(serviceTitle, 0, 1)}"
                                         aria-hidden="true">
                                        <c:choose>
                                            <c:when test="${fn:contains(serviceLower, 'youtube') or fn:contains(serviceLower, '유튜브')}">
                                                <img src="${pageContext.request.contextPath}/images/youtube_premium_logo.png"
                                                     alt=""
                                                     onerror="this.parentElement.classList.add('logo-fallback'); this.remove();">
                                            </c:when>

                                            <c:when test="${fn:contains(serviceLower, 'netflix') or fn:contains(serviceLower, '넷플릭스')}">
                                                <img src="${pageContext.request.contextPath}/images/netflix.png"
                                                     alt="넷플릭스"
                                                     onerror="this.parentElement.classList.add('logo-fallback'); this.remove();">
                                            </c:when>

                                            <c:when test="${fn:contains(serviceLower, 'tving') or fn:contains(serviceLower, '티빙')}">
                                                <img src="${pageContext.request.contextPath}/images/tving.png"
                                                     alt=""
                                                     onerror="this.parentElement.classList.add('logo-fallback'); this.remove();">
                                            </c:when>

                                            <c:when test="${fn:contains(serviceLower, 'wavve') or fn:contains(serviceLower, '웨이브')}">
                                                <img src="${pageContext.request.contextPath}/images/wavve.png"
                                                     alt=""
                                                     onerror="this.parentElement.classList.add('logo-fallback'); this.remove();">
                                            </c:when>

                                            <c:when test="${fn:contains(serviceLower, 'watcha') or fn:contains(serviceLower, '왓챠')}">
                                                <img src="${pageContext.request.contextPath}/images/watcha.png"
                                                     alt=""
                                                     onerror="this.parentElement.classList.add('logo-fallback'); this.remove();">
                                            </c:when>

                                            <c:when test="${fn:contains(serviceLower, 'disney') or fn:contains(serviceLower, '디즈니')}">
                                                <img src="${pageContext.request.contextPath}/images/disney_plus.png"
                                                     alt=""
                                                     onerror="this.parentElement.classList.add('logo-fallback'); this.remove();">
                                            </c:when>

                                            <c:when test="${fn:contains(serviceLower, 'claude')}">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Claude_AI_logo.svg/960px-Claude_AI_logo.svg.png"
                                                     alt=""
                                                     onerror="this.parentElement.classList.add('logo-fallback'); this.remove();">
                                            </c:when>

                                            <c:when test="${fn:contains(serviceLower, 'chatgpt') or fn:contains(serviceLower, 'gpt') or fn:contains(serviceLower, 'openai')}">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg"
                                                     alt=""
                                                     onerror="this.parentElement.classList.add('logo-fallback'); this.remove();">
                                            </c:when>

                                            <c:otherwise>
                                                <span>${fn:substring(serviceTitle, 0, 1)}</span>
                                            </c:otherwise>
                                        </c:choose>
                                    </div>

                                    <div class="sub-info">

                                        <c:choose>
                                            <c:when test="${sub.status eq 'ACTIVE' || sub.status eq 'active'}">
                                                <span class="status-badge active">이용중</span>
                                            </c:when>

                                            <c:when test="${sub.status eq 'CANCELLED' || sub.status eq 'cancelled'}">
                                                <span class="status-badge cancelled">해지됨</span>
                                            </c:when>

                                            <c:otherwise>
                                                <span class="status-badge waiting">${sub.status}</span>
                                            </c:otherwise>
                                        </c:choose>

                                        <strong>${sub.serviceName}</strong>

                                        <div class="sub-meta">
                                            <span>
                                                이용 기간:
                                                ${sub.startDate != null ? sub.startDate : '-'}
                                                ~
                                                ${sub.endDate != null ? sub.endDate : '-'}
                                            </span>
                                        </div>

                                    </div>

                                    <div class="sub-price">
                                        <strong>${sub.monthlyFee}원</strong>
                                        <span>/ 월</span>
                                    </div>

                                </div>
                            </c:forEach>
                        </c:otherwise>
                    </c:choose>
                </div>
            </section>

            <section class="card goal-card">
                <div class="card-header-group">
                    <h2 class="card-title">내 개인 소비 목표</h2>

                    <a href="${pageContext.request.contextPath}/dashboard"
                       class="more-link">
                        전체보기 &gt;
                    </a>
                </div>

                <div class="mypage-goal-list">
                    <c:if test="${not empty fixedGoal}">
                        <c:set var="fixedSavedAmount"
                               value="${goalTotals[fixedGoal.id] != null ? goalTotals[fixedGoal.id] : 0}"/>

                        <c:set var="fixedRate"
                               value="${fixedGoal.targetAmount > 0 ? (fixedSavedAmount * 100.0 / fixedGoal.targetAmount) : 0}"/>

                        <c:set var="fixedRateWidth"
                               value="${fixedRate > 100 ? 100 : fixedRate}"/>

                        <div class="mypage-goal-item main-goal">
                            <div class="goal-label-row">
                                <span class="goal-type-badge fixed">고정 목표</span>
                                <span class="goal-percent">
                                    <fmt:formatNumber value="${fixedRate}" pattern="##0.0"/>%
                                </span>
                            </div>

                            <p class="main-goal-title">가장 중요한 목표</p>

                            <p class="goal-name">
                                ${fixedGoal.goalName}
                            </p>

                            <div class="goal-money-row">
                                <span>
                                    ₩<fmt:formatNumber value="${fixedSavedAmount}" pattern="#,##0"/>
                                </span>

                                <span>
                                    / ₩<fmt:formatNumber value="${fixedGoal.targetAmount}" pattern="#,##0"/>
                                </span>
                            </div>

                            <div class="progress-bg">
                                <div class="progress-fill"
                                     style="width: ${fixedRateWidth}%;"></div>
                            </div>
                        </div>
                    </c:if>

                    <c:forEach var="goal" items="${normalGoals}">
                        <c:set var="goalSavedAmount"
                               value="${goalTotals[goal.id] != null ? goalTotals[goal.id] : 0}"/>

                        <c:set var="goalRate"
                               value="${goal.targetAmount > 0 ? (goalSavedAmount * 100.0 / goal.targetAmount) : 0}"/>

                        <c:set var="goalRateWidth"
                               value="${goalRate > 100 ? 100 : goalRate}"/>

                        <div class="mypage-goal-item goal-item">
                            <div class="goal-label-row">
                                <span class="goal-type-badge normal">일반 목표</span>
                                <span class="goal-percent">
                                    <fmt:formatNumber value="${goalRate}" pattern="##0.0"/>%
                                </span>
                            </div>

                            <p class="goal-name">
                                ${goal.goalName}
                            </p>

                            <div class="goal-money-row">
                                <span>
                                    ₩<fmt:formatNumber value="${goalSavedAmount}" pattern="#,##0"/>
                                </span>

                                <span>
                                    / ₩<fmt:formatNumber value="${goal.targetAmount}" pattern="#,##0"/>
                                </span>
                            </div>

                            <div class="progress-bg">
                                <div class="progress-fill"
                                     style="width: ${goalRateWidth}%;"></div>
                            </div>
                        </div>
                    </c:forEach>

                    <c:if test="${empty fixedGoal && empty normalGoals}">
                        <div class="empty-card-message">
                            등록된 소비 목표가 없습니다.
                        </div>
                    </c:if>
                </div>
            </section>

        </div>

    </main>

</div>

<div id="accountModalOverlay" class="modal-overlay account-modal-overlay">
    <div class="modal-content account-modal-content">
        <span class="close-btn" onclick="closeAccountModal()">&times;</span>

        <h2 id="accountModalTitle">새 계좌 등록</h2>

        <form id="accountForm"
              action="${pageContext.request.contextPath}/mypage/accounts"
              method="post"
              onsubmit="return validateAccountForm()">

            <input type="hidden" name="mode" id="mode" value="register">
            <input type="hidden" name="accountId" id="accountId" value="">
            <input type="hidden" name="primary" id="primary" value="true">

            <div id="currentAccountInfo" class="current-account-card" hidden>
                <strong>현재 대표 계좌:</strong>
                <span id="currentAccText"></span>
            </div>

            <div class="form-group">
                <label for="bankName">은행 선택</label>

                <select name="bankName"
                        id="bankName"
                        required
                        onchange="updateAccountHelp()">
                    <option value="">-- 은행을 선택해주세요 --</option>
                    <option value="국민은행">국민은행</option>
                    <option value="신한은행">신한은행</option>
                    <option value="우리은행">우리은행</option>
                    <option value="하나은행">하나은행</option>
                    <option value="농협은행">농협은행</option>
                    <option value="카카오뱅크">카카오뱅크</option>
                    <option value="토스뱅크">토스뱅크</option>
                </select>
            </div>

            <div class="form-group">
                <label for="accountNumber">계좌번호</label>

                <input type="text"
                       name="accountNumber"
                       id="accountNumber"
                       placeholder="숫자만 입력하세요"
                       required
                       oninput="handleAccountInput(this)">

                <div id="accountHelp" class="form-help"></div>
                <div id="accountError" class="error-text"></div>
            </div>

            <button type="submit"
                    id="accountSubmitBtn"
                    class="change-account-btn">
                계좌 등록하기
            </button>
        </form>
    </div>
</div>

<div id="withdrawModalOverlay" class="modal-overlay">
    <div class="modal-content">
        <span class="close-btn" onclick="closeWithdrawModal()">&times;</span>

        <h2>회원 탈퇴</h2>

        <p>
            정말로 탈퇴하시겠습니까?<br>
            회원 탈퇴 시 내 정보는 30일 동안 저장되었다가 삭제됩니다.
        </p>

        <div class="form-group">
            <label for="withdrawPassword">비밀번호 확인</label>

            <input type="password"
                   id="withdrawPassword"
                   placeholder="비밀번호를 입력하세요">
        </div>

        <button type="button"
                class="leave-btn"
                onclick="submitWithdraw()">
            탈퇴하기
        </button>
    </div>
</div>

<div id="cancelModalOverlay" class="cancel-modal-overlay">
    <div class="cancel-modal-content">
        <span class="cancel-close-x" onclick="closeCancelModal()">&times;</span>
        <p>직접 해지 하셔야합니다.</p>
    </div>
</div>

<%@ include file="/WEB-INF/views/common/layout/footer.jspf" %>
<%@ include file="/WEB-INF/views/common/include/scripts.jspf" %>

<script>
    const bankRules = {
        "국민은행": { min: 10, max: 14 },
        "신한은행": { min: 11, max: 12 },
        "우리은행": { min: 13, max: 13 },
        "하나은행": { min: 10, max: 14 },
        "농협은행": { min: 11, max: 13 },
        "카카오뱅크": { min: 13, max: 13 },
        "토스뱅크": { min: 12, max: 12 }
    };

    const bankNameMap = {
        "국민": "국민은행",
        "신한": "신한은행",
        "우리": "우리은행",
        "하나": "하나은행",
        "농협": "농협은행",
        "카카오": "카카오뱅크",
        "토스": "토스뱅크"
    };

    function handleAccountInput(input) {
        const rawValue = input.value;

        for (const key in bankNameMap) {
            if (rawValue.includes(key)) {
                document.getElementById('bankName').value = bankNameMap[key];
                break;
            }
        }

        input.value = rawValue.replace(/[^0-9]/g, '');
        updateAccountHelp();
    }

    function updateAccountHelp() {
        const bankName = document.getElementById('bankName').value;
        const digits = document.getElementById('accountNumber').value;
        const helpEl = document.getElementById('accountHelp');

        if (!bankName) {
            helpEl.textContent = '';
            return;
        }

        const rule = bankRules[bankName];

        if (!rule) {
            helpEl.textContent = '';
            return;
        }

        const range = rule.min === rule.max
            ? rule.min + '자리'
            : rule.min + '~' + rule.max + '자리';

        if (digits.length >= rule.min && digits.length <= rule.max) {
            helpEl.textContent = '올바른 자리수입니다.';
            helpEl.style.color = '#10b981';
        } else {
            helpEl.textContent = bankName + ' 계좌번호는 ' + range + '입니다.';
            helpEl.style.color = '#3b82f6';
        }
    }

    function validateAccountForm() {
        const bankName = document.getElementById('bankName').value;
        const digits = document.getElementById('accountNumber').value;
        const errorEl = document.getElementById('accountError');

        errorEl.textContent = '';

        if (!bankName) {
            errorEl.textContent = '은행을 선택해주세요.';
            return false;
        }

        const rule = bankRules[bankName];

        if (rule && (digits.length < rule.min || digits.length > rule.max)) {
            errorEl.textContent = '계좌번호 자리수가 맞지 않습니다.';
            return false;
        }

        return true;
    }

    function openAccountModal() {
        document.getElementById('accountModalTitle').textContent = '새 계좌 등록';
        document.getElementById('mode').value = 'register';
        document.getElementById('accountId').value = '';
        document.getElementById('currentAccountInfo').hidden = true;
        document.getElementById('accountSubmitBtn').textContent = '계좌 등록하기';

        resetAccountForm();

        document.getElementById('accountModalOverlay').style.display = 'flex';
    }

    function openEditAccountModal() {
        document.getElementById('accountModalTitle').textContent = '계좌 정보 수정';
        document.getElementById('mode').value = 'edit';
        document.getElementById('accountSubmitBtn').textContent = '계좌 수정하기';

        let targetBank = "";
        let targetNum = "";
        let targetId = "";

        <c:if test="${not empty accounts}">
        <c:set var="acc" value="${accounts[0]}"/>
        targetBank = "${acc.bankName}";
        targetNum = "${acc.accountNumber}";
        targetId = "${acc.id}";
        </c:if>

        document.getElementById('currentAccountInfo').hidden = false;
        document.getElementById('currentAccText').textContent = targetBank + " " + targetNum;
        document.getElementById('accountId').value = targetId;

        resetAccountForm();

        document.getElementById('bankName').value = targetBank;
        document.getElementById('accountNumber').value = targetNum;
        updateAccountHelp();

        document.getElementById('accountModalOverlay').style.display = 'flex';
    }

    function closeAccountModal() {
        document.getElementById('accountModalOverlay').style.display = 'none';
    }

    function resetAccountForm() {
        document.getElementById('bankName').value = '';
        document.getElementById('accountNumber').value = '';
        document.getElementById('accountError').textContent = '';
        document.getElementById('accountHelp').textContent = '';
    }

    function openWithdrawModal() {
        document.getElementById('withdrawModalOverlay').style.display = 'flex';
    }

    function closeWithdrawModal() {
        document.getElementById('withdrawModalOverlay').style.display = 'none';
    }

    function openCancelModal() {
        document.getElementById('cancelModalOverlay').style.display = 'flex';
    }

    function closeCancelModal() {
        document.getElementById('cancelModalOverlay').style.display = 'none';
    }

    window.addEventListener('click', function (event) {
        const accountModal = document.getElementById('accountModalOverlay');
        const withdrawModal = document.getElementById('withdrawModalOverlay');
        const cancelModal = document.getElementById('cancelModalOverlay');

        if (event.target === accountModal) {
            closeAccountModal();
        }

        if (event.target === withdrawModal) {
            closeWithdrawModal();
        }

        if (event.target === cancelModal) {
            closeCancelModal();
        }
    });

    function submitWithdraw() {
        const passwordInput = document.getElementById('withdrawPassword');
        const password = passwordInput ? passwordInput.value.trim() : '';

        if (!password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        if (!confirm('정말로 탈퇴를 진행하시겠습니까?')) {
            return;
        }

        const formData = new URLSearchParams();
        formData.append('password', password);

        fetch('${pageContext.request.contextPath}/mypage/withdraw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formData.toString()
        })
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                alert(data.message || '회원 탈퇴 처리가 완료되었습니다.');

                if (data.success) {
                    window.location.href = '${pageContext.request.contextPath}/';
                }
            })
            .catch(function (error) {
                console.error(error);
                alert('서버 통신 중 오류가 발생했습니다.');
            });
    }


</script>

</body>
</html>