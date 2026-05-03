# MikroTik Login Page - Blue Theme Edition

Sistem Login Page MikroTik Hotspot dengan tema Biru Profesional dan file konfigurasi terpusat.

## 📁 Struktur File

```
mikrotik-login/
├── css/
│   └── ervita.css          # Stylesheet utama (Tema Biru)
├── js/
│   └── setting.js          # File konfigurasi utama
├── img/                    # Folder gambar (favicon, author, banner, dll)
├── login.html              # Halaman login utama
├── logout.html             # Halaman logout
├── status.html             # Halaman status koneksi
├── alogin.html             # Halaman login berhasil
├── rlogin.html             # Halaman redirect login
├── redirect.html           # Halaman redirect umum
├── about.html              # Tentang kami
├── faq.html                # Pusat bantuan
├── fitur.html              # Fitur unggulan
├── member.html             # Login member
├── voucher.html            # Daftar paket voucher
├── aktivasi.html           # Cara aktivasi
├── trial-user.html         # Login gratis/trial
├── error.html              # Halaman error
├── radvert.html            # Halaman iklan
└── md5.js                  # Library MD5 untuk enkripsi password
```

## 🔧 Cara Konfigurasi

Semua pengaturan dilakukan di file **`js/setting.js`** pada objek `HOTSPOT_CONFIG`:

### 1. Informasi Hotspot
```javascript
info: {
    nama: 'NAMA_HOTSPOT_ANDA',
    tagline: 'Tagline Hotspot',
    tahun: '2026',
    alamat: 'Alamat Anda',
    whatsapp: '628xxxxxxxxxx',  // Format: 62 tanpa +
    email: 'email@domain.com'
}
```

### 2. Konfigurasi Banner
```javascript
banner: {
    jumlah: 1,                    // Jumlah banner (1-5)
    interval: 5000,               // Interval autoplay (ms)
    gambar: [
        'https://url-gambar-anda.com/banner1.jpg',
        'https://url-gambar-anda.com/banner2.jpg'
    ],
    teks: [
        { judul: 'Judul 1', subjudul: 'Subjudul 1' },
        { judul: 'Judul 2', subjudul: 'Subjudul 2' }
    ],
    fallback: 'https://url-gambar-fallback.jpg'
}
```

### 3. Daftar Harga Paket
```javascript
hargaPaket: [
    { kecepatan: '10 Mbps', harga: 'Rp 150.000', icon: 'rocket', populer: false },
    { kecepatan: '20 Mbps', harga: 'Rp 200.000', icon: 'bolt', populer: true },
    { kecepatan: '40 Mbps', harga: 'Rp 350.000', icon: 'meteor', populer: false }
]
```

### 4. Konfigurasi Musik
```javascript
musik: {
    aktif: true,                  // Aktifkan/nonaktifkan musik
    url: 'https://url-musik-anda.com/lagu.mp3',
    judul: 'Judul Lagu',
    artis: 'Nama Artis',
    volume: 0.5,                  // 0.0 - 1.0
    autoplay: true,
    loop: true
}
```

### 5. Popup Promo
```javascript
popup: {
    aktif: true,
    delay: 2000,                  // Delay sebelum popup muncul (ms)
    judul: 'Judul Popup',
    isi: 'Isi popup (bisa HTML)',
    tombolWA: true,
    waText: 'Pesan via WhatsApp'
}
```

## 🎨 Panduan Mengubah Warna Tema

Untuk mengubah warna tema, edit file **`css/ervita.css`** pada bagian `:root`:

```css
:root {
    /* Warna Utama - Biru */
    --primary: #2563eb;           /* Biru utama */
    --primary-dark: #1d4ed8;      /* Biru gelap */
    --primary-light: #3b82f6;     /* Biru terang */
    
    /* Gradasi Background */
    --bg-gradient: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0ea5e9 100%);
    
    /* Warna Lainnya */
    --success: #10b981;           /* Hijau */
    --warning: #f59e0b;           /* Kuning/Oranye */
    --danger: #ef4444;            /* Merah */
    --info: #06b6d4;              /* Cyan */
}
```

### Catatan Penting untuk Link Eksternal

Agar semua resource (font, icon, gambar) dapat diakses sebelum login, tambahkan domain berikut ke **Walled Garden** MikroTik:

```
fonts.googleapis.com
cdnjs.cloudflare.com
images.unsplash.com
raw.githubusercontent.com
gstatic.com
ui-avatars.com
wa.me
```

Cara menambahkan Walled Garden di MikroTik:
```
/ip hotspot walled-garden
add dst-host=fonts.googleapis.com
add dst-host=cdnjs.cloudflare.com
add dst-host=*.gstatic.com
add dst-host=raw.githubusercontent.com
add dst-host=images.unsplash.com
add dst-host=ui-avatars.com
add dst-host=wa.me
```

## 📤 Cara Upload ke MikroTik

### Via Winbox:
1. Buka **Files** menu
2. Drag & drop semua file ke folder `hotspot`
3. Pastikan struktur folder tetap terjaga

### Via FTP:
```bash
# Upload semua file ke direktori hotspot MikroTik
ftp admin@IP_MIKROTIK
cd hotspot
put *.html
put *.js
mkdir css
put css/ervita.css
cd js
put js/setting.js
```

### Via Terminal MikroTik:
```
/tool fetch url="https://your-server.com/login.html" dst-path="hotspot/login.html"
```

## ⚠️ Variabel MikroTik yang Harus Dijaga

Jangan hapus atau ubah variabel-variabel berikut:

- `$(link-login-only)` - URL login
- `$(link-orig)` - URL tujuan setelah login
- `$(link-redirect)` - URL redirect
- `$(chap-id)` - ID untuk enkripsi CHAP
- `$(chap-challenge)` - Challenge untuk enkripsi CHAP
- `$(username)` - Username pengguna
- `$(password)` - Password pengguna
- `$(error)` - Pesan error
- `$(trial)` - Status trial (yes/no)
- `$(ip)` - IP address client
- `$(mac)` - MAC address client
- `$(uptime)` - Uptime koneksi
- `$(bytes-in-nice)` - Data upload
- `$(bytes-out-nice)` - Data download
- `$(session-time-left)` - Sisa waktu session
- `$(remain-bytes-total-nice)` - Sisa kuota

## 🔒 Keamanan

- File `md5.js` wajib ada untuk enkripsi password CHAP
- Jangan mengubah fungsi `doLogin()` pada file HTML
- Selalu gunakan HTTPS untuk hosting file eksternal

## 📱 Fitur

- ✅ Desain responsif (mobile-friendly)
- ✅ Tema Biru Profesional
- ✅ Banner slider dengan autoplay
- ✅ Musik background (dapat dimatikan)
- ✅ Popup promo otomatis
- ✅ Status server real-time
- ✅ Animasi halus
- ✅ DOM Manipulation untuk konten dinamis
- ✅ Satu file konfigurasi untuk semua pengaturan

## 📝 Lisensi

Free to use and modify for personal or commercial use.

---
**Versi:** 4.0 - Blue Theme Edition  
**Dibuat untuk:** MikroTik Hotspot Gateway
