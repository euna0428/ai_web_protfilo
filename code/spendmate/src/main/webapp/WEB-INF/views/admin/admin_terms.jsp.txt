<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>약관 관리 | 지출메이트</title>
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
                <span class="admin-kicker">TERMS MANAGEMENT</span>
                <h1>약관 관리</h1>
            </div>
            <a class="admin-text-link admin-link" href="${pageContext.request.contextPath}/admin">처음 화면</a>
        </div>
        <nav class="admin-folder-tabs" aria-label="약관 관리 하위 메뉴">
            <a class="admin-mini-folder is-active admin-link" href="${pageContext.request.contextPath}/admin/terms">
                <span class="admin-mini-folder-icon" aria-hidden="true"></span>
                <span>약관 목록</span>
            </a>
            <a class="admin-mini-folder admin-link" href="${pageContext.request.contextPath}/admin/terms/form">
                <span class="admin-mini-folder-icon" aria-hidden="true"></span>
                <span>약관 등록 / 수정</span>
            </a>
        </nav>
        <div class="admin-card">
            <div class="admin-card-head">
                <h2>약관 목록</h2>
                <a class="admin-btn admin-link" href="${pageContext.request.contextPath}/admin/terms/form">신규 등록</a>
            </div>
            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead>
                    <tr>
                        <th>약관 ID</th>
                        <th>약관 유형</th>
                        <th>버전</th>
                        <th>필수 여부</th>
                        <th>적용일</th>
                        <th>작성일</th>
                        <th>수정일</th>
                        <th>관리</th>
                    </tr>
                    </thead>
                    <tbody id="terms-table-body">
                    </tbody>
                </table>
            </div>
        </div>
        <a class="admin-logout admin-link" href="${pageContext.request.contextPath}/logout">로그아웃</a>
    </section>
</main>
<script src="${pageContext.request.contextPath}/js/pages/admin-terms.js"></script>

<script src="${pageContext.request.contextPath}/js/pages/admin-dashboard.js"></script>
</body>
</html>
