<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/common/include/head.jspf" %>
    <meta charset="UTF-8">
    <title>결제 완료</title>

    <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/subscription.css">

    <style>
        body {
            font-family: Pretendard, sans-serif;
            background: #f8fafc;
            margin: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }


        .success-page {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 120px 20px 80px;
            box-sizing: border-box;
        }

        .success-box {
            width: 600px;
            max-width: 100%;
            background: white;
            padding: 60px 40px;
            text-align: center;
            border-radius: 24px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            box-sizing: border-box;
        }

        .success-box h1 {
            color: #111111;
            font-size: 28px;
            font-weight: 900;
            margin-bottom: 16px;
            letter-spacing: -0.03em;
        }

        .success-box p {
            color: #6b7280;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 40px;
        }

        .success-btn {
            width: 180px;
            height: 52px;
            border: none;
            border-radius: 14px;
            background: #243864; /* 사이트 메인 남색으로 통일 */
            color: white;
            cursor: pointer;
            font-size: 16px;
            font-weight: 800;
            transition: opacity 0.2s, transform 0.2s;
        }

        .success-btn:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }
    </style>
</head>


<body class="is-header-ready is-opening-loaded is-fab-ready">

<%@ include file="/WEB-INF/views/common/layout/header.jspf" %>

<main class="success-page">
    <div class="success-box">
        <!-- 체크 아이콘 추가 (디자인 포인트) -->
        <i class="bi bi-check-circle-fill" style="font-size: 64px; color: #1f9d55; margin-bottom: 20px; display: inline-block;"></i>
        <h1>결제가 완료되었습니다.</h1>
        <p>구독 서비스가 정상적으로 등록되었습니다.</p>

        <button class="success-btn"
                onclick="location.href='${pageContext.request.contextPath}/subscription/ott'">
            확인
        </button>
    </div>
</main>

<%@ include file="/WEB-INF/views/common/layout/footer.jspf" %>
<%@ include file="/WEB-INF/views/common/layout/floatingBtn.jspf" %>


<%@ include file="/WEB-INF/views/common/include/scripts.jspf" %>
<script src="${pageContext.request.contextPath}/js/nav-wave.js"></script>

</body>
</html>