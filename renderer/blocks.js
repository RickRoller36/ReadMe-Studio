// ReadMe Studio — blocs : définitions, champs, génération Markdown
// Utilisé par le renderer (script classique) ET par les tests node (module.exports).
'use strict';

let __bid = 0;
function newId() {
  __bid += 1;
  return 'b' + Date.now().toString(36) + __bid.toString(36);
}

function shieldsEscape(s) {
  return String(s == null ? '' : s)
    .replace(/-/g, '--').replace(/_/g, '__').replace(/ /g, '_');
}
function enc(s) { return encodeURIComponent(String(s == null ? '' : s)); }
function escHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function slugify(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 _-]/g, '').trim().replace(/\s+/g, '-');
}

// Conversion vers alphabets Unicode (vraiment visible sur GitHub, contrairement aux <style>)
const FONT_STYLES = {
  gras:        { up: 0x1D400, low: 0x1D41A, dig: 0x1D7CE },
  'gras-sans': { up: 0x1D5D4, low: 0x1D5EE, dig: 0x1D7EC },
  italique:    { up: 0x1D434, low: 0x1D44E },
  'gras-italique': { up: 0x1D468, low: 0x1D482 },
  mono:        { up: 0x1D670, low: 0x1D68A, dig: 0x1D7F6 },
  contourne:   { up: 0x1D538, low: 0x1D552, dig: 0x1D7D8,
                 upExc: { C: 0x2102, H: 0x210D, N: 0x2115, P: 0x2119, Q: 0x211A, R: 0x211D, Z: 0x2124 } },
  encercle:    { up: 0x24B6, low: 0x24D0, digZero: 0x24EA, digBase: 0x245F },
  script:      { up: 0x1D4D0, low: 0x1D4EA, dig: 0x1D7CE,
                 upExc: { B: 0x212C, E: 0x2130, F: 0x2131, H: 0x210B, I: 0x2110, L: 0x2112, M: 0x211B, R: 0x211D },
                 lowExc: { e: 0x212F, g: 0x210A, o: 0x2134 } },
};
function stylize(text, style) {
  const st = FONT_STYLES[style];
  if (!st) return String(text || '');
  let out = '';
  for (const ch of String(text || '')) {
    const c = ch.codePointAt(0);
    if (c >= 65 && c <= 90) {
      out += String.fromCodePoint((st.upExc && st.upExc[ch]) || (st.up + c - 65));
    } else if (c >= 97 && c <= 122) {
      out += String.fromCodePoint((st.lowExc && st.lowExc[ch]) || (st.low + c - 97));
    } else if (c >= 48 && c <= 57 && st.dig) {
      out += String.fromCodePoint(st.dig + c - 48);
    } else if (c >= 49 && c <= 57 && st.digBase) {
      out += String.fromCodePoint(st.digBase + c);
    } else if (ch === '0' && st.digZero) {
      out += String.fromCodePoint(st.digZero);
    } else {
      out += ch;
    }
  }
  return out;
}

// ---------------------------------------------------------------- définitions
const BLOCKS = {
  hero: {
    name: 'Bannière', icon: 'hero',
    desc: 'Grand titre centré + sous-titre + image',
    defaults: () => ({ title: 'Mon Projet', subtitle: 'Une courte description qui donne envie', image: '', imageWidth: 120 }),
    fields: [
      { key: 'title', label: 'Titre', type: 'text' },
      { key: 'subtitle', label: 'Sous-titre', type: 'text' },
      { key: 'image', label: 'URL du logo (optionnel)', type: 'text' },
      { key: 'imageWidth', label: 'Largeur logo (px)', type: 'number' },
    ],
  },
  heading: {
    name: 'Titre de section', icon: 'heading',
    desc: 'H1 à H4, centré ou non',
    defaults: () => ({ level: 2, text: 'Installation', center: false }),
    fields: [
      { key: 'text', label: 'Texte', type: 'text' },
      { key: 'level', label: 'Niveau', type: 'select', options: [1, 2, 3, 4] },
      { key: 'center', label: 'Centré', type: 'checkbox' },
    ],
  },
  banner: {
    name: 'Bannière couleur', icon: 'banner',
    desc: 'Nom en couleur, animé (capsule)',
    defaults: () => ({ text: 'TIGROU', type: 'rounded', color: 'gradient', fontColor: 'ffffff', fontSize: 60, height: 200, section: 'header', animation: 'fadeIn', desc: '' }),
    fields: [
      { key: 'text', label: 'Texte (ton nom)', type: 'text' },
      { key: 'desc', label: 'Sous-texte (optionnel)', type: 'text' },
      { key: 'type', label: 'Forme', type: 'select', options: ['rounded', 'waving', 'soft', 'egg', 'cylinder', 'transparent'] },
      { key: 'color', label: 'Couleur', type: 'select', options: ['gradient', 'dark'] },
      { key: 'fontColor', label: 'Couleur du texte (hex, sans #)', type: 'text' },
      { key: 'fontSize', label: 'Taille du texte', type: 'number' },
      { key: 'height', label: 'Hauteur (px)', type: 'number' },
      { key: 'section', label: 'Position', type: 'select', options: ['header', 'footer'] },
      { key: 'animation', label: 'Animation', type: 'select', options: ['fadeIn', 'twinkling', 'scaleIn', 'blink', 'aucune'] },
    ],
  },
  text: {
    name: 'Paragraphe', icon: 'text',
    desc: 'Texte libre (Markdown accepté)',
    defaults: () => ({ content: 'Décris ton projet ici : ce qu’il fait, pour qui, pourquoi il est utile.' }),
    fields: [{ key: 'content', label: 'Texte', type: 'textarea' }],
  },
  fonttext: {
    name: 'Texte stylé', icon: 'fonttext',
    desc: 'Change vraiment la police (Unicode : gras, script, mono…)',
    defaults: () => ({ text: 'Bienvenue sur mon profil', style: 'gras', size: 'titre', center: true }),
    fields: [
      { key: 'text', label: 'Texte (lettres et chiffres)', type: 'textarea' },
      { key: 'style', label: 'Police', type: 'select', options: ['gras', 'gras-sans', 'italique', 'gras-italique', 'mono', 'script', 'contourne', 'encercle'] },
      { key: 'size', label: 'Taille', type: 'select', options: ['texte', 'titre', 'grand-titre'] },
      { key: 'center', label: 'Centré', type: 'checkbox' },
    ],
  },
  typing: {
    name: 'Titre animé', icon: 'typing',
    desc: 'Machine à écrire animée (police au choix)',
    defaults: () => ({ lines: 'Salut, moi c’est TIGROU\nJe code des trucs cools', font: 'Fira Code', size: 22, color: '2f81f7', width: 500, center: true }),
    fields: [
      { key: 'lines', label: 'Une phrase par ligne', type: 'textarea' },
      { key: 'font', label: 'Police', type: 'select', options: ['Fira Code', 'JetBrains Mono', 'Cascadia Code', 'Courier New', 'monospace', 'Anton', 'Pacifico'] },
      { key: 'size', label: 'Taille', type: 'number' },
      { key: 'color', label: 'Couleur (hex, sans #)', type: 'text' },
      { key: 'width', label: 'Largeur (px)', type: 'number' },
      { key: 'center', label: 'Centré', type: 'checkbox' },
    ],
  },
  badges: {
    name: 'Badges', icon: 'badges',
    desc: 'Badges shields.io (version, licence, build…)',
    defaults: () => ({ items: [
      { label: 'version', message: '1.0.0', color: 'blue', logo: '', style: 'flat' },
      { label: 'license', message: 'MIT', color: 'green', logo: '', style: 'flat' },
    ] }),
    fields: [{ key: 'items', label: 'Badges', type: 'badgelist' }],
  },
  tech: {
    name: 'Technologies', icon: 'tech',
    desc: 'Icônes de langages/outils (skillicons)',
    defaults: () => ({ ids: 'js,html,css,py,git', center: true }),
    fields: [
      { key: 'ids', label: 'IDs en minuscules, séparés par des virgules (c++ → cpp, c# → cs, node → nodejs)', type: 'text' },
      { key: 'center', label: 'Centré', type: 'checkbox' },
    ],
  },
  stats: {
    name: 'Stats GitHub', icon: 'stats',
    desc: 'Cartes de statistiques du profil',
    defaults: () => ({ username: 'octocat', theme: 'tokyonight', showStats: true, showStreak: true, showLangs: true }),
    fields: [
      { key: 'username', label: "Pseudo GitHub", type: 'text' },
      { key: 'theme', label: 'Thème', type: 'select', options: ['tokyonight', 'dracula', 'dark', 'radical', 'gruvbox', 'onedark', 'cobalt', 'github_dark'] },
      { key: 'showStats', label: 'Carte stats', type: 'checkbox' },
      { key: 'showStreak', label: 'Séries (streak)', type: 'checkbox' },
      { key: 'showLangs', label: 'Top langages', type: 'checkbox' },
    ],
  },
  image: {
    name: 'Image', icon: 'image',
    desc: 'Capture d’écran ou illustration',
    defaults: () => ({ url: 'https://placehold.co/800x400?text=Screenshot', alt: 'Aperçu', width: 800, align: 'center' }),
    fields: [
      { key: 'url', label: 'URL', type: 'text' },
      { key: 'alt', label: 'Texte alternatif', type: 'text' },
      { key: 'width', label: 'Largeur (px, 0 = auto)', type: 'number' },
      { key: 'align', label: 'Alignement', type: 'select', options: ['center', 'left', 'right'] },
    ],
  },
  links: {
    name: 'Liens', icon: 'links',
    desc: 'Rangée de liens (démo, docs…)',
    defaults: () => ({ items: [{ label: 'Démo', url: 'https://example.com' }, { label: 'Documentation', url: 'https://example.com/docs' }], center: true }),
    fields: [
      { key: 'items', label: 'Liens', type: 'linklist' },
      { key: 'center', label: 'Centré', type: 'checkbox' },
    ],
  },
  list: {
    name: 'Liste', icon: 'list',
    desc: 'Puces ou numérotée (fonctionnalités…)',
    defaults: () => ({ ordered: false, items: 'Fonctionnalité 1\nFonctionnalité 2\nFonctionnalité 3' }),
    fields: [
      { key: 'ordered', label: 'Numérotée', type: 'checkbox' },
      { key: 'items', label: 'Un élément par ligne', type: 'textarea' },
    ],
  },
  code: {
    name: 'Bloc de code', icon: 'code',
    desc: 'Installation / exemple d’usage',
    defaults: () => ({ lang: 'bash', code: 'npm install mon-projet\nnpm start' }),
    fields: [
      { key: 'lang', label: 'Langage', type: 'text' },
      { key: 'code', label: 'Code', type: 'textarea' },
    ],
  },
  table: {
    name: 'Tableau', icon: 'table',
    desc: 'En-tête + lignes (virgules)',
    defaults: () => ({ header: 'Option,Défaut,Description', rows: '--port,3000,Port d’écoute\n--host,localhost,Hôte' }),
    fields: [
      { key: 'header', label: 'En-tête (séparé par des virgules)', type: 'text' },
      { key: 'rows', label: 'Une ligne par rangée (virgules)', type: 'textarea' },
    ],
  },
  quote: {
    name: 'Citation', icon: 'quote',
    desc: 'Mise en avant, témoignage',
    defaults: () => ({ text: 'Simple, rapide, efficace.', author: '' }),
    fields: [
      { key: 'text', label: 'Texte', type: 'textarea' },
      { key: 'author', label: 'Auteur (optionnel)', type: 'text' },
    ],
  },
  fun: {
    name: 'Citation / Blague auto', icon: 'fun',
    desc: 'Contenu dynamique qui change tout seul',
    defaults: () => ({ kind: 'citation', theme: 'tokyonight' }),
    fields: [
      { key: 'kind', label: 'Type', type: 'select', options: ['citation', 'blague'] },
      { key: 'theme', label: 'Thème', type: 'select', options: ['tokyonight', 'dracula', 'dark', 'radical', 'gruvbox', 'light'] },
    ],
  },
  toc: {
    name: 'Sommaire auto', icon: 'toc',
    desc: 'Généré depuis les titres du document',
    defaults: () => ({}),
    fields: [],
  },
  divider: {
    name: 'Séparateur', icon: 'divider',
    desc: 'Ligne, étoiles ou vague animée',
    defaults: () => ({ style: 'line', animation: 'twinkling' }),
    fields: [
      { key: 'style', label: 'Style', type: 'select', options: ['line', 'stars', 'wave'] },
      { key: 'animation', label: 'Animation (vague uniquement)', type: 'select', options: ['twinkling', 'fadeIn', 'scaleIn', 'blink'] },
    ],
  },
  counter: {
    name: 'Compteur de visites', icon: 'counter',
    desc: 'Nombre de vues du profil',
    defaults: () => ({ service: 'komarev', username: 'octocat', label: 'Visites', color: 'blue', style: 'flat', pageId: 'octocat.octocat' }),
    fields: [
      { key: 'service', label: 'Service', type: 'select', options: ['komarev', 'laobi'] },
      { key: 'username', label: 'Pseudo GitHub (komarev)', type: 'text' },
      { key: 'label', label: 'Étiquette (komarev)', type: 'text' },
      { key: 'color', label: 'Couleur (komarev)', type: 'text' },
      { key: 'style', label: 'Style (komarev)', type: 'select', options: ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social'] },
      { key: 'pageId', label: 'Page ID user.repo (laobi)', type: 'text' },
    ],
  },
};

const PALETTE = ['hero', 'banner', 'heading', 'text', 'fonttext', 'typing', 'badges', 'tech', 'stats', 'image', 'links', 'list', 'code', 'table', 'quote', 'fun', 'toc', 'divider', 'counter'];

function makeBlock(type) {
  const def = BLOCKS[type];
  if (!def) throw new Error('Bloc inconnu : ' + type);
  return { id: newId(), type, data: def.defaults() };
}

// ---------------------------------------------------------------- génération
function gen(block, ctx) {
  const d = block.data || {};
  switch (block.type) {
    case 'hero': {
      // GitHub n'interprète PAS le markdown dans les blocs HTML -> tout en HTML pur
      const parts = [];
      if (d.image) parts.push(`<p align="center">\n  <img src="${d.image}" width="${d.imageWidth || 120}" alt="logo">\n</p>`);
      parts.push(`<h1 align="center">${escHtml(d.title || '')}</h1>`);
      if (d.subtitle) parts.push(`<p align="center">${escHtml(d.subtitle)}</p>`);
      return parts.join('\n');
    }
    case 'heading': {
      const lvl = Math.min(6, Math.max(1, +d.level || 2));
      const text = escHtml(d.text || '');
      if (d.center) return `<h${lvl} align="center">${text}</h${lvl}>`;
      return `${'#'.repeat(lvl)} ${d.text || ''}`;
    }
    case 'text': return d.content || '';
    case 'fonttext': {
      const out = stylize(d.text || '', d.style || 'gras');
      if (d.size === 'grand-titre') return d.center ? `<h1 align="center">${escHtml(out)}</h1>` : `# ${out}`;
      if (d.size === 'titre') return d.center ? `<h2 align="center">${escHtml(out)}</h2>` : `## ${out}`;
      return d.center ? `<p align="center">${escHtml(out)}</p>` : out;
    }
    case 'typing': {
      const lines = String(d.lines || '').split('\n').map((s) => s.trim()).filter(Boolean);
      if (!lines.length) return '';
      const q = `font=${enc(String(d.font || 'Fira Code').trim())}&size=${+d.size || 22}&color=${enc(String(d.color || '2f81f7').replace(/^#/, ''))}&width=${+d.width || 500}&lines=${lines.map((l) => enc(l)).join(';')}`;
      const src = `https://readme-typing-svg.demolab.com?${q}`;
      if (d.center) return `<p align="center">\n  <a href="https://git.io/typing-svg"><img src="${src}" alt="typing"></a>\n</p>`;
      return `[![Typing](${src})](https://git.io/typing-svg)`;
    }
    case 'badges': {
      const items = Array.isArray(d.items) ? d.items : [];
      const imgs = items.filter((b) => b.label || b.message).map((b) => {
        const url = `https://img.shields.io/badge/${shieldsEscape(b.label || '')}-${shieldsEscape(b.message || '')}-${enc(b.color || 'blue')}?style=${enc(b.style || 'flat')}${b.logo ? `&logo=${enc(b.logo)}` : ''}`;
        return `![${b.label || ''}](${url})`;
      });
      return imgs.join(' ');
    }
    case 'tech': {
      // skillicons exige des minuscules : on normalise (Python -> python)
      const ids = String(d.ids || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean).join(',');
      if (!ids) return '';
      const src = `https://skillicons.dev/icons?i=${ids}`;
      if (d.center) return `<p align="center">\n  <a href="https://skillicons.dev"><img src="${src}" alt="tech"></a>\n</p>`;
      return `[![Tech](${src})](https://skillicons.dev)`;
    }
    case 'stats': {
      const u = enc(d.username || 'octocat');
      const t = enc(d.theme || 'tokyonight');
      const cards = [];
      if (d.showStats) cards.push(`<img src="https://github-readme-stats.vercel.app/api?username=${u}&show_icons=true&theme=${t}" alt="Stats">`);
      if (d.showStreak) cards.push(`<img src="https://streak-stats.demolab.com?user=${u}&theme=${t}" alt="Streak">`);
      if (d.showLangs) cards.push(`<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${u}&layout=compact&theme=${t}" alt="Top Langs">`);
      if (!cards.length) return '';
      return `<div align="center">\n\n${cards.join('\n\n')}\n\n</div>`;
    }
    case 'image': {
      const w = +d.width || 0;
      const tag = `<img src="${d.url || ''}" alt="${(d.alt || '').replace(/"/g, '&quot;')}"${w ? ` width="${w}"` : ''}>`;
      const align = d.align || 'center';
      if (align === 'center') return `<p align="center">\n  ${tag}\n</p>`;
      if (align === 'right') return `<p align="right">\n  ${tag}\n</p>`;
      return tag;
    }
    case 'links': {
      const items = Array.isArray(d.items) ? d.items : [];
      const valid = items.filter((l) => l.label && l.url);
      if (!valid.length) return '';
      if (d.center) {
        const parts = valid.map((l) => `<a href="${l.url}">${escHtml(l.label)}</a>`);
        return `<p align="center">\n  ${parts.join(' · ')}\n</p>`;
      }
      return valid.map((l) => `[${l.label}](${l.url})`).join(' · ');
    }
    case 'list': {
      const items = String(d.items || '').split('\n').map((s) => s.trim()).filter(Boolean);
      return items.map((it, i) => (d.ordered ? `${i + 1}. ${it}` : `- ${it}`)).join('\n');
    }
    case 'code': return '```' + (d.lang || '') + '\n' + (d.code || '') + '\n```';
    case 'table': {
      const head = String(d.header || '').split(',').map((s) => s.trim());
      if (!head.length || !head[0]) return '';
      const rows = String(d.rows || '').split('\n').map((r) => r.trim()).filter(Boolean)
        .map((r) => `| ${r.split(',').map((s) => s.trim()).join(' | ')} |`);
      return `| ${head.join(' | ')} |\n| ${head.map(() => '---').join(' | ')} |\n${rows.join('\n')}`;
    }
    case 'quote': {
      const lines = String(d.text || '').split('\n').map((s) => `> ${s}`).join('\n');
      return d.author ? `${lines}\n>\n> — ${d.author}` : lines;
    }
    case 'banner': {
      // Nom en couleur + animation (capsule-render) : le seul vrai moyen fiable sur GitHub
      const anim = ['twinkling', 'fadeIn', 'scaleIn', 'blink'].includes(d.animation) ? `&animation=${d.animation}` : '';
      const q = `type=${enc(d.type || 'rounded')}&color=${enc(d.color || 'gradient')}&height=${+d.height || 200}&section=${enc(d.section || 'header')}&text=${enc(d.text || '')}&fontSize=${+d.fontSize || 60}&fontColor=${enc(String(d.fontColor || 'ffffff').replace(/^#/, ''))}${d.desc ? `&desc=${enc(d.desc)}` : ''}${anim}`;
      return `<p align="center">\n  <img src="https://capsule-render.vercel.app/api?${q}" alt="bannière">\n</p>`;
    }
    case 'fun': {
      const t = enc(d.theme || 'tokyonight');
      const src = d.kind === 'blague'
        ? `https://readme-jokes.vercel.app/api?theme=${t}`
        : `https://quotes-github-readme.vercel.app/api?type=horizontal&theme=${t}`;
      return `<p align="center">\n  <img src="${src}" alt="${d.kind === 'blague' ? 'blague' : 'citation'}">\n</p>`;
    }
    case 'toc': {
      const heads = (ctx && ctx.headings) || [];
      if (!heads.length) return '<!-- Ajoute des blocs "Titre de section" pour générer le sommaire -->';
      return heads.map((h) => `- [${h.text}](#${slugify(h.text)})`).join('\n');
    }
    case 'divider': {
      if (d.style === 'stars') return '***';
      if (d.style === 'wave') {
        const anim = ['twinkling', 'fadeIn', 'scaleIn', 'blink'].includes(d.animation) ? d.animation : 'twinkling';
        return `![wave](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=120&section=header&animation=${anim})`;
      }
      return '---';
    }
    case 'counter': {
      if (d.service === 'laobi' && d.pageId) {
        const src = `https://visitor-badge.laobi.icu/badge?page_id=${enc(d.pageId)}`;
        return `<p align="center">\n  <img src="${src}" alt="visites">\n</p>`;
      }
      const u = enc(d.username || 'octocat');
      const src = `https://komarev.com/ghpvc/?username=${u}&label=${enc(d.label || 'Visites')}&color=${enc(d.color || 'blue')}&style=${enc(d.style || 'flat')}`;
      return `<p align="center">\n  <img src="${src}" alt="visites">\n</p>`;
    }
    default: return '';
  }
}

function toMarkdown(blocks) {
  const headings = blocks
    .filter((b) => b.type === 'heading' && b.data && b.data.text)
    .map((b) => ({ text: String(b.data.text) }));
  return blocks.map((b) => gen(b, { headings })).filter((s) => s !== '').join('\n\n') + '\n';
}

// Toutes les URLs d'images du markdown (notation ![..](url) + <img src="..">)
function extractImageUrls(md) {
  const out = [];
  const push = (u) => {
    const url = String(u || '').trim();
    if (/^https?:\/\//i.test(url) && !out.includes(url)) out.push(url);
  };
  const s = String(md || '');
  let m;
  const reMd = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  while ((m = reMd.exec(s))) push(m[1]);
  const reImg = /<img[^>]+src=["']([^"']+)["']/gi;
  while ((m = reImg.exec(s))) push(m[1]);
  return out.slice(0, 60);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BLOCKS, PALETTE, makeBlock, gen, toMarkdown, slugify, extractImageUrls, stylize, FONT_STYLES };
}
