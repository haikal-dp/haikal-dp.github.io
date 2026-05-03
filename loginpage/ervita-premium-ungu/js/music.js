/**
 * ERVITA.NET - Music Player Script
 * Version: 3.0
 * Music player dengan autoplay dan kontrol tombol
 */

// ============================================
// KONFIGURASI MUSIK - BISA DIUBAH
// ============================================
const MUSIC_CONFIG = {
    // URL musik dari GitHub
    musicUrl: 'https://raw.githubusercontent.com/haikal-dp/haikal-dp.github.io/main/mikrotik/musik/Celengan%20rindu%20-%20Fiersa%20Besari%20(Feby%20Cover%20Video)%20%5BKSoI_Vq5S3g%5D.mp3',
    
    // Judul lagu yang ditampilkan
    songTitle: 'Celengan Rindu',
    
    // Artis (opsional)
    artist: '',
    
    // Volume awal (0.0 - 1.0)
    initialVolume: 0.5,
    
    // Autoplay saat halaman dimuat
    // Catatan: Beberapa browser memblokir autoplay tanpa interaksi user
    autoPlay: true,
    
    // Loop musik
    loop: true,
    
    // Tampilkan notifikasi saat musik diputar
    showNotification: true
};

// ============================================
// MUSIC PLAYER CLASS
// ============================================
class MusicPlayer {
    constructor(config = MUSIC_CONFIG) {
        this.config = config;
        this.audio = null;
        this.isPlaying = true;
        this.isMuted = false;
        this.volume = config.initialVolume;
        
        this.init();
    }
    
    init() {
        this.createPlayerHTML();
        this.setupAudio();
        this.setupEventListeners();
        
        // Coba autoplay jika diizinkan
        if (this.config.autoPlay) {
            this.attemptAutoPlay();
        }
    }
    
    createPlayerHTML() {
        const container = document.getElementById('music-player-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="music-player">
                <div class="music-info">
                    <div class="music-icon">
                        <i class="fas fa-music"></i>
                        <span class="music-wave"></span>
                        <span class="music-wave"></span>
                        <span class="music-wave"></span>
                    </div>
                    <div class="music-text">
                        <span class="music-title">${this.config.songTitle}</span>
                        <span class="music-artist">${this.config.artist}</span>
                    </div>
                </div>
                <div class="music-controls">
                    <button class="music-btn" id="music-play-btn" title="Play/Pause">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="music-btn" id="music-mute-btn" title="Mute/Unmute">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
            </div>
        `;
        
        this.playBtn = document.getElementById('music-play-btn');
        this.muteBtn = document.getElementById('music-mute-btn');
        this.waves = container.querySelectorAll('.music-wave');
    }
    
    setupAudio() {
        this.audio = new Audio(this.config.musicUrl);
        this.audio.volume = this.volume;
        this.audio.loop = this.config.loop;
        
        // Event listeners untuk audio
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
            this.startWaveAnimation();
        });
        
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
            this.stopWaveAnimation();
        });
        
        this.audio.addEventListener('ended', () => {
            if (!this.config.loop) {
                this.isPlaying = false;
                this.updatePlayButton();
                this.stopWaveAnimation();
            }
        });
        
        this.audio.addEventListener('error', (e) => {
            console.error('Music player error:', e);
            this.showError();
        });
    }
    
    setupEventListeners() {
        if (this.playBtn) {
            this.playBtn.addEventListener('click', () => this.togglePlay());
        }
        
        if (this.muteBtn) {
            this.muteBtn.addEventListener('click', () => this.toggleMute());
        }
        
        // Coba autoplay saat user pertama kali berinteraksi dengan halaman
        if (this.config.autoPlay) {
            const tryAutoPlay = () => {
                this.play();
                document.removeEventListener('click', tryAutoPlay);
                document.removeEventListener('touchstart', tryAutoPlay);
            };
            
            document.addEventListener('click', tryAutoPlay, { once: true });
            document.addEventListener('touchstart', tryAutoPlay, { once: true });
        }
    }
    
    async attemptAutoPlay() {
        try {
            await this.audio.play();
            this.isPlaying = true;
            this.updatePlayButton();
            this.startWaveAnimation();
            
            if (this.config.showNotification) {
                this.showNotification('Musik sedang diputar');
            }
        } catch (error) {
            // Autoplay diblokir browser, tunggu interaksi user
            console.log('Autoplay diblokir, menunggu interaksi user...');
            this.isPlaying = false;
            this.updatePlayButton();
        }
    }
    
    play() {
        if (this.audio) {
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.updatePlayButton();
                this.startWaveAnimation();
            }).catch(err => {
                console.error('Gagal memutar musik:', err);
            });
        }
    }
    
    pause() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
            this.updatePlayButton();
            this.stopWaveAnimation();
        }
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    toggleMute() {
        if (this.audio) {
            this.isMuted = !this.isMuted;
            this.audio.muted = this.isMuted;
            this.updateMuteButton();
        }
    }
    
    updatePlayButton() {
        if (this.playBtn) {
            const icon = this.playBtn.querySelector('i');
            if (icon) {
                icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
            }
            this.playBtn.classList.toggle('playing', this.isPlaying);
        }
    }
    
    updateMuteButton() {
        if (this.muteBtn) {
            const icon = this.muteBtn.querySelector('i');
            if (icon) {
                icon.className = this.isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
            }
            this.muteBtn.classList.toggle('muted', this.isMuted);
        }
    }
    
    startWaveAnimation() {
        this.waves.forEach((wave, index) => {
            wave.style.animationDelay = `${index * 0.2}s`;
            wave.classList.add('active');
        });
    }
    
    stopWaveAnimation() {
        this.waves.forEach(wave => {
            wave.classList.remove('active');
        });
    }
    
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.audio) {
            this.audio.volume = this.volume;
        }
    }
    
    showNotification(message) {
        // Buat notifikasi sederhana
        const notification = document.createElement('div');
        notification.className = 'music-notification';
        notification.innerHTML = `
            <i class="fas fa-music"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    showError() {
        const container = document.getElementById('music-player-container');
        if (container) {
            container.innerHTML = `
                <div class="music-player error">
                    <div class="music-info">
                        <div class="music-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="music-text">
                            <span class="music-title">Gagal memuat musik</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

// ============================================
// INITIALIZE MUSIC PLAYER SAAT DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi music player
    window.musicPlayer = new MusicPlayer(MUSIC_CONFIG);
});

// Export untuk akses global
window.MusicPlayer = MusicPlayer;
window.MUSIC_CONFIG = MUSIC_CONFIG;
