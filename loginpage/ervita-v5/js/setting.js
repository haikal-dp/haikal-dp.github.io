/**
 * MIKROTIK HOTSPOT - CONFIGURATION FILE
 * ======================================
 * Edit file ini untuk mengubah pengaturan login page
 * Semua konfigurasi terpusat di sini
 */

const SETTINGS = {
  // ============================================
  // INFORMASI SITE
  // ============================================
  siteName: "ERVITA.NET",
  siteTagline: "Internet Cepat & Stabil",
  adminWhatsApp: "6285172207018",
  adminEmail: "support@netpro.id",
  copyright: "2026 ERVITA.NET",
  
  // ============================================
  // TEMA WARNA
  // ============================================
  theme: {
    primary: "#0ea5e9",
    primaryDark: "#0284c7",
    primaryLight: "#38bdf8",
    secondary: "#1e293b",
    secondaryLight: "#334155",
    accent: "#f97316",
    accentGreen: "#10b981",
    accentRed: "#ef4444",
    accentYellow: "#f59e0b",
    bgDark: "#0f172a",
    bgCard: "#1e293b",
    bgInput: "#334155",
    textPrimary: "#f8fafc",
    textSecondary: "#94a3b8",
    textMuted: "#64748b",
    border: "#334155",
    borderLight: "#475569",
    gradientPrimary: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    gradientDark: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
    gradientCard: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)"
  },
  
  // ============================================
  // KONFIGURASI HALAMAN
  // ============================================
  pages: {
    login: {
      title: "Login Internet",
      subtitle: "Masukkan kode voucher untuk mengakses internet",
      showPrices: true,
      showBanner: true,
      showComboPackage: true
    },
    status: {
      title: "Status Koneksi",
      showUptime: true,
      showTraffic: true,
      showQuota: true
    }
  },
  
  // ============================================
  // BANNER
  // ============================================
  banner: {
    enabled: true,
    autoPlay: true,
    interval: 5000,
    images: [
      {
        src: "assets/images/banner1.jpg",
        title: "Internet Cepat & Stabil",
        subtitle: "Nikmati pengalaman browsing tanpa hambatan"
      },
      {
        src: "/ervita-v5/assets/images/banner2.jpg",
        title: "Paket Hemat",
        subtitle: "Pilih paket sesuai kebutuhan Anda"
      }
    ],
    fallbackColor: "#0ea5e9"
  },
  
  // ============================================
  // PAKET HARGA
  // ============================================
  packages: [
    {
      name: "10 Mbps",
      speed: "10",
      price: "Rp 150.000",
      period: "/bulan",
      icon: "rocket",
      popular: false
    },
    {
      name: "20 Mbps",
      speed: "20",
      price: "Rp 200.000",
      period: "/bulan",
      icon: "bolt",
      popular: true
    },
    {
      name: "40 Mbps",
      speed: "40",
      price: "Rp 350.000",
      period: "/bulan",
      icon: "meteor",
      popular: false
    }
  ],
  
  // ============================================
  // VOUCHER
  // ============================================
  vouchers: [
    { name: "10 Jam", duration: "10 jam", price: "Rp 3.000" },
    { name: "2 Hari", duration: "2 hari", price: "Rp 6.000" },
    { name: "7 Hari", duration: "7 hari", price: "Rp 20.000" },
    { name: "30 Hari", duration: "30 hari", price: "Rp 50.000" }
  ],
  
  // ============================================
  // POPUP
  // ============================================
  popup: {
    enabled: false,
    autoShow: true,
    delay: 2000,
    title: "Informasi",
    message: "Selamat datang di ERVITA.NET",
    showOncePerDay: false
  },
  
  // ============================================
  // MUSIK
  // ============================================
  music: {
    enabled: true,
    file: "assets/music/background.mp3",
    autoPlay: true,
    loop: true,
    volume: 0.5,
    title: "Background Music"
  },
  
  // ============================================
  // FITUR
  // ============================================
  features: {
    trialLogin: true,
    memberLogin: true,
    qrCode: true,
    voucherInfo: true,
    faq: true,
    whatsappSupport: true
  },
  
  // ============================================
  // PESAN ERROR
  // ============================================
  errorMessages: {
    "user $(username) has reached uptime limit": "Masa aktif voucher sudah habis",
    "user $(username) has reached traffic limit": "Kuota voucher sudah habis",
    "no valid profile found": "Profil voucher tidak valid",
    "invalid username or password": "Kode voucher salah atau tidak terdaftar",
    "user <$(username)> not found": "Voucher tidak ditemukan",
    "simultaneous session limit reached": "Batas session tercapai",
    "no more sessions are allowed for user $(username)": "Voucher sedang digunakan di perangkat lain",
    "authentication failed": "Autentikasi gagal",
    "invalid voucher": "Voucher tidak valid"
  },
  
  // ============================================
  // JAM OPERASIONAL
  // ============================================
  operationalHours: {
    show: true,
    text: "24 Jam Online"
  }
};

window.SETTINGS = SETTINGS;