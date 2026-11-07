<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>약관 등록 수정 | 지출메이트</title>
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
                <span class="admin-kicker">TERMS FORM</span>
                <h1>약관 등록 / 수정</h1>
            </div>
            <a class="admin-text-link admin-link" href="${pageContext.request.contextPath}/admin/terms">약관 목록</a>
        </div>

        <form class="admin-card admin-form wide" id="terms-form">
            <label>
                <span>약관 유형</span>
                <input type="text" name="termType" id="term-type" readonly required>
            </label>
            <label>
                <span>버전</span>
                <input type="text" name="version" id="term-version" required>
            </label>
            <label>
                <span>필수 여부</span>
                <select name="isRequired" id="term-required">
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                </select>
            </label>
            <label>
                <span>적용일</span>
                <input type="date" name="applyDate" id="term-apply-date" required>
            </label>
            <label class="full-field">
                <span>약관 내용</span>
                <textarea name="content" id="term-content" rows="12" required></textarea>
            </label>
            <div class="admin-bottom-actions form-actions">
                <a class="admin-btn ghost admin-link" href="${pageContext.request.contextPath}/admin/terms">취소</a>
                <button class="admin-btn" type="submit">저장</button>
            </div>
        </form>
    </section>
</main>
<script src="${pageContext.request.contextPath}/js/pages/admin-terms.js"></script>
<script src="${pageContext.request.contextPath}/js/pages/admin-dashboard.js"></script>
</body>
</html>