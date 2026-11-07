<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>회원 상태 처리 | 지출메이트</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin-theme.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin-components.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin-console.css">
</head>
<body class="admin-body">
<header class="admin-topbar">
    <a class="admin-brand" href="${pageContext.request.contextPath}/admin">지출메이트</a>
</header>

<main class="admin-page admin-enter">
    <section class="admin-panel compact">
        <div class="admin-page-head">
            <div>
                <span class="admin-kicker">ACCOUNT STATUS</span>
                <h1>회원 정지 / 탈퇴 처리</h1>
            </div>
            <a class="admin-text-link admin-link" href="${pageContext.request.contextPath}/admin/users">회원 목록</a>
        </div>
        <div class="admin-split">
            <article class="admin-card">
                <div class="admin-card-head">
                    <h2>대상 회원</h2>
                </div>
                <dl class="admin-detail-grid one-column">
                    <div>회원 ID: <span id="display-userId"></span></div>
                    <div>로그인 ID: <span id="display-loginId"></span></div>
                    <div>닉네임: <span id="display-nickname"></span></div>
                    <div>현재 상태: <span id="display-status"></span></div>
                </dl>
            </article>
            <form class="admin-card admin-form">
                <div class="admin-card-head">
                    <h2>상태 변경</h2>
                </div>
                <input type="hidden" name="userId" id="hidden-userId">
                <label>
                    <span>변경 상태</span>
                    <select name="accountStatus" id="status-select">
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                        <option value="WITHDRAWN">WITHDRAWN</option>
                    </select>
                </label>
                <button type="submit" class="admin-btn full">상태 저장</button>
            </form>
        </div>
    </section>
</main>

<script src="${pageContext.request.contextPath}/js/pages/admin-dashboard.js"></script>
<script src="${pageContext.request.contextPath}/js/pages/admin_user_status.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        // 1. URL에서 userId 파라미터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');

        if (!userId) {
            alert('회원 정보가 없습니다.');
            return;
        }

        // 2. 회원 정보 불러오기 (API 호출)
        fetch(`/api/admin/users/\${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    const user = data.user;
                    // 정보 채우기
                    document.getElementById('display-userId').innerText = user.userId;
                    document.getElementById('display-loginId').innerText = user.loginId;
                    document.getElementById('display-nickname').innerText = user.nickname;
                    document.getElementById('display-status').innerText = user.accountStatus;

                    // hidden input 및 select 초기값 설정
                    document.getElementById('hidden-userId').value = user.userId;
                    document.getElementById('status-select').value = user.accountStatus;
                }
            });

        // 3. 폼 제출 처리
        const form = document.querySelector('.admin-form');
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const status = document.getElementById('status-select').value;

            fetch(`/api/admin/users/\${userId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: status })
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    alert('상태가 변경되었습니다.');
                    window.location.href = '${pageContext.request.contextPath}/admin/users';
                } else {
                    alert(data.message);
                }
            });
        });
    });
</script>
</body>
</html>