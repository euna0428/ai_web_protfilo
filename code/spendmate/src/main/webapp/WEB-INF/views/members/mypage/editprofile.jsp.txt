<%@ page contentType="text/html; charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<c:set var="menu" value="mypage"/>

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/common/include/head.jspf" %>

    <meta charset="UTF-8">
    <title>지출메이트 - 내 정보 수정</title>

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/mypage.css?v=52">

    <style>
        .profile-edit-page {
            width: 100%;
        }

        .profile-edit-card {
            width: min(100%, 760px);
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #e2e4ea;
            border-radius: 24px;
            padding: 38px 42px;
            box-shadow: 0 8px 24px rgba(17, 24, 39, 0.05);
        }

        .inner-title {
            margin: 0 0 28px;
            color: #111111;
            font-size: 28px;
            font-weight: 900;
            letter-spacing: -0.04em;
            text-align: center;
        }

        .profile-img-area {
            display: flex;
            justify-content: center;
            margin-bottom: 34px;
        }

        .profile-circle {
            position: relative;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: #243864;
            overflow: hidden;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 22px rgba(17, 24, 39, 0.12);
        }

        .profile-circle img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .profile-preview-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .profile-preview-img.is-hidden,
        .profile-preview-img[hidden] {
            display: none !important;
        }

        .profile-avatar-fallback {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #243864;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .profile-avatar-fallback svg {
            width: 72px;
            height: 72px;
            stroke: #ffffff;
        }

        .profile-avatar-fallback[hidden] {
            display: none !important;
        }

        .profile-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.46);
            color: #ffffff;
            font-size: 15px;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .profile-circle:hover .profile-overlay {
            opacity: 1;
        }

        .edit-form {
            display: flex;
            flex-direction: column;
            gap: 26px;
        }

        .form-column {
            display: flex;
            flex-direction: column;
            gap: 18px;
        }

        .form-section {
            padding-top: 24px;
            border-top: 1px solid #eef0f4;
        }

        .input-item {
            display: flex;
            flex-direction: column;
            gap: 9px;
        }

        .input-item label {
            color: #111111;
            font-size: 15px;
            font-weight: 800;
        }

        .input-with-btn {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .current-value-input,
        .form-input,
        .mentor-select {
            width: 100%;
            height: 46px;
            padding: 0 14px;
            border: 1px solid #d7dbe3;
            border-radius: 12px;
            background: #ffffff;
            color: #111111;
            font-size: 15px;
            font-weight: 600;
            outline: none;
            transition: border 0.2s ease, box-shadow 0.2s ease;
        }

        .current-value-input {
            background: #f3f5f8;
            color: #555555;
            cursor: not-allowed;
        }

        .form-input:focus,
        .mentor-select:focus {
            border-color: #243864;
            box-shadow: 0 0 0 3px rgba(36, 56, 100, 0.12);
        }

        .password-container {
            position: relative;
            width: 100%;
        }

        .password-container .form-input {
            padding-right: 48px;
        }

        .toggle-eye {
            position: absolute;
            top: 50%;
            right: 12px;
            width: 34px;
            height: 34px;
            transform: translateY(-50%);
            border: 0;
            border-radius: 10px;
            background: transparent;
            color: #777777;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 0;
            transition: background 0.2s ease, color 0.2s ease;
        }

        .toggle-eye:hover,
        .toggle-eye:focus-visible {
            background: #f1f3f7;
            color: #243864;
            outline: none;
        }

        .toggle-eye svg {
            width: 20px;
            height: 20px;
            stroke: currentColor;
            stroke-width: 2;
            fill: none;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .toggle-eye .eye-closed {
            display: none;
        }

        .toggle-eye.is-visible .eye-open {
            display: none;
        }

        .toggle-eye.is-visible .eye-closed {
            display: block;
        }

        .btn-action-sm,
        .btn-cancel-sm {
            flex: 0 0 auto;
            height: 46px;
            padding: 0 18px;
            border: none;
            border-radius: 12px;
            color: #ffffff;
            font-size: 14px;
            font-weight: 800;
            cursor: pointer;
            white-space: nowrap;
            transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .btn-action-sm {
            background: #243864;
        }

        .btn-cancel-sm {
            background: #9ca3af;
        }

        .btn-action-sm:hover,
        .btn-cancel-sm:hover {
            opacity: 0.92;
            transform: translateY(-1px);
        }

        .mentor-section {
            margin-top: 28px;
            padding-top: 26px;
            border-top: 1px solid #eef0f4;
        }

        .section-title-sm {
            margin: 0 0 18px;
            color: #111111;
            font-size: 20px;
            font-weight: 900;
            letter-spacing: -0.03em;
        }

        .form-btns {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 34px;
        }

        .btn-gray,
        .btn-navy {
            min-width: 130px;
            height: 48px;
            border: none;
            border-radius: 14px;
            font-size: 15px;
            font-weight: 900;
            cursor: pointer;
            transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .btn-gray {
            background: #e5e7eb;
            color: #333333;
        }

        .btn-navy {
            background: #243864;
            color: #ffffff;
        }

        .btn-gray:hover,
        .btn-navy:hover {
            opacity: 0.92;
            transform: translateY(-1px);
        }

        @media (max-width: 768px) {
            .profile-edit-card {
                padding: 28px 22px;
                border-radius: 20px;
            }

            .input-with-btn {
                align-items: stretch;
                flex-direction: column;
            }

            .btn-action-sm,
            .btn-cancel-sm {
                width: 100%;
            }

            .form-btns {
                flex-direction: column;
            }

            .btn-gray,
            .btn-navy {
                width: 100%;
            }
        }
    </style>
</head>

<body class="mypage is-header-ready is-opening-loaded is-fab-ready">

<%@ include file="/WEB-INF/views/common/layout/header.jspf" %>

<div class="mypage-container">

    <aside class="mypage-sidebar">
        <%@ include file="/WEB-INF/views/members/mypage/mypage-sidebar.jspf" %>
    </aside>

    <main class="dashboard profile-edit-page">

        <section class="profile-edit-card">

            <h1 class="inner-title">내 정보 수정</h1>

            <div class="profile-img-area">
                <label for="profileImageInput" class="profile-circle profile-upload">
                    <c:choose>
                        <c:when test="${not empty profileImageUrl}">
                            <img id="profilePreview"
                                 class="profile-preview-img"
                                 src="${pageContext.request.contextPath}${profileImageUrl}"
                                 alt="프로필 이미지"
                                 onerror="handleProfileImageError(this)">

                            <span id="profilePreviewAvatar"
                                  class="profile-avatar-fallback"
                                  hidden
                                  aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                    <path d="M20 21a8 8 0 0 0-16 0"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </span>
                        </c:when>

                        <c:otherwise>
                            <img id="profilePreview"
                                 class="profile-preview-img is-hidden"
                                 src=""
                                 alt="프로필 이미지 미리보기"
                                 hidden>

                            <span id="profilePreviewAvatar"
                                  class="profile-avatar-fallback"
                                  aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                    <path d="M20 21a8 8 0 0 0-16 0"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </span>
                        </c:otherwise>
                    </c:choose>

                    <div class="profile-overlay">사진 변경</div>
                </label>

                <input type="file"
                       id="profileImageInput"
                       accept="image/*"
                       hidden>
            </div>

            <form class="edit-form" id="profileForm">

                <div class="form-column">
                    <div class="input-item">
                        <label>현재 이메일</label>

                        <div class="input-with-btn">
                            <input type="text"
                                   class="current-value-input"
                                   readonly
                                   value="${sessionScope.loginUser.loginId != null ? sessionScope.loginUser.loginId : user.loginId}">

                            <input type="hidden"
                                   id="curEmail"
                                   value="${sessionScope.loginUser.loginId != null ? sessionScope.loginUser.loginId : user.loginId}">

                            <button type="button"
                                    class="btn-action-sm"
                                    onclick="enableEmailEdit()">
                                변경하기
                            </button>
                        </div>
                    </div>

                    <div class="input-item"
                         id="newEmailArea"
                         style="display: none;">
                        <label>새 이메일 주소</label>

                        <div class="input-with-btn">
                            <input type="text"
                                   id="emailId"
                                   class="form-input"
                                   placeholder="example@email.com">

                            <button type="button"
                                    class="btn-cancel-sm"
                                    onclick="cancelEmailEdit()">
                                취소
                            </button>
                        </div>
                    </div>

                    <div class="input-item">
                        <label>현재 닉네임</label>

                        <div class="input-with-btn">
                            <input type="text"
                                   class="current-value-input"
                                   readonly
                                   value="${sessionScope.loginUser.nickname != null ? sessionScope.loginUser.nickname : user.nickname}">

                            <input type="hidden"
                                   id="curNickname"
                                   value="${sessionScope.loginUser.nickname != null ? sessionScope.loginUser.nickname : user.nickname}">

                            <button type="button"
                                    class="btn-action-sm"
                                    onclick="enableNicknameEdit()">
                                변경하기
                            </button>
                        </div>
                    </div>

                    <div class="input-item"
                         id="newNicknameArea"
                         style="display: none;">
                        <label>새 닉네임</label>

                        <div class="input-with-btn">
                            <input type="text"
                                   id="newNickname"
                                   class="form-input"
                                   placeholder="2~5자 이내로 입력하세요">

                            <button type="button"
                                    class="btn-cancel-sm"
                                    onclick="cancelNicknameEdit()">
                                취소
                            </button>
                        </div>
                    </div>
                </div>

                <div class="form-column form-section">
                    <div class="input-item">
                        <label>
                            현재 비밀번호 <span style="color:#ff4d4d;">*</span>
                        </label>

                        <div class="password-container">
                            <input type="password"
                                   id="curPw"
                                   class="form-input"
                                   placeholder="정보 수정을 위해 현재 비밀번호를 입력해주세요">

                            <button type="button"
                                    class="toggle-eye"
                                    aria-label="현재 비밀번호 보기"
                                    onclick="togglePassword('curPw', this)">
                                <svg class="eye-open" viewBox="0 0 24 24">
                                    <path d="M1.5 12s3.8-6.5 10.5-6.5S22.5 12 22.5 12 18.7 18.5 12 18.5 1.5 12 1.5 12Z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <svg class="eye-closed" viewBox="0 0 24 24">
                                    <path d="M3 3l18 18"></path>
                                    <path d="M10.6 10.6a3 3 0 0 0 3.8 3.8"></path>
                                    <path d="M9.9 5.8A9.8 9.8 0 0 1 12 5.5c6.7 0 10.5 6.5 10.5 6.5a18.3 18.3 0 0 1-3.1 3.7"></path>
                                    <path d="M6.2 6.8A18.6 18.6 0 0 0 1.5 12S5.3 18.5 12 18.5a10.4 10.4 0 0 0 4.2-.9"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="input-item">
                        <label>새 비밀번호</label>

                        <div class="password-container">
                            <input type="password"
                                   id="confirmPw"
                                   class="form-input"
                                   placeholder="변경하지 않으려면 비워두세요">

                            <button type="button"
                                    class="toggle-eye"
                                    aria-label="새 비밀번호 보기"
                                    onclick="togglePassword('confirmPw', this)">
                                <svg class="eye-open" viewBox="0 0 24 24">
                                    <path d="M1.5 12s3.8-6.5 10.5-6.5S22.5 12 22.5 12 18.7 18.5 12 18.5 1.5 12 1.5 12Z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <svg class="eye-closed" viewBox="0 0 24 24">
                                    <path d="M3 3l18 18"></path>
                                    <path d="M10.6 10.6a3 3 0 0 0 3.8 3.8"></path>
                                    <path d="M9.9 5.8A9.8 9.8 0 0 1 12 5.5c6.7 0 10.5 6.5 10.5 6.5a18.3 18.3 0 0 1-3.1 3.7"></path>
                                    <path d="M6.2 6.8A18.6 18.6 0 0 0 1.5 12S5.3 18.5 12 18.5a10.4 10.4 0 0 0 4.2-.9"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

            </form>

            <div class="mentor-section">
                <h2 class="section-title-sm">AI 멘토 성향</h2>

                <div class="input-item">
                    <label>AI 멘토 성향 선택</label>

                    <select id="mentorTone" class="mentor-select">
                        <option value="MILD"
                        ${(sessionScope.loginUser.mentorTone == 'MILD' || user.mentorTone == 'MILD') ? 'selected' : ''}>
                            MILD (순한맛)
                        </option>

                        <option value="MEDIUM"
                        ${(sessionScope.loginUser.mentorTone == 'MEDIUM' || user.mentorTone == 'MEDIUM') ? 'selected' : ''}>
                            MEDIUM (중간맛)
                        </option>

                        <option value="HOT"
                        ${(sessionScope.loginUser.mentorTone == 'HOT' || user.mentorTone == 'HOT') ? 'selected' : ''}>
                            HOT (매운맛)
                        </option>
                    </select>
                </div>
            </div>

            <div class="form-btns">
                <button type="button"
                        class="btn-gray"
                        onclick="location.href='${pageContext.request.contextPath}/mypage'">
                    이전으로
                </button>

                <button type="button"
                        class="btn-navy"
                        onclick="saveProfile()">
                    수정 완료
                </button>
            </div>

        </section>

    </main>

</div>

<%@ include file="/WEB-INF/views/common/layout/footer.jspf" %>
<%@ include file="/WEB-INF/views/common/include/scripts.jspf" %>

<script>
    function togglePassword(id, element) {
        const input = document.getElementById(id);

        if (!input) {
            return;
        }

        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";

        element.classList.toggle('is-visible', isHidden);
        element.setAttribute(
            'aria-label',
            isHidden ? '비밀번호 숨기기' : '비밀번호 보기'
        );
    }

    function handleProfileImageError(img) {
        const avatar = document.getElementById('profilePreviewAvatar');

        img.hidden = true;
        img.classList.add('is-hidden');

        if (avatar) {
            avatar.hidden = false;
        }
    }

    function enableEmailEdit() {
        document.getElementById('newEmailArea').style.display = 'flex';
        document.getElementById('emailId').focus();
    }

    function cancelEmailEdit() {
        document.getElementById('newEmailArea').style.display = 'none';
        document.getElementById('emailId').value = "";
    }

    function enableNicknameEdit() {
        document.getElementById('newNicknameArea').style.display = 'flex';
        document.getElementById('newNickname').focus();
    }

    function cancelNicknameEdit() {
        document.getElementById('newNicknameArea').style.display = 'none';
        document.getElementById('newNickname').value = "";
    }

    function saveProfile() {
        const curEmail = document.getElementById('curEmail').value.trim();
        const curNickname = document.getElementById('curNickname').value.trim();
        const curPw = document.getElementById('curPw').value.trim();

        const emailId = document.getElementById('emailId').value.trim();
        const newNickname = document.getElementById('newNickname').value.trim();
        const confirmPw = document.getElementById('confirmPw').value.trim();
        const mentorTone = document.getElementById('mentorTone').value;

        let finalNewEmail = null;

        if (emailId !== "") {
            finalNewEmail = emailId;
        }

        let finalNickname = curNickname;

        if (newNickname !== "") {
            if (newNickname.length < 2 || newNickname.length > 5) {
                alert("닉네임은 2~5자여야 합니다.");
                return;
            }

            finalNickname = newNickname;
        }

        if (curPw === "") {
            alert("정보 수정을 위해 현재 비밀번호를 입력해주세요.");
            return;
        }

        const requestData = {
            loginId: curEmail,
            newEmail: finalNewEmail,
            nickname: finalNickname,
            currentPassword: curPw,
            newPassword: confirmPw === "" ? null : confirmPw,
            confirmPassword: confirmPw === "" ? null : confirmPw,
            mentorTone: mentorTone
        };

        const formData = new FormData();

        formData.append(
            'userRequest',
            new Blob([JSON.stringify(requestData)], { type: "application/json" })
        );

        const fileInput = document.getElementById('profileImageInput');

        if (fileInput.files.length > 0) {
            formData.append('profileImage', fileInput.files[0]);
        }

        fetch('${pageContext.request.contextPath}/user/updateProfile', {
            method: 'POST',
            body: formData
        })
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                if (data.success) {
                    alert("정보가 수정되었습니다.");
                    location.href = '${pageContext.request.contextPath}/mypage';
                } else {
                    alert(data.message || "수정에 실패했습니다.");
                }
            })
            .catch(function (err) {
                console.error(err);
                alert("서버 연결 실패");
            });
    }

    document.getElementById('profileImageInput').addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = function (loadEvent) {
            const preview = document.getElementById('profilePreview');
            const avatar = document.getElementById('profilePreviewAvatar');

            preview.src = loadEvent.target.result;
            preview.hidden = false;
            preview.classList.remove('is-hidden');

            if (avatar) {
                avatar.hidden = true;
            }
        };

        reader.readAsDataURL(file);
    });

    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const sidebar = document.querySelector('nav.sidebar');

    if (hamburgerBtn && sidebar) {
        hamburgerBtn.addEventListener('click', function () {
            sidebar.classList.toggle('open');
        });
    }
</script>

</body>
</html>