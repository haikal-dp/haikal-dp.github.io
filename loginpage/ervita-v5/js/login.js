/**
 * LOGIN.JS
 * ========
 * Handler untuk login voucher dan member
 * Kompatibel dengan Mikrotik Hotspot
 */

(function() {
  'use strict';

  // ============================================
  // DOM READY
  // ============================================
  document.addEventListener('DOMContentLoaded', function() {
    initVoucherLogin();
    initMemberLogin();
    initErrorHandler();
    initRememberMe();
  });

  // ============================================
  // VOUCHER LOGIN
  // ============================================
  function initVoucherLogin() {
    const voucherForm = document.getElementById('voucher-form');
    const voucherInput = document.getElementById('voucher-input');
    
    if (!voucherForm || !voucherInput) return;
    
    // Auto uppercase dan trim
    voucherInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase().replace(/\s/g, '');
    });
    
    // Auto focus
    voucherInput.focus();
    
    // Form submit handler
    voucherForm.addEventListener('submit', function(e) {
      const voucher = voucherInput.value.trim();
      
      if (!voucher) {
        e.preventDefault();
        showError('Masukkan kode voucher terlebih dahulu');
        voucherInput.focus();
        return false;
      }
      
      // Sync password field (for Mikrotik)
      const passwordField = this.querySelector('input[name="password"]');
      if (passwordField) {
        passwordField.value = voucher;
      }
      
      // Show loading
      setLoadingState(this, true);
      
      return true;
    });
  }

  // ============================================
  // MEMBER LOGIN
  // ============================================
  function initMemberLogin() {
    const memberForm = document.getElementById('member-form');
    if (!memberForm) return;
    
    const usernameInput = memberForm.querySelector('input[name="username"]');
    const passwordInput = memberForm.querySelector('input[name="password"]');
    const rememberCheckbox = document.getElementById('remember-me');
    
    // Restore remembered username
    if (usernameInput) {
      const savedUsername = localStorage.getItem('memberUsername');
      if (savedUsername) {
        usernameInput.value = savedUsername;
        if (rememberCheckbox) {
          rememberCheckbox.checked = true;
        }
      }
    }
    
    // Form submit handler
    memberForm.addEventListener('submit', function(e) {
      const username = usernameInput ? usernameInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';
      
      if (!username) {
        e.preventDefault();
        showError('Masukkan username terlebih dahulu');
        if (usernameInput) usernameInput.focus();
        return false;
      }
      
      if (!password) {
        e.preventDefault();
        showError('Masukkan password terlebih dahulu');
        if (passwordInput) passwordInput.focus();
        return false;
      }
      
      // Save username if remember me is checked
      if (rememberCheckbox && rememberCheckbox.checked) {
        localStorage.setItem('memberUsername', username);
      } else {
        localStorage.removeItem('memberUsername');
      }
      
      // Show loading
      setLoadingState(this, true);
      
      return true;
    });
  }

  // ============================================
  // ERROR HANDLER
  // ============================================
  function initErrorHandler() {
    // Get error from URL or Mikrotik variable
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    
    if (errorParam) {
      showError(decodeURIComponent(errorParam));
      return;
    }
    
    // Check for Mikrotik error element
    const errorEl = document.getElementById('mikrotik-error');
    if (errorEl) {
      const errorText = errorEl.textContent.trim();
      if (errorText) {
        const translatedError = translateError(errorText);
        showError(translatedError);
      }
    }
  }

  // ============================================
  // REMEMBER ME
  // ============================================
  function initRememberMe() {
    const rememberCheckbox = document.getElementById('remember-me');
    if (!rememberCheckbox) return;
    
    rememberCheckbox.addEventListener('change', function() {
      if (!this.checked) {
        localStorage.removeItem('memberUsername');
      }
    });
  }

  // ============================================
  // ERROR TRANSLATION
  // ============================================
  function translateError(error) {
    const settings = window.SETTINGS || {};
    const messages = settings.errorMessages || {};
    
    // Direct match
    if (messages[error]) {
      return messages[error];
    }
    
    // Pattern matching
    for (const key in messages) {
      if (error.toLowerCase().includes(key.toLowerCase())) {
        return messages[key];
      }
    }
    
    // Default translations for common errors
    const defaultTranslations = {
      'invalid username or password': 'Kode voucher salah atau tidak terdaftar',
      'user not found': 'Voucher tidak ditemukan',
      'no valid profile found': 'Profil voucher tidak valid',
      'uptime limit reached': 'Masa aktif voucher sudah habis',
      'traffic limit reached': 'Kuota voucher sudah habis',
      'session limit reached': 'Batas session tercapai',
      'simultaneous session limit': 'Voucher sedang digunakan di perangkat lain'
    };
    
    for (const key in defaultTranslations) {
      if (error.toLowerCase().includes(key)) {
        return defaultTranslations[key];
      }
    }
    
    return error;
  }

  // ============================================
  // SHOW ERROR
  // ============================================
  function showError(message) {
    const errorContainer = document.getElementById('error-container');
    if (!errorContainer) return;
    
    errorContainer.innerHTML = `
      <div class="alert alert-danger">
        <svg class="alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div class="alert-content">${message}</div>
      </div>
    `;
    
    // Auto hide after 10 seconds
    setTimeout(() => {
      const alert = errorContainer.querySelector('.alert');
      if (alert) {
        alert.style.transition = 'opacity 0.3s ease';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
      }
    }, 10000);
  }

  // ============================================
  // SET LOADING STATE
  // ============================================
  function setLoadingState(form, isLoading) {
    const submitBtn = form.querySelector('[type="submit"]');
    if (!submitBtn) return;
    
    if (isLoading) {
      submitBtn.dataset.originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
        </svg>
        <span>Memproses...</span>
      `;
      submitBtn.disabled = true;
    } else {
      submitBtn.innerHTML = submitBtn.dataset.originalText || 'Login';
      submitBtn.disabled = false;
    }
  }

  // ============================================
  // MD5 LOGIN (for CHAP)
  // ============================================
  window.doLogin = function() {
    const form = document.forms.login;
    const sendinForm = document.forms.sendin;
    
    if (!form || !sendinForm) return true;
    
    const username = form.username ? form.username.value : '';
    const password = form.password ? form.password.value : '';
    
    if (!username) {
      showError('Masukkan kode voucher terlebih dahulu');
      return false;
    }
    
    // Get CHAP values from hidden fields
    const chapId = document.getElementById('chap-id');
    const chapChallenge = document.getElementById('chap-challenge');
    
    if (chapId && chapChallenge && typeof hexMD5 === 'function') {
      sendinForm.username.value = username;
      sendinForm.password.value = hexMD5(chapId.value + password + chapChallenge.value);
      sendinForm.submit();
      return false;
    }
    
    return true;
  };

  // ============================================
  // LOGOUT HANDLER
  // ============================================
  window.openLogout = function() {
    if (window.name !== 'hotspot_status') {
      return true;
    }
    
    const logoutUrl = document.querySelector('form[name="logout"]')?.action;
    if (logoutUrl) {
      window.open(logoutUrl, 'hotspot_logout', 'toolbar=0,location=0,directories=0,status=0,menubars=0,resizable=1,width=320,height=300');
      window.close();
    }
    return false;
  };

  // ============================================
  // OPEN LOGIN (for logout page)
  // ============================================
  window.openLogin = function() {
    if (window.name !== 'hotspot_logout') {
      return true;
    }
    
    const loginUrl = document.querySelector('form[name="login"]')?.action;
    if (loginUrl) {
      window.open(loginUrl, '_blank', '');
      window.close();
    }
    return false;
  };

  // Export functions
  window.LoginHandler = {
    showError: showError,
    translateError: translateError,
    setLoadingState: setLoadingState
  };

})();
