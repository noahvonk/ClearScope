const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('fs');
const Anthropic = require('@anthropic-ai/sdk'); // use the regular SDK, not agent-sdk
const mammoth = require('mammoth');
const XLSX = require('xlsx');


const preferencesDefaults = {
  settings: { theme: "default" },
  apis: {
    claude_api_key: "",
    claude_max_tokens: 1024,
    trello_api_key: "",
    trello_api_secret: ""
  },
  maxFileSize: 10485760
};

function initPreferences() {
  const prefsPath = path.join(app.getPath('userData'), 'preferences.json');
  console.log(prefsPath);
  if (!fs.existsSync(prefsPath)) {
    fs.writeFileSync(prefsPath, JSON.stringify(preferencesDefaults, null, 2));
  } else{
    // make sure that the file contains all the necessary keys, if not add them with default values. This is to ensure that we don't run into errors when trying to access keys that don't exist in the preferences file.
    let prefs = JSON.parse(fs.readFileSync(prefsPath, 'utf8'));
    let updated = false;

    // check settings
    if(!prefs.settings){
      prefs.settings = preferencesDefaults.settings;
      updated = true;
    } else {
      if(!prefs.settings.theme){
        prefs.settings.theme = preferencesDefaults.settings.theme;
        updated = true;
      }
    }

    // check apis
    if(!prefs.apis){
      prefs.apis = preferencesDefaults.apis;
      updated = true;
    } else {
      if(!prefs.apis.claude_api_key){
        prefs.apis.claude_api_key = preferencesDefaults.apis.claude_api_key;
        updated = true;
      }
      if(!prefs.apis.claude_max_tokens){
        prefs.apis.claude_max_tokens = preferencesDefaults.apis.claude_max_tokens;
        updated = true;
      }
      if(!prefs.apis.trello_api_key){
        prefs.apis.trello_api_key = preferencesDefaults.apis.trello_api_key;
        updated = true;
      }
      if(!prefs.apis.trello_api_secret){
        prefs.apis.trello_api_secret = preferencesDefaults.apis.trello_api_secret;
        updated = true;
      }
    }

    if(updated){
      fs.writeFileSync(prefsPath, JSON.stringify(prefs, null, 2));
    }
  }
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
  });
  mainWindow.removeMenu();
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // only open dev tools if the app is not packaged, this is to prevent users from accidentally opening dev tools and getting confused. We can also use this to log the path to the preferences file for debugging purposes.
  if(!app.isPackaged){
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  initPreferences();
  createWindow();
  console.log('App is ready'); // add this

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


ipcMain.on('get-user-data-path', (event) => {
  console.log('Received request for user data path');
    event.returnValue = app.getPath('userData');
});

ipcMain.handle('claude-query', async (event, prompt, files = []) => {
    const prefsPath = path.join(app.getPath('userData'), 'preferences.json');
    const preferences = JSON.parse(fs.readFileSync(prefsPath, 'utf8'));
    const client = new Anthropic({ apiKey: preferences.apis.claude_api_key });

    const content = [];

    for (const file of files) {
        const buffer = Buffer.from(file.data, 'base64');

        switch(file.type) {

            // --- natively supported ---
            case 'application/pdf':
                content.push({
                    type: 'document',
                    source: { type: 'base64', media_type: 'application/pdf', data: file.data }
                });
                break;

            case 'image/jpeg':
            case 'image/png':
            case 'image/gif':
            case 'image/webp':
                content.push({
                    type: 'image',
                    source: { type: 'base64', media_type: file.type, data: file.data }
                });
                break;

            case 'text/plain':
                content.push({
                    type: 'text',
                    text: `File: ${file.name}\n\n${buffer.toString('utf8')}`
                });
                break;

            // --- parsed types ---
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            case 'application/msword': {
                const result = await mammoth.extractRawText({ buffer });
                content.push({
                    type: 'text',
                    text: `File: ${file.name}\n\n${result.value}`
                });
                break;
            }

            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            case 'application/vnd.ms-excel':
            case 'text/csv': {
                const workbook = XLSX.read(buffer, { type: 'buffer' });
                const sheets = workbook.SheetNames.map(name => {
                    const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[name]);
                    return `Sheet: ${name}\n${csv}`;
                }).join('\n\n');
                content.push({
                    type: 'text',
                    text: `File: ${file.name}\n\n${sheets}`
                });
                break;
            }

            default:
                console.warn(`Unsupported file type: ${file.type} for file ${file.name}`);
                break;
        }
    }

    content.push({ type: 'text', text: prompt });

    const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: preferences.apis.claude_max_tokens,
        messages: [{ role: 'user', content }]
    });

    console.log('Claude response:', response); // add this
    return response.content[0].text;
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
