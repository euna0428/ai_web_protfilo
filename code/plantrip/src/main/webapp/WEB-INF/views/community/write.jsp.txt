<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ include file="/WEB-INF/views/common/theme.jspf" %>
<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>후기 작성</title>

  <link rel="stylesheet" href="/css/header.css" />
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/community.css">
  <link rel="stylesheet" href="/css/redesign.css" />
  <link rel="stylesheet" href="/css/ui-toast.css" />

  <script defer src="/js/ui-toast.js"></script>
  <script defer src="/js/theme.js"></script>
  <script defer src="/js/nav-wave.js"></script>
</head>
<body class="page-solid">

<jsp:include page="/WEB-INF/views/common/header.jsp" />
<div class="cm-shell cm-shell--write">
<main class="cm-main">
    <section class="mp-card">
      <div class="mp-card-head">
        <div>
          <div class="mp-card-title">후기 작성</div>
          <div class="mp-card-sub">여행에서 느낀 점을 공유해 보세요</div>
        </div>
      </div>

      <div class="mp-card-body">
        <form class="cm-form" action="${pageContext.request.contextPath}/community/write" method="post" enctype="multipart/form-data">
          
          <div class="cm-field">
            <label>장소</label>
            <c:choose>
              <c:when test="${not empty selectedSpot}">
                <input type="hidden" name="sIdx" value="${selectedSpot.id}" />
                <input type="text" value="${selectedSpot.name}" readonly style="width:100%; padding:12px 14px; border-radius:12px; border:1px solid rgba(148,163,184,.35); background:rgba(148,163,184,.10);" />
                <div class="cm-hint" style="margin-top:6px; font-size:12px; opacity:.7;">선택된 장소로 후기가 등록됩니다.</div>
              </c:when>
              <c:otherwise>
				<div class="cm-two-grid">
				  <div class="cm-two-item">
				    <div class="cm-two-label">지역</div>
				    <select id="cmRegion" required>
				      <option value="">지역 선택</option>
				    </select>
				  </div>
				  <div class="cm-two-item">
				    <div class="cm-two-label">장소</div>
				    <select id="cmSpot" name="sIdx" required>
				      <option value="">장소 선택</option>
				      <c:forEach var="s" items="${spotList}">
				        <option value="${s.id}" data-city="${empty s.city ? '' : s.city.name}"><c:out value="${s.name}"/></option>
				      </c:forEach>
				    </select>
				  </div>
				</div>
				<script>
				(function(){
				  const region = document.getElementById('cmRegion');
				  const spot = document.getElementById('cmSpot');
				  if(!region || !spot) return;
				  const all = Array.from(spot.querySelectorAll('option')).slice(1);
				  const cities = Array.from(new Set(all.map(o=>o.dataset.city).filter(Boolean)));
				  cities.forEach(c=>{
				    const opt = document.createElement('option');
				    opt.value = c;
				    opt.textContent = c;
				    region.appendChild(opt);
				  });
				  function filter(){
				    const city = region.value;
				    spot.value = '';
				    all.forEach(o=>{
				      const ok = !city || o.dataset.city === city;
				      o.hidden = !ok;
				      o.disabled = !ok;
				    });
				  }
				  region.addEventListener('change', filter);
				  filter();
				})();
				</script>
              </c:otherwise>
            </c:choose>
          </div>

          <div class="cm-field">
            <label>별점</label>
            <div class="rv-rating" data-max="5" aria-label="별점 선택">
              <button type="button" class="rv-star" data-value="1" aria-label="1점"></button>
              <button type="button" class="rv-star" data-value="2" aria-label="2점"></button>
              <button type="button" class="rv-star" data-value="3" aria-label="3점"></button>
              <button type="button" class="rv-star" data-value="4" aria-label="4점"></button>
              <button type="button" class="rv-star" data-value="5" aria-label="5점"></button>
              <span class="rv-rating-text" aria-live="polite">5/5</span>
            </div>
            <input type="hidden" id="rvStarHidden" name="rvStar" value="5" />
          </div>

          <div class="cm-field">
            <label>후기 제목</label>
            <input type="text" name="rvTitle" placeholder="후기 제목을 입력하세요" required />
          </div>

          <div class="cm-field">
            <label>후기 내용</label>
            <div class="rv-tip" role="note" aria-label="리뷰 작성 가이드">
              <span class="rv-tip-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M8.5 10.25c.6-1.6 2.1-2.75 3.95-2.75 2.2 0 3.95 1.55 3.95 3.45 0 2.2-2.1 2.95-3.2 3.55-.7.4-1.2.8-1.2 1.55v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  <path d="M12 18.3h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
                </svg>
              </span>
              <div class="rv-tip-text">
                <div class="rv-tip-title">여행은 어떠셨어요?</div>
                <div class="rv-tip-sub">위치나 교통, 편의시설 등 다른 여행자에게 추천하는 나만의 여행 팁을 알려주세요!</div>
              </div>
            </div>
            <div class="rv-cont-wrap">
              <textarea id="rvCont" name="rvCont" placeholder="여기에 후기를 작성하세요" required maxlength="5000"></textarea>
              <div class="rv-cont-counter" aria-live="polite">
                <span id="rvContCount">0</span>/<span id="rvContMax">5000</span>
              </div>
            </div>
          </div>

          <div class="cm-field">
            <label>사진 첨부 <span class="rv-optional">(선택)</span></label>
            <div class="rv-photo">
              <input id="photosInput" class="rv-photo-input" type="file" name="photos" accept="image/*" multiple style="display:none;" />
              
              <div class="rv-photo-head">
                <div class="rv-photo-sub">여행 사진을 공유해보세요!</div>
              </div>
              <div class="rv-photo-grid" id="photoGrid" data-empty="true">
                <div class="rv-photo-add" id="photoAddBtn" role="button" tabindex="0" aria-label="사진 추가" onclick="document.getElementById('photosInput').click()">
                  <div class="rv-photo-add-ico" aria-hidden="true"></div>
                  <div class="rv-photo-count"><span id="photoCountSpan">0</span>/<span>10</span></div>
                </div>
              </div>
              <div class="cm-hint rv-photo-hint">
                사진은 선택 사항입니다. 여러 장 첨부할 수 있어요 (최대 10장).
              </div>
            </div>
          </div>

          <div class="rv-agree" style="margin-top: 24px; margin-bottom: 30px;">
            <label class="rv-check" for="rvAgree" style="display: flex; align-items: center; cursor: pointer; gap: 8px;">
              <input id="rvAgree" type="checkbox" required />
              <span class="rv-check-box" aria-hidden="true"></span>
              <span class="rv-check-text" style="display: flex; align-items: center; flex-wrap: wrap;">
                콘텐츠 업로드에 있어서, PlanTrip의 이용약관에 동의합니다
                <span class="rv-links" style="margin-left: 8px; display: inline-flex; align-items: center; gap: 6px;">
                  <a href="#" target="_blank" rel="noopener" style="color: #3264ff; font-weight: bold; text-decoration: none;">이용약관</a>
                  <span class="rv-dot" style="color: #888;">&amp;</span>
                  <a href="#" target="_blank" rel="noopener" style="color: #3264ff; font-weight: bold; text-decoration: none;">커뮤니티 규칙</a>
                </span>
              </span>
            </label>
          </div>

          <div class="cm-actions">
            <button class="rv-btn rv-btn-primary" type="submit">등록</button>
            <button class="rv-btn rv-btn-ghost" type="button" onclick="location.href='${pageContext.request.contextPath}/community'">취소</button>
          </div>
        </form>
      </div>
    </section>
  </main>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. 별점 로직
    const ratingWrap = document.querySelector('.rv-rating');
    const stars = document.querySelectorAll('.rv-star');
    const starText = document.querySelector('.rv-rating-text');
    const hiddenStar = document.getElementById('rvStarHidden');
    let currentRating = 5;

    function renderStars(val) {
        stars.forEach(s => {
            const v = parseInt(s.getAttribute('data-value'));
            if(v <= val) {
                s.classList.add('is-on');
            } else {
                s.classList.remove('is-on');
            }
        });
        if(starText) starText.textContent = val + '/5';
    }

    stars.forEach(star => {
        star.addEventListener('mouseenter', function() {
            renderStars(parseInt(this.getAttribute('data-value')));
        });
        star.addEventListener('click', function() {
            currentRating = parseInt(this.getAttribute('data-value'));
            hiddenStar.value = currentRating;
            renderStars(currentRating);
        });
    });

    if(ratingWrap) {
        ratingWrap.addEventListener('mouseleave', function() {
            renderStars(currentRating);
        });
    }
    renderStars(5);

	// 2. 사진 첨부 미리보기 및 숨김 파일 필터링 로직
	        const photosInput = document.getElementById('photosInput');
	        const photoGrid = document.getElementById('photoGrid');
	        const addBtn = document.getElementById('photoAddBtn');
	        const countSpan = document.getElementById('photoCountSpan');
	        let selectedFiles = [];

	        if(photosInput) {
	            photosInput.addEventListener('change', (e) => {
	                const newFiles = Array.from(e.target.files);
	                
	                // 필터링: 이미지 타입이고, 이름이 '.'으로 시작하지 않는 파일만 통과
	                const validFiles = newFiles.filter(file => {
	                    const isImage = file.type && file.type.startsWith('image/');
	                    const isSystemFile = file.name.startsWith('.'); 
	                    return isImage && !isSystemFile;
	                });

	                // 걸러진 파일이 있다면 사용자에게 알림
	                if (newFiles.length !== validFiles.length) {
	                    alert("이미지 파일만 첨부할 수 있습니다.\n(시스템 파일이나 이미지 형식이 아닌 파일은 제외되었습니다.)");
	                }

	                // 중복 방지: 이미 selectedFiles에 들어있는 파일은 빼고 새로 추가된 것만 담기
	                const uniqueFiles = validFiles.filter(vf => 
	                    !selectedFiles.some(sf => sf.name === vf.name && sf.size === vf.size)
	                );

	                if(selectedFiles.length + uniqueFiles.length > 10) {
	                    alert("사진은 최대 10장까지 첨부할 수 있습니다.");
	                    return;
	                }
	                
	                selectedFiles = selectedFiles.concat(uniqueFiles);
	                updatePhotoGrid();
	            });
	        }

    function updatePhotoGrid() {
        if(!photoGrid) return;
        
        const existingThumbs = photoGrid.querySelectorAll('.rv-thumb');
        existingThumbs.forEach(th => th.remove());

        if(countSpan) countSpan.textContent = selectedFiles.length;
        const dt = new DataTransfer();

        selectedFiles.forEach((file, index) => {
            dt.items.add(file);

            const thumb = document.createElement('div');
            thumb.className = 'rv-thumb';
            
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            thumb.appendChild(img);

            const rmBtn = document.createElement('button');
            rmBtn.type = 'button';
            rmBtn.className = 'rv-thumb-remove';
            rmBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v10h-2V9zm4 0h2v10h-2V9zM6 9h2v10H6V9z"/></svg>';
            
            rmBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                selectedFiles.splice(index, 1);
                updatePhotoGrid();
            });
            thumb.appendChild(rmBtn);

            photoGrid.insertBefore(thumb, addBtn);
        });

        if(photosInput) photosInput.files = dt.files;
    }

    // 3. 텍스트 글자 수 세기
    const ta = document.getElementById('rvCont');
    const counterNow = document.getElementById('rvContCount');
    if(ta && counterNow) {
        ta.addEventListener('input', () => {
            counterNow.textContent = ta.value.length;
        });
    }
});
</script>

<%@ include file="/WEB-INF/views/common/footer.jspf" %>
</body>
</html>