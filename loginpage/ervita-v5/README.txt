================================================================================
                    MIKROTIK HOTSPOT LOGIN PAGE - NETPRO ISP
================================================================================

DESKRIPSI
---------
Login page Mikrotik Hotspot modern dengan design dark professional, 
full offline, ringan, dan responsive.

VERSI
-----
Version: 4.0
Release: April 2026
Author: Professional Redesign

FITUR UTAMA
-----------
✓ Design Dark Modern Professional
✓ Full Offline (Tanpa CDN)
✓ Responsive (HP, Tablet, Desktop)
✓ Tab Login (Voucher & Member)
✓ Auto Uppercase untuk Voucher
✓ Remember Username untuk Member
✓ Show/Hide Password Toggle
✓ Loading State pada Tombol Login
✓ Error Message Translation
✓ Banner Slider
✓ Price Cards
✓ Popup Modal
✓ Toast Notification

STRUKTUR FOLDER
---------------
/login-page
│
├── index.html          (Halaman utama - sama dengan login.html)
├── login.html          (Halaman login utama)
├── status.html         (Halaman status koneksi)
├── logout.html         (Halaman logout)
├── alogin.html         (Halaman login berhasil)
├── error.html          (Halaman error)
├── rlogin.html         (Redirect login)
├── redirect.html       (Redirect umum)
├── radvert.html        (Halaman iklan)
├── member.html         (Login member standalone)
├── faq.html            (Pusat bantuan)
├── voucher.html        (Daftar paket voucher)
├── about.html          (Tentang kami)
├── aktivasi.html       (Panduan aktivasi)
├── trial-user.html     (Login gratis/trial)
├── fitur.html          (Fitur unggulan)
│
├── css/
│   ├── theme.css       (Variabel tema & warna)
│   ├── style.css       (Style utama)
│   └── responsive.css  (Responsive design)
│
├── js/
│   ├── setting.js      (Konfigurasi sentral)
│   ├── app.js          (App utama)
│   ├── login.js        (Login handler)
│   ├── popup.js        (Popup modal)
│   └── md5.js          (MD5 untuk CHAP)
│
├── assets/
│   ├── images/         (Gambar banner, dll)
│   ├── icons/          (Icon SVG)
│   ├── fonts/          (Font lokal jika ada)
│   └── music/          (File musik jika ada)
│
└── README.txt          (File ini)

KONFIGURASI
-----------
Edit file js/setting.js untuk mengubah:
- Nama site
- Warna tema
- Paket harga
- Nomor WhatsApp admin
- Pesan error
- Dan lainnya

VARIABEL MIKROTIK YANG DIDUKUNG
--------------------------------
✓ $(link-login)
✓ $(link-login-only)
✓ $(link-orig)
✓ $(link-orig-esc)
✓ $(link-logout)
✓ $(link-status)
✓ $(link-redirect)
✓ $(link-redirect-esc)
✓ $(link-advert)
✓ $(username)
✓ $(password)
✓ $(error)
✓ $(chap-id)
✓ $(chap-challenge)
✓ $(ip)
✓ $(mac)
✓ $(uptime)
✓ $(bytes-in-nice)
✓ $(bytes-out-nice)
✓ $(remain-bytes-total-nice)
✓ $(session-time-left)
✓ $(refresh-timeout)
✓ $(refresh-timeout-secs)
✓ $(trial)
✓ $(mac-esc)
✓ $(blocked)
✓ $(popup)

CARA INSTALL
------------
1. Upload seluruh folder login-page ke router Mikrotik
2. Letakkan di folder hotspot (biasanya /hotspot)
3. Ubah konfigurasi hotspot untuk menggunakan file ini:
   - IP > Hotspot > Server Profile > Login
   - Pilih HTML Directory: login-page
   - Login Page: login.html

CATATAN PENTING
---------------
- Pastikan semua file memiliki permission yang benar
- Test di berbagai perangkat sebelum production
- Backup konfigurasi sebelumnya
- Edit js/setting.js sesuai kebutuhan Anda

KONTAK
------
Jika ada pertanyaan atau masalah, silakan hubungi:
WhatsApp: 6285172207018
Email: support@netpro.id

================================================================================
                            SELAMAT MENGGUNAKAN!
================================================================================
