/**
 * APP.JS
 * ======
 * JavaScript utama untuk Mikrotik Hotspot Login Page
 */
/**
 * APP.JS
 * ======
 * JavaScript utama untuk Mikrotik Hotspot Login Page
 */

(function() {
  'use strict';

  // ============================================
  // DOM READY
  // ============================================
  document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initTabs();
    initBanner();
    initPasswordToggle();
    initFormValidation();
    initAutoHideAlerts();
    initWelcomeMessage();
    initServerStatus();
    initMusic();
  });

  // ============================================
  // THEME INITIALIZATION
  // ============================================
  function initTheme() {
    if (window.SETTINGS && window.SETTINGS.theme) {
      const root = document.documentElement;
      const theme = window.SETTINGS.theme;
      
      if (theme.primary) root.style.setProperty('--primary', theme.primary);
      if (theme.primaryDark) root.style.setProperty('--primary-dark', theme.primaryDark);
      if (theme.primaryLight) root.style.setProperty('--primary-light', theme.primaryLight);
      if (theme.bgDark) root.style.setProperty('--bg-primary', theme.bgDark);
      if (theme.bgCard) root.style.setProperty('--bg-card', theme.bgCard);
      if (theme.textPrimary) root.style.setProperty('--text-primary', theme.textPrimary);
      if (theme.textSecondary) root.style.setProperty('--text-secondary', theme.textSecondary);
      if (theme.border) root.style.setProperty('--border', theme.border);
    }
  }

  // ============================================
  // TABS
  // ============================================
  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (!tabBtns.length || !tabContents.length) return;
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const target = this.dataset.tab;
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        this.classList.add('active');
        const targetContent = document.getElementById(target + '-tab');
        if (targetContent) {
          targetContent.classList.add('active');
        }
        
        localStorage.setItem('lastTab', target);
      });
    });
    
    const lastTab = localStorage.getItem('lastTab');
    if (lastTab) {
      const lastTabBtn = document.querySelector('[data-tab="' + lastTab + '"]');
      if (lastTabBtn) {
        lastTabBtn.click();
      }
    }
  }

  // ============================================
  // BANNER SLIDER
  // ============================================
  function initBanner() {
    const banner = document.getElementById('banner');
    if (!banner) return;
    
    const slides = banner.querySelectorAll('.banner-slide');
    const dots = banner.querySelectorAll('.banner-dot');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    let autoPlayTimer = null;
    
    const config = window.SETTINGS && window.SETTINGS.banner ? window.SETTINGS.banner : {};
    const autoPlay = config.autoPlay !== false;
    const interval = config.interval || 5000;
    
    function goToSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      currentSlide = index;
    }
    
    function nextSlide() {
      const next = (currentSlide + 1) % slides.length;
      goToSlide(next);
    }
    
    function startAutoPlay() {
      if (autoPlay && slides.length > 1) {
        stopAutoPlay();
        autoPlayTimer = setInterval(nextSlide, interval);
      }
    }
    
    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
        startAutoPlay();
      });
    });
    
    banner.addEventListener('mouseenter', stopAutoPlay);
    banner.addEventListener('mouseleave', startAutoPlay);
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    banner.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    banner.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const diff = touchStartX - touchEndX;
      const threshold = 50;
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          const prev = (currentSlide - 1 + slides.length) % slides.length;
          goToSlide(prev);
        }
        startAutoPlay();
      }
    }
    
    goToSlide(0);
    startAutoPlay();
  }

  // ============================================
  // PASSWORD TOGGLE
  // ============================================
  function initPasswordToggle() {
    const toggles = document.querySelectorAll('.password-toggle');
    
    toggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        if (!input) return;
        
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        
        const svg = this.querySelector('svg');
        if (svg) {
          if (isPassword) {
            svg.innerHTML = '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>';
          } else {
            svg.innerHTML = '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.78 0 1.53-.09 2.24-.26"/><path d="M2 2l20 20"/>';
          }
        }
      });
    });
  }

  // ============================================
  // FORM VALIDATION
  // ============================================
  function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('[type="submit"]');
        if (submitBtn) {
          submitBtn.classList.add('btn-loading');
          submitBtn.disabled = true;
          submitBtn.dataset.originalText = submitBtn.innerHTML;
        }
        return true;
      });
    });
    
    const voucherInput = document.getElementById('voucher-input');
    if (voucherInput) {
      voucherInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase().trim();
      });
    }
    
    const usernameInput = document.getElementById('username-input');
    if (usernameInput) {
      const savedUsername = localStorage.getItem('rememberedUsername');
      if (savedUsername) {
        usernameInput.value = savedUsername;
      }
      
      usernameInput.addEventListener('input', function() {
        localStorage.setItem('rememberedUsername', this.value);
      });
    }
  }

  // ============================================
  // AUTO HIDE ALERTS
  // ============================================
  function initAutoHideAlerts() {
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    
    alerts.forEach(alert => {
      setTimeout(() => {
        alert.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
          alert.remove();
        }, 300);
      }, 10000);
    });
  }

  // ============================================
  // WELCOME MESSAGE
  // ============================================
  function initWelcomeMessage() {
    const element = document.getElementById('welcome-message');
    if (!element) return;
    
    const hour = new Date().getHours();
    let message = '';
    
    if (hour >= 5 && hour < 11) {
      message = 'Selamat Pagi';
    } else if (hour >= 11 && hour < 15) {
      message = 'Selamat Siang';
    } else if (hour >= 15 && hour < 18) {
      message = 'Selamat Sore';
    } else {
      message = 'Selamat Malam';
    }
    
    element.textContent = message;
  }

  // ============================================
  // SERVER STATUS
  // ============================================
  function initServerStatus() {
    const statusEl = document.getElementById('server-status');
    if (!statusEl) return;
    
    statusEl.innerHTML = '<span style="color:var(--accent-green,#10b981);font-size:11px;">● Online</span>';
  }

  // ============================================
  // BACKGROUND MUSIC
  // ============================================
  function initMusic() {
    const settings = window.SETTINGS && window.SETTINGS.music;
    if (!settings || !settings.enabled) return;

    const audio = document.getElementById('bg-music');
    const player = document.getElementById('music-player');
    const toggle = document.getElementById('music-toggle');

    if (!audio || !player || !toggle) return;

    audio.src = settings.file;
    audio.volume = typeof settings.volume === 'number' ? settings.volume : 0.5;
    audio.loop = settings.loop !== false;
    audio.preload = 'auto';

    player.style.display = 'block';

    let isPlaying = false;

    function updateIcon() {
      toggle.classList.toggle('muted', !isPlaying);
      toggle.textContent = isPlaying ? '🔊' : '🔇';
      toggle.title = isPlaying ? (settings.title || 'Music On') : 'Klik untuk memutar musik';
    }

    function tryPlay() {
      const promise = audio.play();
      if (promise !== undefined) {
        promise.then(function() {
          isPlaying = true;
          updateIcon();
        }).catch(function() {
          isPlaying = false;
          updateIcon();
        });
      }
    }

    toggle.addEventListener('click', function() {
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        updateIcon();
      } else {
        tryPlay();
      }
    });

    if (settings.autoPlay) {
      tryPlay();
      document.addEventListener('click', function handler() {
        if (!isPlaying) tryPlay();
        document.removeEventListener('click', handler);
      }, { once: true });
    }
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  window.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  window.throttle = function(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };
  
  window.formatBytes = function(bytes, decimals) {
    decimals = decimals || 2;
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

})();