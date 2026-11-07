<%@ page contentType="text/html; charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<c:set var="menu" value="sales"/>

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/common/include/head.jspf" %>
    <meta charset="UTF-8">
    <title>지출메이트 - 내 판매 목록</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/mypage.css?v=31">

    <style>
        .sales-main { display: flex; flex-direction: column; gap: 24px; }
        .sales-page-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 18px; }
        .sales-title-area { display: flex; flex-direction: column; gap: 8px; }
        .sales-title-area .page-title { margin: 0; }
        .sales-subtitle { margin: 0; color: #6b7280; font-size: 15px; font-weight: 600; line-height: 1.5; }
        .register-post-btn { height: 46px; padding: 0 18px; border: none; border-radius: 999px; background: #243864; color: #ffffff; font-size: 14px; font-weight: 900; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
        .register-post-btn:hover { opacity: 0.92; transform: translateY(-1px); }
        .sales-card { width: 100%; min-height: 620px; padding: 30px 34px; border: 1px solid #e2e4ea; border-radius: 24px; background: #ffffff; box-shadow: 0 8px 24px rgba(17, 24, 39, 0.04); display: flex; flex-direction: column; }
        .empty-box { min-height: 460px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 22px; text-align: center; }
        .empty-box h1 { margin: 0; color: #111111; font-size: 26px; font-weight: 900; letter-spacing: -0.04em; }
        .empty-box p { margin: 0; color: #6b7280; font-size: 15px; font-weight: 600; line-height: 1.6; }
        .primary-btn { min-width: 160px; height: 48px; padding: 0 20px; border: none; border-radius: 14px; background: #243864; color: #ffffff; font-size: 15px; font-weight: 900; cursor: pointer; transition: all 0.2s; }

        .sales-table-wrap { width: 100%; overflow-x: auto; }
        .sales-table { width: 100%; min-width: 880px; border-collapse: collapse; }
        .sales-table thead tr { height: 54px; border-top: 1px solid #e2e4ea; border-bottom: 1px solid #e2e4ea; background: #f8fafc; }
        .sales-table th { color: #222222; font-size: 14px; font-weight: 900; text-align: center; white-space: nowrap; }
        .sales-table tbody tr { min-height: 68px; border-bottom: 1px solid #eef0f4; transition: background 0.2s ease; }
        .sales-table tbody tr:hover { background: #fbfcff; }
        .sales-table td { padding: 18px 12px; color: #333333; font-size: 14px; font-weight: 700; text-align: center; vertical-align: middle; }

        .service-name-cell { color: #111111 !important; font-size: 15px !important; font-weight: 900 !important; }
        .share-id-cell { max-width: 180px; word-break: break-all; }

        .status-badge { min-width: 76px; height: 30px; padding: 0 10px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 900; white-space: nowrap; }
        .status-badge.approved { background: #e9f8ef; color: #1f9d55; }
        .status-badge.waiting { background: #fff4df; color: #d48600; }
        .status-badge.full { background: #eeeeee; color: #666666; }
        .status-badge.rejected { background: #ffe8e8; color: #e53935; }

        .manage-btn-group { display: flex; justify-content: center; align-items: center; gap: 8px; }
        .detail-btn, .delete-btn { min-width: 64px; height: 34px; padding: 0 12px; border-radius: 10px; background: #ffffff; font-size: 13px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .detail-btn { border: 1px solid #243864; color: #243864; }
        .detail-btn:hover { background: #243864; color: #ffffff; transform: translateY(-1px); }
        .delete-btn { border: 1px solid #ff4d4d; color: #ff4d4d; }
        .delete-btn:hover { background: #ff4d4d; color: #ffffff; transform: translateY(-1px); }

        /* 모달 팝업 스타일 */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); display: flex; justify-content: center; align-items: center; z-index: 9999; }
        .modal-content { background: #ffffff; border-radius: 20px; width: 340px; padding: 30px 24px; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .modal-close-btn { position: absolute; top: 16px; right: 20px; font-size: 24px; font-weight: bold; color: #999; background: none; border: none; cursor: pointer; }
        .modal-header { text-align: center; margin-bottom: 24px; font-size: 22px; font-weight: 900; color: #111; }
        .info-group { margin-bottom: 16px; }
        .info-group label { display: block; font-size: 16px; font-weight: 800; color: #111; margin-bottom: 8px; text-align: left; }
        .info-box { border: 1px solid #ddd; border-radius: 12px; padding: 10px 14px; font-size: 14px; color: #333; text-align: center; background: #fff; font-weight: 600; }

        /* 반려 사유 특별 박스 스타일 */
        .reject-box { color: #e53935 !important; border-color: #ffcdd2 !important; background: #fff5f5 !important; }

        /* 알림 페이지와 100% 일치하는 페이지네이션 디자인 */
                .pagination {
                    width: 100%;
                    margin-top: 28px;
                    padding-top: 26px;
                    border-top: 1px solid #eef0f4;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .page-link {
                    min-width: 36px;
                    height: 36px;
                    padding: 0 12px;
                    border: 1px solid #d8dce5;
                    border-radius: 10px;
                    background: #ffffff;
                    color: #4b5563;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-weight: 800;
                    text-decoration: none;
                    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
                }

                .page-link:hover {
                    background: #f4f6fa;
                }

                .page-link.active {
                    background: #243864;
                    border-color: #243864;
                    color: #ffffff;
                }

    </style>
</head>

<body class="mypage is-header-ready is-opening-loaded is-fab-ready">

<%@ include file="/WEB-INF/views/common/layout/header.jspf" %>

<div class="mypage-container">
    <aside class="mypage-sidebar">
        <%@ include file="/WEB-INF/views/members/mypage/mypage-sidebar.jspf" %>
    </aside>

    <main class="sales-main">
        <div class="sales-page-header">
            <div class="sales-title-area">
                <h1 class="page-title">내 판매 목록</h1>
                <p class="sales-subtitle">내가 등록한 구독 공유 판매글의 승인 상태와 판매 정보를 확인할 수 있습니다.</p>
            </div>
            <c:if test="${isSeller}">
                <button type="button" class="register-post-btn" onclick="location.href='${pageContext.request.contextPath}/party/form'">판매글 등록하기</button>
            </c:if>
        </div>

        <section class="sales-card">
            <c:choose>
                <c:when test="${not isSeller}">
                    <div class="empty-box">
                        <h1>판매자 등록을 먼저 해주세요!</h1>
                        <p>구독 공유 판매글을 등록하려면 판매자 인증이 필요합니다.<br>판매자 등록 후 내 판매 목록을 관리할 수 있습니다.</p>
                        <button type="button" class="primary-btn" onclick="location.href='${pageContext.request.contextPath}/mypage/sales/register-identity'">판매자 등록하기</button>
                    </div>
                </c:when>

                <c:when test="${isSeller and empty salesList}">
                    <div class="empty-box">
                        <h1>등록된 판매글이 없습니다.</h1>
                        <p>판매할 구독 서비스를 등록하면 이곳에서 판매 상태를 확인할 수 있습니다.</p>
                        <button type="button" class="primary-btn" onclick="location.href='${pageContext.request.contextPath}/party/form'">판매글 등록하기</button>
                    </div>
                </c:when>

                <c:otherwise>
                    <div class="sales-table-wrap">
                        <table class="sales-table">
                            <thead>
                            <tr>
                                <th>순번</th>
                                <th>서비스명</th>
                                <th>공유 ID</th>
                                <th>월 가격</th>
                                <th>상태</th>
                                <th>등록일</th>
                                <th>관리</th>
                            </tr>
                            </thead>
                            <tbody>
                            <c:forEach var="s" items="${salesList}" varStatus="st">
                                <tr>
                                    <td>${st.count}</td>

                                    <td class="service-name-cell">${s.serviceName}</td>

                                    <td class="share-id-cell">${not empty s.shareId ? s.shareId : '-'}</td>
                                    <td>${s.monthlyPrice}원</td>
                                    <td>
                                        <c:choose>
                                            <c:when test="${s.status eq 'APPROVED'}"><span class="status-badge approved">승인됨</span></c:when>
                                            <c:when test="${s.status eq 'WAITING'}"><span class="status-badge waiting">승인대기</span></c:when>
                                            <c:when test="${s.status eq 'FULL'}"><span class="status-badge full">모집완료</span></c:when>
                                            <c:when test="${s.status eq 'REJECTED' or s.status eq 'CANCELED'}"><span class="status-badge rejected">거절</span></c:when>
                                            <c:otherwise><span class="status-badge full">${s.status}</span></c:otherwise>
                                        </c:choose>
                                    </td>
                                    <td>${not empty s.createdAt ? s.createdAt.toLocalDate() : '-'}</td>
                                    <td>
                                        <div class="manage-btn-group">
                                            <button type="button" class="detail-btn"
                                                    data-name="${s.serviceName}"
                                                    data-price="${s.monthlyPrice}"
                                                    data-id="${not empty s.shareId ? s.shareId : ''}"
                                                    data-pw="${not empty s.sharePassword ? s.sharePassword : ''}"
                                                    data-date="${not empty s.createdAt ? s.createdAt : ''}"
                                                    data-status="${s.status}"
                                                    data-reject="${not empty s.rejectReason ? s.rejectReason : '사유 미기재'}"
                                                    onclick="openDetailModal(this)">
                                                상세
                                            </button>
                                            <button type="button" class="delete-btn"
                                                    onclick="deleteSalePost(${s.id})">
                                                삭제
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </c:forEach>
                            </tbody>
                        </table>
                    </div>


                    <c:if test="${not empty salesPage and salesPage.totalPages > 0}">
                            <div class="pagination">
                                <c:forEach begin="1" end="${salesPage.totalPages}" var="i">
                                    <a href="?page=${i - 1}"
                                       class="page-link ${salesPage.number == (i - 1) ? 'active' : ''}">
                                            ${i}
                                    </a>
                                </c:forEach>
                            </div>
                        </c:if>
                </c:otherwise>
            </c:choose>
        </section>
    </main>
</div>

<div id="detailModal" class="modal-overlay" style="display: none;">
    <div class="modal-content">
        <button type="button" class="modal-close-btn" onclick="closeDetailModal()">×</button>

        <div class="modal-header" id="modalHeaderTitle"></div>

        <div class="modal-body">
            <div class="info-group" id="modalRejectGroup" style="display: none;">
                <label style="color: #e53935;">거절 사유</label>
                <div class="info-box reject-box" id="modalRejectReason"></div>
            </div>

            <div class="info-group"><label>OTT 명</label><div class="info-box" id="modalServiceName"></div></div>
            <div class="info-group"><label>가격</label><div class="info-box" id="modalPrice"></div></div>
            <div class="info-group"><label>아이디</label><div class="info-box" id="modalShareId"></div></div>
            <div class="info-group"><label>비밀번호</label><div class="info-box" id="modalSharePassword"></div></div>
            <div class="info-group"><label>판매 기간</label><div class="info-box" id="modalPeriod"></div></div>
        </div>
    </div>
</div>

<%@ include file="/WEB-INF/views/common/layout/footer.jspf" %>
<%@ include file="/WEB-INF/views/common/include/scripts.jspf" %>

<script>
    function openDetailModal(btnElement) {
        // 데이터 가져오기
        let serviceName = btnElement.getAttribute('data-name');
        let price = btnElement.getAttribute('data-price');
        let shareId = btnElement.getAttribute('data-id');
        let sharePw = btnElement.getAttribute('data-pw');
        let regDate = btnElement.getAttribute('data-date');
        let status = btnElement.getAttribute('data-status');
        let rejectReason = btnElement.getAttribute('data-reject');

        // 기본 정보 세팅
        document.getElementById('modalHeaderTitle').innerText = serviceName + ' 구독 정보';
        document.getElementById('modalServiceName').innerText = serviceName;
        document.getElementById('modalPrice').innerText = Number(price).toLocaleString() + '원';
        document.getElementById('modalShareId').innerText = shareId || '정보 없음';
        document.getElementById('modalSharePassword').innerText = sharePw || '정보 없음';

        let periodText = regDate ? regDate.substring(0, 10) + ' ~ (진행중)' : '-';
        document.getElementById('modalPeriod').innerText = periodText;

        // ★ 반려 사유 노출 제어
        let rejectGroup = document.getElementById('modalRejectGroup');
        if (status === 'REJECTED' || status === 'CANCELED') {
            document.getElementById('modalRejectReason').innerText = rejectReason;
            rejectGroup.style.display = 'block'; // 반려일 때는 보여주기
        } else {
            rejectGroup.style.display = 'none';  // 승인됨, 대기중일 때는 숨기기
        }

        // 모달 띄우기
        document.getElementById('detailModal').style.display = 'flex';
    }

    function closeDetailModal() {
        document.getElementById('detailModal').style.display = 'none';
    }

    function deleteSalePost(partyId) {
        if (!partyId) {
            alert("삭제할 판매글 정보를 확인할 수 없습니다.");
            return;
        }

        const confirmed = confirm("해당 판매글을 삭제하시겠습니까?");

        if (!confirmed) {
            return;
        }

        fetch("${pageContext.request.contextPath}/mypage/sales/" + partyId, {
            method: "DELETE",
            headers: {
                "Accept": "application/json"
            }
        })
            .then(async function (response) {
                const data = await response.json().catch(function () {
                    return null;
                });

                if (!response.ok) {
                    const message = data && data.message
                        ? data.message
                        : "판매글 삭제 중 오류가 발생했습니다.";
                    throw new Error(message);
                }

                alert(data && data.data ? data.data : "판매글이 삭제되었습니다.");
                location.reload();
            })
            .catch(function (error) {
                alert(error.message || "판매글 삭제 중 오류가 발생했습니다.");
            });
    }
</script>

</body>
</html>