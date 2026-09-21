// ReadMe Studio — app renderer
'use strict';

const ICONS = {
  hero: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/></svg>',
  heading: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 5v14M19 5v14M5 12h14"/></svg>',
  banner: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M5 21V4"/><path d="M5 4h13l-2.5 4L18 12H5"/></svg>',
  text: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h16M4 10h16M4 14h10M4 18h7"/></svg>',
  fonttext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 20V7l-3 1M6 7l-3 1M6 7h6M18 20v-9M15 20l1.5-9L18 20l1.5-9L21 20"/></svg>',
  typing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="18" height="13" rx="2"/><path d="M7 10h4M7 14h7M16 17h3"/></svg>',
  badges: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="7" width="9" height="5" rx="2.5"/><rect x="12" y="12" width="9" height="5" rx="2.5"/></svg>',
  tech: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6l-5 6 5 6M16 6l5 6-5 6M13 4l-2 16"/></svg>',
  stats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-8M21 20H3"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4 4 3 3-2 4 3"/></svg>',
  links: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1.5 1.5M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1.5-1.5"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="5" cy="6" r="1.2"/><circle cx="5" cy="12" r="1.2"/><circle cx="5" cy="18" r="1.2"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 9l-2.5 3L9 15M15 9l2.5 3L15 15"/></svg>',
  table: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 10h18M3 15h18M9 10v9M15 10v9"/></svg>',
  quote: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16c0-4 2.5-7 6-8.5l1 2C9.8 10.4 8.5 12 8.2 14H11v4H5v-2zm9 0c0-4 2.5-7 6-8.5l1 2c-2.2.9-3.5 2.5-3.8 4.5H20v4h-6v-2z"/></svg>',
  fun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8"/><circle cx="9" cy="9.5" r=".6" fill="currentColor"/><circle cx="15" cy="9.5" r=".6" fill="currentColor"/></svg>',
  toc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h9M4 12h9M4 18h9"/><path d="M16 5l4 3-4 3M16 13l4 3-4 3"/></svg>',
  divider: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12h18"/></svg>',
  counter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.5"/></svg>',
  grip: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/></svg>',
};

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const state = { blocks: [], selected: null, previewTab: 'preview' };

function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 2200);
}

function starter() {
  const hero = makeBlock('hero');
  hero.data.title = 'Mon Super Projet';
  hero.data.subtitle = 'Description courte et percutante de ton projet GitHub';
  const badges = makeBlock('badges');
  const text = makeBlock('text');
  state.blocks = [hero, badges, text];
  state.selected = hero.id;
}

// ---------------- palette ----------------
function renderPalette() {
  $('paletteList').innerHTML = PALETTE.map((t) =>
    `<div class="pal-item" draggable="true" data-add="${t}" title="Glisser ou cliquer">
       <span>${ICONS[BLOCKS[t].icon] || ''}</span>
       <div><b>${esc(BLOCKS[t].name)}</b><small>${esc(BLOCKS[t].desc)}</small></div>
     </div>`
  ).join('');
  document.querySelectorAll('[data-add]').forEach((el) => {
    el.addEventListener('click', () => addBlock(el.dataset.add, state.blocks.length));
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/rs-new', el.dataset.add);
      e.dataTransfer.effectAllowed = 'copy';
    });
  });
}

function blockSummary(b) {
  const d = b.data || {};
  switch (b.type) {
    case 'hero': return d.title || '';
    case 'heading': return d.text || '';
    case 'text': return String(d.content || '').slice(0, 60);
    case 'badges': return `${(d.items || []).length} badge(s)`;
    case 'tech': return d.ids || '';
    case 'stats': case 'counter': return d.username || '';
    case 'image': return d.alt || d.url || '';
    case 'links': return `${(d.items || []).length} lien(s)`;
    case 'list': return `${String(d.items || '').split('\n').filter(Boolean).length} élément(s)`;
    case 'code': return (d.lang || '') + ' — ' + String(d.code || '').split('\n')[0];
    case 'table': return String(d.header || '');
    case 'quote': return String(d.text || '').slice(0, 60);
    case 'toc': return 'auto';
    case 'divider': return d.style || '';
    default: return '';
  }
}

// ---------------- canvas ----------------
function renderCanvas() {
  const cv = $('canvas');
  $('blockCount').textContent = `${state.blocks.length} bloc(s)`;
  cv.classList.toggle('empty', !state.blocks.length);
  cv.innerHTML = state.blocks.map((b) => `
    <div class="block${b.id === state.selected ? ' selected' : ''}" data-id="${b.id}">
      <div class="block-head">
        <span class="grip" draggable="true" data-grip="${b.id}" title="Glisser pour déplacer">${ICONS.grip}</span>
        <span class="ico">${ICONS[BLOCKS[b.type].icon] || ''}</span>
        <b>${esc(BLOCKS[b.type].name)}</b>
        <small>${esc(blockSummary(b))}</small>
        <span class="block-tools">
          <button data-act="up" data-id="${b.id}" title="Monter">▲</button>
          <button data-act="down" data-id="${b.id}" title="Descendre">▼</button>
          <button data-act="dup" data-id="${b.id}" title="Dupliquer">⧉</button>
          <button data-act="del" data-id="${b.id}" title="Supprimer" class="del">✕</button>
        </span>
      </div>
    </div>`).join('');

  cv.querySelectorAll('.block-head').forEach((h) => {
    h.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('[data-grip]')) return;
      state.selected = h.parentElement.dataset.id;
      renderCanvas();
      renderProps();
    });
  });
  cv.querySelectorAll('[data-act]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      actOn(btn.dataset.id, btn.dataset.act);
    });
  });
  cv.querySelectorAll('[data-grip]').forEach((g) => {
    g.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/rs-move', g.dataset.grip);
      e.dataTransfer.effectAllowed = 'move';
    });
  });
}

function addBlock(type, index) {
  const b = makeBlock(type);
  state.blocks.splice(Math.max(0, Math.min(index, state.blocks.length)), 0, b);
  state.selected = b.id;
  refresh();
  renderProps();
}

function actOn(id, act) {
  const i = state.blocks.findIndex((b) => b.id === id);
  if (i < 0) return;
  if (act === 'del') {
    state.blocks.splice(i, 1);
    if (state.selected === id) state.selected = null;
  } else if (act === 'dup') {
    const copy = JSON.parse(JSON.stringify(state.blocks[i]));
    copy.id = 'b' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
    state.blocks.splice(i + 1, 0, copy);
    state.selected = copy.id;
  } else if (act === 'up' && i > 0) {
    [state.blocks[i - 1], state.blocks[i]] = [state.blocks[i], state.blocks[i - 1]];
  } else if (act === 'down' && i < state.blocks.length - 1) {
    [state.blocks[i + 1], state.blocks[i]] = [state.blocks[i + 1], state.blocks[i]];
  }
  refresh();
  renderProps();
}

// drop : ajout depuis palette OU déplacement avec indicateur
(function initDnd() {
  const cv = $('canvas');
  const clearLines = () => cv.querySelectorAll('.drop-line').forEach((l) => l.remove());
  const posOf = (e) => {
    const blocks = [...cv.querySelectorAll('.block')];
    for (let k = 0; k < blocks.length; k++) {
      const r = blocks[k].getBoundingClientRect();
      if (e.clientY < r.top + r.height / 2) return { el: blocks[k], index: k };
    }
    return { el: null, index: blocks.length };
  };
  cv.addEventListener('dragover', (e) => {
    if (![...e.dataTransfer.types].some((t) => t === 'text/rs-new' || t === 'text/rs-move')) return;
    e.preventDefault();
    clearLines();
    const { el } = posOf(e);
    const line = document.createElement('div');
    line.className = 'drop-line';
    if (el) cv.insertBefore(line, el);
    else cv.appendChild(line);
  });
  cv.addEventListener('dragleave', (e) => { if (e.target === cv) clearLines(); });
  cv.addEventListener('drop', (e) => {
    e.preventDefault();
    const { index } = posOf(e);
    clearLines();
    const nt = e.dataTransfer.getData('text/rs-new');
    const mv = e.dataTransfer.getData('text/rs-move');
    if (nt) { addBlock(nt, index); toast('Bloc ajouté'); }
    else if (mv) {
      const from = state.blocks.findIndex((b) => b.id === mv);
      if (from < 0) return;
      const [b] = state.blocks.splice(from, 1);
      state.blocks.splice(from < index ? index - 1 : index, 0, b);
      refresh();
    }
  });
})();

// ---------------- propriétés ----------------
function fieldInput(b, f) {
  const v = b.data[f.key];
  if (f.type === 'textarea') {
    return `<textarea data-k="${f.key}">${esc(v || '')}</textarea>`;
  }
  if (f.type === 'select') {
    return `<select data-k="${f.key}">${f.options.map((o) =>
      `<option value="${o}"${String(v) === String(o) ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
  }
  if (f.type === 'checkbox') {
    return `<input type="checkbox" data-k="${f.key}"${v ? ' checked' : ''}>`;
  }
  if (f.type === 'number') {
    return `<input type="number" data-k="${f.key}" value="${esc(v == null ? '' : v)}">`;
  }
  if (f.type === 'badgelist') return badgeEditor(b);
  if (f.type === 'linklist') return linkEditor(b);
  return `<input type="text" data-k="${f.key}" value="${esc(v == null ? '' : v)}">`;
}

function badgeEditor(b) {
  const items = Array.isArray(b.data.items) ? b.data.items : [];
  return `<div id="subEditor">${items.map((it, i) => `
    <div class="subrow" data-i="${i}">
      <input type="text" data-sk="label" data-i="${i}" value="${esc(it.label || '')}" placeholder="Étiquette (ex. version)">
      <input type="text" data-sk="message" data-i="${i}" value="${esc(it.message || '')}" placeholder="Message (ex. 1.0.0)">
      <div class="row">
        <input type="text" data-sk="color" data-i="${i}" value="${esc(it.color || '')}" placeholder="Couleur">
        <input type="text" data-sk="logo" data-i="${i}" value="${esc(it.logo || '')}" placeholder="Logo">
      </div>
      <div class="row">
        <select data-sk="style" data-i="${i}">${['flat', 'flat-square', 'plastic', 'for-the-badge', 'social'].map((s) =>
          `<option${it.style === s ? ' selected' : ''}>${s}</option>`).join('')}</select>
        <button class="danger" data-subdel="${i}">Supprimer</button>
      </div>
    </div>`).join('')}
    <button id="subAdd">+ Ajouter un badge</button></div>`;
}

function linkEditor(b) {
  const items = Array.isArray(b.data.items) ? b.data.items : [];
  return `<div id="subEditor">${items.map((it, i) => `
    <div class="subrow" data-i="${i}">
      <input type="text" data-sk="label" data-i="${i}" value="${esc(it.label || '')}" placeholder="Libellé">
      <input type="text" data-sk="url" data-i="${i}" value="${esc(it.url || '')}" placeholder="https://…">
      <div class="row"><button class="danger" data-subdel="${i}">Supprimer</button></div>
    </div>`).join('')}
    <button id="subAdd">+ Ajouter un lien</button></div>`;
}

function renderProps() {
  const body = $('propsBody');
  const b = state.blocks.find((x) => x.id === state.selected);
  if (!b) { body.innerHTML = '<p class="hint">Clique un bloc du canevas pour le régler ici.</p>'; return; }
  const def = BLOCKS[b.type];
  body.innerHTML = `<p class="hint"><b>${esc(def.name)}</b> — ${esc(def.desc)}</p>` +
    def.fields.map((f) => `<div class="field"><label>${esc(f.label)}</label>${fieldInput(b, f)}</div>`).join('');

  body.querySelectorAll('[data-k]').forEach((inp) => {
    inp.addEventListener('input', () => {
      const k = inp.dataset.k;
      b.data[k] = inp.type === 'checkbox' ? inp.checked
        : (inp.type === 'number' ? (+inp.value || 0) : inp.value);
      refresh(false);
    });
    inp.addEventListener('change', () => refresh());
  });
  body.querySelectorAll('[data-sk]').forEach((inp) => {
    inp.addEventListener('input', () => {
      const arr = b.data.items;
      const i = +inp.dataset.i;
      if (arr && arr[i]) arr[i][inp.dataset.sk] = inp.value;
      refresh(false);
    });
    inp.addEventListener('change', () => refresh());
  });
  const add = $('subAdd');
  if (add) add.addEventListener('click', () => {
    if (b.type === 'badges') b.data.items.push({ label: '', message: '', color: 'blue', logo: '', style: 'flat' });
    else b.data.items.push({ label: '', url: '' });
    renderProps();
    refresh();
  });
  body.querySelectorAll('[data-subdel]').forEach((btn) => {
    btn.addEventListener('click', () => {
      b.data.items.splice(+btn.dataset.subdel, 1);
      renderProps();
      refresh();
    });
  });
}

// ---------------- aperçu + export ----------------
function currentMd() { return toMarkdown(state.blocks); }

function refresh(rebuildCanvas = true) {
  if (rebuildCanvas) renderCanvas();
  const md = currentMd();
  if (state.previewTab === 'preview') {
    $('preview').classList.remove('hidden');
    $('source').classList.add('hidden');
    $('preview').innerHTML = render(md);
  } else {
    $('preview').classList.add('hidden');
    $('source').classList.remove('hidden');
    $('source').textContent = md;
  }
}

$('tabPreview').addEventListener('click', () => {
  state.previewTab = 'preview';
  $('tabPreview').classList.add('active');
  $('tabSource').classList.remove('active');
  refresh(false);
});
$('tabSource').addEventListener('click', () => {
  state.previewTab = 'source';
  $('tabSource').classList.add('active');
  $('tabPreview').classList.remove('active');
  refresh(false);
});

$('btnCopy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(currentMd());
    toast('Markdown copié !');
  } catch { toast('Copie impossible'); }
});
$('btnDownload').addEventListener('click', async () => {
  const r = await window.rs.saveMd(currentMd());
  if (!r.canceled) toast('Enregistré : ' + r.path);
});
$('btnCheckUrls').addEventListener('click', async () => {
  const urls = extractImageUrls(currentMd());
  const card = $('urlCard');
  const report = $('urlReport');
  card.classList.remove('hidden');
  if (!urls.length) {
    $('urlCount').textContent = '0 image';
    report.innerHTML = '<p class="hint">Aucune image dans le document (ajoute un bloc Image, Badges, Stats ou Technologies).</p>';
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }
  $('urlCount').textContent = `${urls.length} image(s)…`;
  report.innerHTML = '<p class="hint">Vérification en cours…</p>';
  let results;
  try {
    results = await window.rs.checkUrls(urls);
  } catch {
    report.innerHTML = '<p class="hint">Échec de la vérification.</p>';
    return;
  }
  const nko = results.filter((r) => !r.ok).length;
  $('urlCount').textContent = nko ? `${nko} problème(s)` : 'tout est OK';
  report.innerHTML = results.map((r) => `
    <div class="url-row ${r.ok ? 'ok' : 'ko'}">
      <span class="url-dot"></span>
      <div><b>${r.ok ? 'OK ' + r.status : 'KO' + (r.status ? ' ' + r.status : '')} — ${esc(r.contentType || r.error || '')}</b>
      <small>${esc(r.url)}</small></div>
    </div>`).join('')
    + (nko ? '<p class="hint">Astuce : remplace les URLs en échec (service hors-ligne ou pseudo GitHub inexistant). GitHub met aussi ses images en cache quelques minutes.</p>' : '');
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
$('btnSaveProject').addEventListener('click', async () => {
  const r = await window.rs.saveProject(JSON.stringify({ app: 'readme-studio', blocks: state.blocks }, null, 2));
  if (!r.canceled) toast('Projet sauvé : ' + r.path);
});
$('btnOpen').addEventListener('click', async () => {
  const r = await window.rs.loadProject();
  if (r.canceled) return;
  try {
    const obj = JSON.parse(r.json);
    if (!obj || !Array.isArray(obj.blocks)) throw new Error('bad');
    state.blocks = obj.blocks.filter((b) => b && BLOCKS[b.type]);
    state.selected = null;
    refresh();
    renderProps();
    toast('Projet chargé');
  } catch { toast('Fichier projet invalide'); }
});
$('btnNew').addEventListener('click', () => {
  state.blocks = [];
  state.selected = null;
  refresh();
  renderProps();
});

// ---------------- init ----------------
renderPalette();
starter();
refresh();
renderProps();
