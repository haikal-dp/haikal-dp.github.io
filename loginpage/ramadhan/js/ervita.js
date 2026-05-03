/**
 * ERVITA.NET - Modern Hotspot JavaScript
 * Version: 3.0 - Professional Edition
 */

// ============================================
// SLIDER FUNCTIONALITY
// ============================================
class Slider {
    constructor(elementId, options = {}) {
        this.slider = document.getElementById(elementId);
        if (!this.slider) return;
        
        this.slides = this.slider.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = options.autoPlayInterval || 5000;
        
        this.init();
    }
    
    init() {
        if (this.totalSlides <= 1) return;
        
        // Start autoplay
        this.startAutoPlay();
        
        // Pause on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.slider.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        // Update dots
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(this.currentSlide);
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayTimer = setInterval(() => this.nextSlide(), this.autoPlayInterval);
    }
    
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
        }
    }
}

// ============================================
// DROPDOWN FUNCTIONALITY
// ============================================
class Dropdown {
    constructor(triggerSelector, menuSelector) {
        this.trigger = document.querySelector(triggerSelector);
        this.menu = document.querySelector(menuSelector);
        
        if (!this.trigger || !this.menu) return;
        
        this.init();
    }
    
    init() {
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });
        
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target) && !this.trigger.contains(e.target)) {
                this.close();
            }
        });
    }
    
    toggle() {
        this.menu.classList.toggle('active');
    }
    
    open() {
        this.menu.classList.add('active');
    }
    
    close() {
        this.menu.classList.remove('active');
    }
}

// ============================================
// ACCORDION FUNCTIONALITY
// ============================================
class Accordion {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;
        
        this.items = this.container.querySelectorAll('.accordion-item');
        this.init();
    }
    
    init() {
        this.items.forEach(item => {
            const button = item.querySelector('.accordion-button');
            const content = item.querySelector('.accordion-content');
            
            button.addEventListener('click', () => {
                const isActive = button.classList.contains('active');
                
                // Close all items
                this.closeAll();
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    button.classList.add('active');
                    content.classList.add('active');
                }
            });
        });
    }
    
    closeAll() {
        this.items.forEach(item => {
            item.querySelector('.accordion-button').classList.remove('active');
            item.querySelector('.accordion-content').classList.remove('active');
        });
    }
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
class AccordionSearch {
    constructor(inputSelector, accordionSelector) {
        this.input = document.querySelector(inputSelector);
        this.accordion = document.querySelector(accordionSelector);
        
        if (!this.input || !this.accordion) return;
        
        this.init();
    }
    
    init() {
        this.input.addEventListener('input', (e) => this.search(e.target.value));
        this.input.addEventListener('keyup', (e) => this.search(e.target.value));
    }
    
    search(query) {
        const items = this.accordion.querySelectorAll('.accordion-item');
        const lowerQuery = query.toLowerCase().trim();
        
        items.forEach(item => {
            const button = item.querySelector('.accordion-button');
            const content = item.querySelector('.accordion-body');
            const text = (button.textContent + ' ' + content.textContent).toLowerCase();
            
            if (lowerQuery === '' || text.includes(lowerQuery)) {
                item.style.display = 'block';
                if (lowerQuery.length >= 3) {
                    button.classList.add('active');
                    item.querySelector('.accordion-content').classList.add('active');
                }
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// ============================================
// POPUP MODAL
// ============================================
class Popup {
    constructor(overlaySelector) {
        this.overlay = document.querySelector(overlaySelector);
        if (!this.overlay) return;
        
        this.closeBtn = this.overlay.querySelector('.popup-close, [data-close]');
        this.init();
    }
    
    init() {
        // Close on button click
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        // Close on overlay click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }
    
    open() {
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// SERVER STATUS CHECKER
// ============================================
class ServerStatus {
    constructor(imageUrl, statusElementId) {
        this.imageUrl = imageUrl;
        this.statusElement = document.getElementById(statusElementId);
        if (!this.statusElement) return;
        
        this.check();
    }
    
    check() {
        const img = new Image();
        
        img.onload = () => {
            this.setOnline();
        };
        
        img.onerror = () => {
            this.setOffline();
        };
        
        img.src = this.imageUrl + '?t=' + Date.now();
    }
    
    setOnline() {
        this.statusElement.innerHTML = '<span>Terhubung</span>';
        this.statusElement.classList.add('status-online');
        this.statusElement.classList.remove('status-offline');
    }
    
    setOffline() {
        this.statusElement.innerHTML = '<span>Offline</span>';
        this.statusElement.classList.add('status-offline');
        this.statusElement.classList.remove('status-online');
    }
}

// ============================================
// PASSWORD SYNC (for voucher login)
// ============================================
function syncPassword(usernameId, passwordId) {
    const usernameInput = document.getElementById(usernameId);
    const passwordInput = document.getElementById(passwordId);
    
    if (!usernameInput || !passwordInput) return;
    
    usernameInput.addEventListener('input', () => {
        passwordInput.value = usernameInput.value;
    });
}

// ============================================
// ERROR MESSAGE AUTO-HIDE
// ============================================
function autoHideError(selector, delay = 10000) {
    const errorElement = document.querySelector(selector);
    if (!errorElement) return;
    
    setTimeout(() => {
        errorElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        errorElement.style.opacity = '0';
        errorElement.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            errorElement.remove();
        }, 500);
    }, delay);
}

// ============================================
// WELCOME MESSAGE BASED ON TIME
// ============================================
function setWelcomeMessage(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const hour = new Date().getHours();
    let message = '';
    
    if (hour >= 5 && hour < 11) {
        message = 'Selamat Pagi';
    } else if (hour >= 11 && hour < 15) {
        message = 'Selamat Siang';
    } else if (hour >= 15 && hour < 18) {
        message = 'Selamat Sore';
    } else if (hour >= 18 && hour < 23) {
        message = 'Selamat Malam';
    } else {
        message = 'Selamat Malam Menjelang Pagi';
    }
    
    element.textContent = message;
}

// ============================================
// COUNTDOWN TIMER
// ============================================
class CountdownTimer {
    constructor(elementSelector, seconds, onComplete) {
        this.element = document.querySelector(elementSelector);
        this.seconds = seconds;
        this.onComplete = onComplete;
        this.timer = null;
        
        if (!this.element) return;
        
        this.start();
    }
    
    start() {
        this.updateDisplay();
        this.timer = setInterval(() => {
            this.seconds--;
            this.updateDisplay();
            
            if (this.seconds <= 0) {
                this.stop();
                if (this.onComplete) {
                    this.onComplete();
                }
            }
        }, 1000);
    }
    
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    
    updateDisplay() {
        if (this.element) {
            this.element.textContent = this.seconds;
        }
    }
}

// ============================================
// TRIAL COUNTDOWN
// ============================================
function initTrialCountdown() {
    const trialLogin = document.getElementById('trial-login');
    const counterTrial = document.getElementById('counter-trial');
    const secondsDisplay = document.querySelector('.seconds');
    
    if (!trialLogin || !counterTrial || !secondsDisplay) return;
    
    let seconds = 10;
    secondsDisplay.textContent = seconds;
    
    const timer = setInterval(() => {
        seconds--;
        secondsDisplay.textContent = seconds;
        
        if (seconds <= 0) {
            clearInterval(timer);
            trialLogin.style.display = 'none';
            counterTrial.style.display = 'block';
        }
    }, 1000);
}

// ============================================
// COPY TO CLIPBOARD
// ============================================
function copyToClipboard(text, buttonElement) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = buttonElement.textContent;
        buttonElement.textContent = 'Tersalin!';
        buttonElement.classList.add('copied');
        
        setTimeout(() => {
            buttonElement.textContent = originalText;
            buttonElement.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// ============================================
// TOOLTIP
// ============================================
function initTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', (e) => {
            const text = trigger.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = text;
            document.body.appendChild(tooltip);
            
            const rect = trigger.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
            
            trigger._tooltip = tooltip;
        });
        
        trigger.addEventListener('mouseleave', () => {
            if (trigger._tooltip) {
                trigger._tooltip.remove();
                trigger._tooltip = null;
            }
        });
    });
}

// ============================================
// PRICE CARD ANIMATION
// ============================================
function initPriceCardAnimation() {
    const priceCards = document.querySelectorAll('.price-card');
    
    priceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ============================================
// COMBO CARD ANIMATION
// ============================================
function initComboCardAnimation() {
    const comboCard = document.querySelector('.combo-card');
    if (!comboCard) return;
    
    comboCard.style.opacity = '0';
    comboCard.style.transform = 'translateY(30px) scale(0.95)';
    
    setTimeout(() => {
        comboCard.style.transition = 'all 0.6s ease';
        comboCard.style.opacity = '1';
        comboCard.style.transform = 'translateY(0) scale(1)';
    }, 400);
}

// ============================================
// WARNING BOX ANIMATION
// ============================================
function initWarningBoxAnimation() {
    const warningBox = document.querySelector('.warning-box');
    if (!warningBox) return;
    
    warningBox.style.opacity = '0';
    warningBox.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
        warningBox.style.transition = 'all 0.5s ease';
        warningBox.style.opacity = '1';
        warningBox.style.transform = 'translateX(0)';
    }, 600);
}

// ============================================
// INITIALIZE ALL COMPONENTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Slider (fallback untuk banner lama)
    const slider = new Slider('slider', { autoPlayInterval: 5000 });
    
    // Initialize Dropdown
    const dropdown = new Dropdown('.notification-btn', '#dropdownMenu');
    
    // Initialize Accordion
    const accordion = new Accordion('#accordion');
    
    // Initialize Accordion Search
    const accordionSearch = new AccordionSearch('#accordion_search_bar', '#accordion');
    
    // Initialize Popup
    const popup = new Popup('#popup');
    
    // Initialize Server Status
    const serverStatus = new ServerStatus('img/author.jpg', 'statusServer');
    
    // Sync password for voucher login
    syncPassword('user', 'pass');
    
    // Auto-hide error messages
    autoHideError('.alert-danger', 10000);
    
    // Set welcome message
    setWelcomeMessage('WelcomeMessage');
    
    // Initialize trial countdown
    initTrialCountdown();
    
    // Initialize tooltips
    initTooltips();
    
    // Initialize price card animations
    initPriceCardAnimation();
    
    // Initialize combo card animation
    initComboCardAnimation();
    
    // Initialize warning box animation
    initWarningBoxAnimation();
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format bytes to human readable
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Format time duration
function formatDuration(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0) parts.push(`${secs}s`);
    
    return parts.join(' ') || '0s';
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for global access
window.ERVITA = {
    Slider,
    Dropdown,
    Accordion,
    AccordionSearch,
    Popup,
    ServerStatus,
    CountdownTimer,
    syncPassword,
    autoHideError,
    setWelcomeMessage,
    initTrialCountdown,
    copyToClipboard,
    formatBytes,
    formatDuration,
    debounce,
    throttle,
    initPriceCardAnimation,
    initComboCardAnimation,
    initWarningBoxAnimation
};
