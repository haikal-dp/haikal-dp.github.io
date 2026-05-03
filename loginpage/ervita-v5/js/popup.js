/**
 * POPUP.JS
 * ========
 * Handler untuk popup modal dan notifikasi
 */

(function() {
  'use strict';

  // ============================================
  // DOM READY
  // ============================================
  document.addEventListener('DOMContentLoaded', function() {
    initPopup();
    initAutoPopup();
  });

  // ============================================
  // POPUP INITIALIZATION
  // ============================================
  function initPopup() {
    // Close buttons
    const closeBtns = document.querySelectorAll('[data-popup-close]');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', closePopup);
    });
    
    // Close on overlay click
    const overlay = document.getElementById('popup-overlay');
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === this) {
          closePopup();
        }
      });
    }
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closePopup();
      }
    });
  }

  // ============================================
  // AUTO POPUP
  // ============================================
  function initAutoPopup() {
    const settings = window.SETTINGS || {};
    const popupConfig = settings.popup || {};
    
    if (!popupConfig.enabled || !popupConfig.autoShow) return;
    
    // Check if already shown today
    if (popupConfig.showOncePerDay) {
      const lastShown = localStorage.getItem('popupLastShown');
      const today = new Date().toDateString();
      
      if (lastShown === today) {
        return;
      }
    }
    
    // Show popup after delay
    const delay = popupConfig.delay || 2000;
    
    setTimeout(() => {
      showPopup({
        title: popupConfig.title || 'Informasi',
        message: popupConfig.message || 'Selamat datang!',
        icon: 'info'
      });
      
      // Save last shown date
      if (popupConfig.showOncePerDay) {
        localStorage.setItem('popupLastShown', new Date().toDateString());
      }
    }, delay);
  }

  // ============================================
  // SHOW POPUP
  // ============================================
  window.showPopup = function(options) {
    const overlay = document.getElementById('popup-overlay');
    if (!overlay) return;
    
    const title = options.title || 'Informasi';
    const message = options.message || '';
    const icon = options.icon || 'info';
    const confirmText = options.confirmText || 'Tutup';
    const showCancel = options.showCancel || false;
    const cancelText = options.cancelText || 'Batal';
    const onConfirm = options.onConfirm || null;
    const onCancel = options.onCancel || null;
    
    // Icon SVG
    const icons = {
      info: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>`,
      success: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                 <polyline points="22 4 12 14.01 9 11.01"/>
               </svg>`,
      error: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
               <circle cx="12" cy="12" r="10"/>
               <line x1="15" y1="9" x2="9" y2="15"/>
               <line x1="9" y1="9" x2="15" y2="15"/>
             </svg>`,
      warning: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                 <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                 <line x1="12" y1="9" x2="12" y2="13"/>
                 <line x1="12" y1="17" x2="12.01" y2="17"/>
               </svg>`,
      whatsapp: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#25d366" stroke-width="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>`
    };
    
    // Build popup content
    const popupBox = overlay.querySelector('.popup-box') || document.createElement('div');
    popupBox.className = 'popup-box';
    popupBox.innerHTML = `
      <div class="popup-icon">${icons[icon] || icons.info}</div>
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="popup-actions">
        <button class="btn btn-primary btn-block" data-popup-confirm>${confirmText}</button>
        ${showCancel ? `<button class="btn btn-outline btn-block" data-popup-cancel>${cancelText}</button>` : ''}
      </div>
    `;
    
    if (!overlay.querySelector('.popup-box')) {
      overlay.appendChild(popupBox);
    }
    
    // Show overlay
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Confirm button
    const confirmBtn = popupBox.querySelector('[data-popup-confirm]');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', function() {
        closePopup();
        if (typeof onConfirm === 'function') {
          onConfirm();
        }
      });
    }
    
    // Cancel button
    const cancelBtn = popupBox.querySelector('[data-popup-cancel]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function() {
        closePopup();
        if (typeof onCancel === 'function') {
          onCancel();
        }
      });
    }
  };

  // ============================================
  // CLOSE POPUP
  // ============================================
  window.closePopup = function() {
    const overlay = document.getElementById('popup-overlay');
    if (!overlay) return;
    
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear popup content after animation
    setTimeout(() => {
      const popupBox = overlay.querySelector('.popup-box');
      if (popupBox) {
        popupBox.innerHTML = '';
      }
    }, 300);
  };

  // ============================================
  // TOAST NOTIFICATION
  // ============================================
  window.showToast = function(message, type = 'info', duration = 3000) {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
      existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    
    const icons = {
      info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
    };
    
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-message">${message}</div>
    `;
    
    // Add styles
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(-100px);
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: var(--space-3) var(--space-4);
      display: flex;
      align-items: center;
      gap: var(--space-3);
      box-shadow: var(--shadow-lg);
      z-index: 9999;
      transition: transform 0.3s ease, opacity 0.3s ease;
      opacity: 0;
      max-width: 90%;
      width: max-content;
    `;
    
    // Type-specific styles
    const colors = {
      info: '#0ea5e9',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b'
    };
    
    toast.style.borderLeft = `3px solid ${colors[type] || colors.info}`;
    
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity = '1';
    });
    
    // Auto remove
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(-100px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  // ============================================
  // CONFIRM DIALOG
  // ============================================
  window.showConfirm = function(options) {
    showPopup({
      title: options.title || 'Konfirmasi',
      message: options.message || '',
      icon: options.icon || 'warning',
      confirmText: options.confirmText || 'Ya',
      showCancel: true,
      cancelText: options.cancelText || 'Tidak',
      onConfirm: options.onConfirm,
      onCancel: options.onCancel
    });
  };

  // Export
  window.PopupHandler = {
    show: showPopup,
    close: closePopup,
    toast: showToast,
    confirm: showConfirm
  };

})();
