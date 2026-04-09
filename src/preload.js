// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

console.log('Preload script running'); // add this

contextBridge.exposeInMainWorld('electronAPI', {
  readFile: (filePath) => fs.readFileSync(filePath, 'utf8'),
  writeFile: (filePath, data) => fs.writeFileSync(filePath, data),
  fileExists: (filePath) => fs.existsSync(filePath),
  getAppPath: () => path.join(ipcRenderer.sendSync('get-user-data-path'), 'preferences.json'),
  claudeQuery: (prompt, files) => ipcRenderer.invoke('claude-query', prompt, files),
  getErrorCodeMessage: (statusCode) => ipcRenderer.invoke('get-error-code-message', statusCode)
  // add whatever fs operations you need
});