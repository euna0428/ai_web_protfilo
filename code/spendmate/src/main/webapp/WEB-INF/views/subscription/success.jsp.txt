<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>구독 완료</title>

    <link rel="stylesheet"
          as="style"
          crossorigin
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">

    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/subscription.css">

    <style>
        body {
            margin: 0;
            font-family: Pretendard, sans-serif;
            background: #f5f5f5;
        }

        .complete-page {
            min-height: calc(100vh - 220px);
            padding: 120px 20px 80px;
            box-sizing: border-box;
        }

        .complete-box {
            width: 640px;
            max-width: 100%;
            margin: 0 auto;
            padding: 50px;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.12);
            text-align: center;
            box-sizing: border-box;
        }

        .complete-box h2 {
            color: #1e2b50;
            margin-bottom: 16px;
        }

        .complete-box p {
            color: #555;
            margin-bottom: 30px;
        }

        .complete-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 180px;
            height: 48px;
            border-radius: 10px;
            background: #1e2b50;
            color: #ffffff;
            text-decoration: none;
            font-weight: 600;
        }

        .complete-link:hover {
            background: #15203d;
        }
    </style>
</head>

<body>

<%@ include file="/WEB-INF/views/common/layout/header.jspf" %>

<main class="complete-page">
    <section class="complete-box">
        <h2>구독 결제가 완료되었습니다.</h2>
        <p>OTT 구독이 정상적으로 저장되었습니다.</p>

        <a class="complete-link"
           href="${pageContext.request.contextPath}/subscription/ott">
            다시 구매하기
        </a>
    </section>
</main>

<%@ include file="/WEB-INF/views/common/layout/footer.jspf" %>
<%@ include file="/WEB-INF/views/common/layout/floatingBtn.jspf" %>

<script src="${pageContext.request.contextPath}/js/nav-wave.js"></script>

</body>
</html>