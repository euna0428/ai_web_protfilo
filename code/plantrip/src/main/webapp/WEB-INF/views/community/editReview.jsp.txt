<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>
<!doctype html>
<html lang="ko">
	<head>
	  <meta charset="UTF-8"/>
	  <meta name="viewport" content="width=device-width, initial-scale=1"/>
	  <title>여행 후기</title>

	  
    <link rel="stylesheet" href="/css/header.css" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/community.css">
<link rel="stylesheet" href="/css/redesign.css" />
	  <!-- Trip.com 스타일 참고한 후기 상세 전용 -->
	  <link rel="stylesheet" href="/css/community-review-view.css" />

	  <link rel="stylesheet" href="/css/ui-toast.css" />

	  <script defer src="/js/ui-toast.js"></script>
	  <script defer src="/js/theme.js"></script>
	    <script defer src="/js/nav-wave.js"></script>

  <style>
    /* ✅ 헤더(고정) + 로고 돌출 높이만큼 콘텐츠를 아래로 내림 (이 JSP 전용) */
    body{ padding-top: 0 !important; }
    .cm-shell{
      margin-top: calc(var(--headerH, 72px) + var(--logoOffset, 35px) - 20px) !important;
    }
  </style>
</head>
<body class="page-solid">


    <jsp:include page="/WEB-INF/views/common/header.jsp" />
<div class="cm-shell">
<main class="cm-main">
    <section class="mp-card">
      <div class="mp-card-head">
        <div>
          <div class="mp-card-title">후기 수정</div>
          <div class="mp-card-sub">제목, 내용, 별점을 변경할 수 있어요</div>
        </div>
      </div>

      <div class="mp-card-body">

        <!-- =========================
             ✅ 수정 폼 (중첩 form 금지!)
             제목/내용/별점만 담당
        ========================= -->
        <form id="cmEditForm" class="cm-form"
              action="${pageContext.request.contextPath}/community/edit"
              method="post">

          <input type="hidden" name="rvIdx" value="${review.rvIdx}"/>

          <div class="cm-field">
            <label>후기 제목</label>
            <input type="text" name="rvTitle" value="${review.rvTitle}" required/>
          </div>

          <div class="cm-field">
            <label>후기 내용</label>
            <textarea name="rvCont" required>${review.rvCont}</textarea>
          </div>

          <!-- ✅ 별점 (rvStar 파라미터 누락 시 400 발생) -->
          <div class="cm-field">
            <label>별점</label>
            <c:set var="star" value="${empty review.rvStar ? 5 : review.rvStar}" />
            <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
              <div style="display:inline-flex; gap:6px;">
                <c:forEach var="i" begin="1" end="5">
                  <label style="display:inline-flex; align-items:center; gap:6px; cursor:pointer; user-select:none;">
                    <input type="radio" name="rvStar" value="${i}" ${i == star ? 'checked' : ''} />
                    <span>★ ${i}</span>
                  </label>
                </c:forEach>
              </div>
              <span style="font-size:12px; opacity:.75;">(수정 저장/사진 추가 시 rvStar가 같이 넘어가야 해요)</span>
            </div>
          </div>

        </form>
        <!-- ✅ 수정 폼 끝 -->

        <!-- =========================
             ✅ 사진 첨부/관리 (수정 폼 밖으로 이동)
             - 기존 사진: ${photos}
             - 추가 업로드: /reviewphoto/upload
             - 삭제: /reviewphoto/delete
        ========================= -->
        <section class="cm-photo" style="margin-top:18px;">
          <h3 style="margin:0 0 10px; font-size:16px;">사진</h3>

          <c:if test="${not empty photos}">
            <div class="cm-photo-grid" style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
              <c:forEach var="p" items="${photos}">
				<div class="cm-photo-item" style="position:relative; width:120px; height:90px; border-radius:12px; overflow:hidden; background:#f3f4f6;">
					<img
					  src="${pageContext.request.contextPath}/uploads/reviews/${p.rpStoredName}"
					  alt="후기 사진"
					  style="width:100%; height:100%; object-fit:cover;"
					  onerror="this.closest('.cm-photo-item').remove();"
					/>

                  <!-- ✅ 사진 삭제 폼 (단독 form) -->
                  <form method="post"
                        action="${pageContext.request.contextPath}/review-photos/delete"
                        style="position:absolute; top:6px; right:6px;">
                    <input type="hidden" name="rpIdx" value="${p.rpIdx}" />
                    <input type="hidden" name="rvIdx" value="${review.rvIdx}" />
                    <button type="submit"
                            style="border:0; cursor:pointer; padding:4px 8px; border-radius:999px; background:rgba(0,0,0,.55); color:#fff; font-size:12px;">
                      삭제
                    </button>
                  </form>

                </div>
              </c:forEach>
            </div>
          </c:if>

          <!-- ✅ 사진 업로드 폼 (단독 form) -->
          <form id="cmPhotoForm" method="post"
                action="${pageContext.request.contextPath}/review-photos/upload"
                enctype="multipart/form-data"
                style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
            <input type="hidden" name="rvIdx" value="${review.rvIdx}" />
            <input type="hidden" name="redirectBase" value="/community/edit?rvIdx=" />
            <!-- ✅ 버튼 1개만 보이도록: 파일 인풋 숨기고, 버튼 클릭 -> 파일 선택 -> 자동 업로드 -->
            <input id="cmPhotoInput" type="file" name="photos" accept="image/*" multiple style="display:none;" />
            <button type="button" class="cm-btn cm-btn-primary" style="padding:10px 14px;" onclick="document.getElementById('cmPhotoInput').click()">
              사진 추가
            </button>
            <p style="margin:0; font-size:12px; color:#6b7280;">(여러 장 선택 가능)</p>
          </form>

          <script>
          (function(){
            const input = document.getElementById('cmPhotoInput');
            const form = document.getElementById('cmPhotoForm');
            if(!input || !form) return;
            input.addEventListener('change', function(){
              if(input.files && input.files.length){
                form.submit();
              }
            });
          })();
          </script>
        </section>

        <!-- ✅ 수정 저장/취소 버튼은 맨 아래로 이동 (폼 바깥) -->
        <div class="cm-actions" style="margin-top:18px;">
          <button class="cm-primary" type="submit" form="cmEditForm">수정 저장</button>
          <button class="cm-ghost" type="button" onclick="history.back()">취소</button>
        </div>

      </div>
    </section>
  </main>

</div>

<%@ include file="/WEB-INF/views/common/footer.jspf" %>

</body>
</html>