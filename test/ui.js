// ReadMe Studio — test UI : ajoute/déplace un bloc, vérifie l'aperçu et l'export.
// Usage : npx electron --no-sandbox test/ui.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

async function main() {
  const errors = [];
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.webContents.on('console-message', (_e, level, msg) => {
    if (level >= 2 && !/Security Warning|Content-Security/i.test(msg)) errors.push('console: ' + msg);
  });
  win.webContents.on('page-error', (err) => errors.push('page: ' + (err && err.stack || err)));
  await win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  await new Promise((r) => setTimeout(r, 1200));

  const res = await win.webContents.executeJavaScript(`(() => {
    const out = [];
    out.push('blocs-init:' + document.querySelectorAll('#canvas .block').length);
    out.push('palette:' + document.querySelectorAll('[data-add]').length);
    // ajout via clic palette
    document.querySelector('[data-add="stats"]').click();
    out.push('blocs-apres-ajout:' + document.querySelectorAll('#canvas .block').length);
    // sélection + réglage : change le pseudo stats
    const sel = document.querySelector('#propsBody [data-k="username"]');
    out.push('champ-username:' + (sel ? 'oui' : 'non'));
    if (sel) { sel.value = 'torvalds'; sel.dispatchEvent(new Event('input', { bubbles: true })); }
    const md = document.getElementById('source').textContent;
    out.push('source-tab-md:' + (md && md.length > 0 ? 'non-vide' : 'VIDE'));
    document.getElementById('tabSource').click();
    const src = document.getElementById('source').textContent;
    out.push('export-contient-torvalds:' + (src.includes('torvalds') ? 'oui' : 'non'));
    out.push('export-contient-hero:' + (src.includes('Mon Super Projet') ? 'oui' : 'non'));
    out.push('apercu-h1:' + (document.getElementById('preview').innerHTML.includes('<h1') ? 'oui' : 'non'));
    // suppression
    const before = document.querySelectorAll('#canvas .block').length;
    document.querySelector('#canvas .block [data-act="del"]').click();
    out.push('suppression:' + before + '->' + document.querySelectorAll('#canvas .block').length);
    // vérificateur d'images
    document.getElementById('btnCheckUrls').click();
    out.push('bouton-check:cliqué');
    return out;
  })()`);
  await new Promise((r) => setTimeout(r, 20000));
  const urlReport = await win.webContents.executeJavaScript(
    `document.getElementById('urlReport').textContent.slice(0, 400)`
  );
  console.log(res.join('\n'));
  console.log('--- rapport images ---');
  console.log(urlReport);
  console.log('--- erreurs page ---');
  console.log(errors.length ? errors.join('\n') : 'aucune');
  app.exit(0);
}

app.whenReady().then(main);
