/**
 * ============================================================================
 * KONFIGURASI TELEGRAM BOT & MIKROTIK
 * ============================================================================
 * 
 * ⚠️ PERINGATAN KEAMANAN ⚠️
 * ========================
 * File ini berisi token dan credential yang SENSITIF.
 * 
 * - JANGAN pernah commit file ini ke repository publik!
 * - Gunakan .gitignore untuk menyembunyikan file ini
 * - Untuk production, gunakan backend proxy atau environment variables
 * - Frontend-only TIDAK AMAN untuk menyimpan secret keys
 * 
 * Cara Mendapatkan Token:
 * 1. Buka Telegram, cari @BotFather
 * 2. Kirim /newbot dan ikuti instruksi
 * 3. Copy token yang diberikan ke TELEGRAM_BOT_TOKEN
 * 
 * Cara Mendapatkan Chat ID:
 * 1. Kirim pesan ke bot Anda
 * 2. Buka: https://api.telegram.org/bot<TOKEN>/getUpdates
 * 3. Cari "chat":{"id":123456789 - itu adalah chat_id
 * ============================================================================
 */

const CONFIG = {
  // ============================================
  // TELEGRAM BOT CONFIGURATION
  // ============================================
  TELEGRAM_BOT_TOKEN: "7837171460:AAE8B-BviGAJTn5qZX4XxrYl6WPH7OWzpLw",
  
  // Base URL akan otomatis dibentuk dari token
  get BASE_URL() {
    return `https://api.telegram.org/bot${this.TELEGRAM_BOT_TOKEN}`;
  },
  
  // Chat ID default (opsional, untuk testing)
  CHAT_ID_SAYA: "5328648743",
  
  // ============================================
  // MIKROTIK CONFIGURATION
  // ============================================
  // ⚠️ MikroTik API biasanya butuh backend proxy karena CORS
  // Jika menggunakan frontend-only, butuh MikroTik dengan CORS enabled
  // atau gunakan proxy server
  MIKROTIK: {
    host: "sg24.gukotunnel.net:8859",      // IP MikroTik Anda
    user: "mik",            // Username MikroTik
    password: "",     // Password MikroTik
    port: 8728,               // API port (default: 8728)
    useSSL: false             // Gunakan https?
  },
  
  // ============================================
  // APP SETTINGS
  // ============================================
  SETTINGS: {
    // Interval refresh dalam milidetik (default: 5000ms = 5 detik)
    REFRESH_INTERVAL: 5000,
    
    // Jumlah pesan maksimal yang ditampilkan per chat
    MAX_MESSAGES_PER_CHAT: 100,
    
    // Enable/disable notifikasi suara
    SOUND_NOTIFICATION: true,
    
    // Tema (light/dark/auto)
    THEME: 'light'
  }
};

// Export untuk digunakan di app.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
