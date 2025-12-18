const buttonContainer = document.getElementById('buttonContainer');
const voucherContainer = document.getElementById('voucherContainer');

// Jumlah file JSON (ubah sesuai kebutuhan)
const totalFiles = 2;

// Buat tombol otomatis
for (let i = 1; i <= totalFiles; i++) {
  const btn = document.createElement('button');
  btn.textContent = `Voucher ${i}`;
  btn.addEventListener('click', () => loadVoucher(`vouchera${i}.json`));
  buttonContainer.appendChild(btn);
}

async function loadVoucher(filename) {
  voucherContainer.innerHTML = `<p style="text-align:center;color:#555;">Memuat ${filename}...</p>`;

  try {
    const res = await fetch(filename);
    if (!res.ok) throw new Error(`Gagal memuat ${filename}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error(`Format ${filename} tidak valid`);

    renderVoucher(data);
  } catch (err) {
    voucherContainer.innerHTML = `<div style="color:red;text-align:center;">${err.message}</div>`;
  }
}

function renderVoucher(codes) {
  voucherContainer.innerHTML = '';

  // Ambil tanggal hari ini
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  codes.forEach(code => {
    const div = document.createElement('div');
    div.className = 'voucher';
    div.innerHTML = `
      <div class="v-head">ERVITA.NET</div>
      <div class="v-code">${escapeHtml(String(code))}</div>
      <div class="v-meta">
        <div>Rp 20.000</div>
        <div>7 Hari</div>
        <div><b>UNLIMITED</b></div>
      </div>
      <div class="v-cs">CS : 081294701977</div>
      <div class="v-cs">Dicetak Pada: ${formattedDate}</div>
            <div class="v-cs">Jika Segel Rusak Tidak boleh di tukar</div>
    `;
    voucherContainer.appendChild(div);
  });

  // Isi kosong biar tetap pas 11x4 (44 slot)
  const totalSlots = 44;
  for (let i = codes.length; i < totalSlots; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'voucher empty';
    voucherContainer.appendChild(emptyDiv);
  }
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, m => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]
  ));
}

// Auto-load file pertama
loadVoucher('vouchera1.json');
