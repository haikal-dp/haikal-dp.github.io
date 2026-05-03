/* =============================================
   EVRVITA.NET MikroTik Hotspot Login Script
   Fully Offline | Vanilla JS | Production Ready
   ============================================= */
(function() {
    'use strict';

    /* =========================================
       DOM Ready Helper
       ========================================= */
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            document.attachEvent('onreadystatechange', function() {
                if (document.readyState === 'complete') fn();
            });
        }
    }

    ready(initApp);

    /* =========================================
       App Initialization
       ========================================= */
    function initApp() {
        initTabs();
        initFaq();
        initPasswordToggle();
        initForms();
        initErrorDisplay();
    }

    /* =========================================
       Tab Switching (Voucher / Member)
       ========================================= */
    function initTabs() {
        var tabs = document.querySelectorAll('.tab-btn');
        var panels = document.querySelectorAll('.form-panel');

        function switchTab(targetId) {
            // Update tab buttons
            for (var i = 0; i < tabs.length; i++) {
                var tab = tabs[i];
                if (tab.getAttribute('data-target') === targetId) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            }

            // Update panels
            for (var j = 0; j < panels.length; j++) {
                var panel = panels[j];
                if (panel.id === targetId) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            }

            // Clear alerts on switch
            hideAlerts();
        }

        for (var t = 0; t < tabs.length; t++) {
            tabs[t].addEventListener('click', function(e) {
                var target = this.getAttribute('data-target');
                if (target) switchTab(target);
            });
        }
    }

    /* =========================================
       FAQ Accordion
       ========================================= */
    function initFaq() {
        var questions = document.querySelectorAll('.faq-question');

        for (var i = 0; i < questions.length; i++) {
            questions[i].addEventListener('click', function() {
                var item = this.parentNode;
                var isOpen = item.classList.contains('open');

                // Close all items
                var allItems = document.querySelectorAll('.faq-item');
                for (var j = 0; j < allItems.length; j++) {
                    allItems[j].classList.remove('open');
                }

                // Open clicked if it was closed
                if (!isOpen) {
                    item.classList.add('open');
                }
            });
        }
    }

    /* =========================================
       Password Visibility Toggle
       ========================================= */
    function initPasswordToggle() {
        var toggles = document.querySelectorAll('.toggle-pass');

        for (var i = 0; i < toggles.length; i++) {
            toggles[i].addEventListener('click', function() {
                var input = this.parentNode.querySelector('input');
                var iconShow = this.querySelector('.icon-show');
                var iconHide = this.querySelector('.icon-hide');

                if (!input) return;

                if (input.type === 'password') {
                    input.type = 'text';
                    if (iconShow) iconShow.style.display = 'none';
                    if (iconHide) iconHide.style.display = 'block';
                } else {
                    input.type = 'password';
                    if (iconShow) iconShow.style.display = 'block';
                    if (iconHide) iconHide.style.display = 'none';
                }
            });
        }
    }

    /* =========================================
       Alert Helpers
       ========================================= */
    function showAlert(id, message) {
        var el = document.getElementById(id);
        if (!el) return;
        el.textContent = message;
        el.classList.add('show');
    }

    function hideAlerts() {
        var alerts = document.querySelectorAll('.alert');
        for (var i = 0; i < alerts.length; i++) {
            alerts[i].classList.remove('show');
        }
    }

    /* =========================================
       MikroTik Error Display
       ========================================= */
    function initErrorDisplay() {
        var errBox = document.getElementById('alert-box');
        if (!errBox) return;

        var raw = errBox.getAttribute('data-error') || '';
        // Trim MikroTik variable syntax noise
        raw = raw.replace(/^\s+|\s+$/g, '');
        if (raw && raw.length > 0 && raw !== '$(error)' && raw.indexOf('$(if') !== 0) {
            showAlert('alert-box', raw);
        }
    }

    /* =========================================
       Form Handling & Login Logic
       ========================================= */
    function initForms() {
        var voucherForm = document.getElementById('form-voucher');
        var memberForm = document.getElementById('form-member');
        var sendinForm = document.getElementById('sendin');

        // Voucher form
        if (voucherForm) {
            voucherForm.addEventListener('submit', function(e) {
                e = e || window.event;
                if (e.preventDefault) e.preventDefault(); else e.returnValue = false;

                var code = document.getElementById('voucher-code');
                if (!code || !code.value || code.value.trim() === '') {
                    showAlert('alert-box', 'Silakan masukkan kode voucher Anda.');
                    code.focus();
                    return false;
                }

                submitLogin(code.value.trim(), code.value.trim());
                return false;
            });
        }

        // Member form
        if (memberForm) {
            memberForm.addEventListener('submit', function(e) {
                e = e || window.event;
                if (e.preventDefault) e.preventDefault(); else e.returnValue = false;

                var user = document.getElementById('member-username');
                var pass = document.getElementById('member-password');

                if (!user || !user.value || user.value.trim() === '') {
                    showAlert('alert-box', 'Silakan masukkan username member Anda.');
                    user.focus();
                    return false;
                }
                if (!pass || !pass.value || pass.value.trim() === '') {
                    showAlert('alert-box', 'Silakan masukkan password Anda.');
                    pass.focus();
                    return false;
                }

                submitLogin(user.value.trim(), pass.value.trim());
                return false;
            });
        }

        // CHAP MD5 login helper
        function submitLogin(username, password) {
            var chapId = '';
            var chapChallenge = '';

            // Read CHAP variables from hidden inputs if present
            var chapIdEl = document.getElementById('chap-id');
            var chapChallengeEl = document.getElementById('chap-challenge');

            if (chapIdEl) chapId = chapIdEl.value;
            if (chapChallengeEl) chapChallenge = chapChallengeEl.value;

            // Check if we have CHAP credentials
            if (chapId && chapChallenge && typeof hexMD5 === 'function') {
                // CHAP mode: hash password with MD5
                var hash = hexMD5(chapId + password + chapChallenge);
                doSendin(username, hash);
            } else {
                // Plain text mode (no CHAP)
                doPlainLogin(username, password);
            }
        }

        function doSendin(username, passwordHash) {
            if (sendinForm) {
                var u = sendinForm.querySelector('input[name="username"]');
                var p = sendinForm.querySelector('input[name="password"]');
                if (u) u.value = username;
                if (p) p.value = passwordHash;
                sendinForm.submit();
            } else {
                // Fallback: plain login via visible form
                doPlainLogin(username, passwordHash);
            }
        }

        function doPlainLogin(username, password) {
            var plainForm = document.getElementById('plain-login-form');
            if (plainForm) {
                var u = plainForm.querySelector('input[name="username"]');
                var p = plainForm.querySelector('input[name="password"]');
                if (u) u.value = username;
                if (p) p.value = password;
                plainForm.submit();
            }
        }
    }

})();
