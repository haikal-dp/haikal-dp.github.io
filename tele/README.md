# Telegram Web Client

Aplikasi web client untuk Telegram Bot dengan tampilan mirip WhatsApp Web. Frontend-only, bisa dijalankan langsung di GitHub Pages tanpa backend.

![Telegram Web Client](https://via.placeholder.com/800x400/128C7E/FFFFFF?text=Telegram+Web+Client)

## Fitur

- **Auto Load Chat**: Memuat chat otomatis dari `getUpdates`
- **Realtime Update**: Refresh otomatis setiap 5 detik
- **Kirim Pesan**: Text message dengan HTML parsing
- **Kirim Media**: Foto, Video, Audio, Dokumen
- **Kirim Lokasi**: Dengan geolocation API
- **Spam Mode**: Kirim pesan berulang dengan delay
- **MikroTik Monitor**: Monitoring router (simulasi)
- **Notifikasi Suara**: Saat pesan masuk
- **Unread Badge**: Indikator pesan belum dibaca
- **Responsive**: Support mobile dan desktop

## Struktur File

```
/project
├── index.html      # UI utama
├── style.css       # Styling WhatsApp-like
├── app.js          # Logic aplikasi
├── config.js       # Konfigurasi API (EDIT INI!)
└── README.md       # Dokumentasi
```

## Cara Setup

### 1. Buat Bot Telegram

1. Buka Telegram, cari **@BotFather**
2. Kirim `/newbot` dan ikuti instruksi
3. Copy **token** yang diberikan
4. Kirim pesan ke bot Anda
5. Buka URL: `https://api.telegram.org/bot<TOKEN>/getUpdates`
6. Cari `"chat":{"id":123456789` - itu adalah **chat_id**

### 2. Konfigurasi

Edit file `config.js`:

```javascript
const CONFIG = {
  TELEGRAM_BOT_TOKEN: "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",  // Ganti dengan token Anda
  CHAT_ID_SAYA: "123456789",  // Ganti dengan chat ID Anda
  // ...
};
```

### 3. Deploy ke GitHub Pages

#### Opsi A: Upload Manual

1. Fork/download repository ini
2. Edit `config.js` dengan token Anda
3. Upload ke repository GitHub
4. Buka **Settings** → **Pages**
5. Pilih branch `main`, folder `/ (root)`
6. Klik **Save**
7. Tunggu 1-2 menit, lalu akses URL yang diberikan

#### Opsi B: Git Clone

```bash
# Clone repository
git clone https://github.com/username/telegram-web-client.git
cd telegram-web-client

# Edit config.js
nano config.js  # atau editor favorit Anda

# Commit dan push
git add .
git commit -m "Update config"
git push origin main
```

## Cara Penggunaan

### Chat

1. Buka website yang sudah di-deploy
2. Chat akan muncul otomatis saat ada pesan masuk
3. Klik chat di sidebar untuk membuka
4. Ketik pesan dan tekan Enter atau tombol kirim

### Chat Baru

1. Klik icon **+** di header sidebar
2. Masukkan **Chat ID** target
3. (Opsional) Masukkan pesan pertama
4. Klik **Mulai Chat**

### Kirim Media

1. Klik icon **+** di input area
2. Pilih tipe media (Foto/Video/Audio/Dokumen/Lokasi)
3. Pilih file atau masukkan lokasi
4. Klik **Kirim**

### Spam Mode

1. Buka chat target
2. Klik icon **⚡** di header
3. Atur:
   - **Jumlah Pesan**: 1-100
   - **Delay**: Dalam milidetik (1000 = 1 detik)
   - **Pesan**: Text yang akan dikirim
4. Klik **START SPAM**
5. Klik **STOP** untuk menghentikan

## API Functions

### Telegram API (Frontend)

Semua request menggunakan `fetch` dengan method `POST`:

```javascript
// Get Updates
POST https://api.telegram.org/bot<TOKEN>/getUpdates

// Send Message
POST https://api.telegram.org/bot<TOKEN>/sendMessage
Body: { chat_id, text, parse_mode }

// Send Photo
POST https://api.telegram.org/bot<TOKEN>/sendPhoto
Body: FormData { chat_id, photo, caption }

// Send Video
POST https://api.telegram.org/bot<TOKEN>/sendVideo
Body: FormData { chat_id, video, caption }

// Send Audio
POST https://api.telegram.org/bot<TOKEN>/sendAudio
Body: FormData { chat_id, audio, caption }

// Send Document
POST https://api.telegram.org/bot<TOKEN>/sendDocument
Body: FormData { chat_id, document, caption }

// Send Location
POST https://api.telegram.org/bot<TOKEN>/sendLocation
Body: { chat_id, latitude, longitude }
```

### JavaScript Functions

```javascript
// Load dan render chat
loadChats()           // Fetch getUpdates
renderSidebar()       // Render list chat
openChat(chat_id)     // Buka chat
renderMessages(id)    // Render pesan

// Kirim pesan
sendMessage()         // Kirim text
sendMedia()           // Kirim media

// Spam
startSpam()           // Mulai spam
stopSpam()            // Hentikan spam

// Auto update
autoUpdate()          // Start interval
getMikrotikData()     // Get MikroTik stats
```

## Keamanan ⚠️

**PERINGATAN PENTING:**

- **Token bot disimpan di frontend** - Tidak aman untuk production!
- Jangan commit `config.js` ke repository publik
- Gunakan `.gitignore` untuk menyembunyikan config
- Untuk production, gunakan **backend proxy** atau **environment variables**
- Semua orang yang melihat source code bisa melihat token Anda

### Rekomendasi Keamanan

1. **Gunakan Backend Proxy**:
   ```
   Frontend → Your Backend → Telegram API
   ```

2. **Environment Variables** (untuk hosting dengan backend):
   ```javascript
   // .env
   TELEGRAM_BOT_TOKEN=your_token_here
   ```

3. **Rate Limiting**: Bot API memiliki limit:
   - 30 pesan/detik ke chat yang sama
   - 20 pesan/menit ke grup yang sama

## Troubleshooting

### Chat tidak muncul

1. Pastikan token benar
2. Kirim pesan ke bot terlebih dahulu
3. Cek console browser untuk error
4. Refresh halaman

### Tidak bisa kirim pesan

1. Pastikan bot tidak diblokir user
2. Cek chat ID benar
3. Lihat error di console

### CORS Error

Telegram API mendukung CORS, tapi jika ada masalah:
- Gunakan browser modern
- Disable CORS extension (jika ada)
- Gunakan backend proxy

## Teknologi

- **HTML5** - Struktur
- **CSS3** - Styling (WhatsApp-like)
- **Vanilla JavaScript** - Logic (ES6+)
- **Telegram Bot API** - Backend
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Lisensi

MIT License - Bebas digunakan dan dimodifikasi.

**Disclaimer**: Gunakan dengan bijak. Penyalahgunaan spam bisa menyebabkan token bot dibanned.

---

Dibuat dengan ❤️ untuk komunitas Telegram Bot
