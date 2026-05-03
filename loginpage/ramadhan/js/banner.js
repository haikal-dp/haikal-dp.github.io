/**
 * ERVITA.NET - Banner Slider Script
 * Version: 3.0
 * Konfigurasi jumlah banner dapat diatur melalui konfigurasi di bawah
 */

// ============================================
// KONFIGURASI BANNER - BISA DIUBAH
// ============================================
const BANNER_CONFIG = {
    // Jumlah banner yang ingin ditampilkan (1-5)
    jumlahBanner: 1,
    
    // Interval autoplay dalam milidetik
    autoPlayInterval: 5000,
    
    // Sumber gambar banner dari GitHub
    // Format: https://raw.githubusercontent.com/username/repo/branch/path
    bannerImages: [
        'https://raw.githubusercontent.com/haikal-dp/haikal-dp.github.io/main/mikrotik/banner/banner1.png',
        'https://raw.githubusercontent.com/haikal-dp/haikal-dp.github.io/main/mikrotik/banner/img/banner2.jpg',
        'https://raw.githubusercontent.com/haikal-dp/haikal-dp.github.io/main/mikrotik/banner/img/banner3.jpg',
        'https://raw.githubusercontent.com/haikal-dp/haikal-dp.github.io/main/mikrotik/banner/img/banner4.jpg',
        'https://raw.githubusercontent.com/haikal-dp/haikal-dp.github.io/main/mikrotik/banner/img/banner5.jpg',
        'https://raw.githubusercontent.com/haikal-dp/haikal-dp.github.io/main/mikrotik/banner/img/banner6.jpg',
        'https://raw.githubusercontent.com/haikal-dp/haikal-dp.github.io/main/mikrotik/banner/img/banner7.jpg',
    ],
    
    // Teks overlay untuk setiap banner
    bannerTexts: [
        { title: 'SALON TIDAK BUKA , Beli Voucher Melalui Whatsapp:085173229118', subtitle: '' },
        { title: 'Paket Hemat Bulanan', subtitle: 'Mulai dari Rp 150.000/bulan' },
        { title: 'CCTV Online 24 Jam', subtitle: 'Pantau rumah dari mana saja' },
        { title: 'Support 24/7', subtitle: 'Siap membantu kapan saja' },
        { title: 'Jangkauan Luas', subtitle: 'Area coverage terluas' }
    ],
    
    // Gambar fallback jika banner utama gagal dimuat
    fallbackImages: [
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop'
    ]
};

// ============================================
// BANNER SLIDER CLASS
// ============================================
class BannerSlider {
    constructor(config = BANNER_CONFIG) {
        this.config = config;
        this.currentSlide = 0;
        this.slider = null;
        this.dotsContainer = null;
        this.autoPlayTimer = null;
        this.totalSlides = config.jumlahBanner;
        
        this.init();
    }
    
    init() {
        this.createBannerHTML();
        this.setupEventListeners();
        this.startAutoPlay();
    }
    
    createBannerHTML() {
        const container = document.getElementById('banner-container');
        if (!container) return;
        
        // Buat wrapper slider
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider';
        
        // Buat slides wrapper
        const slidesWrapper = document.createElement('div');
        slidesWrapper.className = 'slides-wrapper';
        slidesWrapper.id = 'banner-slider';
        
        // Generate slides berdasarkan jumlah yang dikonfigurasi
        for (let i = 0; i < this.totalSlides; i++) {
            const slide = this.createSlide(i);
            slidesWrapper.appendChild(slide);
        }
        
        sliderWrapper.appendChild(slidesWrapper);
        container.appendChild(sliderWrapper);
        
        // Buat dots indicator
        this.createDots(container);
        
        // Simpan referensi
        this.slider = slidesWrapper;
        this.slides = slidesWrapper.querySelectorAll('.slide');
    }
    
    createSlide(index) {
        const slide = document.createElement('div');
        slide.className = 'slide';
        
        const imgUrl = this.config.bannerImages[index] || this.config.fallbackImages[index % this.config.fallbackImages.length];
        const fallbackUrl = this.config.fallbackImages[index % this.config.fallbackImages.length];
        const text = this.config.bannerTexts[index] || { title: 'ERVITA.NET', subtitle: 'Internet Cepat & Stabil' };
        
        slide.innerHTML = `
            <img src="${imgUrl}" 
                 alt="Banner ${index + 1}" 
                 onerror="this.src='${fallbackUrl}'"
                 loading="${index === 0 ? 'eager' : 'lazy'}">
            <div class="slide-overlay">
                <h4>${text.title}</h4>
                <p>${text.subtitle}</p>
            </div>
        `;
        
        return slide;
    }
    
    createDots(container) {
        const dotsWrapper = document.createElement('div');
        dotsWrapper.className = 'slider-dots';
        dotsWrapper.id = 'banner-dots';
        
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('span');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.onclick = () => this.goToSlide(i);
            dotsWrapper.appendChild(dot);
        }
        
        container.appendChild(dotsWrapper);
        this.dots = dotsWrapper.querySelectorAll('.dot');
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.totalSlides) return;
        
        this.currentSlide = index;
        
        if (this.slider) {
            this.slider.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
        
        // Update dots
        if (this.dots) {
            this.dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentSlide);
            });
        }
    }
    
    nextSlide() {
        const next = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(next);
    }
    
    prevSlide() {
        const prev = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prev);
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayTimer = setInterval(() => {
            this.nextSlide();
        }, this.config.autoPlayInterval);
    }
    
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }
    
    setupEventListeners() {
        // Pause autoplay saat hover
        const container = document.getElementById('banner-container');
        if (container) {
            container.addEventListener('mouseenter', () => this.stopAutoPlay());
            container.addEventListener('mouseleave', () => this.startAutoPlay());
        }
        
        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (container) {
            container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            }, { passive: true });
        }
    }
    
    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
}

// ============================================
// INITIALIZE BANNER SAAT DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi banner slider
    window.bannerSlider = new BannerSlider(BANNER_CONFIG);
});

// Export untuk akses global
window.BannerSlider = BannerSlider;
window.BANNER_CONFIG = BANNER_CONFIG;
