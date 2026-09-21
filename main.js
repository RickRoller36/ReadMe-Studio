// ReadMe Studio — processus principal Electron
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { checkUrls } = require('./probe');

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 680,
    backgroundColor: '#0d1117',
    title: 'ReadMe Studio',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  win.on('closed', () => { win = null; });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('rs:save-md', async (_evt, content) => {
  const res = await dialog.showSaveDialog(win, {
    title: 'Enregistrer le README',
    defaultPath: 'README.md',
    filters: [{ name: 'Markdown', extensions: ['md'] }],
  });
  if (res.canceled || !res.filePath) return { canceled: true };
  fs.writeFileSync(res.filePath, String(content || ''), 'utf8');
  return { canceled: false, path: res.filePath };
});

ipcMain.handle('rs:save-project', async (_evt, json) => {
  const res = await dialog.showSaveDialog(win, {
    title: 'Sauvegarder le projet',
    defaultPath: 'readme-studio.json',
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });
  if (res.canceled || !res.filePath) return { canceled: true };
  fs.writeFileSync(res.filePath, String(json || ''), 'utf8');
  return { canceled: false, path: res.filePath };
});

ipcMain.handle('rs:load-project', async () => {
  const res = await dialog.showOpenDialog(win, {
    title: 'Ouvrir un projet',
    properties: ['openFile'],
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });
  if (res.canceled || !res.filePaths.length) return { canceled: true };
  const data = fs.readFileSync(res.filePaths[0], 'utf8');
  return { canceled: false, json: data, path: res.filePaths[0] };
});

ipcMain.handle('rs:check-urls', async (_evt, urls) => checkUrls(urls));
