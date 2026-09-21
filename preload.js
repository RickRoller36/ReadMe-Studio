// ReadMe Studio — pont sécurisé vers le renderer
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('rs', {
  saveMd: (content) => ipcRenderer.invoke('rs:save-md', content),
  saveProject: (json) => ipcRenderer.invoke('rs:save-project', json),
  loadProject: () => ipcRenderer.invoke('rs:load-project'),
  checkUrls: (urls) => ipcRenderer.invoke('rs:check-urls', urls),
});
