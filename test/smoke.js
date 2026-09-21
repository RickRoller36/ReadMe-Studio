// ReadMe Studio — smoke test (node uniquement)
'use strict';
const assert = require('assert');
const { BLOCKS, PALETTE, makeBlock, gen, toMarkdown, slugify, extractImageUrls, stylize } = require('../renderer/blocks');
const { render } = require('../renderer/md');
const { probeUrl, checkUrls } = require('../probe');

let n = 0;
function ok(cond, label) {
  n += 1;
  assert(cond, 'ÉCHEC: ' + label);
  console.log(`  PASS ${n}: ${label}`);
}

ok(PALETTE.length >= 12 && PALETTE.every((t) => BLOCKS[t]), 'palette complète et définie');
ok(Object.values(BLOCKS).every((d) => d.name && d.defaults && Array.isArray(d.fields)), 'chaque bloc a nom/défauts/champs');

const hero = makeBlock('hero');
ok(hero.id && hero.type === 'hero' && hero.data.title, 'makeBlock hero');
ok(gen(hero, {}).includes('<h1 align="center">'), 'hero -> h1 centré');

const badges = makeBlock('badges');
const bm = gen(badges, {});
ok(bm.includes('img.shields.io/badge/version-1.0.0-blue'), 'badge shields.io correct');

const stats = makeBlock('stats');
stats.data.username = 'torvalds';
const sm = gen(stats, {});
ok(sm.includes('github-readme-stats') && sm.includes('torvalds') && sm.includes('streak-stats'), 'stats github');

const code = makeBlock('code');
ok(gen(code, {}).startsWith('```bash'), 'bloc code avec langage');

const table = makeBlock('table');
const tm = gen(table, {});
ok(tm.includes('| Option | Défaut | Description |') && tm.includes('| --- |'), 'tableau GFM');

const toc = makeBlock('toc');
const h1 = makeBlock('heading'); h1.data.text = 'Installation Rapide';
const tocm = gen(toc, { headings: [{ text: 'Installation Rapide' }] });
ok(tocm.includes('#installation-rapide'), 'sommaire + slug accentué');
ok(slugify('Café Été') === 'cafe-ete', 'slugify accents');

const full = toMarkdown([hero, h1, toc, code, table]);
ok(full.endsWith('\n') && full.includes('## Installation Rapide'), 'document complet assemblé');

const html = render('# Titre\n\n- a\n- b\n\n```js\nlet x = 1;\n```\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n> citation\n\n---\n\n![alt](http://img)\n\n**gras** et `code`');
for (const s of ['<h1>Titre</h1>', '<ul>', '<li>a</li>', '<pre><code', '<table>', '<th>A</th>', '<blockquote>', '<hr>', '<img', '<strong>gras</strong>', '<code>code</code>']) {
  ok(html.includes(s), 'rendu md: ' + s);
}
const raw = render('<p align="center">\n  hello\n</p>');
ok(raw.includes('<p align="center">'), 'HTML brut préservé');

// GitHub n'interprète pas le markdown dans les blocs HTML -> générateurs 100 % HTML + aperçu fidèle
const tech = makeBlock('tech'); tech.data.ids = 'js,react';
const techMd = gen(tech, {});
ok(techMd.includes('<p align="center">') && techMd.includes('<img src="https://skillicons.dev/icons?i=js,react"') && !techMd.includes('[!['), 'tech centré en pur HTML');
tech.data.center = false;
ok(gen(tech, {}).startsWith('[![Tech]('), 'tech non centré reste markdown');
const st2 = makeBlock('stats'); st2.data.username = 'octocat';
ok(gen(st2, {}).includes('<img src="https://github-readme-stats'), 'stats en pur HTML');
const lk = makeBlock('links');
ok(gen(lk, {}).includes('<p align="center">') && gen(lk, {}).includes('<a href="https://example.com">Démo</a>'), 'liens centrés en pur HTML');
const hh = makeBlock('heading'); hh.data.text = 'Salut'; hh.data.center = true;
ok(gen(hh, {}).includes('<h2 align="center">Salut</h2>'), 'titre centré en pur HTML');
const faithful = render('<div align="center">\n\n[![X](http://img)](http://t)\n\n</div>');
ok(faithful.includes('[![X]') && !faithful.includes('<a href="http://t"><img'), 'aperçu fidèle : markdown brut dans les blocs HTML');

const img = makeBlock('image');
ok(img.data.url.includes('placehold.co') && !img.data.url.includes('via.placeholder'), 'placeholder par défaut vivant (placehold.co)');

const urls = extractImageUrls('![a](https://x.com/1.png)\n<p><img src="https://y.com/2.svg"></p>\n[lien](https://z.com)\n![a](https://x.com/1.png)');
ok(urls.length === 2 && urls[0] === 'https://x.com/1.png' && urls[1] === 'https://y.com/2.svg', 'extraction URLs images (dédupliquées, pas les liens)');

console.log('— probe.js (réseau réel) —');

(async () => {
  const p1 = await probeUrl('https://skillicons.dev/icons?i=js');
  ok(p1.ok && /^image\//.test(p1.contentType), `skillicons OK (${p1.status} ${p1.contentType})`);
  const p2 = await probeUrl('https://placehold.co/800x400?text=X');
  ok(p2.ok, `placehold.co OK (${p2.status})`);
  const p3 = await probeUrl('https://img.shields.io/badge/a-b-blue');
  ok(p3.ok, `shields OK (${p3.status})`);
  const p4 = await probeUrl('https://via.placeholder.com/800x400');
  ok(!p4.ok, `via.placeholder KO comme attendu (${p4.error || p4.status})`);
  const all = await checkUrls(['https://skillicons.dev/icons?i=js', 'https://via.placeholder.com/x']);
  ok(all.length === 2 && all[0].ok && !all[1].ok, 'checkUrls en lot');
  const bad = await probeUrl('https://skillicons.dev/icons?i=nimportequoi_xyz');
  ok(!bad.ok && /inconnue/.test(bad.error), `ID skillicons inconnu détecté (${bad.error})`);
  const up = await probeUrl('https://skillicons.dev/icons?i=Python');
  ok(!up.ok, 'ID majuscule détecté comme inconnu (minuscules exigées)');
  const t = makeBlock('tech'); t.data.ids = 'Python, JS';
  ok(gen(t, {}).includes('i=python,js'), 'génération tech normalisée en minuscules');

  // polices Unicode + typing animé + compteur + vague animée
  ok(stylize('Az09 !', 'gras') === '\u{1D400}\u{1D433}\u{1D7CE}\u{1D7D7} !', 'stylize gras (A,z,0,9 conservés, ponctuation intacte)');
  ok(stylize('Hello', 'mono') === '\u{1D677}\u{1D68E}\u{1D695}\u{1D695}\u{1D698}', 'stylize mono');
  ok(stylize('R', 'contourne') === 'ℝ' && stylize('e', 'script') === 'ℯ', 'stylize exceptions (R double, e script)');
  const ft = makeBlock('fonttext'); ft.data.text = 'Salut'; ft.data.style = 'script';
  ok(gen(ft, {}).includes('<h2 align="center">'), 'fonttext titre centré en HTML pur');
  const ty = makeBlock('typing'); ty.data.lines = 'Hello\nWorld'; ty.data.font = 'Fira Code';
  const tyMd = gen(ty, {});
  ok(tyMd.includes('readme-typing-svg.demolab.com') && tyMd.includes('font=Fira%20Code') && tyMd.includes('lines=Hello;World'), 'typing URL avec police et lignes');
  const dv = makeBlock('divider'); dv.data.style = 'wave'; dv.data.animation = 'fadeIn';
  ok(gen(dv, {}).includes('animation=fadeIn'), 'vague animée paramétrée');
  const ct = makeBlock('counter'); ct.data.service = 'laobi'; ct.data.pageId = 'octocat.octocat';
  ok(gen(ct, {}).includes('visitor-badge.laobi.icu/badge?page_id=octocat.octocat'), 'compteur laobi');

  // bannière couleur + fun dynamique
  const bn = makeBlock('banner'); bn.data.text = 'TIGROU';
  const bnMd = gen(bn, {});
  ok(bnMd.includes('capsule-render.vercel.app/api') && bnMd.includes('text=TIGROU') && bnMd.includes('<img src='), 'bannière couleur en HTML pur');
  const fn1 = makeBlock('fun'); fn1.data.kind = 'citation';
  ok(gen(fn1, {}).includes('quotes-github-readme.vercel.app'), 'bloc citation auto');
  const fn2 = makeBlock('fun'); fn2.data.kind = 'blague';
  ok(gen(fn2, {}).includes('readme-jokes.vercel.app'), 'bloc blague auto');

  console.log('— services dynamiques (réseau réel) —');
  const live = await checkUrls([
    'https://capsule-render.vercel.app/api?type=rounded&color=gradient&text=TIGROU&fontSize=60&fontColor=ffffff&animation=fadeIn&height=200',
    'https://quotes-github-readme.vercel.app/api?type=horizontal&theme=tokyonight',
    'https://readme-jokes.vercel.app/api?theme=tokyonight',
  ]);
  ok(live.every((r) => r.ok), `services dynamiques OK (${live.map((r) => r.status).join(',')})`);
  console.log(`\nSMOKE OK — ${n} tests réussis.`);
})().catch((e) => { console.error('SMOKE ÉCHEC:', e.message); process.exit(1); });
