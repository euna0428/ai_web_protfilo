<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>

<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>블랙리스트 지정 | PlanTrip</title>
<link rel="stylesheet" href="/css/home.css">

<style>
:root{
  --admin-bg:#fff; --admin-text:#111; --admin-muted:rgba(17,17,17,.70);
  --admin-border:rgba(0,0,0,.12); --admin-hover:rgba(0,0,0,.04);
}
.admin-wrap{max-width:1200px;margin:0 auto;padding:30px;display:grid;grid-template-columns:240px 1fr;gap:20px;}
.admin-side,.admin-main{background:var(--admin-bg)!important;color:var(--admin-text)!important;border:1px solid var(--admin-border)!important;border-radius:14px;}
.admin-side{padding:18px;} .admin-main{padding:22px;}
.admin-link{display:block;padding:12px;border-radius:10px;margin-bottom:10px;text-decoration:none;background:#fff!important;color:var(--admin-text)!important;border:1px solid var(--admin-border)!important;}
.admin-link:hover{background:var(--admin-hover)!important;}
.hr-admin{border:0;border-top:1px solid var(--admin-border);margin:14px 0;}
.header.is-solid{background:#fff!important;border-bottom:1px solid rgba(0,0,0,.10);}
.header.is-solid .nav a,.header.is-solid .header-right,.header.is-solid .header-auth{color:#111!important;}

.table{width:100%;border-collapse:collapse;font-size:14px;}
.table th,.table td{padding:10px 6px;text-align:left;vertical-align:middle;}
.table thead tr{border-bottom:1px solid #e5e7eb;}
.table tbody tr{border-top:1px solid #f1f5f9;}

.badge{display:inline-block;padding:4px 10px;border-radius:999px;border:1px solid #e5e7eb;font-size:12px;color:#111;}
.badge.danger{border-color:#ef4444;color:#ef4444;}
.badge.ok{border-color:#10b981;color:#10b981;}

.search-row{display:flex;gap:8px;margin:12px 0 16px;align-items:center;}
.search-row input, .search-row select{padding:10px;border:1px solid #e5e7eb;border-radius:10px;}
.search-row input{flex:1;}
.search-row button{padding:10px 14px;border:1px solid #e5e7eb;border-radius:10px;background:#fff;cursor:pointer;white-space:nowrap;}
.search-row button:hover{background:var(--admin-hover);}

.card{border:1px solid var(--admin-border);border-radius:14px;padding:14px;margin:12px 0;background:#fff;}
.card-title{font-weight:700;margin:0 0 10px;}
.inline-form{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
.inline-form input{padding:10px;border:1px solid #e5e7eb;border-radius:10px;}
.inline-form .w160{width:160px;}
.inline-form .w260{width:260px;}
.btn-danger{border:1px solid #ef4444!important;}
</style>
</head>

<body>
<header class="header is-solid">
  <div class="container header-inner">
    <a href="/" class="brand-top" title="메인으로">
      <img class="brand-logo-img" src="/img/PlanTriplog.png" alt="PlanTrip">
    </a>

    <nav class="nav">
      <a href="/">메인</a>
      <a href="/admin">관리자</a>
      <a href="/admin/blacklist" style="font-weight:700;">블랙리스트</a>
    </nav>

    <div class="header-right">
      <div>${sessionScope.loginMember.MName} (ADMIN)</div>
      <form action="/members/logout" method="post" style="margin:0;">
        <button class="header-auth" type="submit">로그아웃</button>
      </form>
    </div>
  </div>
</header>

<main class="admin-wrap">
  <aside class="admin-side">
    <h3>관리자 메뉴</h3>
    <a class="admin-link" href="/admin">🏠 대시보드</a>
    <a class="admin-link" href="/admin/members">👥 회원 관리</a>
    <a class="admin-link" href="/admin/notices">📢 공지사항</a>
    <a class="admin-link" href="/admin/faqs">❓ FAQ</a>
    <a class="admin-link" href="/admin/inquiries">✉ 문의 관리</a>
    <hr class="hr-admin">
    <a class="admin-link" href="/">← 사용자 페이지</a>
  </aside>

  <section class="admin-main">
    <h2>블랙리스트 지정</h2>
    <p style="color:var(--admin-muted);margin:0 0 10px;">
      회원을 블랙리스트에 등록/해제합니다. (등록된 회원은 회원관리 페이지에서 이름 앞에 BlackList 표시)
    </p>

    <!-- 1) 등록 폼(기능은 나중에 연결) -->
    <div class="card">
      <div class="card-title">블랙리스트 등록</div>

      <form class="inline-form" method="post" action="/admin/blacklist/add">
        <!-- 기능 붙일 때 CSRF 넣기 -->
        <!-- <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" /> -->

        <select name="type">
          <option value="id">아이디</option>
          <option value="email">이메일</option>
          <option value="idx">회원번호</option>
        </select>

        <input class="w260" type="text" name="keyword" placeholder="예) hong123 / test@email.com / 15" />
        <input class="w260" type="text" name="reason" placeholder="사유(선택) 예) 도배, 악성활동" />
        <button class="btn-danger" type="submit">등록</button>
      </form>

      <div style="margin-top:8px;color:var(--admin-muted);font-size:13px;">
        ※ 지금은 화면만 구성된 상태이며, 실제 등록/해제 처리는 추후 연결합니다.
      </div>
    </div>

    <!-- 2) 검색/필터 -->
    <form class="search-row" method="get" action="/admin/blacklist">
      <input type="text" name="kw" value="${kw}" placeholder="블랙리스트 검색 (아이디/이름/이메일/사유)" />
      <button type="submit">검색</button>
    </form>

    <!-- 3) 블랙리스트 목록(더미 데이터로 화면만) -->
    <div style="margin:0 0 10px;color:var(--admin-muted);">
      <span class="badge">총 ${blacklist.size()}건</span>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>회원번호</th>
          <th>아이디</th>
          <th>이름</th>
          <th>이메일</th>
          <th>사유</th>
          <th>등록일</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        <c:forEach var="b" items="${blacklist}">
          <tr>
            <td>${b.MIdx}</td>
            <td>${b.MId}</td>
            <td><span class="badge danger" style="margin-right:6px;">BlackList</span>${b.MName}</td>
            <td>${b.MEmail}</td>
            <td>${b.reason}</td>
            <td>${b.blacklistedAt}</td>
            <td>
              <form method="post" action="/admin/blacklist/remove" style="margin:0;display:inline;">
                <!-- <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" /> -->
                <input type="hidden" name="mIdx" value="${b.MIdx}" />
                <button type="submit">해제</button>
              </form>
            </td>
          </tr>
        </c:forEach>

        <c:if test="${empty blacklist}">
          <tr>
            <td colspan="7" style="padding:14px;color:#6b7280;">등록된 블랙리스트가 없습니다.</td>
          </tr>
        </c:if>
      </tbody>
    </table>

  </section>
</main>

</body>
</html>
