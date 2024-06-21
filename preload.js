const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  notifyUrlChange: (url) => ipcRenderer.send('url-changed', url)
});
