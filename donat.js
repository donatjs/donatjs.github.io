/**
 * DONAT.JS — DonatJS Kernel Framework
 * Versi: 2.2
 *
 * Inti dari ekosistem DonatJS. Menyediakan:
 *   • Utilities DOM & localStorage
 *   • Toast, Modal, Side Panel
 *   • Warna interpolasi dari CSS token
 *   • MVC default — model dimuat dari donat.json
 *   • Service layer HTTP/CRUD (fetch API)
 *   • Tabs terintegrasi (tabs.js tidak diperlukan)
 *
 * Dipanggil oleh semua modul lain:
 *   d.gebi(), d.info(), d.modal(), d.sidePanel()
 *   d.service.get(), d.setls(), d.color()
 *
 * Bootstrap:
 *   d.service.init('data/donat.json')  ← muat model dari JSON
 *   d.service.init()                   ← pakai path default
 */


/* ═══════════════════════════════════════════
   BOOTSTRAP
   ═══════════════════════════════════════════ */

const log = console.log.bind(window.console);


/* ═══════════════════════════════════════════
   OBJECT UTAMA: d
   Kernel tunggal seluruh ekosistem DonatJS.
   Modul lain mendaftar ke d:  d.pos = pos
   ═══════════════════════════════════════════ */

const d = {

    /* ═══════════════════════════════════════
       UTILITIES — DOM & Storage
       ═══════════════════════════════════════ */

    gebi:  (id)      => document.getElementById(id),
    gebc:  (cls)     => document.getElementsByClassName(cls),
    qs:    (sel)     => document.querySelector(sel),
    ce:    (tag)     => document.createElement(tag),
    setcss:(id, val) => document.documentElement.style.setProperty(id, val),

    setls: (k, v)    => localStorage.setItem(k, JSON.stringify(v)),
    getls: (k)       => localStorage.getItem(k),
    remls: (k)       => localStorage.removeItem(k),

    open:  (id) => { const el = d.gebi(id); if (el) el.className = el.className.replace('hide', 'show'); },
    close: (id) => { const el = d.gebi(id); if (el) el.className = el.className.replace('show', 'hide'); },

    events:        (id, fn)  => d.gebi(id)?.addEventListener('click', fn),
    selectElement: (id, val) => { if (d.gebi(id)) d.gebi(id).value = val; },
    content:       (html)    => { d.gebi('content').innerHTML = html; },
    goto:          (url)     => { window.location.href = url; },


    /* ═══════════════════════════════════════
       NAVIGASI
       ═══════════════════════════════════════ */

    /** Panggil controller.view() modul berdasarkan nama */
    url: (id) => {
        if (window[id]?.controller?.view) window[id].controller.view();
    },

    /** Ambil data form lalu jalankan controller yang sesuai */
    getf: (id) => {
        const item = d.model.set?.filter(el => el.nama === id);
        if (item?.length > 0) d.controller[item[0].isi]();
    },


    /* ═══════════════════════════════════════
       WARNA — interpolasi dari CSS token
       ═══════════════════════════════════════ */

    /**
     * Hasilkan array warna antara --pColor dan --pDarkColor.
     * @param  {number} step  jumlah warna yang diinginkan
     * @return {string[]}     array hex, misal ['#d6ce93','#bcba7a','#a3a380']
     */
    color: (step) => {
        const style = getComputedStyle(document.body);
        const hex1  = style.getPropertyValue('--pColor').trim()     || '#d6ce93';
        const hex2  = style.getPropertyValue('--pDarkColor').trim() || '#a3a380';

        const _parse       = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
        const _interpolate = (a, b, t) => {
            const [r1,g1,b1] = _parse(a);
            const [r2,g2,b2] = _parse(b);
            const r  = Math.round(r1 + t * (r2 - r1));
            const g  = Math.round(g1 + t * (g2 - g1));
            const bl = Math.round(b1 + t * (b2 - b1));
            return `#${((1<<24)+(r<<16)+(g<<8)+bl).toString(16).slice(1)}`;
        };

        if (step <= 1) return [hex1];
        return Array.from({ length: step }, (_, i) => _interpolate(hex1, hex2, i / (step - 1)));
    },


    /* ═══════════════════════════════════════
       TOAST
       ═══════════════════════════════════════ */

    /** Tampilkan pesan toast 3 detik di bagian bawah layar */
    info: (msg) => {
        const el = d.gebi('bawah');
        if (!el) return;
        el.innerHTML = msg;
        d.open('bawah');
        setTimeout(() => d.close('bawah'), 3000);
    },


    /* ═══════════════════════════════════════
       MODAL
       ═══════════════════════════════════════ */

    /**
     * Buka modal dengan konten HTML bebas.
     * Tutup dari template HTML: onclick="d.closeModal()"
     */
    modal: (html) => {
        const el = d.gebi('modal');
        if (!el) return;
        el.innerHTML = d.view.modal(html);
        d.open('modal');
    },

    closeModal: () => {
        d.modal('');
        d.close('modal');
    },


    /* ═══════════════════════════════════════
       SIDE PANEL
       ═══════════════════════════════════════ */

    /** Buka side panel. Dibuat lazy di DOM jika belum ada. */
    sidePanel: (title, content) => {
        const container = d.gebi('panel-container');
        if (!container) return;

        if (!d.gebi('panel')) {
            container.innerHTML = `
                <div id="overlay" class="panel-overlay"></div>
                <div id="panel"   class="side-panel">
                    <div class="panel-header">
                        <h3 id="panel-title"></h3>
                        <button id="panel-close"><img data-src="close"></button>
                    </div>
                    <div id="panel-body" class="panel-body"></div>
                </div>`;
            d.gebi('panel-close').onclick = () => d.closePanel();
            d.gebi('overlay').onclick     = () => d.closePanel();
        }

        d.gebi('panel-title').innerText = title;
        d.gebi('panel-body').innerHTML  = content;
        d._openPanel();
    },

    _openPanel: () => {
        const overlay = d.gebi('overlay');
        const panel   = d.gebi('panel');
        if (overlay && panel) {
            overlay.classList.add('show-flex');
            setTimeout(() => panel.classList.add('active'), 10);
        }
    },

    closePanel: () => {
        const panel   = d.gebi('panel');
        const overlay = d.gebi('overlay');
        panel?.classList.remove('active');
        setTimeout(() => overlay?.classList.remove('show-flex'), 300);
    },


    /* ═══════════════════════════════════════
       PRIVATE HELPERS
       ═══════════════════════════════════════ */

    /** Tampilkan tooltip info field saat label diklik */
    _tooltip: (id) => {
        const nod = d.model.table?.tipe?.find(e => e.id === id);
        if (nod?.info) d.info(nod.info);
    },

    /** Warna tombol berdasarkan label aksi */
    _warna: (nama) => ({
        Tambah:  'green',
        Simpan:  'green',
        Batal:   'grey',
        Hapus:   'red',
        Ubah:    'blue',
        Signup:  'green',
        Signin:  'blue',
        Signout: 'red',
    })[nama] || '',

    /** Toggle kebab menu */
    _kebab: (btn) => btn.nextElementSibling?.classList.toggle('active'),

    /** Build satu field input dari definisi tipe */
    _buildInput: (tipe, data, id) => {
        if (!Object.prototype.hasOwnProperty.call(data, id)) return '';

        const css     = d.model.css;
        const nod     = tipe.find(e => e.id === id) || {};
        const hide    = nod.nama === 'hidden' ? 'hide' : '';
        const bintang = nod.perlu === '1' ? ' *' : '';

        let inp = `<input id="${id}" class="${css.input} ${hide}" type="text"
                       aria-label="${id}" value="${data[id] ?? ''}" name="${id}">`;

        if (nod.nama === 'password') {
            inp = `<input id="${id}" class="${css.input}" type="password"
                       aria-label="${id}" value="" name="${id}">`;

        } else if (nod.nama === 'textarea') {
            inp = `<textarea class="${css.input}" aria-label="${id}"
                       name="${id}" id="${id}" placeholder=" ">${data[id] ?? ''}</textarea>`;

        } else if (nod.nama === 'option') {
            const opts = (nod.arr || '').split(',').map(v =>
                `<option value="${v}" ${data[id] == v ? 'selected' : ''}>${v}</option>`
            ).join('');
            inp = `<select class="${css.input}" id="${id}" name="${id}"
                       onchange="this.setAttribute('value',this.value)">${opts}</select>`;
        }

        return `<div class="col-1-2 ${hide}">
                    <div class="${css.gInput}" onclick="d._tooltip('${id}')">
                        ${inp}
                        <label class="${css.label}">${id}${bintang}</label>
                    </div>
                </div>`;
    },


    /* ═══════════════════════════════════════
       MODEL
       Nilai awal minimal — diisi penuh oleh
       d.service.init() saat memuat donat.json.
       ═══════════════════════════════════════ */

    model: {
        id:         '',
        nama:       'donat',
        publicMode: false,
        tmp:        {},

        css: {
            ul:      'ul',      li:      'li',
            a:       'a',       search:  'search',
            page:    'shadow row',       table:   'table',
            form:    'form row',         gInput:  'gInput',
            input:   'input',   label:   'label',
            gButton: 'gButton', button:  'button',
            gIcons:  'gIcons',  icons:   'icons',
        },

        tabs:  { items: ['Data', 'Bantuan'], active: 0 },

        table: { id: 'master', rpp: 5, page: 1, fld: 'id,nama', data: [], tipe: [] },
        view:  { button: { data: [] } },
        add:   { input: { data: {}, tipe: [] }, button: { data: [] } },
        edit:  { id: 'edit', induk: 1, input: { data: {}, tipe: [] }, button: { data: [] } },
    },


    /* ═══════════════════════════════════════
       VIEW
       ═══════════════════════════════════════ */

    view: {

        /* ─── Atom: modal ────────────────── */
        modal: (html) => `
            <div class="modal">
                <div class="row modalbar">
                    <span>Info</span>
                    <button onclick="d.closeModal()"><img data-src="close/20"></button>
                </div>
                <div class="row modalcontent">${html}</div>
            </div>`,

        /* ─── Atom: menu ─────────────────── */
        menu: (arr) => {
            const css = d.model.css;
            return `<ul class="${css.ul}">${(arr.data || []).map(item =>
                `<li class="${css.li}">
                    <a class="${css.a}" onclick="d.service.read('${item.url}')">
                        <img data-src="${item.icon}"> ${item.nama}
                    </a>
                </li>`
            ).join('')}</ul>`;
        },

        /* ─── Atom: tombol aksi baris ────── */
        aksi: (i) => `
            <button data-action="Edit" class="${d.model.css.button}"
                onclick="d.controller.edit(${i})">
                <img data-src="pen"> <span>Edit</span>
            </button>`,

        /* ─── Form: input ────────────────── */
        input: (arr) => {
            const { data, tipe } = arr;
            const fields = Object.keys(data).map(id => d._buildInput(tipe, data, id)).join('');
            return `<form id="form" class="${d.model.css.form}">${fields}</form>`;
        },

        /* ─── Form: button ───────────────── */
        button: (arr) => `
            <div class="${d.model.css.gButton} kanan">${(arr.data || []).map(({ icon, url, nama }) =>
                `<button data-action="${nama}" class="${d.model.css.button} ${d._warna(nama)}"
                    onclick="${url}">
                    <img data-src="${icon}"> ${nama}
                </button>`
            ).join('')}</div>`,

        /* ─── Data: tabel ────────────────── */
        table: (arr) => {
            const { page, rpp, data } = arr;
            const publicMode          = d.model.publicMode;
            const al                  = data.length;
            const cb                  = publicMode
                ? ''
                : '<input type="checkbox" onclick="d.service.checkAll(this)">';

            let out = `<table class="${d.model.css.table}">
                <thead><tr><th>${cb}</th>`;
            if (data[0]) Object.keys(data[0]).forEach(k => { out += `<th>${k}</th>`; });
            out += `<th>Aksi</th></tr></thead><tbody>`;

            for (let i = (page - 1) * rpp; i < page * rpp && i < al; i++) {
                const col = data[i];
                out += `<tr><td>${publicMode ? '' : `<input type="checkbox" name="cb[]" value="${col.id}">`}</td>`;
                Object.values(col).forEach(v => {
                    const str = v && String(v).length > 12 ? String(v).substring(0, 12) + '…' : v;
                    out += `<td>&nbsp;${str}</td>`;
                });
                out += `<td>${d.view.aksi(i)}</td></tr>`;
            }
            return out + '</tbody></table>';
        },

        /* ─── Data: datatable (tabel + kontrol) ── */
        datatable: (arr) => `
            <div class="${d.model.css.search}">
                <select class="input" onchange="d.controller.rpp(this.value)">
                    <option>5</option><option>10</option><option>50</option>
                </select>
                <input id="search" class="input" type="text" onkeyup="d.controller.search()">
                <div class="kebab-container">
                    <button onclick="d._kebab(this)"><img data-src="kebab/32"></button>
                    <div class="kebab-menu">
                        <a onclick="d.controller.print()"  class="menu-item">Print</a>
                        <a onclick="d.service.delete()"    class="menu-item delete-action">Hapus</a>
                    </div>
                </div>
            </div>
            <div id="table"  class="gTable">${d.view.table(arr)}</div>
            <div id="paging" class="gpaging">${d.view.paging(arr)}</div>`,

        /* ─── Data: paging ───────────────── */
        paging: (arr) => {
            const { data, page } = arr;
            const rpp = d.model.table.rpp;
            const al  = data.length;
            const np  = Math.ceil(al / rpp);
            const p   = page <= 1  || al <= rpp ? 'hide' : 'show';
            const n   = page >= np || al <= rpp ? 'hide' : 'show';
            return `<div class="gPaging">
                        <button class="button ${p}" onclick="d.controller.paging(-1)">
                            <img data-src="prev"> Prev
                        </button>
                        <button class="button ${n}" onclick="d.controller.paging(1)">
                            <img data-src="next"> Next
                        </button>
                        <span>Hal ${page}/${np} &nbsp; ${al} data</span>
                    </div>`;
        },

        /* ─── Visual: pie chart ──────────── */
        pie: (arr) => {
            const { data } = arr;
            const color    = d.color(data.length);
            const total    = Math.round(
                data.reduce((s, x) => s + x.isi, 0) / (data.length * 100) * 100
            );
            let sdo = 25;
            let out = `<svg class="pie img" width="100" height="100%" viewBox="0 0 42 42">
                <circle class="pie-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>`;

            data.forEach((item, i) => {
                out += `<circle cx="21" cy="21" r="15.91549430918954"
                            fill="transparent" stroke="${color[i]}" stroke-width="3"
                            stroke-dasharray="${item.isi} ${100 - item.isi}"
                            stroke-dashoffset="${sdo}"></circle>`;
                sdo -= parseInt(item.isi);
            });

            return out + `<g class="chart-text">
                    <text x="50%" y="50%" class="chart-number">${total}%</text>
                    <text x="50%" y="50%" class="chart-label">Total</text>
                </g></svg>`;
        },

        /* ─── Visual: progress bar ───────── */
        progress: (arr) => {
            const { data } = arr;
            const color    = d.color(data.length);
            return data.map(({ isi, nama }, i) => `
                <div class="progress-bar-linear">
                    <p>${nama} <span class="float_right">${isi}%</span></p>
                    <div class="progress-bar">
                        <span style="background:${color[i]}; width:${isi}%;"></span>
                    </div>
                </div>`).join('');
        },

        /* ─── Visual: icon grid ──────────── */
        icons: (arr) => `
            <div class="${d.model.css.gIcons}">${(arr.data || []).map(nama =>
                `<div class="${d.model.css.icons}">
                    <img data-src="${nama}"><span>${nama}</span>
                </div>`
            ).join('')}</div>`,

        /* ─── Visual: card grid ──────────── */
        card: (arr) => {
            const { data } = arr;
            const step     = Math.min(data.length, 4);
            return `<div class="row card-container">${data.map(({ nama, isi, icon, url }) =>
                `<div class="col-1-${step}" onclick="navigate('${url}')">
                    <div class="card shadow">
                        <img data-src="${icon}/150" alt="${nama}">
                        <div class="artikel">${nama}<br>${isi}</div>
                    </div>
                </div>`
            ).join('')}</div>`;
        },

        /* ─── Visual: grid bebas ─────────── */
        grid: (arr) => `
            <div class="gGrid">${(arr.data || []).map(({ css, isi }) =>
                `<div class="${css}"><span>${isi}</span></div>`
            ).join('')}</div>`,

        /* ─── Tabs ───────────────────────── */

        /** Render tab bar + slot konten kosong */
        tabs: (items, activeIndex = 0) => {
            const bar      = items.map((label, i) =>
                `<li class="${i === activeIndex ? 'active-tab' : ''}">${label}</li>`
            ).join('');
            const contents = items.map((_, i) =>
                `<li class="${i === activeIndex ? 'active-content' : ''}"></li>`
            ).join('');
            return `<ul class="tabs" id="tabsBar">${bar}</ul>
                    <ul class="tabs-content" id="contentBox">${contents}</ul>`;
        },

        /* ─── Halaman utama ──────────────── */
        view: (arr) => `
            ${d.view.tabs(d.model.tabs.items)}
            <ul class="tabs-content" id="contentBox">
                <li class="active-content">
                    <div class="artikel">
                        <div class="row">${d.view.button(arr.button)}</div>
                        <div class="row">${d.view.datatable(arr.datatable)}</div>
                    </div>
                </li>
                <li>
                    <div class="artikel">
                        <h3>Petunjuk Teknis</h3>
                        <p>Memuat informasi dari file JSON…</p>
                    </div>
                </li>
            </ul>`,

        add: (arr) => `
            <div>${d.view.input(arr.input)}</div>
            <div>${d.view.button(arr.button)}</div>`,

        edit: (arr) => `
            <div id="ext"></div>
            <div>${d.view.input(arr.input)}</div>
            <div>${d.view.button(arr.button)}</div>`,

    }, // end view


    /* ═══════════════════════════════════════
       CONTROLLER
       ═══════════════════════════════════════ */

    controller: {

        /* ─── Render ke DOM ──────────────── */
        menu:      () => { d.gebi('menu-left').innerHTML = d.view.menu(d.model.menu); },
        page:      () => { d.gebi('content').innerHTML   = d.view.page(d.model.page); },
        datatable: () => { d.gebi('datatable').innerHTML = d.view.datatable(d.model.datatable); },
        input:     () => { d.gebi('input').innerHTML     = d.view.input(d.model.input); },
        button:    () => { d.gebi('button').innerHTML    = d.view.button(d.model.button); },
        table:     () => { d.gebi('table').innerHTML     = d.view.table(d.model.table); },
        print:     () => window.print(),

        /* ─── Form ───────────────────────── */

        /** Kumpulkan nilai elemen form ke plain object */
        el: (id) => {
            const frm = d.gebi(id);
            const obj = {};
            for (const el of frm.elements) { if (el.name) obj[el.name] = el.value; }
            return obj;
        },

        /* ─── Paging & Search ────────────── */

        paging: (delta) => {
            const tbl = d.model.table;
            tbl.page  = Math.max(1, parseInt(tbl.page) + delta);
            d.gebi('table').innerHTML  = d.view.table(tbl);
            d.gebi('paging').innerHTML = d.view.paging(tbl);
        },

        rpp: (n) => {
            d.model.table.rpp = parseInt(n);
            d.controller.table();
        },

        search: () => {
            const q   = d.gebi('search')?.value || '';
            const tbl = d.model.table;
            const res = d.controller._search(tbl.data, q);
            d.gebi('table').innerHTML = d.view.table({ data: res, page: tbl.page, rpp: tbl.rpp });
        },

        _search: (arr, q) => arr.filter(item =>
            Object.values(item).some(v => String(v).toLowerCase().includes(q.toLowerCase()))
        ),

        /* ─── CRUD ───────────────────────── */

        view: () => {
            d.gebi('content').innerHTML = d.view.view(d.model.view);
            d.controller.tabs();
        },

        add: () => {
            d.model.add.input.data = { ...d.model.table.data[0] };
            d.sidePanel('Tambah Data', d.view.add(d.model.add));
        },

        edit: (i) => {
            const induk             = d.model.table.data[i].id;
            d.model.edit.induk      = induk;
            d.model.edit.input.data = { ...d.model.table.data[i] };
            d.setls('induk', induk);
            d.sidePanel('Edit Data', d.view.edit(d.model.edit));
        },

        color: () => {
            d.model.color?.data.forEach(({ id, isi }) => d.setcss(id, isi));
        },

        /* ─── Tabs ───────────────────────── */

        /**
         * Aktifkan logika tab di DOM yang sudah dirender.
         * Dipanggil otomatis setelah controller.view().
         */
        tabs: () => {
            const tabEls     = document.querySelectorAll('.tabs li');
            const contentEls = document.querySelectorAll('.tabs-content > li');

            const _activate = (index) => {
                tabEls.forEach(t     => t.classList.remove('active-tab'));
                contentEls.forEach(c => c.classList.remove('active-content'));
                tabEls[index]?.classList.add('active-tab');
                contentEls[index]?.classList.add('active-content');
                d.model.tabs.active = index;
            };

            tabEls.forEach((tab, i) => tab.addEventListener('click', () => _activate(i)));

            /** Ganti item tab secara programatik: d.controller.setTabs(['A','B']) */
            d.controller.setTabs = (items) => {
                const bar = d.gebi('tabsBar');
                if (!bar) return;
                bar.innerHTML = '';
                items.forEach((teks, i) => {
                    const li       = d.ce('li');
                    li.textContent = teks;
                    if (i === 0) li.className = 'active-tab';
                    li.onclick     = () => _activate(i);
                    bar.appendChild(li);
                });
                d.model.tabs.items = items;
            };
        },

    }, // end controller


    /* ═══════════════════════════════════════
       SERVICE — HTTP / CRUD
       Semua operasi jaringan menggunakan fetch API.
       XHR tidak digunakan lagi sejak versi 2.2.
       ═══════════════════════════════════════ */

    service: {
        host:  'http://localhost/donat/api/index.php',
        param: { t: 'master_users', mod: 'login', nama: 'users' },

        /* ─── Init — muat model dari JSON ── */

        /**
         * Muat model default dari file JSON lalu isi d.model.
         * Panggil di awal aplikasi, sebelum router dispatch.
         *
         * Contoh di script.js:
         *   await d.service.init('data/donat.json');
         *   ui.router.dispatch();
         *
         * @param {string} [url='data/donat.json']
         */
        init: async (url = 'data/donat.json') => {
            try {
                const res  = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                const tbl  = json.table || {};

                d.model.nama       = json.app?.nama       ?? d.model.nama;
                d.model.publicMode = json.app?.publicMode ?? false;
                d.service.host     = json.app?.host       ?? d.service.host;

                d.model.css   = { ...d.model.css,  ...(json.css  || {}) };
                d.model.tabs  = { ...d.model.tabs, ...(json.tabs || {}) };

                d.model.table      = { rpp: 5, page: 1, ...tbl };
                d.model.table.rst  = [...(tbl.data || [])];

                d.model.view = {
                    id:        'view',
                    datatable: d.model.table,
                    button:    json.view?.button || { data: [] },
                };

                d.model.add = {
                    id:     'add',
                    input:  { data: {}, tipe: tbl.tipe || [] },
                    button: json.add?.button || { data: [] },
                };

                d.model.edit = {
                    id:     'edit',
                    induk:  1,
                    input:  { data: {}, tipe: tbl.tipe || [] },
                    button: json.edit?.button || { data: [] },
                };

                log('[d.service.init] model dimuat dari:', url);

            } catch (e) {
                console.warn('[d.service.init] Gagal memuat model:', e.message);
            }
        },

        /* ─── Transport ──────────────────── */

        /**
         * Kirim POST ke service.host menggunakan fetch.
         * @param {object}   param     payload JSON
         * @param {Function} callback  fn(responseText) dipanggil jika berhasil
         */
        req: async (param, callback) => {
            try {
                const res = await fetch(d.service.host, {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify(param),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                callback(await res.text());
            } catch (e) {
                console.error('[d.service.req]', e.message);
                d.info(`Gagal terhubung ke server: ${e.message}`);
            }
        },

        /** Susun param berdasarkan mod aktif lalu kirim via req() */
        get: (callback) => {
            const { t, mod, nama } = d.service.param;
            let param = { t, mod, nama };

            if (mod === 'create') {
                const frm = d.controller.el('form');
                delete frm.id;
                param = { t, mod, data: frm };

            } else if (mod === 'update') {
                const frm = d.controller.el('form');
                param = { t, mod, data: frm, id: frm.id };

            } else if (mod === 'delete') {
                param = { t, mod, id: d.model.id };
            }

            d.service.req(param, callback);
        },

        /* ─── CRUD operations ────────────── */

        read: () => {
            d.service.param.mod = 'table';
            d.service.get(json => {
                const res              = JSON.parse(json);
                d.service.param.t      = res.tb;
                d.model.datatable.data = res.data;
                d.controller.view();
            });
        },

        create: () => {
            d.closePanel();
            log('[service.create] siap — aktifkan blok di bawah saat API tersedia');
            // d.service.param.mod = 'create';
            // d.service.get(() => d.url(d.model.nama));
        },

        update: () => {
            const frm = d.controller.el('form');
            log('[service.update]', frm);
            d.modal(JSON.stringify(frm));
            // d.service.param.mod = 'update';
            // d.service.get(() => { d.closePanel(); d.url(d.model.nama); });
        },

        delete: () => {
            const checked = [...document.querySelectorAll('input[name="cb[]"]:checked')]
                .map(cb => cb.value);
            const joined  = checked.join(',');
            if (!joined) { d.info('Pilih data yang akan dihapus.'); return; }

            d.modal(`
                <div class="info">Yakin hapus data: <strong>${joined}</strong>?</div>
                <div class="gButton tengah">
                    <button onclick="d.service._confirmDelete()">
                        <img data-src="check"> Oke
                    </button>
                    <button onclick="d.closeModal()">
                        <img data-src="close"> Batal
                    </button>
                </div>`);

            d.service._confirmDelete = () => {
                d.model.id          = joined;
                d.service.param.mod = 'delete';
                d.service.get(json => {
                    log('[service.delete]', JSON.parse(json));
                    d.url(d.model.nama);
                });
                d.closeModal();
            };
        },

        checkAll: (el) => {
            document.querySelectorAll('input[name="cb[]"]')
                .forEach(cb => { cb.checked = el.checked; });
        },

        menu: (id) => {
            d.service.param.nama = id.split('/')[0];
            d.service.read();
        },

    }, // end service

}; // end d
