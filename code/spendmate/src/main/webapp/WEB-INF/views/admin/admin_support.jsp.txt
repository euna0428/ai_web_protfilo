<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>고객센터 관리 | 지출메이트</title>
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
        <div class="admin-page-head"><div><span class="admin-kicker">SUPPORT CENTER</span><h1>고객센터</h1></div><a class="admin-text-link admin-link" href="${pageContext.request.contextPath}/admin">처음 화면</a></div>
        <nav class="admin-folder-tabs large" aria-label="고객센터 하위 메뉴">
            <a class="admin-mini-folder admin-link" href="${pageContext.request.contextPath}/admin/inquiries"><span class="admin-mini-folder-icon" aria-hidden="true"></span><span>문의 관리</span></a>
            <a class="admin-mini-folder admin-link" href="${pageContext.request.contextPath}/admin/faq"><span class="admin-mini-folder-icon" aria-hidden="true"></span><span>FAQ 관리</span></a>
        </nav>
        <a class="admin-logout admin-link" href="${pageContext.request.contextPath}/logout">로그아웃</a>
    </section>
</main>

<script src="${pageContext.request.contextPath}/js/pages/admin-dashboard.js"></script>
</body>
</html>
