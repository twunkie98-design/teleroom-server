const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  app: {
    quit: () => ipcRenderer.send('app-quit'),
    version: process.versions.electron
  }
});
