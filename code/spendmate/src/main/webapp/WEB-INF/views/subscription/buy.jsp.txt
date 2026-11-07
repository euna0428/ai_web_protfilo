<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>구독 구매</title>

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

        .buy-page {
            min-height: calc(100vh - 220px);
            padding: 120px 20px 80px;
            box-sizing: border-box;
        }

        .buy-box {
            width: 640px;
            max-width: 100%;
            margin: 0 auto;
            padding: 40px;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.12);
            box-sizing: border-box;
        }

        .buy-box h2 {
            margin: 0 0 30px;
            color: #1e2b50;
            text-align: center;
        }

        .form-row {
            margin-bottom: 20px;
        }

        .form-row label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 600;
        }

        .form-row input,
        .form-row select {
            width: 100%;
            height: 46px;
            padding: 0 14px;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-sizing: border-box;
            font-size: 15px;
        }

        .submit-btn {
            width: 100%;
            height: 50px;
            margin-top: 10px;
            border: none;
            border-radius: 10px;
            background: #1e2b50;
            color: #ffffff;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
        }

        .submit-btn:hover {
            background: #15203d;
        }
    </style>

    <script>
        function calculateTotal() {
            const monthlyFee = Number(document.getElementById("monthlyFee").value || 0);
            const periodMonths = Number(document.getElementById("periodMonths").value || 0);
            const total = monthlyFee * periodMonths;

            document.getElementById("totalAmount").value = total;
        }
    </script>
</head>

<body>

<%@ include file="/WEB-INF/views/common/layout/header.jspf" %>

<main class="buy-page">
    <section class="buy-box">
        <h2>OTT 구독 구매</h2>

        <form action="${pageContext.request.contextPath}/subscription/ott" method="post">

            <div class="form-row">
                <label for="partyId">OTT 서비스 ID</label>
                <input type="number"
                       id="partyId"
                       name="partyId"
                       required>
            </div>

            <div class="form-row">
                <label for="monthlyFee">월 결제 금액</label>
                <input type="number"
                       id="monthlyFee"
                       name="monthlyFee"
                       onkeyup="calculateTotal()"
                       required>
            </div>

            <div class="form-row">
                <label for="periodMonths">구독 개월 수</label>
                <select id="periodMonths"
                        name="periodMonths"
                        onchange="calculateTotal()">
                    <option value="1">1개월</option>
                    <option value="3">3개월</option>
                    <option value="6">6개월</option>
                </select>
            </div>

            <div class="form-row">
                <label for="totalAmount">총 결제 금액</label>
                <input type="number"
                       id="totalAmount"
                       readonly>
            </div>

            <button type="submit" class="submit-btn">
                구독 등록
            </button>
        </form>
    </section>
</main>

<%@ include file="/WEB-INF/views/common/layout/footer.jspf" %>
<%@ include file="/WEB-INF/views/common/layout/floatingBtn.jspf" %>

<script src="${pageContext.request.contextPath}/js/nav-wave.js"></script>

</body>
</html>