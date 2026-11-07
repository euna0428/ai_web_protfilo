<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>이메일 알림 로그 | 지출메이트</title>
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
        <div class="admin-page-head"><div><span class="admin-kicker">EMAIL NOTIFICATION</span><h1>이메일 알림 로그</h1></div><a class="admin-text-link admin-link" href="${pageContext.request.contextPath}/admin">처음 화면</a></div>
        <div class="admin-card"><div class="admin-card-head"><h2>알림 로그 목록</h2><span class="admin-card-sub">NOTIFICATION_LOGS 기준</span></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>로그 ID</th><th>회원 ID</th><th>알림 종류</th><th>알림 내용</th><th>성공 여부</th><th>실패 사유</th><th>발송 일시</th><th>관리</th></tr></thead><tbody>
            <tr><td>1</td><td>2</td><td>PAYMENT</td><td>구독 결제일 안내</td><td><span class="admin-badge badge-green">Y</span></td><td>-</td><td>2026-06-02 09:00</td><td><a class="admin-btn admin-link" href="${pageContext.request.contextPath}/admin/notifications/detail?logId=1">상세</a></td></tr>
            <tr><td>2</td><td>3</td><td>ACCOUNT</td><td>계정 상태 변경 안내</td><td><span class="admin-badge badge-red">N</span></td><td>SMTP_TIMEOUT</td><td>2026-06-02 09:10</td><td><a class="admin-btn admin-link" href="${pageContext.request.contextPath}/admin/notifications/detail?logId=2">상세</a></td></tr>
        </tbody></table></div></div>
        <a class="admin-logout admin-link" href="${pageContext.request.contextPath}/logout">로그아웃</a>
    </section>
</main>

<script src="${pageContext.request.contextPath}/js/pages/admin-dashboard.js"></script>
</body>
</html>
