(function () {
  const body = document.body;
  const contextPath = body?.dataset?.contextPath || "";

  const adminPages = {
    users: {
      title: "회원 관리",
      kicker: "USER MANAGEMENT",
      defaultSub: "users",
      subTabs: [
        { id: "users", label: "회원 목록" },
        { id: "audit", label: "활동 로그 조회" }
      ]
    },
    terms: {
      title: "약관 관리",
      kicker: "TERMS MANAGEMENT",
      defaultSub: "terms",
      subTabs: [
        { id: "terms", label: "약관 목록" },
        { id: "termsForm", label: "약관 등록" }
      ]
    },
    ott: {
      title: "OTT 관리",
      kicker: "OTT MANAGEMENT",
      defaultSub: "ottParties",
      subTabs: [
        { id: "ottParties", label: "OTT 파티 목록" },
        { id: "ottApproval", label: "승인 대기" }
      ]
    },
    support: {
      title: "고객센터",
      kicker: "CUSTOMER SUPPORT",
      defaultSub: "inquiries",
      subTabs: [
        { id: "inquiries", label: "문의 관리" },
        { id: "faq", label: "FAQ 관리" }
      ]
    },
    notification: {
      title: "이메일 알림",
      kicker: "EMAIL NOTIFICATION",
      defaultSub: "notifications",
      subTabs: [
        { id: "notifications", label: "알림 로그" },
        { id: "notificationDetail", label: "알림 상세" }
      ]
    }
  };

  const pageOrder = Object.keys(adminPages);
  const state = {
    activePage: null,
    activeSubTabs: Object.fromEntries(pageOrder.map((key) => [key, adminPages[key].defaultSub])),
    selected: {
      userId: null,
      partyId: null,
      notificationId: null,
      inquiryId: null,
      faqId: null,
      termId: null
    },
    cache: {},
    loadingToken: 0
  };

  const workspace = document.getElementById("adminWorkspace");
  const workspaceTitle = document.getElementById("adminWorkspaceTitle");
  const openTabs = document.getElementById("adminOpenTabs");
  const contentPanel = document.getElementById("adminContentPanel");
  const closeWorkspace = document.getElementById("adminCloseWorkspace");
  const folderCards = Array.from(document.querySelectorAll(".admin-folder-card[data-page]"));
  const root = document.getElementById("adminRoot");
  const dashboardBoard = document.getElementById("adminDashboardBoard");
  const logoutButton = document.getElementById("adminLogoutButton");

  if (!workspace || !openTabs || !contentPanel) return;

  folderCards.forEach((card) => {
    card.addEventListener("click", () => activateAdminPage(card.dataset.page));
  });

  logoutButton?.addEventListener("click", async () => {
    try {
      await fetch(api("/auth/logout"), {
        method: "POST",
        credentials: "same-origin",
        headers: { "Accept": "application/json" }
      });
    } finally {
      window.location.href = api("/");
    }
  });

  closeWorkspace?.addEventListener("click", () => {
    state.activePage = null;
    workspace.hidden = true;
    dashboardBoard && (dashboardBoard.hidden = false);
    root?.classList.remove("is-workspace-open");
    body?.classList.remove("is-admin-workspace-open");
    folderCards.forEach((card) => card.classList.remove("is-active"));
    window.history.replaceState(null, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  openTabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-open-tab]");
    if (!tab) return;
    activateAdminPage(tab.dataset.openTab, { scroll: false });
  });

  contentPanel.addEventListener("click", async (event) => {
    const subTab = event.target.closest("[data-sub-tab]");
    const userDetail = event.target.closest("[data-user-detail]");
    const userStatus = event.target.closest("[data-user-status]");
    const partyDetail = event.target.closest("[data-party-detail]");
    const notificationDetail = event.target.closest("[data-notification-detail]");
    const inquiryDetail = event.target.closest("[data-inquiry-detail]");
    const faqDelete = event.target.closest("[data-faq-delete]");
    const partyApprove = event.target.closest("[data-party-approve]");
    const partyCancel = event.target.closest("[data-party-cancel]");
    const userSearchBtn = event.target.closest("#btn-user-search");
    const termEdit = event.target.closest("[data-term-edit]");

    if (subTab) {

      if (subTab.dataset.subTab === "termsForm") state.selected.termId = null;

      state.activeSubTabs[state.activePage] = subTab.dataset.subTab;
      await renderActiveContent();
      return;
    }

    if (userSearchBtn) {
          const searchId = document.getElementById("search-login-id").value.toLowerCase();
          const searchStatus = document.getElementById("search-status").value;
          const rows = document.querySelectorAll("#user-table-body .user-row");

          rows.forEach(row => {
            // 화면에 그려진 아이디와 상태 텍스트를 가져와서 비교합니다
            const loginId = row.querySelector(".user-login-id").textContent.toLowerCase();
            const status = row.querySelector(".user-status").textContent.trim();

            const matchId = loginId.includes(searchId); // 입력한 텍스트가 포함되어 있는지
            const matchStatus = searchStatus === "" || status === searchStatus; // 상태가 일치하는지

            // 두 조건이 모두 맞으면 보이고, 아니면 숨깁니다
            if (matchId && matchStatus) {
              row.style.display = "";
            } else {
              row.style.display = "none";
            }
          });
          return;
        }

    if (termEdit) {
          state.selected.termId = Number(termEdit.dataset.termEdit);
          state.activeSubTabs.terms = "termsForm";
          await renderActiveContent();
          return;
    }

    if (userDetail) {
      state.selected.userId = Number(userDetail.dataset.userDetail);
      state.activeSubTabs.users = "userDetail";
      await renderActiveContent();
      return;
    }

    if (userStatus) {
      state.selected.userId = Number(userStatus.dataset.userStatus);
      state.activeSubTabs.users = "userStatus";
      await renderActiveContent();
      return;
    }

    if (partyDetail) {
      state.selected.partyId = Number(partyDetail.dataset.partyDetail);
      state.activeSubTabs.ott = "partyDetail";
      await renderActiveContent();
      return;
    }

    if (notificationDetail) {
      state.selected.notificationId = Number(notificationDetail.dataset.notificationDetail);
      state.activeSubTabs.notification = "notificationDetail";
      await renderActiveContent();
      return;
    }

    if (inquiryDetail) {
      state.selected.inquiryId = Number(inquiryDetail.dataset.inquiryDetail);
      state.activeSubTabs.support = "inquiryDetail";
      await renderActiveContent();
      return;
    }

    if (faqDelete) {
      await deleteFaq(Number(faqDelete.dataset.faqDelete));
      return;
    }

    if (partyApprove) {
      const partyId = Number(partyApprove.dataset.partyApprove);
      const approved = partyApprove.dataset.approved === "true";
      await approveParty(partyId, approved, "");
      return;
    }

    if (partyCancel) {
      await cancelParty(Number(partyCancel.dataset.partyCancel));
    }
  });

  contentPanel.addEventListener("submit", async (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    if (form.matches("[data-user-status-form]")) {
      event.preventDefault();
      await submitUserStatus(form);
    }

    if (form.matches("[data-terms-form]")) {
      event.preventDefault();
      await submitTerms(form);
    }

    if (form.matches("[data-inquiry-answer-form]")) {
      event.preventDefault();
      await submitInquiryAnswer(form);
    }

    if (form.matches("[data-faq-form]")) {
      event.preventDefault();
      await submitFaq(form);
    }

    if (form.matches("[data-party-approval-form]")) {
      event.preventDefault();
      await submitPartyApproval(form);
    }
  });

  window.addEventListener("popstate", () => {
    const pageKey = getPageFromHash();
    if (pageKey) activateAdminPage(pageKey, { scroll: false, updateHash: false });
  });

  const initialPage = getPageFromHash();
  if (initialPage) activateAdminPage(initialPage, { scroll: false, updateHash: false });

  function getPageFromHash() {
    const raw = window.location.hash.replace("#", "").trim();
    if (!raw) return null;
    const [pageKey, subKey] = raw.split("/");
    if (!adminPages[pageKey]) return null;
    if (subKey) state.activeSubTabs[pageKey] = subKey;
    return pageKey;
  }

  function api(path) {
    return `${contextPath}${path}`;
  }

  async function requestJson(path, options = {}) {
    const response = await fetch(api(path), {
      credentials: "same-origin",
      headers: {
        "Accept": "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {})
      },
      ...options
    });

    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (error) {
        throw new Error("서버 응답을 JSON으로 해석할 수 없습니다.");
      }
    }

    if (!response.ok) {
      throw new Error(data?.message || `요청 실패: HTTP ${response.status}`);
    }

    return data;
  }

  async function fetchCached(key, path, picker) {
    if (state.cache[key]) return state.cache[key];
    const data = await requestJson(path);
    const value = picker ? picker(data) : data;
    state.cache[key] = Array.isArray(value) ? value : [];
    return state.cache[key];
  }

  function clearCache(...keys) {
    keys.forEach((key) => delete state.cache[key]);
  }

  function activateAdminPage(pageKey, options = {}) {
    if (!adminPages[pageKey]) return;

    const { scroll = true, updateHash = true } = options;
    state.activePage = pageKey;
    workspace.hidden = false;
    dashboardBoard && (dashboardBoard.hidden = true);
    root?.classList.add("is-workspace-open");
    body?.classList.add("is-admin-workspace-open");

    folderCards.forEach((card) => {
      card.classList.toggle("is-active", card.dataset.page === pageKey);
    });

    renderOpenTabs();
    renderActiveContent();

    const subKey = state.activeSubTabs[pageKey] || adminPages[pageKey].defaultSub;
    if (updateHash) window.history.replaceState(null, "", `#${pageKey}/${subKey}`);
    if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderOpenTabs() {
    openTabs.innerHTML = pageOrder.map((pageKey) => {
      const page = adminPages[pageKey];
      const activeClass = pageKey === state.activePage ? "is-active" : "";
      return `
        <button class="admin-open-tab ${activeClass}" type="button" data-open-tab="${pageKey}">
          <span class="admin-open-tab-icon" aria-hidden="true"></span>
          <span>${page.title}</span>
        </button>
      `;
    }).join("");
  }

  async function renderActiveContent() {
    const pageKey = state.activePage;
    const page = adminPages[pageKey];
    if (!page) return;

    const subKey = state.activeSubTabs[pageKey] || page.defaultSub;
    const token = ++state.loadingToken;

    workspaceTitle.textContent = page.title;
    contentPanel.innerHTML = `
      ${renderPageHead(page, subKey)}
      ${renderSubTabs(page, subKey)}
      ${renderLoadingCard()}
    `;

    try {
      const bodyHtml = await renderView(pageKey, subKey);
      if (token !== state.loadingToken) return;
      contentPanel.innerHTML = `
        ${renderPageHead(page, subKey)}
        ${renderSubTabs(page, subKey)}
        ${bodyHtml}
      `;
      if (window.location.hash) {
        window.history.replaceState(null, "", `#${pageKey}/${subKey}`);
      }
    } catch (error) {
      if (token !== state.loadingToken) return;
      contentPanel.innerHTML = `
        ${renderPageHead(page, subKey)}
        ${renderSubTabs(page, subKey)}
        ${renderErrorCard(error.message)}
      `;
    }
  }

  function renderPageHead(page, subKey) {
    return "";
  }

  function renderSubTabs(page, activeSubKey) {
    return `
      <nav class="admin-folder-tabs" aria-label="${escapeHtml(page.title)} 하위 메뉴">
        ${page.subTabs.map((tab) => `
          <button class="admin-mini-folder ${tab.id === activeSubKey ? "is-active" : ""}" type="button" data-sub-tab="${tab.id}">
            <span class="admin-mini-folder-icon" aria-hidden="true"></span>
            <span>${tab.label}</span>
          </button>
        `).join("")}
      </nav>
    `;
  }

  function renderLoadingCard() {
    return `
      <article class="admin-card admin-state-card">
        <div class="admin-state-spinner" aria-hidden="true"></div>
        <h2>서버 데이터를 불러오는 중입니다.</h2>
        <p>관리자 API와 연결 상태를 확인하고 있습니다.</p>
      </article>
    `;
  }

  function renderErrorCard(message) {
    return `
      <article class="admin-card admin-state-card error">
        <h2>데이터를 불러오지 못했습니다.</h2>
        <p>${escapeHtml(message || "알 수 없는 오류가 발생했습니다.")}</p>
        <button class="admin-btn ghost" type="button" data-sub-tab="${adminPages[state.activePage].defaultSub}">다시 시도</button>
      </article>
    `;
  }

  async function renderView(pageKey, subKey) {
    if (pageKey === "users" && subKey === "users") return renderUsers();
    if (pageKey === "users" && subKey === "audit") return renderAuditLogs();
    if (pageKey === "users" && subKey === "userDetail") return renderUserDetail();
    if (pageKey === "users" && subKey === "userStatus") return renderUserStatus();

    if (pageKey === "terms" && subKey === "terms") return renderTerms();
    if (pageKey === "terms" && subKey === "termsForm") return renderTermsForm();

    if (pageKey === "ott" && subKey === "ottParties") return renderOttParties(false);
    if (pageKey === "ott" && subKey === "ottApproval") return renderOttParties(true);
    if (pageKey === "ott" && subKey === "partyDetail") return renderPartyDetail();

    if (pageKey === "support" && subKey === "inquiries") return renderInquiries();
    if (pageKey === "support" && subKey === "inquiryDetail") return renderInquiryDetail();
    if (pageKey === "support" && subKey === "faq") return renderFaq();

    if (pageKey === "notification" && subKey === "notifications") return renderNotifications();
    if (pageKey === "notification" && subKey === "notificationDetail") return renderNotificationDetail();

    return renderErrorCard("아직 연결되지 않은 화면입니다.");
  }

  async function loadUsers() {
    return fetchCached("users", "/api/admin/users", (data) => data?.users || data || []);
  }

  async function loadAuditLogs() {
    return fetchCached("auditLogs", "/api/admin/audit-logs", (data) => data?.logs || data || []);
  }

  async function loadTerms() {
    return fetchCached("terms", "/api/admin/terms", (data) => data?.terms || data || []);
  }

  async function loadParties() {
    return fetchCached("parties", "/api/admin/parties", (data) => data?.parties || data || []);
  }

  async function loadFaqs() {
    return fetchCached("faqs", "/api/admin/faqs", (data) => data?.faqs || data || []);
  }

  async function loadInquiries() {
    return fetchCached("inquiries", "/api/admin/inquiries", (data) => data?.inquiries || data || []);
  }

  async function loadNotifications() {
    return fetchCached("notifications", "/api/admin/notifications", (data) => data?.logs || data?.notifications || data || []);
  }

  async function renderUsers() {
      const users = await loadUsers();
      const rows = users.map((user) => {
        const userId = value(user, ["userId", "id"], "-");
        const loginId = value(user, ["loginId", "email", "username"], "-");
        const nickname = value(user, ["nickname", "name"], "-");
        const role = value(user, ["role"], "USER");
        const status = value(user, ["accountStatus", "status"], "-");
        const noti = value(user, ["isNotiEnabled", "notiEnabled", "notificationEnabled"], "-");

        return `
          <tr class="user-row"> <td>${escapeHtml(userId)}</td>
            <td class="user-login-id">${escapeHtml(loginId)}</td> <td>${escapeHtml(nickname)}</td>
            <td>${badge(role, role === "ADMIN" ? "blue" : "gray")}</td>
            <td class="user-status">${statusBadge(status)}</td> <td>${escapeHtml(noti)}</td>
            <td class="admin-actions">
              <button class="admin-btn ghost" type="button" data-user-detail="${escapeAttr(userId)}">상세보기</button>
              <button class="admin-btn soft" type="button" data-user-status="${escapeAttr(userId)}">상태변경</button>
            </td>
          </tr>
        `;
      }).join("");

      return `
        <article class="admin-card">
          <div class="admin-card-head">
            <h2>회원 목록</h2>
          </div>
          <div class="admin-filter-bar">
            <label>로그인 ID <input type="search" id="search-login-id" placeholder="화면 내 검색"></label>
            <label>계정 상태
              <select id="search-status">
                <option value="">전체</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="WITHDRAWN">WITHDRAWN</option>
              </select>
            </label>
            <button class="admin-btn" type="button" id="btn-user-search">검색</button>
            </div>
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead><tr><th>회원 ID</th><th>로그인 ID</th><th>닉네임</th><th>권한</th><th>계정 상태</th><th>알림 수신</th><th>관리</th></tr></thead>
              <tbody id="user-table-body">${rows || emptyRow(7, "회원 데이터가 없습니다.")}</tbody>
            </table>
          </div>
        </article>
      `;
    }

  async function renderAuditLogs() {
    const logs = await loadAuditLogs();
    const rows = logs.map((log) => `
      <tr>
        <td>${escapeHtml(value(log, ["logId", "id"], "-"))}</td>
        <td>${escapeHtml(value(log, ["adminNickname", "adminId", "adminName"], "-"))}</td>
        <td>${escapeHtml(value(log, ["actionType"], "-"))}</td>
        <td>${escapeHtml(value(log, ["targetTable"], "-"))}</td>
        <td>${escapeHtml(value(log, ["targetId"], "-"))}</td>
        <td>${escapeHtml(value(log, ["ipAddress"], "-"))}</td>
        <td>${escapeHtml(formatDate(value(log, ["createdAt"], null)))}</td>
      </tr>
    `).join("");

    return `
      <article class="admin-card">
        <div class="admin-card-head"><h2>관리자 활동 로그</h2></div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th>로그 ID</th><th>관리자</th><th>작업 유형</th><th>대상 테이블</th><th>대상 ID</th><th>IP 주소</th><th>작업 일시</th></tr></thead>
            <tbody>${rows || emptyRow(7, "활동 로그가 없습니다.")}</tbody>
          </table>
        </div>
      </article>
    `;
  }

  async function renderUserDetail() {
    const users = await loadUsers();
    const user = findById(users, state.selected.userId, ["userId", "id"]);
    if (!user) return renderErrorCard("선택한 회원 정보를 찾을 수 없습니다.");

    const userId = value(user, ["userId", "id"], "-");
    const loginId = value(user, ["loginId", "email", "username"], "-");
    const nickname = value(user, ["nickname", "name"], "-");
    const gender = value(user, ["gender"], "-");
    const birthDate = formatDate(value(user, ["birthDate"], null));
    const provider = value(user, ["provider"], "-");
    const role = value(user, ["role"], "USER");
    const status = value(user, ["accountStatus", "status"], "-");
    const noti = value(user, ["isNotiEnabled", "notiEnabled", "notificationEnabled"], "-");
    const twoFactor = value(user, ["is2faEnabled", "twoFactorEnabled"], "-");

    return `
      <article class="admin-card admin-detail-card admin-detail-card--classic">
        <div class="admin-card-head">
          <h2>회원 상세 정보</h2>
          <button class="admin-btn ghost" type="button" data-sub-tab="users">목록으로</button>
        </div>

        <dl class="admin-detail-table">
          ${detailRow("회원 ID", userId, "로그인 ID", loginId)}
          ${detailRow("닉네임", nickname, "성별", gender)}
          ${detailRow("생년월일", birthDate, "가입 방식", provider)}
          ${detailRow("권한", badge(role, role === "ADMIN" ? "blue" : "gray"), "계정 상태", statusBadge(status), true)}
          ${detailRow("알림 수신 여부", noti, "2차 인증", twoFactor)}
        </dl>

        <div class="admin-bottom-actions">
          <button class="admin-btn ghost" type="button" data-sub-tab="users">목록으로</button>
          <button class="admin-btn" type="button" data-user-status="${escapeAttr(userId)}">상태변경</button>
        </div>
      </article>
    `;
  }

  async function renderUserStatus() {
    const users = await loadUsers();
    const user = findById(users, state.selected.userId, ["userId", "id"]);
    if (!user) return renderErrorCard("상태를 변경할 회원 정보를 찾을 수 없습니다.");

    const userId = value(user, ["userId", "id"], "");
    const status = value(user, ["accountStatus", "status"], "ACTIVE");

    return `
      <div class="admin-split">
        <article class="admin-card">
          <div class="admin-card-head"><h2>대상 회원</h2></div>
          <dl class="admin-detail-grid one-column">
            ${detailItem("회원 ID", userId)}
            ${detailItem("로그인 ID", value(user, ["loginId", "email", "username"], "-"))}
            ${detailItem("닉네임", value(user, ["nickname", "name"], "-"))}
            ${detailItem("현재 상태", statusBadge(status), true)}
          </dl>
        </article>
        <form class="admin-card admin-form" data-user-status-form>
          <div class="admin-card-head"><h2>상태 변경</h2></div>
          <input type="hidden" name="userId" value="${escapeAttr(userId)}">
          <label><span>변경 상태</span>${selectHtml("status", ["ACTIVE", "SUSPENDED", "WITHDRAWN"], status)}</label>
          <div class="admin-bottom-actions"><button type="button" class="admin-btn ghost" data-sub-tab="users">취소</button><button type="submit" class="admin-btn">상태 저장</button></div>
        </form>
      </div>
    `;
  }

  async function renderTerms() {
      const terms = await loadTerms();
      const rows = terms.map((term) => `
        <tr>
          <td>${escapeHtml(value(term, ["termsId", "termId", "id"], "-"))}</td>
          <td>${escapeHtml(value(term, ["termType", "type", "termsType"], "-"))}</td>
          <td>${escapeHtml(value(term, ["version"], "-"))}</td>
          <td>${escapeHtml(value(term, ["displayOrder", "sortOrder"], "-"))}</td>
          <td>${requiredBadge(value(term, ["isRequired", "required"], "-"))}</td>
          <td>${escapeHtml(formatDate(value(term, ["applyDate", "createdAt"], null)))}</td>
          <td class="admin-actions">
            <button class="admin-btn ghost" type="button" data-term-edit="${escapeAttr(value(term, ["termsId", "termId", "id"], ""))}">약관 수정</button>
          </td>
        </tr>
      `).join("");

      return `
        <article class="admin-card">
          <div class="admin-card-head"><h2>약관 목록</h2><button class="admin-btn" type="button" data-sub-tab="termsForm">신규 등록</button></div>
          <div class="admin-table-wrap"><table class="admin-table">
            <thead><tr><th>약관 ID</th><th>약관 종류</th><th>버전</th><th>정렬</th><th>필수 여부</th><th>적용일</th><th>관리</th></tr></thead>
            <tbody>${rows || emptyRow(7, "약관 데이터가 없습니다.")}</tbody>
          </table></div>
        </article>
      `;
    }

  async function renderTermsForm() {
      let term = null;
      // ★ 수정 모드: 저장해둔 ID가 있으면 기존 약관 정보를 불러옵니다.
      if (state.selected.termId) {
        const terms = await loadTerms();
        term = findById(terms, state.selected.termId, ["termsId", "termId", "id"]);
      }

      const isEdit = !!term; // 정보가 있으면 true(수정), 없으면 false(신규)
      const termId = isEdit ? value(term, ["termsId", "termId", "id"], "") : "";
      const termType = isEdit ? value(term, ["termType", "type"], "SERVICE") : "SERVICE";
      const version = isEdit ? value(term, ["version"], "") : "";
      const isRequired = isEdit ? value(term, ["isRequired", "required"], "Y") : "Y";
      const content = isEdit ? value(term, ["content"], "") : "";

      // 날짜 포맷 맞추기 (YYYY-MM-DDTHH:mm)
      let applyDate = "";
      if (isEdit && term.applyDate) applyDate = term.applyDate.slice(0, 16);

      return `
        <form class="admin-card admin-form wide" data-terms-form>
          <div class="admin-card-head full-field"><h2>${isEdit ? "약관 수정" : "약관 신규 등록"}</h2></div>
          ${isEdit ? `<input type="hidden" name="termId" value="${escapeAttr(termId)}">` : ""}
          <label><span>약관 종류</span>${selectHtml("termType", ["SERVICE", "PRIVACY", "MARKETING", "LOCATION"], termType)}</label>
          <label><span>버전</span><input name="version" placeholder="예: v1.1" value="${escapeAttr(version)}" required></label>
          <label><span>필수 여부</span>${selectHtml("isRequired", ["Y", "N"], isRequired)}</label>
          <label><span>적용일</span><input name="applyDate" type="datetime-local" value="${escapeAttr(applyDate)}"></label>
          <label class="full-field"><span>약관 내용</span><textarea name="content" rows="12" required>${escapeHtml(content)}</textarea></label>
          <div class="form-actions admin-bottom-actions">
            <button class="admin-btn ghost" type="button" data-sub-tab="terms">목록으로</button>
            <button class="admin-btn" type="submit">저장</button>
          </div>
        </form>
      `;
    }

  async function renderOttParties(onlyWaiting) {
    const parties = await loadParties();
    const filtered = onlyWaiting
      ? parties.filter((party) => String(value(party, ["status"], "")).toUpperCase() === "WAITING")
      : parties;

    const rows = filtered.map((party) => {
      const partyId = value(party, ["partyId", "id"], "-");
      const status = value(party, ["status"], "-");
      return `
        <tr>
          <td>${escapeHtml(partyId)}</td>
          <td>${escapeHtml(value(party, ["ottService", "serviceName"], "-"))}</td>
          <td>${escapeHtml(value(party, ["sellerName", "seller"], "-"))}</td>
          <td>${escapeHtml(formatPrice(value(party, ["price", "monthlyPrice"], null)))}</td>
          <td>${statusBadge(status)}</td>
          <td>${escapeHtml(formatDate(value(party, ["createdAt"], null)))}</td>
          <td class="admin-actions">
            <button class="admin-btn ghost" type="button" data-party-detail="${escapeAttr(partyId)}">상세보기</button>
            <button class="admin-btn" type="button" data-party-approve="${escapeAttr(partyId)}" data-approved="true">승인</button>
            <button class="admin-btn soft" type="button" data-party-detail="${escapeAttr(partyId)}">거절</button>
          </td>
        </tr>
      `;
    }).join("");

    return `
      <article class="admin-card">
        <div class="admin-card-head"><h2>${onlyWaiting ? "승인 대기 목록" : "OTT 파티 목록"}</h2></div>
        <div class="admin-table-wrap"><table class="admin-table">
          <thead><tr><th>파티 ID</th><th>OTT 서비스</th><th>판매자</th><th>가격</th><th>상태</th><th>등록일</th><th>관리</th></tr></thead>
          <tbody>${rows || emptyRow(7, onlyWaiting ? "승인 대기 데이터가 없습니다." : "OTT 파티 데이터가 없습니다.")}</tbody>
        </table></div>
      </article>
    `;
  }

  async function renderPartyDetail() {
    const parties = await loadParties();
    const party = findById(parties, state.selected.partyId, ["partyId", "id"]);
    if (!party) return renderErrorCard("선택한 OTT 파티 정보를 찾을 수 없습니다.");

    const partyId = value(party, ["partyId", "id"], "");

    return `
      <div class="admin-split">
        <article class="admin-card">
          <div class="admin-card-head"><h2>OTT 파티 상세</h2><button class="admin-btn ghost" type="button" data-sub-tab="ottParties">목록으로</button></div>
          <dl class="admin-detail-grid one-column">
            ${detailItem("파티 ID", partyId)}
            ${detailItem("OTT 서비스", value(party, ["ottService", "serviceName"], "-"))}
            ${detailItem("판매자", value(party, ["sellerName", "seller"], "-"))}
            ${detailItem("계정 ID", value(party, ["accountId"], "-"))}
            ${detailItem("계정 비밀번호", value(party, ["accountPassword"], "-"))}
            ${detailItem("가격", formatPrice(value(party, ["price", "monthlyPrice"], null)))}
            ${detailItem("상태", statusBadge(value(party, ["status"], "-")), true)}
            ${detailItem("거절 사유", value(party, ["rejectReason"], "-"))}
          </dl>
        </article>
        <form class="admin-card admin-form" data-party-approval-form>
          <div class="admin-card-head"><h2>승인 / 거절 처리</h2></div>
          <input type="hidden" name="partyId" value="${escapeAttr(partyId)}">
          <label><span>처리 상태</span><select name="approved"><option value="true">승인</option><option value="false">거절</option></select></label>
          <label><span>거절 사유</span><textarea name="rejectReason" rows="6" placeholder="거절 처리 시 사유를 입력하세요."></textarea></label>
          <div class="admin-bottom-actions"><button class="admin-btn ghost" type="button" data-party-cancel="${escapeAttr(partyId)}">강제 취소</button><button class="admin-btn" type="submit">처리 저장</button></div>
        </form>
      </div>
    `;
  }

  async function renderInquiries() {
    const inquiries = await loadInquiries();
    const rows = inquiries.map((inquiry) => {
      const inquiryId = value(inquiry, ["inquiryId", "id"], "-");
      return `
        <tr>
          <td>${escapeHtml(inquiryId)}</td>
          <td>${escapeHtml(value(inquiry, ["authorId", "userId"], "-"))}</td>
          <td>${escapeHtml(value(inquiry, ["title"], "-"))}</td>
          <td>${statusBadge(value(inquiry, ["status"], "-"))}</td>
          <td>${escapeHtml(formatDate(value(inquiry, ["createdAt"], null)))}</td>
          <td class="admin-actions"><button class="admin-btn ghost" type="button" data-inquiry-detail="${escapeAttr(inquiryId)}">답변 관리</button></td>
        </tr>
      `;
    }).join("");

    return `
      <article class="admin-card">
        <div class="admin-card-head"><h2>문의 관리</h2></div>
        <div class="admin-table-wrap"><table class="admin-table">
          <thead><tr><th>문의 ID</th><th>작성자 ID</th><th>제목</th><th>상태</th><th>등록일</th><th>관리</th></tr></thead>
          <tbody>${rows || emptyRow(6, "문의 데이터가 없습니다.")}</tbody>
        </table></div>
      </article>
    `;
  }

  async function renderInquiryDetail() {
    const inquiries = await loadInquiries();
    const inquiry = findById(inquiries, state.selected.inquiryId, ["inquiryId", "id"]);
    if (!inquiry) return renderErrorCard("선택한 문의 정보를 찾을 수 없습니다.");

    const inquiryId = value(inquiry, ["inquiryId", "id"], "");

    return `
      <div class="admin-split">
        <article class="admin-card">
          <div class="admin-card-head"><h2>문의 상세</h2><button class="admin-btn ghost" type="button" data-sub-tab="inquiries">목록으로</button></div>
          <dl class="admin-detail-grid one-column">
            ${detailItem("문의 ID", inquiryId)}
            ${detailItem("작성자 ID", value(inquiry, ["authorId", "userId"], "-"))}
            ${detailItem("제목", value(inquiry, ["title"], "-"))}
            ${detailItem("내용", value(inquiry, ["content"], "-"))}
            ${detailItem("상태", statusBadge(value(inquiry, ["status"], "-")), true)}
            ${detailItem("기존 답변", value(inquiry, ["answerContent", "answer"], "-"))}
          </dl>
        </article>
        <form class="admin-card admin-form" data-inquiry-answer-form>
          <div class="admin-card-head"><h2>답변 등록</h2></div>
          <input type="hidden" name="inquiryId" value="${escapeAttr(inquiryId)}">
          <label><span>답변 내용</span><textarea name="answer" rows="10" required>${escapeHtml(value(inquiry, ["answerContent", "answer"], ""))}</textarea></label>
          <button type="submit" class="admin-btn full">답변 저장</button>
        </form>
      </div>
    `;
  }

  async function renderFaq() {
    const faqs = await loadFaqs();
    const rows = faqs.map((faq) => {
      const faqId = value(faq, ["faqId", "id"], "-");
      return `
        <tr>
          <td>${escapeHtml(faqId)}</td>
          <td>${escapeHtml(value(faq, ["question", "title"], "-"))}</td>
          <td>${escapeHtml(value(faq, ["displayOrder", "sortOrder"], "-"))}</td>
          <td>${requiredBadge(value(faq, ["isActive", "useYn", "isUsed"], "Y"))}</td>
          <td>${escapeHtml(formatDate(value(faq, ["createdAt"], null)))}</td>
          <td class="admin-actions"><button class="admin-btn soft" type="button" data-faq-delete="${escapeAttr(faqId)}">삭제</button></td>
        </tr>
      `;
    }).join("");

    return `
      <div class="admin-split admin-split-wide">
        <article class="admin-card">
          <div class="admin-card-head"><h2>FAQ 목록</h2></div>
          <div class="admin-table-wrap"><table class="admin-table">
            <thead><tr><th>FAQ ID</th><th>질문</th><th>정렬</th><th>사용 여부</th><th>등록일</th><th>관리</th></tr></thead>
            <tbody>${rows || emptyRow(6, "FAQ 데이터가 없습니다.")}</tbody>
          </table></div>
        </article>
        <form class="admin-card admin-form" data-faq-form>
          <div class="admin-card-head"><h2>FAQ 등록</h2></div>

          <label><span>질문</span><input name="question" placeholder="질문을 입력하세요." required></label>
          <label><span>답변</span><textarea name="answer" rows="7" required></textarea></label>
          <label><span>정렬 순서</span><input name="displayOrder" type="number" value="1"></label>
          <label><span>사용 여부</span><select name="isActive"><option value="Y">Y</option><option value="N">N</option></select></label>
          <button class="admin-btn full" type="submit">FAQ 저장</button>
        </form>
      </div>
    `;
  }

  async function renderNotifications() {
    const logs = await loadNotifications();
    const rows = logs.map((log) => {
      const logId = value(log, ["logId", "id"], "-");
      return `
        <tr>
          <td>${escapeHtml(logId)}</td>
          <td>${escapeHtml(value(log, ["targetUserId", "userId"], "-"))}</td>
          <td>${escapeHtml(value(log, ["type"], "-"))}</td>
          <td>${escapeHtml(shortText(value(log, ["content", "message"], "-"), 60))}</td>
          <td>${successBadge(value(log, ["isSuccess", "success"], "-"))}</td>
          <td>${escapeHtml(formatDate(value(log, ["sentAt", "createdAt"], null)))}</td>
          <td class="admin-actions"><button class="admin-btn ghost" type="button" data-notification-detail="${escapeAttr(logId)}">상세보기</button></td>
        </tr>
      `;
    }).join("");

    return `
      <article class="admin-card">
        <div class="admin-card-head"><h2>이메일 / 알림 로그</h2></div>
        <div class="admin-table-wrap"><table class="admin-table">
          <thead><tr><th>로그 ID</th><th>대상 회원</th><th>타입</th><th>내용</th><th>성공 여부</th><th>발송 일시</th><th>관리</th></tr></thead>
          <tbody>${rows || emptyRow(7, "알림 로그가 없습니다.")}</tbody>
        </table></div>
      </article>
    `;
  }

  async function renderNotificationDetail() {
    const logs = await loadNotifications();
    const log = findById(logs, state.selected.notificationId, ["logId", "id"]);
    if (!log) {
      return `
        <article class="admin-card admin-state-card">
          <h2>알림 상세를 선택해주세요.</h2>
          <p>알림 로그 목록에서 상세보기를 누르면 이 영역에 상세 정보가 표시됩니다.</p>
          <button class="admin-btn" type="button" data-sub-tab="notifications">알림 로그 보기</button>
        </article>
      `;
    }

    return `
      <article class="admin-card">
        <div class="admin-card-head"><h2>알림 상세</h2><button class="admin-btn ghost" type="button" data-sub-tab="notifications">목록으로</button></div>
        <dl class="admin-detail-grid">
          ${detailItem("로그 ID", value(log, ["logId", "id"], "-"))}
          ${detailItem("대상 회원 ID", value(log, ["targetUserId", "userId"], "-"))}
          ${detailItem("타입", value(log, ["type"], "-"))}
          ${detailItem("성공 여부", successBadge(value(log, ["isSuccess", "success"], "-")), true)}
          ${detailItem("실패 사유", value(log, ["failReason"], "-"))}
          ${detailItem("발송 일시", formatDate(value(log, ["sentAt", "createdAt"], null)))}
          ${detailItem("내용", value(log, ["content", "message"], "-"), false, "wide-item")}
        </dl>
      </article>
    `;
  }

  async function submitUserStatus(form) {
    const userId = form.userId.value;
    const status = form.status.value;
    await requestJson(`/api/admin/users/${encodeURIComponent(userId)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    clearCache("users", "auditLogs");
    state.activeSubTabs.users = "users";
    await renderActiveContent();
  }

  async function submitTerms(form) {
      const termId = form.termId ? form.termId.value : null; // 숨겨둔 ID 찾기
      const applyDate = form.applyDate.value ? new Date(form.applyDate.value).toISOString() : null;

      const payload = {
        termType: form.termType.value,
        version: form.version.value,
        content: form.content.value,
        isRequired: form.isRequired.value,
        applyDate
      };

      if (termId) {
        // ★ ID가 있으면 수정 (PUT)
        await requestJson(`/api/admin/terms/${encodeURIComponent(termId)}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        // ★ ID가 없으면 신규 등록 (POST)
        await requestJson("/api/admin/terms", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }

      clearCache("terms", "auditLogs"); // 캐시 지우기 (최신 데이터 갱신)
      state.activeSubTabs.terms = "terms"; // 목록 화면으로 돌아가기
      state.selected.termId = null; // 수정 완료 후 ID 비우기
      await renderActiveContent();
    }

  async function submitInquiryAnswer(form) {
    const inquiryId = form.inquiryId.value;
    await requestJson(`/api/admin/inquiries/${encodeURIComponent(inquiryId)}/answer`, {
      method: "POST",
      body: JSON.stringify({ answer: form.answer.value })
    });
    clearCache("inquiries", "auditLogs");
    state.activeSubTabs.support = "inquiries";
    await renderActiveContent();
  }

  async function submitFaq(form) {
      await requestJson("/api/admin/faqs", {
        method: "POST",
        body: JSON.stringify({
          question: form.question.value,
          answer: form.answer.value,
          displayOrder: Number(form.displayOrder.value || 0),
          isActive: form.isActive.value
        })
      });
      clearCache("faqs", "auditLogs");
      await renderActiveContent();
    }

  async function deleteFaq(faqId) {
    if (!window.confirm("선택한 FAQ를 삭제할까요?")) return;
    await requestJson(`/api/admin/faqs/${encodeURIComponent(faqId)}`, { method: "DELETE" });
    clearCache("faqs", "auditLogs");
    await renderActiveContent();
  }

  async function submitPartyApproval(form) {
    const partyId = form.partyId.value;
    const approved = form.approved.value === "true";
    const rejectReason = form.rejectReason.value;
    await approveParty(partyId, approved, rejectReason);
  }

  async function approveParty(partyId, approved, rejectReason) {
    if (!approved && !rejectReason) {
      rejectReason = window.prompt("거절 사유를 입력해주세요.") || "관리자 거절";
    }
    await requestJson(`/api/admin/parties/${encodeURIComponent(partyId)}/approve`, {
      method: "POST",
      body: JSON.stringify({ approved, rejectReason })
    });
    clearCache("parties", "auditLogs");
    state.activeSubTabs.ott = "ottParties";
    await renderActiveContent();
  }

  async function cancelParty(partyId) {
    if (!window.confirm("해당 OTT 파티를 강제 취소 처리할까요?")) return;
    await requestJson(`/api/admin/parties/${encodeURIComponent(partyId)}/cancel`, { method: "POST" });
    clearCache("parties", "auditLogs");
    state.activeSubTabs.ott = "ottParties";
    await renderActiveContent();
  }

  function value(source, keys, fallback = "") {
    if (!source) return fallback;
    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null && source[key] !== "") return source[key];
    }
    return fallback;
  }

  function findById(items, id, keys) {
    return items.find((item) => keys.some((key) => String(item[key]) === String(id)));
  }

  function detailRow(leftLabel, leftValue, rightLabel, rightValue, html = false) {
    return `
      <div class="admin-detail-row">
        <div class="admin-detail-cell">
          <dt>${escapeHtml(leftLabel)}</dt>
          <dd>${html ? leftValue : escapeHtml(leftValue ?? "-")}</dd>
        </div>
        <div class="admin-detail-cell">
          <dt>${escapeHtml(rightLabel)}</dt>
          <dd>${html ? rightValue : escapeHtml(rightValue ?? "-")}</dd>
        </div>
      </div>
    `;
  }

  function detailItem(label, data, html = false, className = "") {
    return `<div class="${className}"><dt>${escapeHtml(label)}</dt><dd>${html ? data : escapeHtml(data ?? "-")}</dd></div>`;
  }

  function badge(text, color = "gray") {
    return `<span class="admin-badge badge-${color}">${escapeHtml(text ?? "-")}</span>`;
  }

  function statusBadge(status) {
    const normalized = String(status || "-").toUpperCase();
    const colorMap = {
      ACTIVE: "green",
      APPROVED: "green",
      ANSWERED: "green",
      SUCCESS: "green",
      WAITING: "yellow",
      PENDING: "yellow",
      SUSPENDED: "yellow",
      REJECTED: "red",
      WITHDRAWN: "red",
      CANCELED: "red",
      FAILED: "red"
    };
    return badge(normalized, colorMap[normalized] || "gray");
  }

  function requiredBadge(flag) {
    const normalized = String(flag ?? "-").toUpperCase();
    return badge(normalized, normalized === "Y" || normalized === "TRUE" ? "green" : "gray");
  }

  function successBadge(flag) {
    const normalized = String(flag ?? "-").toUpperCase();
    return badge(normalized, normalized === "Y" || normalized === "TRUE" || normalized === "SUCCESS" ? "green" : "red");
  }

  function selectHtml(name, options, selectedValue) {
    return `<select name="${escapeAttr(name)}">${options.map((option) => `<option value="${escapeAttr(option)}" ${String(option) === String(selectedValue) ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select>`;
  }

  function emptyRow(colspan, message) {
    return `<tr><td colspan="${colspan}" class="admin-empty-cell">${escapeHtml(message)}</td></tr>`;
  }

  function formatDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value).replace("T", " ");
    return date.toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  }

  function formatPrice(value) {
    if (value === null || value === undefined || value === "") return "-";
    const number = Number(value);
    if (Number.isNaN(number)) return value;
    return `${number.toLocaleString("ko-KR")}원`;
  }

  function shortText(text, length) {
    const raw = String(text ?? "");
    return raw.length > length ? `${raw.slice(0, length)}...` : raw;
  }

  function escapeHtml(input) {
    return String(input ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(input) {
    return escapeHtml(input).replaceAll("`", "&#096;");
  }
})();
