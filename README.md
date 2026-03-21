# 🍩 DonatJS

> **Framework yang tidak minta apa-apa dulu sebelum memberikan segalanya.**  
> Tidak ada `npm install`. Tidak ada `webpack.config.js`. Tidak ada `node_modules`.  
> Hanya dua file, satu folder — aplikasi bisnis Anda berjalan hari ini.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Versi](https://img.shields.io/badge/DonatJS-v2.2-E34F26)](https://donat.id)
[![HTML](https://img.shields.io/badge/HTML-45.67%25-E34F26?logo=html5&logoColor=white)](https://github.com/donatjs)
[![JavaScript](https://img.shields.io/badge/JavaScript-39.26%25-F7DF1E?logo=javascript&logoColor=black)](https://github.com/donatjs)
[![Stars](https://img.shields.io/badge/stars-41-yellow)](https://github.com/sismadi)
[![Made in Indonesia](https://img.shields.io/badge/Made%20in-Indonesia-CE1126)](https://wawan.sismadi.com)
[![ISBN](https://img.shields.io/badge/ISBN-978--623--8488--97--1-blue)](https://donat.id)

---

## Apa itu DonatJS?

**DonatJS** adalah ekosistem frontend JavaScript vanilla untuk membangun aplikasi bisnis — tanpa build pipeline, tanpa package manager, tanpa dependensi eksternal.

Tulis JSON → framework render UI. Tidak ada langkah kompilasi di antaranya.

```
JSON → ui.render.engine() → HTML string → DOM
```

Dirancang untuk developer yang ingin **kontrol penuh** atas apa yang terjadi di browser, tanpa abstraksi yang tidak perlu.

---

## 5 Layer Ekosistem

```
┌────────────────────────────────────────────────────────────┐
│  Kit Modules  login · web · pos · app-pos                  │  Aplikasi bisnis
├────────────────────────────────────────────────────────────┤
│  UI Engine    ui.js — Router SPA, fetch, state, render     │  10 tipe blok JSON
├────────────────────────────────────────────────────────────┤
│  Skin System  skin.js — SVG pattern + warna + layout       │  Theme runtime
├────────────────────────────────────────────────────────────┤
│  SVG Engine   svg.js — 80+ ikon, gradien, animasi          │  data-src deklaratif
├────────────────────────────────────────────────────────────┤
│  Core         donat.js + donat.css — kernel d, MVC, CSS    │  Fondasi segalanya
└────────────────────────────────────────────────────────────┘
```

| Repo | File Utama | Fungsi |
|------|-----------|--------|
| [donatjs/core](https://github.com/donatjs/core) | `donat.js` + `donat.css` | Kernel `d`, utilities, MVC, CRUD, CSS token |
| [donatjs/svg](https://github.com/donatjs/svg) | `svg.js` + `svg.json` | Icon engine — 80+ ikon, gradien, 5 animasi |
| [donatjs/skin](https://github.com/donatjs/skin) | `skin.js` + `skin.json` | Theme system — SVG pattern + warna + layout |
| [donatjs/ui](https://github.com/donatjs/ui) | `ui.js` + `ui-code-patch.js` | Router SPA, fetch cache, 10 tipe blok render |
| [donatjs/kit](https://github.com/donatjs/kit) | `login.js` + `web.js` + `pos.js` | Autentikasi, page controller, kasir |

---

## Quick Start

### 1. Struktur folder

```
project/
├── index.html
├── data/
│   └── web/page/home.json
└── al/
    ├── core/   donat.css  donat.js
    ├── svg/    svg.css    svg.js    svg.json
    ├── skin/   skin.css   skin.js   skin.json
    ├── ui/     ui.js      ui-code-patch.js
    └── kit/    login.css  login.js  web.js
```

### 2. `index.html`

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <link rel="stylesheet" href="/al/svg/svg.css">
  <link rel="stylesheet" href="/al/core/donat.css">
  <link rel="stylesheet" href="/al/kit/login.css">
  <link rel="stylesheet" href="/al/skin/skin.css">
</head>
<body>
  <div id="pattern-layer"></div>
  <div id="modal"  class="hide depan"></div>
  <div id="bawah"  class="toast hide">info</div>

  <div id="menu" class="menu">
    <div class="sidebar-header"><span>MyApp</span></div>
    <ul id="leftmenu">
      <li data-info="web/page/home"><img data-src="house"> Home</li>
    </ul>
  </div>

  <div id="panel-container"></div>
  <div id="main" class="main shadow">
    <div id="topmenu" class="topmenu sticky-top"></div>
    <main><div id="content" class="content"></div></main>
    <div id="footer" class="footer"></div>
  </div>

  <!-- Load order wajib -->
  <script src="/al/skin/skin.js"></script>
  <script src="/al/core/donat.js"></script>
  <script src="/al/ui/ui.js"></script>
  <script src="/al/svg/svg.js"></script>
  <script src="/al/kit/login.js"></script>
  <script src="/al/kit/web.js"></script>

  <script>
    const config = {
      api: 0,
      getdata: (id) => `data/${id}.json`,
    };
    d.gebi('leftmenu').addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (li) navigate(li.getAttribute('data-info'));
    });
    loadSVGLibraries(['/al/svg/svg.json']);
  </script>
</body>
</html>
```

### 3. Buat halaman — `data/web/page/home.json`

```json
{
  "page": "web/page/home",
  "data": [
    {
      "section": "header",
      "content": {
        "nama": "Selamat Datang",
        "tagline": "Aplikasi berjalan hari ini.",
        "icon": "donat/150/var(--pColor)/1/float",
        "cta": [
          { "text": "Mulai", "url": "web/page/produk", "icon": "lightning" }
        ]
      }
    },
    {
      "section": "stats",
      "caption": "Menu Utama",
      "content": [
        { "id": 1, "nama": "POS",  "isi": "Kasir digital", "icon": "cart/150",  "url": "pos/page/pos" },
        { "id": 2, "nama": "LMS",  "isi": "Kursus online", "icon": "edu/150",   "url": "lms/page/lms" },
        { "id": 3, "nama": "Stok", "isi": "Manajemen stok","icon": "box/150",   "url": "inv/page/inv" }
      ]
    }
  ]
}
```

### 4. Buka di browser

Langsung buka `index.html` — tidak perlu server, tidak perlu build.

---

## Load Order — Wajib Dipatuhi

```html
<script src="/al/skin/skin.js"></script>       <!-- 1 — CSS token sebelum render -->
<script src="/al/core/donat.js"></script>      <!-- 2 — kernel d -->
<script src="/al/ui/ui.js"></script>           <!-- 3 — router + render engine -->
<script src="/al/ui/ui-code-patch.js"></script><!-- 4 — section code (opsional) -->
<script src="/al/svg/svg.js"></script>         <!-- 5 — icon engine -->
<script src="/al/kit/login.js"></script>       <!-- 6 — auth + topmenu, auto-init -->
<script src="/al/kit/web.js"></script>         <!-- 7 — page controller -->
<script src="/al/kit/app-pos.js"></script>     <!-- 8 — patch engine POS (jika pakai) -->
<script src="/al/kit/pos.js"></script>         <!-- 9 — kasir (jika pakai) -->
```

---

## JSON-Driven UI — 10 Tipe Blok

| `section` | Deskripsi |
|-----------|-----------|
| `header` | Hero — ikon, nama, tagline, bio, CTA |
| `stats` | Grid kartu `col-1-N`, klik → navigate/modal |
| `table` | Tabel responsif dari array objek + filter opsional |
| `progress` | Progress bar berlabel dengan warna interpolasi |
| `btn` | Baris tombol (`url` → navigate, `modal` → path) |
| `kursus` | Grid modul async dari URL JSON |
| `cert` | Verifikasi sertifikat via ID |
| `csv` | Kuis interaktif + skor |
| `mp4` | Video player 16:9 responsif |
| `pdf` | PDF viewer via EmbedPDF |

Dengan `ui-code-patch.js`: tambah section `code` — syntax highlighting, 10 color preset, tab switcher.

---

## Ikon Deklaratif

```html
<!-- Sintaks: id/size/color/opacity/animation -->
<img data-src="home/32">
<img data-src="cart/48/var(--pColor)">
<img data-src="donat/64/#f97316-#dc2626">
<img data-src="setting/32/var(--pColor)/1/spin">
<img data-src="donat/150/var(--pColor)/0.07">
```

5 animasi bawaan: `spin` · `float` · `pulse` · `shake` · `bounce`

---

## Theme System

```js
// Tiga dimensi identitas visual dalam satu baris
Theme.set('wafel', 'biru', 'admin');

// Atau terpisah
Theme.setSvg('piawai');
Theme.setPallet('merah');
Theme.setLayout('blog');

// Palet hex langsung
Theme.setPallet('#e63946');
Theme.setPallet(['#e63946', '#ff8fa3', '#c1121f']);

// Tambah palet kustom runtime
Theme.addPallet('brand', {
  pColor: '#1a1a2e', pLightColor: '#16213e', pDarkColor: '#0f3460'
});
Theme.setPallet('brand');
refreshIcons();
```

**SVG Patterns bawaan:** `donat` · `wafel` · `piawai` · `sismadi`

**Palet bawaan:** `donat` · `hijau` · `coklat` · `ungu` · `biru` · `merah` · `hitam`

**Layout modes:** `framework` (sidebar 200px) · `admin` (sidebar 50px) · `blog` (tanpa sidebar) · `catalog` (fullscreen pattern)

---

## Kit Modules — Fitur Bisnis Siap Pakai

```js
// Autentikasi
login.controller.showSignform();
login.controller.signin();
login.controller.isLogged();

// Page controller
web.controller.page('web/page/dashboard');
web.switchStyle('dark-forest');

// POS — Kasir
pos.addItem('kopi-1', 'Kopi Arabika', 'Rp 15.000');
pos.openCart();
pos.checkout();
```

---

## Aplikasi yang Dibangun di Atasnya

| Aplikasi | Deskripsi |
|----------|-----------|
| LMS | Kursus, modul, kuis, sertifikat digital — [piawai.id](https://piawai.id) |
| POS | Kasir UMKM — keranjang, checkout, transaksi |
| Presensi | Absensi via QR Code, rekap harian |
| Inventory | Manajemen stok masuk-keluar |
| Finance | Catatan keuangan usaha |
| Web Templates | Starter kit SPA berbagai layout dan tema |

---

## Kekuatan & Batas

| | Status |
|--|--------|
| Setup dari nol < 1 menit | ✅ |
| CRUD & dashboard bisnis internal | ✅ |
| JSON-driven UI tanpa kode JS | ✅ |
| Deploy ke shared hosting tanpa Node.js | ✅ |
| Theme runtime tanpa rebuild | ✅ |
| Reaktivitas granular | ❌ |
| SEO / SSR | ❌ |
| TypeScript | ❌ |
| Ekosistem plugin komunitas | ❌ |

---

## Panduan Jujur

| Pilih DonatJS jika | Jangan pilih DonatJS jika |
|--------------------|--------------------------|
| Tim 1–5 orang, deadline minggu ini | Tim 20+ dengan CI/CD mature |
| CRUD: produk, karyawan, transaksi | Real-time collaboration (Figma-like) |
| Hosting shared/cPanel tanpa Node.js | Butuh SEO tinggi (e-commerce publik) |
| Developer generalis PHP + JS | Frontend specialist TypeScript |
| Prototype harus jalan dalam 1 hari | Codebase 5+ tahun, tim berganti |

---

## Filosofi

**Data drives everything.** Dari JSON ke layar — tidak ada langkah kompilasi.

**Explicit over magic.** Jika halaman perlu dirender: panggil render. Tidak ada yang terjadi di belakang layar tanpa Anda ketahui.

**Bisnis dulu, teknologi kemudian.** Framework terbaik adalah yang membuat bisnis klien berjalan besok pagi.

---

## Dokumentasi

- 🌐 **Website:** [donat.id](https://donat.id)
- 📖 **Buku DonatJS** — ISBN: `978-623-8488-97-1`
- 🎓 **LMS:** [piawai.id](https://piawai.id)
- 📊 **SINTA:** [ID 6848496](https://sinta.kemdiktisaintek.go.id/authors/profile/6848496)
- 🔬 **ORCID:** [0009-0007-2685-5663](https://orcid.org/0009-0007-2685-5663)
- 💼 **LinkedIn:** [in/sismadi](https://www.linkedin.com/in/sismadi)
- 📧 **Email:** wawan@sismadi.com

---

## GitHub Stats

```
⭐ Stars Earned   : 41
🔨 Commits (2025) : 500
📦 Repositories   : 23
🤝 Contributed to : 37 repos
📝 Contributions  : 662 (1 tahun terakhir)
```

---

## Kontribusi

```bash
git clone https://github.com/donatjs/donatjs.git
git checkout -b fitur/nama-fitur
git commit -m "feat: deskripsi fitur"
git push origin fitur/nama-fitur
# Buat Pull Request
```

---

## Lisensi

MIT License © [Wawan Sismadi](https://wawan.sismadi.com) · [PT Sismadi Langit Solusi](https://sismadi.co.id)

---

<p align="center">
  <a href="https://donat.id">donat.id</a> ·
  <a href="https://github.com/donatjs">GitHub</a> ·
  <a href="https://www.linkedin.com/in/sismadi">LinkedIn</a> ·
  <a href="mailto:wawan@sismadi.com">wawan@sismadi.com</a>
  <br><br>
  <em>Tidak ada npm install. Tidak ada webpack.config.js.<br>Hanya kode yang bekerja.</em>
</p>
