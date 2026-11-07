(function () {
    'use strict';

    const modalMap = {
        terms: 'termsOverlay',
        login: 'loginOverlay',
        signup: 'signupOverlay',
        findPassword: 'findPasswordOverlay',
        loginRequired: 'loginRequiredOverlay'
    };

    const enterClassMap = {
        terms: 'sign-terms',
        login: 'sign-in',
        signup: 'sign-up',
        findPassword: 'sign-find',
        loginRequired: 'sign-in'
    };

    let signupTermsLoaded = false;
    let signupTerms = [];
    let termsAgreementPassed = false;
    let authFormsBound = false;
    let authNavigationGuardBound = false;

    const AUTH_ACTIVE_KEY = 'jichulmate:auth-active';
    let allowAuthNavigation = false;

    function getContextPath() {
        const contextMeta = document.querySelector('meta[name="context-path"]');

        if (contextMeta) {
            return contextMeta.getAttribute('content') || '';
        }

        return '';
    }

    function getApiUrl(path) {
        return getContextPath() + path;
    }

    function getNavigationType() {
        const entries = window.performance && typeof window.performance.getEntriesByType === 'function'
            ? window.performance.getEntriesByType('navigation')
            : [];

        if (entries && entries.length > 0) {
            return entries[0].type || 'navigate';
        }

        if (window.performance && window.performance.navigation) {
            return window.performance.navigation.type === 1 ? 'reload' : 'navigate';
        }

        return 'navigate';
    }

    function getHeaderElements() {
        return {
            area: document.getElementById('headerActionArea'),
            authLink: document.getElementById('headerAuthLink'),
            profileLink: document.getElementById('headerProfileLink'),
            avatar: document.getElementById('userAvatarInitial')
        };
    }

    function setHeaderLoggedOut() {
        const header = getHeaderElements();

        if (!header.area) {
            return;
        }

        header.area.dataset.serverLogin = 'false';
        header.area.classList.remove('is-login', 'is-logged-in');
        header.area.classList.add('is-logout', 'is-logged-out');
        header.area.style.display = 'flex';

        if (header.authLink) {
            header.authLink.style.display = 'inline-flex';
            header.authLink.style.visibility = 'visible';
            header.authLink.style.opacity = '1';
            header.authLink.removeAttribute('hidden');
            header.authLink.removeAttribute('aria-hidden');
            header.authLink.classList.remove('is-hidden', 'hidden');
        }

        if (header.profileLink) {
            header.profileLink.style.display = 'none';
            header.profileLink.style.visibility = 'hidden';
            header.profileLink.style.opacity = '0';
            header.profileLink.setAttribute('aria-hidden', 'true');
            header.profileLink.classList.add('is-hidden');
        }

        sessionStorage.removeItem(AUTH_ACTIVE_KEY);
    }

    function getInitialFromLoginData(data, form) {
        if (data) {
            const user = data.user || data.loginUser || data.member || {};

            const source =
                user.nickname ||
                user.name ||
                user.mNickname ||
                user.mName ||
                data.nickname ||
                data.name ||
                data.mNickname ||
                data.mName;

            if (source) {
                return String(source).trim().charAt(0).toUpperCase();
            }
        }

        if (form) {
            const idField = form.querySelector('#loginId, input[name="id"], input[name="email"], input[name="mEmail"]');

            if (idField && idField.value) {
                return String(idField.value).trim().charAt(0).toUpperCase();
            }
        }

        return 'M';
    }

    function setHeaderLoggedIn(data, form) {
        const header = getHeaderElements();

        if (!header.area) {
            return;
        }

        header.area.dataset.serverLogin = 'true';
        header.area.classList.remove('is-logout', 'is-logged-out');
        header.area.classList.add('is-login', 'is-logged-in');
        header.area.style.display = 'flex';

        if (header.authLink) {
            header.authLink.style.display = 'none';
            header.authLink.style.visibility = 'hidden';
            header.authLink.style.opacity = '0';
            header.authLink.setAttribute('aria-hidden', 'true');
            header.authLink.classList.add('is-hidden');
        }

        if (header.profileLink) {
            header.profileLink.style.display = 'inline-flex';
            header.profileLink.style.visibility = 'visible';
            header.profileLink.style.opacity = '1';
            header.profileLink.removeAttribute('hidden');
            header.profileLink.removeAttribute('aria-hidden');
            header.profileLink.classList.remove('is-hidden', 'hidden');
        }

        if (header.avatar) {
            header.avatar.textContent = getInitialFromLoginData(data, form);
        }

        sessionStorage.setItem(AUTH_ACTIVE_KEY, 'true');
    }

    function requestServerLogout() {
        const logoutUrl = getApiUrl('/auth/logout');

        sessionStorage.removeItem(AUTH_ACTIVE_KEY);

        if (navigator.sendBeacon) {
            try {
                const payload = new Blob([], {
                    type: 'application/x-www-form-urlencoded;charset=UTF-8'
                });

                navigator.sendBeacon(logoutUrl, payload);
                return;
            } catch (error) {
                console.warn('[auth-modal] sendBeacon 로그아웃 실패:', error);
            }
        }

        fetch(logoutUrl, {
            method: 'POST',
            keepalive: true,
            headers: {
                'Accept': 'application/json'
            }
        }).catch(function (error) {
            console.warn('[auth-modal] 로그아웃 요청 실패:', error);
        });
    }

    function forceLogoutAndResetHeader() {
        setHeaderLoggedOut();

        return fetch(getApiUrl('/auth/logout'), {
            method: 'POST',
            cache: 'no-store',
            headers: {
                'Accept': 'application/json'
            }
        }).then(function () {
            setHeaderLoggedOut();
        }).catch(function (error) {
            console.warn('[auth-modal] 초기 로그아웃 요청 실패:', error);
            setHeaderLoggedOut();
        });
    }

    function bindAuthNavigationGuard() {
        if (authNavigationGuardBound) {
            return;
        }

        authNavigationGuardBound = true;

        document.addEventListener('click', function (event) {
            const navigationTarget = event.target.closest('a[href], button[onclick*="location"]');

            if (!navigationTarget) {
                return;
            }

            const href = navigationTarget.getAttribute('href');

            if (
                href &&
                href !== '#' &&
                !href.startsWith('#') &&
                !href.startsWith('javascript:')
            ) {
                allowAuthNavigation = true;
                return;
            }

            if (navigationTarget.id === 'headerProfileLink') {
                allowAuthNavigation = true;
            }
        });

        /*
         * 자동 로그아웃 제거:
         * 기존에는 pagehide 이벤트에서 requestServerLogout()을 호출했다.
         * 이 방식은 뒤로가기, 새로고침, 고객센터 이동, 마이페이지 이동 시에도
         * /auth/logout을 호출해서 세션을 끊는 문제가 있었다.
         *
         * 따라서 이 함수에서는 페이지 이동을 감지하더라도 로그아웃을 실행하지 않는다.
         * 로그아웃은 사용자가 명시적으로 로그아웃 버튼을 눌렀을 때만 처리한다.
         */
    }

//    function initializeAuthSessionState() {
//        const header = getHeaderElements();
//
//        if (!header.area) {
//            return;
//        }
//
//        const serverLogin = header.area.dataset.serverLogin === 'true';
//
//        if (serverLogin) {
//            setHeaderLoggedIn(null, null);
//        } else {
//            setHeaderLoggedOut();
//        }
//    }

    function initializeAuthSessionState() {
            // ★ 화면 HTML만 믿지 말고, 백엔드 서버에 직접 진짜 로그인 상태인지 물어봅니다!
            fetch(getApiUrl('/api/auth/status'), {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (data.ok && data.loggedIn) {
                    // 백엔드가 "로그인 맞음!" 하면 화면을 무조건 로그인 상태로 렌더링
                    sessionStorage.setItem('jichulmate:auth-active', 'true');
                    setHeaderLoggedIn(data, null);
                } else {
                    // 서버도 로그아웃이라고 하면 그때 화면을 로그아웃으로 렌더링
                    sessionStorage.removeItem('jichulmate:auth-active');
                    setHeaderLoggedOut();
                }
            })
            .catch(function(error) {
                console.error('[auth-modal] 서버 세션 상태 확인 오류:', error);
            });
        }

    function getOverlay(type) {
        const id = modalMap[type];
        return id ? document.getElementById(id) : null;
    }

    function getDialog(overlay) {
        if (!overlay) {
            return null;
        }

        return overlay.querySelector('.terms-modal, .auth-choice-modal, .auth-modal__dialog');
    }

    function clearMotionClass(dialog) {
        if (!dialog) {
            return;
        }

        dialog.classList.remove(
            'sign-terms',
            'sign-in',
            'sign-up',
            'sign-find',
            'sign-choice',
            'is-exiting',
            'is-shaking'
        );
    }

    function closeAllModals() {
        document.querySelectorAll('.auth-modal-overlay').forEach(function (overlay) {
            const dialog = getDialog(overlay);

            if (dialog) {
                clearMotionClass(dialog);
            }

            overlay.classList.remove('is-open');
            overlay.setAttribute('aria-hidden', 'true');
        });

        document.body.classList.remove('auth-modal-lock');
        termsAgreementPassed = false;
    }

    function focusFirstElement(overlay) {
        const firstFocusable = overlay.querySelector(
            'input, select, textarea, button, a[href], [tabindex]:not([tabindex="-1"])'
        );

        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    function bindAuroraInteraction(dialog) {
        if (!dialog || dialog.dataset.auroraBound === 'true') {
            return;
        }

        dialog.dataset.auroraBound = 'true';

        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let rafId = null;

        function render() {
            currentX += (targetX - currentX) * 0.12;
            currentY += (targetY - currentY) * 0.12;

            dialog.style.setProperty('--mx', currentX.toFixed(4));
            dialog.style.setProperty('--my', currentY.toFixed(4));

            if (
                Math.abs(targetX - currentX) > 0.001 ||
                Math.abs(targetY - currentY) > 0.001
            ) {
                rafId = window.requestAnimationFrame(render);
            } else {
                rafId = null;
            }
        }

        function startRender() {
            if (!rafId) {
                rafId = window.requestAnimationFrame(render);
            }
        }

        dialog.addEventListener('mousemove', function (event) {
            const rect = dialog.getBoundingClientRect();

            if (!rect.width || !rect.height) {
                return;
            }

            targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
            targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

            startRender();
        });

        dialog.addEventListener('mouseleave', function () {
            targetX = 0;
            targetY = 0;
            startRender();
        });
    }

    function openModal(type) {
        if (type === 'signup' && !termsAgreementPassed) {
            type = 'terms';
        }

        const overlay = getOverlay(type);

        if (!overlay) {
            console.warn('[auth-modal] 열 수 없는 모달 타입:', type);
            return;
        }

        closeAllModals();

        const dialog = getDialog(overlay);
        const enterClass = enterClassMap[type];

        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('auth-modal-lock');

        bindAuroraInteraction(dialog);

        if (dialog && enterClass) {
            clearMotionClass(dialog);

            window.requestAnimationFrame(function () {
                dialog.classList.add(enterClass);
            });

            window.setTimeout(function () {
                dialog.classList.remove(enterClass);
            }, 650);
        }

        if (type === 'terms') {
            termsAgreementPassed = false;
            loadSignupTerms();
        }

        if (type === 'login') {
            const loginForm = document.getElementById('loginForm') || document.querySelector('form[action$="/auth/login"]');
            removeLoginSummary(loginForm);
        }

        window.requestAnimationFrame(function () {
            focusFirstElement(overlay);
        });
    }

    function closeWithMotion() {
        const openedOverlay = document.querySelector('.auth-modal-overlay.is-open');

        if (!openedOverlay) {
            closeAllModals();
            return;
        }

        const dialog = getDialog(openedOverlay);

        if (!dialog) {
            closeAllModals();
            return;
        }

        clearMotionClass(dialog);
        dialog.classList.add('is-exiting');

        window.setTimeout(function () {
            closeAllModals();
        }, 280);
    }

    function termsListElement() {
        return document.getElementById('termsList');
    }

    function createElement(tagName, className, text) {
        const element = document.createElement(tagName);

        if (className) {
            element.className = className;
        }

        if (text !== undefined && text !== null) {
            element.textContent = text;
        }

        return element;
    }

    function loadSignupTerms() {
        if (signupTermsLoaded) {
            renderTerms(signupTerms);
            resetTermsState();
            return;
        }

        const termsList = termsListElement();

        if (termsList) {
            termsList.innerHTML = '<div class="terms-loading">이용약관을 불러오는 중입니다.</div>';
        }

        fetch(getApiUrl('/api/terms/signup'), {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('이용약관 조회 실패 - HTTP 상태 코드: ' + response.status);
                }

                return response.json();
            })
            .then(function (data) {
                console.log('[auth-modal] 회원가입 약관 응답:', data);

                signupTerms = Array.isArray(data.terms) ? data.terms : [];
                signupTermsLoaded = true;

                renderTerms(signupTerms);
                resetTermsState();
            })
            .catch(function (error) {
                console.error('[auth-modal] 이용약관 조회 오류:', error);

                signupTermsLoaded = false;
                signupTerms = [];

                if (termsList) {
                    termsList.innerHTML = '<div class="terms-error">이용약관을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</div>';
                }
            });
    }

    function renderTerms(terms) {
        const termsList = termsListElement();

        if (!termsList) {
            return;
        }

        termsList.innerHTML = '';

        if (!terms || terms.length === 0) {
            termsList.innerHTML = '<div class="terms-error">등록된 이용약관이 없습니다. 관리자에게 문의해 주세요.</div>';
            return;
        }

        terms
            .slice()
            .sort(function (a, b) {
                return (a.displayOrder || 0) - (b.displayOrder || 0);
            })
            .forEach(function (term) {
                termsList.appendChild(createTermsItem(term));
            });
    }

    function createTermsItem(term) {
        const article = createElement('article', 'terms-item');
        const top = createElement('div', 'terms-item__top');
        const label = createElement('label', 'terms-check-label');
        const checkbox = document.createElement('input');
        const checkUi = createElement('span', 'terms-check-ui');
        const labelText = createElement(
            'span',
            'terms-label-text',
            '[' + (term.required ? '필수' : '선택') + '] ' + term.title
        );
        const viewButton = createElement('button', 'terms-view-button', '내용 보기 〉');
        const content = createElement('div', 'terms-content');
        const contentTitle = createElement('h3', null, term.title);
        const contentVersion = createElement('p', 'terms-version', '버전: ' + term.version);
        const contentBody = createElement('pre', 'terms-content-text', term.content || '');

        checkbox.type = 'checkbox';
        checkbox.className = 'terms-check';
        checkbox.dataset.required = String(Boolean(term.required));
        checkbox.dataset.termId = String(term.termId);
        checkbox.dataset.termType = term.termType || '';

        checkUi.setAttribute('aria-hidden', 'true');

        viewButton.type = 'button';
        viewButton.dataset.termsToggle = String(term.termId);
        viewButton.setAttribute('aria-expanded', 'false');

        content.dataset.termsContent = String(term.termId);
        content.appendChild(contentTitle);
        content.appendChild(contentVersion);
        content.appendChild(contentBody);

        label.appendChild(checkbox);
        label.appendChild(checkUi);
        label.appendChild(labelText);

        top.appendChild(label);
        top.appendChild(viewButton);

        article.appendChild(top);
        article.appendChild(content);

        return article;
    }

    function getTermsChecks() {
        return Array.from(document.querySelectorAll('.terms-check'));
    }

    function getRequiredTermsChecks() {
        return getTermsChecks().filter(function (checkbox) {
            return checkbox.dataset.required === 'true';
        });
    }

    function isRequiredTermsChecked() {
        const requiredChecks = getRequiredTermsChecks();

        return requiredChecks.length > 0 && requiredChecks.every(function (checkbox) {
            return checkbox.checked;
        });
    }

    function updateTermsState() {
        const allCheck = document.getElementById('termsAllCheck');
        const confirmButton = document.getElementById('termsConfirmButton');
        const requiredMessage = document.getElementById('termsRequiredMessage');
        const allChecks = getTermsChecks();
        const requiredChecks = getRequiredTermsChecks();

        const allChecked = allChecks.length > 0 && allChecks.every(function (checkbox) {
            return checkbox.checked;
        });

        const anyChecked = allChecks.some(function (checkbox) {
            return checkbox.checked;
        });

        const requiredChecked = requiredChecks.length > 0 && requiredChecks.every(function (checkbox) {
            return checkbox.checked;
        });

        if (allCheck) {
            allCheck.checked = allChecked;
            allCheck.indeterminate = !allChecked && anyChecked;
        }

        if (confirmButton) {
            confirmButton.disabled = !requiredChecked;
        }

        if (requiredMessage) {
            requiredMessage.classList.toggle('is-ready', requiredChecked);
            requiredMessage.textContent = requiredChecked
                ? '필수 약관 동의가 완료되었습니다. 확인하기를 눌러 회원가입을 진행해 주세요.'
                : '필수 약관에 모두 동의해야 회원가입을 진행할 수 있습니다.';
        }
    }

    function resetTermsState() {
        const allCheck = document.getElementById('termsAllCheck');
        const requiredMessage = document.getElementById('termsRequiredMessage');
        const hiddenFields = document.getElementById('signupTermsHiddenFields');

        if (allCheck) {
            allCheck.checked = false;
            allCheck.indeterminate = false;
        }

        getTermsChecks().forEach(function (checkbox) {
            checkbox.checked = false;
        });

        document.querySelectorAll('.terms-content.is-open').forEach(function (content) {
            content.classList.remove('is-open');
        });

        document.querySelectorAll('[data-terms-toggle]').forEach(function (button) {
            button.textContent = '내용 보기 〉';
            button.setAttribute('aria-expanded', 'false');
        });

        if (hiddenFields) {
            hiddenFields.innerHTML = '';
        }

        if (requiredMessage) {
            requiredMessage.classList.remove('is-ready');
            requiredMessage.textContent = '필수 약관에 모두 동의해야 회원가입을 진행할 수 있습니다.';
        }

        updateTermsState();
    }

    function toggleTermsContent(targetName) {
        const content = document.querySelector('[data-terms-content="' + targetName + '"]');
        const button = document.querySelector('[data-terms-toggle="' + targetName + '"]');
        const termsList = termsListElement();

        if (!content) {
            return;
        }

        const item = content.closest('.terms-item');
        const isAlreadyOpen = content.classList.contains('is-open');

        document.querySelectorAll('.terms-content.is-open').forEach(function (openedContent) {
            if (openedContent !== content) {
                openedContent.classList.remove('is-open');
            }
        });

        document.querySelectorAll('[data-terms-toggle]').forEach(function (toggle) {
            if (toggle !== button) {
                toggle.textContent = '내용 보기 〉';
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        if (isAlreadyOpen) {
            content.classList.remove('is-open');

            if (button) {
                button.textContent = '내용 보기 〉';
                button.setAttribute('aria-expanded', 'false');
            }

            return;
        }

        content.classList.add('is-open');

        if (button) {
            button.textContent = '내용 닫기 〉';
            button.setAttribute('aria-expanded', 'true');
        }

        if (!termsList || !item) {
            return;
        }

        window.setTimeout(function () {
            const listRect = termsList.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();

            const currentScrollTop = termsList.scrollTop;
            const itemTopInList = itemRect.top - listRect.top + currentScrollTop;
            const itemBottomInList = itemTopInList + item.offsetHeight;

            const visibleTop = currentScrollTop;
            const visibleBottom = currentScrollTop + termsList.clientHeight;

            let nextScrollTop = currentScrollTop;

            if (itemTopInList < visibleTop) {
                nextScrollTop = itemTopInList - 12;
            } else if (itemBottomInList > visibleBottom) {
                nextScrollTop = itemBottomInList - termsList.clientHeight + 18;
            }

            termsList.scrollTo({
                top: Math.max(0, nextScrollTop),
                behavior: 'smooth'
            });
        }, 80);
    }

    function applyTermsToSignupForm() {
        const hiddenFields = document.getElementById('signupTermsHiddenFields');
        const selectedChecks = getTermsChecks().filter(function (checkbox) {
            return checkbox.checked;
        });
        const marketingCheck = selectedChecks.find(function (checkbox) {
            return checkbox.dataset.termType === 'MARKETING';
        });

        if (!hiddenFields) {
            return;
        }

        hiddenFields.innerHTML = '';

        selectedChecks.forEach(function (checkbox) {
            const hidden = document.createElement('input');
            hidden.type = 'hidden';
            hidden.name = 'agreedTermIds';
            hidden.value = checkbox.dataset.termId;
            hiddenFields.appendChild(hidden);
        });

        const marketingHidden = document.createElement('input');
        marketingHidden.type = 'hidden';
        marketingHidden.name = 'marketingAgreed';
        marketingHidden.value = marketingCheck ? 'true' : 'false';
        hiddenFields.appendChild(marketingHidden);
    }

    function setSubmitDisabled(form, disabled) {
        const submitButton = form.querySelector('button[type="submit"]');

        if (submitButton) {
            submitButton.disabled = disabled;
        }
    }

    function resetForm(form) {
        form.reset();
        clearFormErrors(form);

        if (form.id === 'signupForm') {
            const hiddenFields = document.getElementById('signupTermsHiddenFields');

            if (hiddenFields) {
                hiddenFields.innerHTML = '';
            }

            termsAgreementPassed = false;
        }
    }

    function parseJsonResponse(response) {
        return response.text()
            .then(function (text) {
                let data = {};

                try {
                    data = text ? JSON.parse(text) : {};
                } catch (error) {
                    data = {
                        ok: false,
                        message: '서버 응답을 처리하지 못했습니다.'
                    };
                }

                if (!response.ok && data.ok !== false) {
                    data.ok = false;
                }

                return data;
            });
    }

    function resolveRedirectUrl(redirectTo) {
        if (!redirectTo) {
            return null;
        }

        if (redirectTo.indexOf('http://') === 0 || redirectTo.indexOf('https://') === 0) {
            return redirectTo;
        }

        if (redirectTo.charAt(0) === '/') {
            return getContextPath() + redirectTo;
        }

        return redirectTo;
    }

    function removeResultMessageModal() {
        const previousModal = document.getElementById('authResultOverlay');

        if (previousModal) {
            previousModal.remove();
        }
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function getFormFields(form) {
        return Array.from(form.querySelectorAll('input, select, textarea')).filter(function (field) {
            return field.type !== 'hidden' && field.type !== 'checkbox' && field.type !== 'radio';
        });
    }

    function getLabelForField(field) {
        if (!field) {
            return null;
        }

        if (field.id) {
            const labelByFor = document.querySelector('label[for="' + field.id + '"]');

            if (labelByFor) {
                return labelByFor;
            }
        }

        const previousLabel = field.previousElementSibling;

        if (previousLabel && previousLabel.classList.contains('label')) {
            return previousLabel;
        }

        const parent = field.closest('.form');

        if (!parent) {
            return null;
        }

        const labels = Array.from(parent.querySelectorAll('.label'));
        const fields = getFormFields(parent);

        const fieldIndex = fields.indexOf(field);

        return labels[fieldIndex] || null;
    }

    function getFieldMessageId(field) {
        const key = field.id || field.name || 'auth-field';
        return key + '-error-message';
    }

    function getFieldMessageAnchor(field) {
        return field.closest('.input-row') || field;
    }

    function removeFieldMessage(field) {
        const messageId = getFieldMessageId(field);
        const message = document.getElementById(messageId);

        if (message) {
            message.remove();
        }
    }

    function removeLoginSummary(form) {
        const loginForm = form || document.getElementById('loginForm') || document.querySelector('form[action$="/auth/login"]');

        if (loginForm) {
            loginForm.querySelectorAll('.auth-invalid-summary').forEach(function (summary) {
                summary.remove();
            });

            const loginDialog = loginForm.closest('.auth-modal__dialog');

            if (loginDialog) {
                loginDialog.querySelectorAll('.auth-invalid-summary').forEach(function (summary) {
                    summary.remove();
                });
            }
        }

        const loginOverlay = document.getElementById('loginOverlay');

        if (loginOverlay) {
            loginOverlay.querySelectorAll('.auth-invalid-summary').forEach(function (summary) {
                summary.remove();
            });
        }
    }

    function setFieldError(field, message) {
        if (!field) {
            return;
        }

        const label = getLabelForField(field);
        const messageId = getFieldMessageId(field);
        const anchor = getFieldMessageAnchor(field);

        field.classList.add('is-invalid');
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', messageId);

        if (label) {
            label.classList.add('is-invalid');
        }

        removeFieldMessage(field);

        const messageElement = document.createElement('p');
        messageElement.id = messageId;
        messageElement.className = 'auth-field-error';
        messageElement.textContent = message || '입력값을 다시 확인해 주세요.';

        anchor.insertAdjacentElement('afterend', messageElement);
    }

    function clearFieldError(field) {
        if (!field) {
            return;
        }

        const label = getLabelForField(field);

        field.classList.remove('is-invalid');
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');

        if (label) {
            label.classList.remove('is-invalid');
        }

        removeFieldMessage(field);
    }

    function clearFormErrors(form) {
        if (!form) {
            return;
        }

        form.querySelectorAll('.input.is-invalid, select.is-invalid, textarea.is-invalid').forEach(function (field) {
            clearFieldError(field);
        });

        form.querySelectorAll('.label.is-invalid').forEach(function (label) {
            label.classList.remove('is-invalid');
        });

        form.querySelectorAll('.auth-field-error, .auth-invalid-summary').forEach(function (message) {
            message.remove();
        });

        form.querySelectorAll('.input-row.is-shaking, .input.is-shaking').forEach(function (target) {
            target.classList.remove('is-shaking');
        });

        if (form.id === 'loginForm') {
            removeLoginSummary(form);
        }
    }

    function showInlineSummary(form, message) {
        if (!form) {
            return;
        }

        if (form.id === 'loginForm' || form.id === 'signupForm') {
            form.querySelectorAll('.auth-invalid-summary').forEach(function (summary) {
                summary.remove();
            });

            return;
        }

        form.querySelectorAll('.auth-invalid-summary').forEach(function (summary) {
            summary.remove();
        });

        const submitButton = form.querySelector('button[type="submit"]');
        const summary = document.createElement('p');

        summary.className = 'auth-invalid-summary';
        summary.setAttribute('role', 'alert');
        summary.textContent = message || '입력한 정보를 다시 확인해 주세요.';

        if (submitButton) {
            submitButton.insertAdjacentElement('beforebegin', summary);
        } else {
            form.appendChild(summary);
        }
    }

    function shakeFields(fields) {
        const targetFields = Array.from(fields || []).filter(Boolean);

        targetFields.forEach(function (field) {
            const shakeTarget = field.closest('.input-row') || field;

            shakeTarget.classList.remove('is-shaking');
            void shakeTarget.offsetWidth;
            shakeTarget.classList.add('is-shaking');

            window.setTimeout(function () {
                shakeTarget.classList.remove('is-shaking');
            }, 460);
        });
    }

    function getInvalidMessage(field) {
        if (!field) {
            return '입력값을 다시 확인해 주세요.';
        }

        if (field.validity) {
            if (field.validity.valueMissing) {
                return '필수 입력 항목입니다.';
            }

            if (field.validity.typeMismatch) {
                return '올바른 형식으로 입력해 주세요.';
            }

            if (field.validity.tooShort) {
                return '입력한 값이 너무 짧습니다.';
            }

            if (field.validity.tooLong) {
                return '입력한 값이 너무 깁니다.';
            }

            if (field.validity.patternMismatch) {
                return '입력 형식이 올바르지 않습니다.';
            }
        }

        return '입력값을 다시 확인해 주세요.';
    }

    function handleNativeInvalid(form) {
        const invalidFields = getFormFields(form).filter(function (field) {
            return typeof field.checkValidity === 'function' && !field.checkValidity();
        });

        if (invalidFields.length === 0) {
            clearFormErrors(form);
            return true;
        }

        clearFormErrors(form);

        invalidFields.forEach(function (field) {
            setFieldError(field, getInvalidMessage(field));
        });

        if (form.id !== 'loginForm' && form.id !== 'signupForm') {
            showInlineSummary(form, '입력한 정보를 다시 확인해 주세요.');
        } else {
            form.querySelectorAll('.auth-invalid-summary').forEach(function (summary) {
                summary.remove();
            });

            if (form.id === 'loginForm') {
                removeLoginSummary(form);
            }
        }

        shakeFields(invalidFields);
        invalidFields[0].focus();

        return false;
    }

    function findFieldsByNames(form, names) {
        const fields = getFormFields(form);

        if (!names || names.length === 0) {
            return [];
        }

        return fields.filter(function (field) {
            return names.some(function (name) {
                const targetName = String(name || '').toLowerCase();
                const fieldName = String(field.name || '').toLowerCase();
                const fieldId = String(field.id || '').toLowerCase();
                const dataField = String(field.dataset.field || '').toLowerCase();

                return (
                    fieldName === targetName ||
                    fieldId === targetName ||
                    dataField === targetName
                );
            });
        });
    }

    function normalizeLoginFieldNames(fieldNames, message, responseData) {
        return ['id', 'email', 'mEmail', 'loginId'];
    }

    function getLoginFieldMessage(field, fallbackMessage) {
        return fallbackMessage || '아이디 또는 비밀번호가 올바르지 않습니다.';
    }

    function getLoginFailFields(form) {
        const fields = getFormFields(form);

        return fields.filter(function (field) {
            const type = (field.type || '').toLowerCase();
            const name = (field.name || '').toLowerCase();
            const id = (field.id || '').toLowerCase();

            return (
                type === 'email' ||
                type === 'text' ||
                name.indexOf('email') > -1 ||
                name.indexOf('id') > -1 ||
                id.indexOf('email') > -1 ||
                id.indexOf('id') > -1
            );
        });
    }

    function markInvalidFields(form, message, fieldNames, responseData) {
        clearFormErrors(form);

        let targetFields = [];

        if (form.id === 'loginForm') {
            removeLoginSummary(form);

            targetFields = findFieldsByNames(form, ['id', 'email', 'mEmail', 'loginId']);

            if (targetFields.length === 0) {
                targetFields = getLoginFailFields(form).slice(0, 1);
            }

            targetFields.forEach(function (field) {
                setFieldError(field, message || '아이디 또는 비밀번호가 올바르지 않습니다.');
            });

            removeLoginSummary(form);
            shakeFields(targetFields);

            if (targetFields[0]) {
                targetFields[0].focus();
            }

            return;
        }

        targetFields = findFieldsByNames(form, fieldNames);

        if (targetFields.length === 0) {
            targetFields = getFormFields(form);
        }

        targetFields.forEach(function (field) {
            setFieldError(field, message || '입력값을 다시 확인해 주세요.');
        });

        if (form.id !== 'signupForm') {
            showInlineSummary(form, message || '입력한 정보를 다시 확인해 주세요.');
        } else {
            form.querySelectorAll('.auth-invalid-summary').forEach(function (summary) {
                summary.remove();
            });
        }

        shakeFields(targetFields);

        if (targetFields[0]) {
            targetFields[0].focus();
        }
    }

    function showResultMessage(options) {
        const message = options && options.message ? options.message : '처리가 완료되었습니다.';
        const title = options && options.title ? options.title : '안내';
        const redirectTo = options ? options.redirectTo : null;
        const nextModal = options ? options.nextModal : null;
        const buttonText = options && options.buttonText ? options.buttonText : '확인';

        closeAllModals();
        removeResultMessageModal();

        const overlay = document.createElement('div');
        overlay.className = 'auth-modal-overlay is-open';
        overlay.id = 'authResultOverlay';
        overlay.setAttribute('aria-hidden', 'false');

        overlay.innerHTML = ''
            + '<div class="auth-modal__backdrop" data-result-close></div>'
            + '<section class="auth-modal__dialog auth-modal__dialog--result" role="dialog" aria-modal="true" aria-labelledby="authResultTitle" tabindex="-1">'
            + '  <div class="auth-modal__wave-bg" aria-hidden="true"></div>'
            + '  <button type="button" class="auth-modal__close" data-result-close aria-label="모달 닫기">×</button>'
            + '  <div class="auth-wrap auth-wrap--center">'
            + '    <div class="auth-left">'
            + '      <div class="brand">'
            + '        <div class="logo" aria-hidden="true">지</div>'
            + '        <div class="title" id="authResultTitle">' + escapeHtml(title) + '</div>'
            + '      </div>'
            + '      <p class="helper">' + escapeHtml(message) + '</p>'
            + '      <button type="button" class="primary-btn" data-result-close>' + escapeHtml(buttonText) + '</button>'
            + '    </div>'
            + '  </div>'
            + '</section>';

        document.body.appendChild(overlay);
        document.body.classList.add('auth-modal-lock');

        const resultDialog = getDialog(overlay);
        bindAuroraInteraction(resultDialog);

        function finish() {
            removeResultMessageModal();
            document.body.classList.remove('auth-modal-lock');

            const redirectUrl = resolveRedirectUrl(redirectTo);

            if (redirectUrl) {
                window.location.href = redirectUrl;
                return;
            }

            if (nextModal) {
                openModal(nextModal);
            }
        }

        overlay.addEventListener('click', function (event) {
            if (event.target.closest('[data-result-close]')) {
                event.preventDefault();
                finish();
            }
        });

        window.requestAnimationFrame(function () {
            const firstButton = overlay.querySelector('[data-result-close]');

            if (firstButton) {
                firstButton.focus();
            }
        });
    }

    function submitFormAsJson(form, options) {
        if (!form) {
            return;
        }

        setSubmitDisabled(form, true);

        if (form.id === 'loginForm') {
            removeLoginSummary(form);
        }

        fetch(form.action, {
            method: (form.method || 'POST').toUpperCase(),
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(parseJsonResponse)
            .then(function (data) {
                if (!data.ok) {
                    const failMessage = data.message || options.failMessage || '요청 처리에 실패했습니다.';

                    if (options.inlineFail) {
                        const failFields = data.fields || (data.field ? [data.field] : options.invalidFieldNames || []);
                        markInvalidFields(form, failMessage, failFields, data);
                        return;
                    }

                    showResultMessage({
                        title: '확인 필요',
                        message: failMessage,
                        nextModal: options.failNextModal || null
                    });
                    return;
                }

                if (form.id === 'loginForm') {
                    removeLoginSummary(form);
                    setHeaderLoggedIn(data, form);
                }

                if (options.resetOnSuccess) {
                    resetForm(form);
                }

                if (options.eventName) {
                    window.dispatchEvent(new CustomEvent(options.eventName, {
                        detail: data
                    }));
                }

                if (form.id === 'loginForm') {
                    const redirectUrl = resolveRedirectUrl(data.redirectTo || options.redirectTo || '/');
                    window.location.href = redirectUrl || getContextPath() + '/';
                    return;
                }

                showResultMessage({
                    title: options.successTitle || '완료',
                    message: data.message || options.successMessage || '처리가 완료되었습니다.',
                    redirectTo: data.redirectTo || options.redirectTo || null,
                    nextModal: options.successNextModal || null
                });
            })
            .catch(function (error) {
                console.error('[auth-modal] 폼 요청 오류:', error);

                const errorMessage = options.errorMessage || '처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';

                if (options.inlineFail) {
                    markInvalidFields(form, errorMessage, options.invalidFieldNames || [], null);
                    return;
                }

                showResultMessage({
                    title: '오류',
                    message: errorMessage,
                    nextModal: options.errorNextModal || null
                });
            })
            .finally(function () {
                setSubmitDisabled(form, false);

                if (form.id === 'loginForm') {
                    removeLoginSummary(form);
                }
            });
    }

    function bindFormRealtimeValidation(form) {
        form.setAttribute('novalidate', 'novalidate');

        form.addEventListener('input', function (event) {
            if (!event.target.matches('.input, select, textarea')) {
                return;
            }

            clearFieldError(event.target);

            if (form.id === 'loginForm') {
                removeLoginSummary(form);
            }

            if (!form.querySelector('.input.is-invalid, select.is-invalid, textarea.is-invalid')) {
                form.querySelectorAll('.auth-invalid-summary').forEach(function (summary) {
                    summary.remove();
                });
            }
        });

        form.addEventListener('change', function (event) {
            if (!event.target.matches('.input, select, textarea')) {
                return;
            }

            clearFieldError(event.target);

            if (form.id === 'loginForm') {
                removeLoginSummary(form);
            }

            if (!form.querySelector('.input.is-invalid, select.is-invalid, textarea.is-invalid')) {
                form.querySelectorAll('.auth-invalid-summary').forEach(function (summary) {
                    summary.remove();
                });
            }
        });
    }

    function bindAuthForms() {
        if (authFormsBound) {
            return;
        }

        authFormsBound = true;

        const loginForm = document.getElementById('loginForm') || document.querySelector('form[action$="/auth/login"]');
        const signupForm = document.getElementById('signupForm') || document.querySelector('form[action$="/auth/register"]');
        const findPasswordForm = document.getElementById('findPasswordForm') || document.querySelector('form[action$="/auth/find-password"]');
        const resetPasswordForm = document.getElementById('resetPasswordForm') || document.querySelector('form[action$="/auth/password/reset"]');

        [loginForm, signupForm, findPasswordForm, resetPasswordForm]
            .filter(Boolean)
            .forEach(bindFormRealtimeValidation);

        if (loginForm) {
            removeLoginSummary(loginForm);

            loginForm.addEventListener('submit', function (event) {
                event.preventDefault();

                removeLoginSummary(loginForm);

                if (!handleNativeInvalid(loginForm)) {
                    removeLoginSummary(loginForm);
                    return;
                }

                submitFormAsJson(loginForm, {
                    successTitle: '로그인 완료',
                    successMessage: '로그인이 완료되었습니다.',
                    failMessage: '아이디가 올바르지 않습니다.',
                    eventName: 'jichulmate:auth-success',
                    inlineFail: true,
                    invalidFieldNames: []
                });
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', function (event) {
                event.preventDefault();

                if (!handleNativeInvalid(signupForm)) {
                    return;
                }

                submitFormAsJson(signupForm, {
                    successTitle: '회원가입 완료',
                    successMessage: '회원가입이 완료되었습니다.',
                    failMessage: '회원가입 입력값을 다시 확인해 주세요.',
                    resetOnSuccess: true,
                    inlineFail: true,
                    invalidFieldNames: ['mEmail', 'email', 'mNickname', 'nickname', 'mPw', 'password', 'mGender', 'gender', 'mBirthDate', 'birthDate']
                });
            });
        }

        if (findPasswordForm) {
            findPasswordForm.addEventListener('submit', function (event) {
                event.preventDefault();

                if (!handleNativeInvalid(findPasswordForm)) {
                    return;
                }

                submitFormAsJson(findPasswordForm, {
                    successTitle: '메일 발송 완료',
                    successMessage: '입력하신 이메일로 비밀번호 재설정 안내를 보냈습니다.',
                    successNextModal: 'login',
                    resetOnSuccess: true
                });
            });
        }

        if (resetPasswordForm) {
            resetPasswordForm.addEventListener('submit', function (event) {
                event.preventDefault();

                if (!handleNativeInvalid(resetPasswordForm)) {
                    return;
                }

                submitFormAsJson(resetPasswordForm, {
                    successTitle: '비밀번호 변경 완료',
                    successMessage: '비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.',
                    redirectTo: '/auth/login',
                    resetOnSuccess: true
                });
            });
        }
    }

    function bindTermsEvents(event) {
        const allCheck = event.target.closest('#termsAllCheck');
        const termsCheck = event.target.closest('.terms-check');
        const toggleButton = event.target.closest('[data-terms-toggle]');
        const confirmButton = event.target.closest('#termsConfirmButton');

        if (allCheck) {
            getTermsChecks().forEach(function (checkbox) {
                checkbox.checked = allCheck.checked;
            });

            updateTermsState();
            return true;
        }

        if (termsCheck) {
            updateTermsState();
            return true;
        }

        if (toggleButton) {
            event.preventDefault();
            toggleTermsContent(toggleButton.dataset.termsToggle);
            return true;
        }

        if (confirmButton) {
            event.preventDefault();

            if (!isRequiredTermsChecked()) {
                updateTermsState();

                const message = document.getElementById('termsRequiredMessage');

                if (message) {
                    message.classList.remove('is-ready');
                    message.textContent = '필수 약관에 모두 동의해야 회원가입을 진행할 수 있습니다.';
                }

                const termsModal = confirmButton.closest('.terms-modal');

                if (termsModal) {
                    termsModal.classList.remove('is-shaking');
                    void termsModal.offsetWidth;
                    termsModal.classList.add('is-shaking');

                    window.setTimeout(function () {
                        termsModal.classList.remove('is-shaking');
                    }, 460);
                }

                return true;
            }

            applyTermsToSignupForm();
            termsAgreementPassed = true;
            openModal('signup');
            return true;
        }

        return false;
    }

    document.addEventListener('click', function (event) {
        if (bindTermsEvents(event)) {
            return;
        }

        const openButton = event.target.closest('[data-auth-open]');
        const closeButton = event.target.closest('[data-auth-close]');
        const clickedOverlay = event.target.classList.contains('auth-modal-overlay') ? event.target : null;

        if (openButton) {
            event.preventDefault();

            const targetModal = openButton.dataset.authOpen;

            if (targetModal === 'terms') {
                termsAgreementPassed = false;
            }

            openModal(targetModal);
            return;
        }

        if (closeButton || clickedOverlay) {
            event.preventDefault();
            closeWithMotion();
        }
    });

    document.addEventListener('change', function (event) {
        if (
            event.target.matches('#termsAllCheck') ||
            event.target.matches('.terms-check')
        ) {
            updateTermsState();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            const resultOverlay = document.getElementById('authResultOverlay');

            if (resultOverlay) {
                removeResultMessageModal();
                document.body.classList.remove('auth-modal-lock');
                return;
            }

            closeWithMotion();
        }
    });

    function initializeAuthModalScript() {
        initializeAuthSessionState();
        bindAuthNavigationGuard();
        bindAuthForms();

        window.setTimeout(function () {
            initializeAuthSessionState();
        }, 0);

        window.setTimeout(function () {
            initializeAuthSessionState();
        }, 80);

        window.setTimeout(function () {
            initializeAuthSessionState();
        }, 200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAuthModalScript);
    } else {
        initializeAuthModalScript();
    }
})();