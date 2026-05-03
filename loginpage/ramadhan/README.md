# 🌙 Ramadhan Theme - ERVITA.NET Hotspot Login

Tema login hotspot modern dengan konsep Ramadhan yang elegan dan profesional.

## ✨ Fitur Utama

### 🎨 Design
- **Tema Ramadhan Modern**: Warna hijau emerald dengan gradasi gelap
- **Ornamen Islami**: SVG moon, lantern, dan pattern halus
- **Glassmorphism Effect**: Card login dengan efek kaca modern
- **Mobile-First**: Responsive penuh untuk semua ukuran layar
- **Border Radius Besar**: 20px untuk tampilan modern
- **Animasi Smooth**: Transisi halus 0.3s ease

### 🔐 Login System
- **Tab Switch**: Voucher dan Member mode
- **Form Login**: Struktur asli MikroTik tetap terjaga
- **QR Code Scanner**: Tombol scan QR untuk voucher
- **Error Handling**: Pesan error dalam Bahasa Indonesia
- **Password Sync**: Otomatis sinkronisasi username dan password

### ⏰ Countdown & Quotes
- **Countdown Lebaran**: Timer menuju Idul Fitri
- **Quote Islami**: Rotasi otomatis hadits dan quotes
- **Greeting Time**: Sapaan berdasarkan waktu (pagi/siang/sore/malam)

### 📱 UI Components
- **Bottom Navigation**: Navigasi modern di bagian bawah
- **Price Cards**: Daftar harga paket internet
- **Menu Grid**: Akses cepat ke fitur lain
- **Popup Modal**: Notifikasi dan informasi
- **Warning Box**: Peringatan penggunaan voucher

## 📁 Struktur File

```
/
├── login.html              # Halaman login utama
├── aktivasi.html           # Panduan aktivasi voucher
├── about.html              # Tentang kami
├── voucher.html            # Daftar paket voucher
├── faq.html                # Pusat bantuan
├── member.html             # Login member
├── trial-user.html         # Login gratis (trial)
├── status.html             # Status koneksi
├── error.html              # Halaman error
├── index.html              # Preview/demo page
├── md5.js                  # Library MD5 untuk autentikasi MikroTik
├── css/
│   └── ramadhan.css        # Stylesheet tema Ramadhan
├── js/
│   └── ramadhan.js         # JavaScript fitur Ramadhan
└── img/
    └── favicon.png         # Favicon (opsional)
```

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Green | `#10b981` | Buttons, accents |
| Primary Dark | `#059669` | Hover states |
| Ramadhan Gold | `#fbbf24` | Highlights, ornaments |
| Background Dark | `#022c22` | Main background |
| Background Gradient | `#064e3b` → `#10b981` | Gradient background |
| Glass White | `rgba(255,255,255,0.08)` | Glassmorphism |

## 🔧 Technical Details

### Form Structure (Tetap)
```html
<form name="login" action="$(link-login-only)" method="post">
    <input type="text" name="username" id="user">
    <input type="hidden" name="password" id="pass">
</form>
```

### JavaScript Functions (Tetap)
- `doLogin()` - Fungsi autentikasi MikroTik
- `doLoginMember()` - Fungsi login member
- Error handling dengan pesan Bahasa Indonesia

### CSS Variables
Semua styling menggunakan CSS variables untuk kemudahan kustomisasi:
```css
:root {
    --primary: #10b981;
    --ramadhan-gold: #fbbf24;
    --radius-xl: 24px;
    /* ... */
}
```

## 📱 Responsive Breakpoints

- **Desktop**: > 480px
- **Mobile**: ≤ 480px
- **Small Mobile**: ≤ 360px

## 🚀 Cara Penggunaan

1. **Upload file** ke server MikroTik hotspot
2. **Pastikan path** css dan js sudah benar
3. **Tambahkan favicon** di folder img/
4. **Sesuaikan tanggal** Lebaran di ramadhan.js
5. **Test login** dengan voucher dan member

## ⚙️ Konfigurasi

### Mengubah Tanggal Lebaran
Edit file `js/ramadhan.js`:
```javascript
const targetDate = new Date('2025-03-31T00:00:00').getTime();
```

### Menambah Quote
Edit array `islamicQuotes` di `js/ramadhan.js`:
```javascript
const islamicQuotes = [
    { text: "...", source: "..." },
    // Tambahkan quote baru
];
```

### Mengubah Warna
Edit CSS variables di `css/ramadhan.css`:
```css
:root {
    --primary: #warna-baru;
    --ramadhan-gold: #gold-baru;
}
```

## 🎯 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Opera 67+

## 📄 License

Free to use for personal and commercial projects.

---

**ERVITA.NET © 2026** - Internet Cepat & Stabil  
🌙 Selamat Menunaikan Ibadah Puasa
