/**
 * RAMADHAN THEME - ERVITA.NET
 * JavaScript untuk fitur-fitur Ramadhan
 * Version: 1.0 - Ramadhan Edition
 */

// ============================================
// TAB SWITCH FUNCTIONALITY
// ============================================
function switchTab(tabName) {
    // Get elements
    const tabVoucher = document.getElementById('tabVoucher');
    const tabMember = document.getElementById('tabMember');
    const formVoucher = document.getElementById('formVoucher');
    const formMember = document.getElementById('formMember');
    
    if (!tabVoucher || !tabMember || !formVoucher || !formMember) return;
    
    // Reset all tabs
    tabVoucher.classList.remove('active');
    tabMember.classList.remove('active');
    formVoucher.classList.remove('active');
    formMember.classList.remove('active');
    
    // Activate selected tab
    if (tabName === 'voucher') {
        tabVoucher.classList.add('active');
        formVoucher.classList.add('active');
        // Focus on voucher input
        setTimeout(() => {
            const userInput = document.getElementById('user');
            if (userInput) userInput.focus();
        }, 100);
    } else if (tabName === 'member') {
        tabMember.classList.add('active');
        formMember.classList.add('active');
        // Focus on member input
        setTimeout(() => {
            const memberInput = document.getElementById('memberUser');
            if (memberInput) memberInput.focus();
        }, 100);
    }
    
    // Save preference to localStorage
    localStorage.setItem('ramadhan_login_tab', tabName);
}

// ============================================
// COUNTDOWN TO EID AL-FITR
// ============================================
function initCountdown() {
    // ======================================
    // SET TANGGAL IDUL FITRI DISINI
    // ======================================
    // Format: new Date(Tahun, Bulan-1, Tanggal, Jam, Menit, Detik)
    // Bulan dikurangi 1 (0 = Januari, 2 = Maret)
    
    const targetDate = new Date(2026, 2, 20, 0, 0, 0).getTime(); 
    // Contoh: 20 Maret 2026 (ubah jika pemerintah tetapkan beda)

    const daysEl = document.getElementById('countdownDays');
    const hoursEl = document.getElementById('countdownHours');
    const minutesEl = document.getElementById('countdownMinutes');
    const secondsEl = document.getElementById('countdownSeconds');
    const timerBox = document.getElementById('countdownTimer');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
            if (timerBox) {
                timerBox.innerHTML = `
                    <div style="font-weight:600; font-size:1.1rem;">
                        🌙 Selamat Hari Raya Idul Fitri 1447H 🌙
                    </div>
                `;
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}
// ============================================
// ISLAMIC QUOTES ROTATOR
// ============================================
const islamicQuotes = [
    {
        text: "Barangsiapa berpuasa di bulan Ramadhan dengan iman dan mengharap pahala, maka diampuni dosa-dosanya yang telah lalu.",
        source: "HR. Bukhari & Muslim"
    },
    {
        text: "Sesungguhnya Ramadhan adalah bulan yang bulannya dimuliakan Allah, dan barangsiapa yang berpuasa di bulan Ramadhan dengan iman dan mengharap pahala, maka diampuni dosa-dosanya yang telah lalu.",
        source: "HR. Bukhari"
    },
    {
        text: "Puasa adalah perisai, maka janganlah kalian berkata kotor dan berbuat bodoh. Dan jika ada orang yang mencaci atau memerangi kalian, maka katakanlah: Sesungguhnya aku sedang berpuasa.",
        source: "HR. Bukhari"
    },
    {
        text: "Barangsiapa yang tidak meninggalkan perkataan dusta dan amalannya, maka Allah tidak butuh ia meninggalkan makanan dan minumannya.",
        source: "HR. Bukhari"
    },
    {
        text: "Tiga doa yang tidak ditolak: Doa orang yang berpuasa sampai ia berbuka, doa orang yang dipimpin dengan adil, dan doa orang yang terzalimi.",
        source: "HR. Tirmidzi"
    },
    {
        text: "Di bulan Ramadhan ada satu malam yang lebih baik dari seribu bulan, barangsiapa yang terhalang dari kebaikannya, maka ia telah terhalang dari semua kebaikan.",
        source: "HR. An-Nasai"
    },
    {
        text: "Allah berfirman: Setiap amalan anak Adam adalah untuknya sendiri kecuali puasa, sesungguhnya puasa itu untuk-Ku dan Aku yang akan membalasnya.",
        source: "HR. Bukhari"
    },
    {
        text: "Dua kegembiraan bagi orang yang berpuasa: kegembiraan ketika berbuka dan kegembiraan ketika bertemu dengan Tuhannya.",
        source: "HR. Bukhari"
    }
];

function initQuoteRotator() {
    const quoteText = document.getElementById('quoteText');
    const quoteSource = document.querySelector('.quote-source');
    
    if (!quoteText || !quoteSource) return;
    
    let currentQuoteIndex = 0;
    
    function rotateQuote() {
        // Fade out
        quoteText.style.opacity = '0';
        quoteSource.style.opacity = '0';
        
        setTimeout(() => {
            // Change quote
            currentQuoteIndex = (currentQuoteIndex + 1) % islamicQuotes.length;
            quoteText.textContent = `"${islamicQuotes[currentQuoteIndex].text}"`;
            quoteSource.textContent = `- ${islamicQuotes[currentQuoteIndex].source}`;
            
            // Fade in
            quoteText.style.opacity = '1';
            quoteSource.style.opacity = '1';
        }, 500);
    }
    
    // Add transition
    quoteText.style.transition = 'opacity 0.5s ease';
    quoteSource.style.transition = 'opacity 0.5s ease';
    
    // Rotate every 30 seconds
    setInterval(rotateQuote, 5000);
}

// ============================================
// GREETING BASED ON TIME
// ============================================
function setGreeting() {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour >= 4 && hour < 12) {
        greeting = 'Selamat Pagi';
    } else if (hour >= 12 && hour < 15) {
        greeting = 'Selamat Siang';
    } else if (hour >= 15 && hour < 18) {
        greeting = 'Selamat Sore';
    } else {
        greeting = 'Selamat Malam';
    }
    
    // Update subtitle if element exists
    const subtitle = document.querySelector('.ramadhan-subtitle');
    if (subtitle) {
        subtitle.textContent = `${greeting}, selamat menunaikan ibadah puasa`;
    }
}

// ============================================
// ANIMATION ON SCROLL
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elements = document.querySelectorAll('.price-card, .menu-item, .quote-section');
    elements.forEach(el => observer.observe(el));
}

// ============================================
// INPUT ANIMATIONS
// ============================================
function initInputAnimations() {
    const inputs = document.querySelectorAll('.input-group input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

// ============================================
// SAVE/RESTORE TAB PREFERENCE
// ============================================
function restoreTabPreference() {
    const savedTab = localStorage.getItem('ramadhan_login_tab');
    if (savedTab) {
        switchTab(savedTab);
    }
}

// ============================================
// PRAYER TIMES (Simplified - can be enhanced with API)
// ============================================
function getPrayerTimes() {
    // Simplified prayer times - in production, use an API like Aladhan
    const prayers = [
        { name: 'Imsak', time: '04:30' },
        { name: 'Subuh', time: '04:45' },
        { name: 'Dzuhur', time: '12:00' },
        { name: 'Ashar', time: '15:15' },
        { name: 'Maghrib', time: '18:15' },
        { name: 'Isya', time: '19:30' }
    ];
    
    return prayers;
}

// ============================================
// PARALLAX EFFECT FOR ORNAMENTS
// ============================================
function initParallax() {
    const moon = document.querySelector('.ornament-moon');
    const lantern = document.querySelector('.ornament-lantern');
    
    if (!moon && !lantern) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                if (moon) {
                    moon.style.transform = `translateY(${scrolled * 0.1}px)`;
                }
                if (lantern) {
                    lantern.style.transform = `translateY(${scrolled * -0.05}px)`;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .menu-item, .nav-item');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add ripple animation to CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ============================================
// LOADING ANIMATION
// ============================================
function initLoadingAnimation() {
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
        loginCard.style.opacity = '0';
        loginCard.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            loginCard.style.transition = 'all 0.6s ease';
            loginCard.style.opacity = '1';
            loginCard.style.transform = 'translateY(0)';
        }, 200);
    }
}

// ============================================
// NETWORK STATUS CHECK
// ============================================
function checkNetworkStatus() {
    window.addEventListener('online', () => {
        showNotification('Koneksi internet tersedia', 'success');
    });
    
    window.addEventListener('offline', () => {
        showNotification('Koneksi internet terputus', 'error');
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 50px;
        font-size: 0.875rem;
        font-weight: 500;
        z-index: 9999;
        animation: slideDown 0.3s ease;
        ${type === 'success' ? 'background: #22c55e; color: white;' : ''}
        ${type === 'error' ? 'background: #ef4444; color: white;' : ''}
        ${type === 'info' ? 'background: #3b82f6; color: white;' : ''}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(notificationStyle);

// ============================================
// INITIALIZE ALL FUNCTIONS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize countdown
    initCountdown();
    
    // Initialize quote rotator
    initQuoteRotator();
    
    // Set greeting
    setGreeting();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize input animations
    initInputAnimations();
    
    // Restore tab preference
    restoreTabPreference();
    
    // Initialize parallax
    initParallax();
    
    // Initialize ripple effect
    initRippleEffect();
    
    // Initialize loading animation
    initLoadingAnimation();
    
    // Check network status
    checkNetworkStatus();
    
    console.log('🌙 Ramadhan Theme Initialized - ERVITA.NET');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

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

// Format number with leading zero
function padZero(num) {
    return String(num).padStart(2, '0');
}

// Export functions for global access
window.RamadhanTheme = {
    switchTab,
    initCountdown,
    initQuoteRotator,
    setGreeting,
    getPrayerTimes,
    debounce,
    throttle,
    padZero
};
