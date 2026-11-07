// 전역 변수 선언
let expenseChart = null;
let comparisonChart = null;

// ==========================================
// ★ 공통 커스텀 모달 (Alert / Confirm) 로직
// ==========================================
let currentAlertCallback = null;
let currentConfirmCallback = null;

window.openCustomAlert = function(title, message, callback) {
    document.getElementById('alertTitle').innerText = title;
    document.getElementById('alertMessage').innerText = message;
    currentAlertCallback = callback;
    document.getElementById('customAlertModal').style.display = 'flex';
};

window.executeAlertAction = function() {
    document.getElementById('customAlertModal').style.display = 'none';
    if (currentAlertCallback) currentAlertCallback();
    currentAlertCallback = null;
};

window.openCustomConfirm = function(title, message, callback) {
    document.getElementById('confirmTitle').innerText = title;
    document.getElementById('confirmMessage').innerText = message;
    currentConfirmCallback = callback;
    document.getElementById('customConfirmModal').style.display = 'flex';
};

window.closeConfirmModal = function() {
    document.getElementById('customConfirmModal').style.display = 'none';
    currentConfirmCallback = null;
};

window.executeConfirmAction = function() {
    if (currentConfirmCallback) currentConfirmCallback();
    closeConfirmModal();
};

// ==========================================
// 1. 차트 초기화 및 색상 패레트 연동
// ==========================================
function getGradientColors(dataArray) {
    const palette = ['#112D4E', '#1A365D', '#23406D', '#2C4A7C', '#3F72AF', '#5687C2', '#709DD4', '#8BB3E4', '#A6C9F2', '#DBE2EF'];
    let mapped = dataArray.map((val, idx) => ({ val: Number(val), idx: idx }));
    mapped.sort((a, b) => b.val - a.val);
    let colors = new Array(dataArray.length);
    mapped.forEach((item, rank) => { colors[item.idx] = palette[Math.min(rank, palette.length - 1)]; });
    return colors;
}

function renderCategoryDetails(dataObj, colors) {
    const container = document.getElementById('categoryDetailList');
    const mostBox = document.getElementById('mostSpentBox');
    if (!container || !mostBox) return;

    let total = Number(dataObj.total) || 0;
    let html = '';
    let maxItem = { label: '', amount: 0, percent: 0 };

    let items = dataObj.labels.map((label, idx) => {
        let amount = Number(dataObj.data[idx]);
        let percent = total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
        return { label: label, amount: amount, percent: percent, color: colors[idx] };
    });

    items.sort((a, b) => b.amount - a.amount);
    if (items.length > 0) maxItem = items[0];

    items.forEach(item => {
        html += `
            <div class="detail-item">
                <div class="detail-item-header">
                    <span>${item.label}</span>
                    <span class="detail-item-amount">₩${item.amount.toLocaleString()} (${item.percent}%)</span>
                </div>
                <div class="progress-bg">
                    <div class="progress-fill" style="width: ${item.percent}%; background-color: ${item.color};"></div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    if (maxItem.amount > 0) {
        mostBox.innerHTML = `가장 많은 지출: <strong>${maxItem.label}</strong> (₩${maxItem.amount.toLocaleString()}, ${maxItem.percent}%)`;
    } else {
        mostBox.innerHTML = `아직 기록된 지출 내역이 없습니다.`;
    }
}

function initChart() {
    const ctx = document.getElementById('expenseChart');
    if (!ctx) return;
    const datasets = window.chartDataSets;
    if (!datasets || !datasets['all']) return;

    const initialData = datasets['all'];
    const dynamicColors = getGradientColors(initialData.data);

    expenseChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: { labels: initialData.labels, datasets: [{ data: initialData.data, backgroundColor: dynamicColors, borderWidth: 2, borderColor: '#ffffff' }] },
        options: { layout: { padding: 0 }, responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { display: false }, tooltip: { enabled: true, callbacks: { label: function(context) { return ` ${context.label || ''}: ₩${(context.raw || 0).toLocaleString()}`; } } } } }
    });
    renderCategoryDetails(initialData, dynamicColors);
}

function initComparisonChart() {
    const ctx = document.getElementById('comparisonChart');
    const barData = window.barChartData;
    const labels = window.monthLabels;
    if (!ctx || !barData) return;

    comparisonChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: barData.labels,
            datasets: [
                { label: '저번 달 (' + (labels ? labels.last : '') + ')', data: barData.lastMonth, backgroundColor: '#DBE2EF', borderRadius: 4 },
                { label: '이번 달 (' + (labels ? labels.current : '') + ')', data: barData.thisMonth, backgroundColor: '#3F72AF', borderRadius: 4 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { callback: v => v.toLocaleString() + '원' } } } }
    });
}

window.updateChart = function(type, event) {
    if (!expenseChart || !window.chartDataSets) return;
    document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
    if (event) event.currentTarget.classList.add('active');

    const newData = window.chartDataSets[type];
    if (!newData) return;
    const newColors = getGradientColors(newData.data);

    expenseChart.data.labels = newData.labels;
    expenseChart.data.datasets[0].data = newData.data;
    expenseChart.data.datasets[0].backgroundColor = newColors;
    expenseChart.update();
    renderCategoryDetails(newData, newColors);
}

// ==========================================
// 2. 공통 유틸 및 메인 탭 전환 로직
// ==========================================
window.formatNumber = function(input) {
    const originalLength = input.value.length;
    const cursorPosition = input.selectionStart;

    const rawValue = input.value.replace(/[^0-9]/g, '');

    if (!rawValue) {
        input.value = '';
        return;
    }

    const formattedValue = parseInt(rawValue, 10).toLocaleString('ko-KR');
    input.value = formattedValue;

    const newLength = input.value.length;
    let newCursorPosition = cursorPosition + (newLength - originalLength);

    if (newCursorPosition < 0) newCursorPosition = 0;

    try {
        input.setSelectionRange(newCursorPosition, newCursorPosition);
    } catch (e) {}
};

function getTodayDate() { return new Date().toISOString().substring(0, 10); }

window.changeTab = function(tabName, element) {
    document.querySelectorAll('#mainTabs .tab').forEach(t => t.classList.remove('active'));
    element.classList.add('active');

    const expBtn = document.getElementById('mainExpenseBtn');
    const savBtn = document.getElementById('mainSavingBtn');

    if (tabName === 'goal') {
        if(expBtn) expBtn.style.display = 'none';
        if(savBtn) savBtn.style.display = 'inline-block';
    } else {
        if(expBtn) expBtn.style.display = 'inline-block';
        if(savBtn) savBtn.style.display = 'none';
    }

    // ★ 탭 내용 전환 및 차트 크기 재조정
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    const targetContent = document.getElementById('tab-' + tabName);
    if(targetContent) {
        targetContent.style.display = 'block';
        if(tabName === 'monthly' && comparisonChart) comparisonChart.resize();
        if(tabName === 'goal' && goalProgressChart) goalProgressChart.resize(); // ★ 목표 차트 리사이징 추가
    }
};

// ==========================================
// ★ 은아님 전용: 카테고리별 변화 분석 (가로 게이지바) 렌더링
// ==========================================
function renderCategoryChange() {
    const container = document.getElementById('categoryChangeList');
    if(!container || !window.barChartData) return;

    const data = window.barChartData;
    let html = '';

    data.labels.forEach((label, i) => {
        const current = data.thisMonth[i];
        const last = data.lastMonth[i];

        if(current === 0 && last === 0) return; // 둘 다 0원인 항목은 생략

        const diff = current - last;
        const isIncrease = diff > 0;
        const diffText = isIncrease ? `+₩${diff.toLocaleString()}` : `-₩${Math.abs(diff).toLocaleString()}`;
        const diffColor = isIncrease ? '#e57373' : '#3F72AF'; // 증가면 빨간색, 감소면 파란색

        let percent = 0;
        if(last > 0) percent = Math.abs(diff) / last * 100;
        else if(current > 0) percent = 100;

        const maxVal = Math.max(current, last, 1);
        const curWidth = (current / maxVal) * 100;
        const lastWidth = (last / maxVal) * 100;

        html += `
            <div class="change-item">
                <div class="change-header">
                    <span class="c-label">${label}</span>
                    <span class="c-diff" style="color: ${diffColor}; font-weight: bold;">
                        ${diffText} (${percent.toFixed(1)}%)
                    </span>
                </div>
                <div class="bar-row">
                    <span class="bar-label">이번 달</span>
                    <div class="bar-bg"><div class="bar-fill current-fill" style="width: ${curWidth}%;"></div></div>
                    <span class="bar-amt">₩${current.toLocaleString()}</span>
                </div>
                <div class="bar-row">
                    <span class="bar-label">지난 달</span>
                    <div class="bar-bg"><div class="bar-fill last-fill" style="width: ${lastWidth}%;"></div></div>
                    <span class="bar-amt" style="color:#8b95a1;">₩${last.toLocaleString()}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html || '<div class="empty-list" style="margin-top:20px;">비교할 지출 내역이 없습니다.</div>';
}

window.onload = function() {
    initChart();
    initComparisonChart();
    renderCategoryChange();
    if (typeof initGoalChart === 'function') initGoalChart();
};

// ==========================================
// 3. 지출 내역 추가 및 수정/삭제
// ==========================================
let currentTab = 'daily';
let selectedCategoryName = null;
let selectedCategoryId = null;
let pendingEntries = [];
let editSelectedCategoryId = null;
let editSelectedCategoryName = null;

window.switchTab = function(tab, event) {
    currentTab = tab;
    document.querySelectorAll('#modalTabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    if(event) event.currentTarget.classList.add('active');
    renderEnteredList();
}

document.querySelectorAll('#categoryContainer .cat-box').forEach(box => {
    box.addEventListener('click', function() {
        document.querySelectorAll('#categoryContainer .cat-box').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        selectedCategoryId = this.getAttribute('data-id');
        selectedCategoryName = this.getAttribute('data-name');
    });
});

window.openExpenseModal = function(mode) {
    const modal = document.getElementById('quickEntryModal');
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    document.getElementById('amountInput').value = '';
    const dateInput = document.getElementById('expenseDateInput');
    if(dateInput) dateInput.value = getTodayDate();
    document.querySelectorAll('#categoryContainer .cat-box').forEach(c => c.classList.remove('active'));
    selectedCategoryId = null;
    selectedCategoryName = null;
    pendingEntries = [];
    const firstTab = document.querySelector('#modalTabs .tab-btn');
    if(firstTab) firstTab.click();
};

window.closeExpenseModal = function() {
    const modal = document.getElementById('quickEntryModal');
    if(modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
};

window.addToList = function() {
    const amountVal = document.getElementById('amountInput').value.replace(/[^0-9]/g, '');
    const selectedDate = document.getElementById('expenseDateInput').value || getTodayDate();
    if (!selectedCategoryId) { openCustomAlert('입력 오류', '카테고리를 선택해 주세요.'); return; }
    if (!amountVal) { openCustomAlert('입력 오류', '금액을 입력해 주세요.'); return; }

    pendingEntries.push({ type: currentTab, categoryId: selectedCategoryId, name: selectedCategoryName, amount: parseInt(amountVal), expenseDate: selectedDate });
    document.getElementById('amountInput').value = '';
    renderEnteredList();
};

function renderEnteredList() {
    const container = document.getElementById('enteredList');
    if(!container) return;
    container.innerHTML = '';
    const newItemsWithIndex = pendingEntries.map((e, idx) => ({ ...e, originalIndex: idx }));
    const newItems = newItemsWithIndex.filter(e => e.type === currentTab);
    const dbItems = (window.dbExpenses || []).filter(e => e.type === currentTab && e.categoryId != 11);

    if (newItems.length === 0 && dbItems.length === 0) {
        container.innerHTML = '<div class="empty-list">아직 입력된 내역이 없습니다.</div>';
        return;
    }

    const iconText = currentTab === 'fixed' ? '고정' : '변동';
    let html = '';

    function buildGroupHtml(items, groupTitle, isDb) {
        if (items.length === 0) return '';
        let groupHtml = '<div class="list-group-title" style="color: ' + (isDb ? '#8b95a1' : '#3F72AF') + ';">' + groupTitle + '</div>';

        items.forEach((entry) => {
            const formattedAmount = Number(entry.amount).toLocaleString();
            const realId = isDb ? entry.id : entry.originalIndex;
            groupHtml +=
                `<div class="list-item" onclick="openEditModal('${realId}', ${isDb})" style="cursor: pointer;">
                    <div class="item-left">
                        <div class="item-icon" style="font-size: 12px; font-weight: bold;">${iconText}</div>
                        <div class="item-details">
                            <div class="item-title">${entry.name}</div>
                            <div class="item-subtitle">${entry.expenseDate || '날짜 없음'}</div>
                        </div>
                    </div>
                    <div class="item-right">
                        <div class="item-amount" style="color: #112D4E;">-₩${formattedAmount}</div>
                    </div>
                </div>`;
        });
        return groupHtml;
    }

    html += buildGroupHtml(newItems, '새로 추가된 내역 (저장 대기중)', false);
    html += buildGroupHtml(dbItems, '기존 저장된 내역', true);
    container.innerHTML = html;
}

window.saveAllData = function() {
    if (pendingEntries.length === 0) { openCustomAlert("저장 오류", "새로 추가된 지출 내역이 없습니다."); return; }
    const requests = pendingEntries.map(entry => {
        return fetch('/api/v1/expenses', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                categoryId: parseInt(entry.categoryId),
                amount: entry.amount,
                expenseDate: entry.expenseDate,
                isFixed: entry.type === 'fixed' ? 'Y' : 'N'
            })
        });
    });
    Promise.all(requests).then(responses => {
        if (responses.every(r => r.ok)) {
            openCustomAlert('저장 완료', '새로운 지출 내역이 성공적으로 저장되었습니다!', () => location.reload());
        }
        else { openCustomAlert('저장 실패', '일부 내역 저장에 실패했습니다.'); }
    });
};

document.querySelectorAll('#editCategoryContainer .edit-cat').forEach(box => {
    box.addEventListener('click', function() {
        document.querySelectorAll('#editCategoryContainer .edit-cat').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        editSelectedCategoryId = this.getAttribute('data-id');
        editSelectedCategoryName = this.getAttribute('data-name');
    });
});

window.openEditModal = function(id, isDb) {
    let item = isDb ? window.dbExpenses.find(e => e.id == id) : pendingEntries[id];
    if (!item) return;

    document.getElementById('editExpenseModal').style.display = 'flex';
    document.getElementById('editTargetId').value = id;
    document.getElementById('editTargetIsDb').value = isDb;
    document.getElementById('editOriginalAmountDisplay').innerText = Number(item.amount).toLocaleString() + '원';
    document.getElementById('editAmountInput').value = Number(item.amount).toLocaleString();
    document.getElementById('editExpenseDateInput').value = item.expenseDate || getTodayDate();

    document.querySelectorAll('#editCategoryContainer .edit-cat').forEach(c => {
        c.classList.remove('active');
        if (c.getAttribute('data-id') == item.categoryId) {
            c.classList.add('active');
            editSelectedCategoryId = item.categoryId;
            editSelectedCategoryName = item.name;
        }
    });
}

window.closeEditModal = function() { document.getElementById('editExpenseModal').style.display = 'none'; }

window.submitEdit = function() {
    const id = document.getElementById('editTargetId').value;
    const isDb = document.getElementById('editTargetIsDb').value === 'true';
    const amountVal = document.getElementById('editAmountInput').value.replace(/[^0-9]/g, '');
    const dateVal = document.getElementById('editExpenseDateInput').value;

    if (!editSelectedCategoryId || !amountVal) { openCustomAlert("입력 오류", "카테고리와 금액을 모두 입력해주세요."); return; }

    if (isDb) {
        fetch('/api/v1/expenses/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryId: parseInt(editSelectedCategoryId), amount: parseInt(amountVal), expenseDate: dateVal, isFixed: currentTab === 'fixed' ? 'Y' : 'N' })
        }).then(res => {
            if(res.ok) {
                let targetIndex = window.dbExpenses.findIndex(e => e.id == id);
                if(targetIndex !== -1) {
                    window.dbExpenses[targetIndex].categoryId = editSelectedCategoryId;
                    window.dbExpenses[targetIndex].name = editSelectedCategoryName;
                    window.dbExpenses[targetIndex].amount = parseInt(amountVal);
                    window.dbExpenses[targetIndex].expenseDate = dateVal;
                    window.dbExpenses[targetIndex].type = currentTab === 'fixed' ? 'fixed' : 'daily';
                }
                closeEditModal();
                renderEnteredList();
                openCustomAlert("수정 완료", "내역이 성공적으로 수정되었습니다.");
            } else {
                openCustomAlert("수정 실패", "수정에 실패했습니다.");
            }
        });
    } else {
        pendingEntries[id].categoryId = editSelectedCategoryId;
        pendingEntries[id].name = editSelectedCategoryName;
        pendingEntries[id].amount = parseInt(amountVal);
        pendingEntries[id].expenseDate = dateVal;
        closeEditModal();
        renderEnteredList();
        openCustomAlert("수정 완료", "목록 내용이 수정되었습니다.");
    }
}

window.submitDelete = function() {
    const id = document.getElementById('editTargetId').value;
    const isDb = document.getElementById('editTargetIsDb').value === 'true';

    openCustomConfirm('지출 내역 삭제', '이 지출 내역을 정말 삭제하시겠습니까?', function() {
        if (isDb) {
            fetch('/api/v1/expenses/' + id, { method: 'DELETE' }).then(res => {
                if(res.ok) {
                    window.dbExpenses = window.dbExpenses.filter(e => e.id != id);
                    closeEditModal();
                    renderEnteredList();
                    openCustomAlert("삭제 완료", "내역이 안전하게 삭제되었습니다.");
                } else {
                    openCustomAlert("삭제 실패", "삭제 처리에 실패했습니다.");
                }
            });
        } else {
            pendingEntries.splice(id, 1);
            closeEditModal();
            renderEnteredList();
            openCustomAlert("삭제 완료", "목록에서 내역이 삭제되었습니다.");
        }
    });
}

// ==========================================
// 4. 저축 내역 추가 및 수정/삭제
// ==========================================
let currentSavingTab = 'regular';
let pendingSavingEntries = [];

window.populateSavingGoalDropdown = function(selectId, tabOrType) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML = '<option value="">목표를 선택해주세요</option>';

    const isFixed = tabOrType === 'fixed' ? 'Y' : 'N';
    const filteredGoals = (window.serverGoals || []).filter(g => String(g.isFixed) === isFixed);

    filteredGoals.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g.id;
        opt.text = g.name;
        select.appendChild(opt);
    });

    // ★ 고정 저축 탭일 때, DB에 저장된 고정 목표가 있으면 드롭박스에 자동으로 선택되게 만듭니다.
    if (tabOrType === 'fixed' && filteredGoals.length > 0) {
        select.value = filteredGoals[0].id;
    }
};

window.switchSavingTab = function(tab, event) {
    currentSavingTab = tab;
    document.querySelectorAll('#savingModalTabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    if(event) event.currentTarget.classList.add('active');

    // ★ 탭에 따라 "어떤 목표에 저축하시나요?" 문구를 끄고 켭니다.
    const goalLabel = document.getElementById('savingGoalLabel');
    if (goalLabel) {
        if (tab === 'fixed') {
            goalLabel.style.display = 'none'; // 고정 저축 탭: 숨김
        } else {
            goalLabel.style.display = 'block'; // 일반 저축 탭: 표시
        }
    }

    populateSavingGoalDropdown('savingGoalSelect', tab);
    renderSavingList();
};

// 모달 열 때 기본값 설정 및 드롭다운 초기화
window.openSavingModal = function() {
    try {
        if (document.getElementById('savingDateInput')) document.getElementById('savingDateInput').value = getTodayDate();
        if (document.getElementById('savingAmountInput')) document.getElementById('savingAmountInput').value = '';
        pendingSavingEntries = [];

        // 모달을 열면 일반 저축 탭이 기본으로 클릭되며 초기화됩니다.
        const firstSavingTab = document.querySelector('#savingModalTabs .tab-btn');
        if(firstSavingTab) firstSavingTab.click();

        const modal = document.getElementById('savingEntryModal');
        if (modal) modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } catch (e) {
        console.error("저축 모달 에러: ", e);
    }
};

window.closeSavingModal = function() {
    const modal = document.getElementById('savingEntryModal');
    if(modal) modal.style.display = 'none';
    document.body.style.overflow = '';
};

window.addToSavingList = function() {
    const amountVal = document.getElementById('savingAmountInput').value.replace(/[^0-9]/g, '');
    const selectedDate = document.getElementById('savingDateInput').value || getTodayDate();
    const goalSelect = document.getElementById('savingGoalSelect');
    const goalId = goalSelect.value;

    if (!goalId) { openCustomAlert('입력 오류', '목표를 선택해 주세요.'); return; }
    if (!amountVal) { openCustomAlert('입력 오류', '금액을 입력해 주세요.'); return; }

    const goalName = goalSelect.options[goalSelect.selectedIndex].text;

    pendingSavingEntries.push({
        type: currentSavingTab,
        categoryId: 11,
        goalId: goalId,
        name: goalName, // 깔끔한 목표 이름만 유지
        amount: parseInt(amountVal),
        expenseDate: selectedDate
    });

    document.getElementById('savingAmountInput').value = '';
    renderSavingList();
};

function renderSavingList() {
    const container = document.getElementById('savingEnteredList');
    if(!container) return;
    container.innerHTML = '';

    const newItemsWithIndex = pendingSavingEntries.map((e, idx) => ({ ...e, originalIndex: idx }));
    const newItems = newItemsWithIndex.filter(e => e.type === currentSavingTab);
    const isFixed = currentSavingTab === 'fixed' ? 'Y' : 'N';
    const dbItems = (window.dbExpenses || []).filter(e => e.categoryId == 11 && e.type === (isFixed === 'Y' ? 'fixed' : 'daily'));

    if (newItems.length === 0 && dbItems.length === 0) {
        container.innerHTML = '<div class="empty-list">아직 입력된 내역이 없습니다.</div>';
        return;
    }

    const iconText = currentSavingTab === 'fixed' ? '고정' : '일반';
    let html = '';

    function buildGroupHtml(items, groupTitle, isDb) {
        if (items.length === 0) return '';
        let groupHtml = '<div class="list-group-title" style="color: ' + (isDb ? '#8b95a1' : '#2b6cb0') + ';">' + groupTitle + '</div>';

        items.forEach((entry) => {
            const formattedAmount = Number(entry.amount).toLocaleString();
            const realId = isDb ? entry.id : entry.originalIndex;

            let displayTitle = entry.name;

            if (isDb) {
                if (entry.goalId) {
                    let matchedGoal = (window.serverGoals || []).find(g => String(g.id) === String(entry.goalId));
                    if (matchedGoal) {
                        displayTitle = matchedGoal.name;
                    } else if (entry.goalName) {
                        displayTitle = entry.goalName;
                    }
                } else if (entry.goalName) {
                    displayTitle = entry.goalName;
                }
            }

            groupHtml +=
                `<div class="list-item" onclick="openSavingEditModal('${realId}', ${isDb})" style="cursor: pointer;">
                    <div class="item-left">
                        <div class="item-icon" style="background: #2b6cb0; font-size: 12px; font-weight: bold;">${iconText}</div>
                        <div class="item-details">
                            <div class="item-title">${displayTitle}</div>
                            <div class="item-subtitle">${entry.expenseDate || '날짜 없음'}</div>
                        </div>
                    </div>
                    <div class="item-right">
                        <div class="item-amount" style="color: #2b6cb0;">+₩${formattedAmount}</div>
                    </div>
                </div>`;
        });
        return groupHtml;
    }

    html += buildGroupHtml(newItems, '새로 추가된 내역 (저장 대기중)', false);
    html += buildGroupHtml(dbItems, '기존 저장된 내역', true);
    container.innerHTML = html;
}

window.saveAllSavingData = function() {
    if (pendingSavingEntries.length === 0) { openCustomAlert("저장 오류", "추가된 저축 내역이 없습니다."); return; }
    const requests = pendingSavingEntries.map(entry => {
        return fetch('/api/v1/expenses', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                categoryId: entry.categoryId,
                amount: entry.amount,
                expenseDate: entry.expenseDate,
                isFixed: entry.type === 'fixed' ? 'Y' : 'N',
                goalId: parseInt(entry.goalId)
            })
        });
    });

    Promise.all(requests).then(responses => {
        if (responses.every(r => r.ok)) {
            openCustomAlert('저장 완료', '새로운 저축 내역이 성공적으로 저장되었습니다!', () => location.reload());
        }
        else { openCustomAlert('저장 실패', '일부 저장에 실패했습니다.'); }
    });
};

window.openSavingEditModal = function(id, isDb) {
    let item = isDb ? window.dbExpenses.find(e => e.id == id) : pendingSavingEntries[id];
    if (!item) return;

    document.getElementById('editSavingModal').style.display = 'flex';
    document.getElementById('editSavingTargetId').value = id;
    document.getElementById('editSavingTargetIsDb').value = isDb;
    document.getElementById('editSavingOriginalAmountDisplay').innerText = Number(item.amount).toLocaleString() + '원';
    document.getElementById('editSavingAmountInput').value = Number(item.amount).toLocaleString();
    document.getElementById('editSavingDateInput').value = item.expenseDate || getTodayDate();

    // ★ 수정창을 열 때도 '해당 항목의 속성(고정/일반)'에 맞는 목표만 드롭다운에 출력합니다.
    populateSavingGoalDropdown('editSavingGoalSelect', item.type);

    const goalSelect = document.getElementById('editSavingGoalSelect');
    if (goalSelect) {
        goalSelect.value = '';
        if (item.goalId) {
            goalSelect.value = String(item.goalId);
            if (goalSelect.selectedIndex <= 0) {
                for (let i = 0; i < goalSelect.options.length; i++) {
                    if (String(goalSelect.options[i].value) === String(item.goalId)) {
                        goalSelect.selectedIndex = i;
                        break;
                    }
                }
            }
        }
    }
}

window.closeSavingEditModal = function() {
    document.getElementById('editSavingModal').style.display = 'none';
}

window.submitSavingEdit = function() {
    const id = document.getElementById('editSavingTargetId').value;
    const isDb = document.getElementById('editSavingTargetIsDb').value === 'true';
    const amountVal = document.getElementById('editSavingAmountInput').value.replace(/[^0-9]/g, '');
    const dateVal = document.getElementById('editSavingDateInput').value;
    const goalSelect = document.getElementById('editSavingGoalSelect');
    const goalId = goalSelect.value;

    if (!goalId || !amountVal) { openCustomAlert("입력 오류", "목표와 금액을 모두 입력해주세요."); return; }

    if (isDb) {
        fetch('/api/v1/expenses/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryId: 11, amount: parseInt(amountVal), expenseDate: dateVal, isFixed: currentSavingTab === 'fixed' ? 'Y' : 'N', goalId: parseInt(goalId) })
        }).then(res => {
            if(res.ok) {
                let targetIndex = window.dbExpenses.findIndex(e => e.id == id);
                if(targetIndex !== -1) {
                    window.dbExpenses[targetIndex].goalId = goalId;
                    window.dbExpenses[targetIndex].goalName = goalSelect.options[goalSelect.selectedIndex].text;
                    window.dbExpenses[targetIndex].amount = parseInt(amountVal);
                    window.dbExpenses[targetIndex].expenseDate = dateVal;
                    window.dbExpenses[targetIndex].type = currentSavingTab === 'fixed' ? 'fixed' : 'daily';
                }
                closeSavingEditModal();
                renderSavingList();
                openCustomAlert("수정 완료", "저축 내역이 성공적으로 수정되었습니다.");
            } else {
                openCustomAlert("수정 실패", "저축 내역 수정에 실패했습니다.");
            }
        });
    } else {
        const goalName = goalSelect.options[goalSelect.selectedIndex].text;
        pendingSavingEntries[id].goalId = goalId;
        pendingSavingEntries[id].name = goalName;
        pendingSavingEntries[id].amount = parseInt(amountVal);
        pendingSavingEntries[id].expenseDate = dateVal;
        closeSavingEditModal();
        renderSavingList();
        openCustomAlert("수정 완료", "목록 내용이 수정되었습니다.");
    }
}

window.submitSavingDelete = function() {
    const id = document.getElementById('editSavingTargetId').value;
    const isDb = document.getElementById('editSavingTargetIsDb').value === 'true';

    openCustomConfirm('저축 내역 삭제', '이 저축 내역을 정말 삭제하시겠습니까?', function() {
        if (isDb) {
            fetch('/api/v1/expenses/' + id, { method: 'DELETE' }).then(res => {
                if(res.ok) {
                    window.dbExpenses = window.dbExpenses.filter(e => e.id != id);
                    closeSavingEditModal();
                    renderSavingList();
                    openCustomAlert("삭제 완료", "저축 내역이 안전하게 삭제되었습니다.");
                } else {
                    openCustomAlert("삭제 실패", "삭제 처리에 실패했습니다.");
                }
            });
        } else {
            pendingSavingEntries.splice(id, 1);
            closeSavingEditModal();
            renderSavingList();
            openCustomAlert("삭제 완료", "목록에서 내역이 삭제되었습니다.");
        }
    });
}

// ==========================================
// 5. 목표 설정 및 커스텀 삭제 로직
// ==========================================
window.addRegularGoalRow = function(id = '', name = '', amount = '') {
    const container = document.getElementById('regularGoalContainer');
    if(!container) return;
    const rowCount = container.querySelectorAll('.regular-goal-row').length;

    if (rowCount >= 4 && !id) {
        openCustomAlert("추가 오류", "일반 목표는 최대 4개까지만 추가할 수 있습니다.");
        return;
    }

    const showDeleteBtn = (rowCount > 0 || id) ? '' : 'visibility: hidden;';
    const formattedAmount = amount ? Number(amount).toLocaleString() : '';

    const rowHtml = `
        <div class="goal-row regular-goal-row" style="display: flex; gap: 10px; margin-bottom: 12px; align-items: center;">
            <input type="hidden" class="reg-goal-id" value="${id}">
            <input type="text" class="large-input full-input reg-goal-name" value="${name}" style="flex: 1.5; margin-bottom: 0;" placeholder="목표 이름">
            <input type="text" class="large-input full-input reg-goal-amount" value="${formattedAmount}" style="flex: 1; margin-bottom: 0;" placeholder="금액 (₩)" oninput="formatNumber(this)">
            <button type="button" style="width: 45px; height: 48px; border: none; background: #F9F7F7; color: #e57373; border-radius: 12px; cursor: pointer; font-weight: bold; font-size: 16px; ${showDeleteBtn}" onclick="deleteGoal(this, '${id}')">✕</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', rowHtml);
};

window.openGoalModal = function() {
    document.getElementById('fixedGoalId').value = '';
    document.getElementById('fixedGoalName').value = '';
    document.getElementById('fixedGoalAmount').value = '';
    document.getElementById('regularGoalContainer').innerHTML = '';

    const goals = window.serverGoals || [];
    const fixedGoals = goals.filter(g => g.isFixed === 'Y');
    const regGoals = goals.filter(g => g.isFixed === 'N');

    if (fixedGoals.length > 0) {
        document.getElementById('fixedGoalId').value = fixedGoals[0].id;
        document.getElementById('fixedGoalName').value = fixedGoals[0].name;
        document.getElementById('fixedGoalAmount').value = Number(fixedGoals[0].amount).toLocaleString();
    }

    if (regGoals.length > 0) {
        regGoals.forEach(g => addRegularGoalRow(g.id, g.name, g.amount));
    } else {
        addRegularGoalRow();
    }

    document.getElementById('goalRegistrationModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.closeGoalModal = function() {
    document.getElementById('goalRegistrationModal').style.display = 'none';
    document.body.style.overflow = '';
};

window.saveGoalData = function() {
    const requests = [];

    const fixedId = document.getElementById('fixedGoalId').value;
    const fixedName = document.getElementById('fixedGoalName').value.trim();
    const fixedAmount = document.getElementById('fixedGoalAmount').value.replace(/[^0-9]/g, '');

    if (fixedName && fixedAmount) {
        const method = fixedId ? 'PUT' : 'POST';
        const url = fixedId ? '/api/v1/goals/' + fixedId : '/api/v1/goals';

        requests.push(fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                itemName: fixedName,
                itemPrice: parseInt(fixedAmount),
                isFixed: 'Y'
            })
        }));
    }

    const regRows = document.querySelectorAll('.regular-goal-row');

    regRows.forEach(row => {
        const id = row.querySelector('.reg-goal-id').value;
        const name = row.querySelector('.reg-goal-name').value.trim();
        const amount = row.querySelector('.reg-goal-amount').value.replace(/[^0-9]/g, '');

        if (name && amount) {
            const method = id ? 'PUT' : 'POST';
            const url = id ? '/api/v1/goals/' + id : '/api/v1/goals';

            requests.push(fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemName: name,
                    itemPrice: parseInt(amount),
                    isFixed: 'N'
                })
            }));
        }
    });

    if (requests.length === 0) {
        openCustomAlert("입력 오류", "저장할 목표를 하나 이상 입력해주세요.");
        return;
    }

    Promise.all(requests).then(async (responses) => {
        let allSuccess = true;
        let errorMessages = [];

        for (const res of responses) {
            if (!res.ok) {
                allSuccess = false;
                errorMessages.push(await res.text());
            }
        }

        if (allSuccess) {
            openCustomAlert("저장 완료", "목표가 성공적으로 저장되었습니다!", () => location.reload());
        } else {
            openCustomAlert("저장 실패", "저장 실패:\n" + errorMessages.join('\n'));
        }
    }).catch(error => {
        console.error("목표 저장 요청 오류:", error);
        openCustomAlert("저장 실패", "목표 저장 요청 중 오류가 발생했습니다.");
    });
};

window.deleteGoal = function(btn, goalId) {
    openCustomConfirm('목표 삭제', '해당 목표를 정말 삭제하시겠습니까?', function() {
        if (goalId) {
            fetch('/api/v1/goals/' + goalId, { method: 'DELETE' })
            .then(res => {
                if(res.ok) {
                    openCustomAlert("삭제 완료", "목표가 삭제되었습니다.", () => location.reload());
                } else {
                    openCustomAlert("삭제 실패", "삭제 실패! 다시 시도해 주세요.");
                }
            });
        } else {
            btn.parentElement.remove();
            openCustomAlert("삭제 완료", "목록에서 제거되었습니다.");
        }
    });
};

// ==========================================
// ★ 목표 달성 진행률 (꺾은선 그래프) 로직
// ==========================================
let goalProgressChart = null;

window.updateGoalChart = function() {
    const select = document.getElementById('goalChartSelect');
    if (!select || !window.serverGoals || !goalProgressChart) return;

    const goalId = select.value;
    if (!goalId) return;

    const goalObj = window.serverGoals.find(g => g.id == goalId);
    const targetAmt = goalObj ? Number(goalObj.amount) : 0;

    // ★ 백엔드에서 받아온 이번 목표 전용 X축(월별 라벨)과 진행률 데이터 가져오기!
    const labels = window.goalChartMonthsMap[goalId] || [];
    const progressData = window.goalProgressData[goalId] || [];

    const percentData = progressData.map(amt => {
        if (targetAmt === 0) return 0;
        return ((amt / targetAmt) * 100).toFixed(1);
    });

    // 차트에 데이터 덮어씌우기 (X축도 목표에 맞게 갈아끼웁니다)
    goalProgressChart.data.labels = labels;
    goalProgressChart.data.datasets[0].data = percentData;
    goalProgressChart.data.datasets[1].data = Array(percentData.length).fill(100);
    goalProgressChart.update();
};

function initGoalChart() {
    const ctx = document.getElementById('goalProgressChart');
    if(!ctx) return; // 캔버스가 없으면 종료

    const select = document.getElementById('goalChartSelect');
    if (select) {
        const fixedOption = Array.from(select.options).find(opt => opt.getAttribute('data-isfixed') === 'Y');
        if (fixedOption) select.value = fixedOption.value;
        else if (select.options.length > 0) select.value = select.options[0].value;
    }

    goalProgressChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: [], // 초기 X축은 비워두고 updateGoalChart에서 채웁니다
            datasets: [
                {
                    label: '진행률 (%)',
                    data: [],
                    borderColor: '#3F72AF',
                    backgroundColor: '#3F72AF',
                    borderWidth: 2,
                    pointRadius: 4,
                    tension: 0.3
                },
                {
                    label: '목표선 (100%)',
                    data: [],
                    borderColor: '#f59e0b',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, suggestedMax: 120, title: { display: true, text: '진행률 (%)' } } },
            plugins: { legend: { position: 'bottom' } }
        }
    });

    updateGoalChart(); // 차트를 다 만들고 나서 렌더링 실행!
}