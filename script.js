fetch('vouchers.json')
    .then(response => response.json())
    .then(vouchers => {
        const resultBox = document.getElementById('result-box');

        vouchers.forEach(({ title, codes }) => {
            const seen = new Set();
            const duplicates = [];

            codes.forEach(code => {
                const trimmed = code.trim();
                if (seen.has(trimmed)) {
                    duplicates.push(trimmed);
                } else {
                    seen.add(trimmed);
                }
            });

            if (duplicates.length > 0) {
                resultBox.textContent +=
                    `⚠️ Ditemukan ${duplicates.length} kode duplikat di voucher "${title}":\n` +
                    duplicates.join(", ") + "\n\n";
            } else {
                resultBox.textContent +=
                    `✅ Tidak ada kode duplikat di voucher "${title}".\n\n`;
            }
        });

        vouchers.forEach(({ title, price, duration, codes }) => {
            codes.forEach(code => {
                const div = document.createElement("div");
                div.className = "voucher";
                div.innerHTML = `
                    <h1>${title}</h1>
                    <div class="code">${code}</div> 
                    <div class="price">Harga ${price}</div> 
                    <div class="details">
                        <div><span>Masa aktif:</span><span>${duration}</span></div>
                        <div><span>support:</span><span>081294701977</span></div>
                    </div>
                `;
                document.body.appendChild(div);
            });
        });
    })
    .catch(error => {
        console.error('Gagal memuat vouchers.json:', error);
        document.getElementById('result-box').textContent = '❌ Gagal memuat data voucher.';
    });
