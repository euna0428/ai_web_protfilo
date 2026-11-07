<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>회원 관리 | 지출메이트</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin-theme.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin-components.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin-console.css">
</head>
<body class="admin-body">
<header class="admin-topbar">
    <a class="admin-brand" href="${pageContext.request.contextPath}/admin">지출메이트</a>
</header>

<main class="admin-page admin-enter">
    <section class="admin-panel">
        <div class="admin-page-head">
            <div>
                <span class="admin-kicker">USER MANAGEMENT</span>
                <h1>회원 관리</h1>
            </div>
            <a class="admin-text-link admin-link" href="${pageContext.request.contextPath}/admin">처음 화면</a>
        </div>

        <nav class="admin-folder-tabs" aria-label="회원 관리 하위 메뉴">
            <a class="admin-mini-folder is-active admin-link" href="${pageContext.request.contextPath}/admin/users">
                <span class="admin-mini-folder-icon" aria-hidden="true"></span>
                <span>회원 관리</span>
            </a>
            <a class="admin-mini-folder admin-link" href="${pageContext.request.contextPath}/admin/audit">
                <span class="admin-mini-folder-icon" aria-hidden="true"></span>
                <span>활동 로그 조회</span>
            </a>
        </nav>

        <div class="admin-card">
            <div class="admin-card-head">
                <h2>회원 목록</h2>
                <span class="admin-card-sub">USERS 테이블 기준 정보</span>
            </div>
            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>회원 ID</th>
                            <th>로그인 ID</th>
                            <th>닉네임</th>
                            <th>권한</th>
                            <th>계정 상태</th>
                            <th>알림 수신</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody id="user-table-body">
                        </tbody>
                </table>
            </div>
        </div>

        <a class="admin-logout admin-link" href="${pageContext.request.contextPath}/logout">로그아웃</a>
    </section>
</main>

<script src="${pageContext.request.contextPath}/js/pages/admin-dashboard.js"></script>
<script src="${pageContext.request.contextPath}/js/pages/admin-users.js"></script>
</body>
</html>
