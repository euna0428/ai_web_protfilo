<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>관리자 | 지출메이트</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin-theme.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin-components.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin-console.css">
</head>
<body class="admin-body" data-context-path="${pageContext.request.contextPath}">
<header class="admin-topbar">
    <a class="admin-brand" href="${pageContext.request.contextPath}/" aria-label="지출메이트 메인으로 이동">지출메이트</a>
</header>

<main id="adminRoot" class="admin-main-board admin-dashboard-shell admin-enter">
    <section id="adminDashboardBoard" class="admin-folder-board admin-dashboard-board" aria-label="관리자 기능 선택">
        <button class="admin-folder-card" type="button" data-page="users" aria-label="회원 관리 열기">
            <span class="admin-folder-icon" aria-hidden="true"></span>
            <span class="admin-folder-title">회원 관리</span>
        </button>

        <button class="admin-folder-card" type="button" data-page="terms" aria-label="약관 관리 열기">
            <span class="admin-folder-icon" aria-hidden="true"></span>
            <span class="admin-folder-title">약관 관리</span>
        </button>

        <button class="admin-folder-card" type="button" data-page="ott" aria-label="OTT 관리 열기">
            <span class="admin-folder-icon" aria-hidden="true"></span>
            <span class="admin-folder-title">OTT 관리</span>
        </button>

        <button class="admin-folder-card" type="button" data-page="support" aria-label="고객센터 열기">
            <span class="admin-folder-icon" aria-hidden="true"></span>
            <span class="admin-folder-title">고객센터</span>
        </button>

        <button class="admin-folder-card" type="button" data-page="notification" aria-label="이메일 알림 열기">
            <span class="admin-folder-icon" aria-hidden="true"></span>
            <span class="admin-folder-title">이메일 알림</span>
        </button>

        <button id="adminLogoutButton" class="admin-folder-logout" type="button">로그아웃</button>
    </section>

    <section id="adminWorkspace" class="admin-workspace admin-workspace-page" aria-live="polite" hidden>
        <div class="admin-workspace-toolbar">
            <div>
                <h2 id="adminWorkspaceTitle">회원 관리</h2>
            </div>
            <button id="adminCloseWorkspace" class="admin-text-link" type="button">대시보드만 보기</button>
        </div>

        <nav id="adminOpenTabs" class="admin-open-tabs" aria-label="관리자 카테고리"></nav>

        <section id="adminContentPanel" class="admin-content-panel"></section>
    </section>
</main>

<script src="${pageContext.request.contextPath}/js/pages/admin-dashboard.js"></script>
</body>
</html>
