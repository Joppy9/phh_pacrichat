const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.on('ready', () => {
  let win = new BrowserWindow({
    width: 375,
    height: 600,
    'node-integration': false
  });
  win.loadURL(`http://localhost:3000`);
  //win.webContents.openDevTools();
    win.on('closed', function () {
    win = null;
  });
});