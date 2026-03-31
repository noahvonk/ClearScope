// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge } = require('electron');
const fs = require('fs');
const path = require('path');

console.log('Preload script running'); // add this

contextBridge.exposeInMainWorld('electronAPI', {
  readFile: (filePath) => fs.readFileSync(filePath, 'utf8'),
  writeFile: (filePath, data) => fs.writeFileSync(filePath, data),
getAppPath: () => path.join(__dirname, '..', '..', '..', 'preferences.json'),
  // add whatever fs operations you need
});