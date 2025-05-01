const { app, BrowserWindow, globalShortcut, Menu, Tray, dialog, shell, systemPreferences } = require('electron');
const path = require('path');
const config = require('./config.json');

let mainWindow = null;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadFile('index.html');
}

function registerGlobalShortcut() {
  const shortcut = config.hotkey || 'Command+Shift+Z';
  const success = globalShortcut.register(shortcut, () => {
    if (!systemPreferences.isTrustedAccessibilityClient(false)) {
      dialog.showMessageBox({
        type: 'warning',
        buttons: ['פתח העדפות מערכת', 'ביטול'],
        title: 'הרשאות נדרשות',
        message: 'האפליקציה דורשת הרשאות נגישות כדי לפעול כראוי.',
        detail: 'לחץ על "פתח העדפות מערכת" כדי להעניק הרשאות.',
      }).then(result => {
        if (result.response === 0) {
          require('child_process').exec('open "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility"');
        }
      });
    } else {
      console.log('קיצור מקשים הופעל');
    }
  });

  if (!success) {
    console.log('רישום קיצור המקשים נכשל.');
  }
}

function createTrayMenu() {
  tray = new Tray(path.join(__dirname, 'iconTemplate.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: "🪄 Correct Layout", click: () => { mainWindow.webContents.send('trigger-action', 'correct-layout'); } },
    { label: "🧼 Clean Template", click: () => { mainWindow.webContents.send('trigger-action', 'clean-template'); } },
    { label: "🌐 Translate Text", click: () => { mainWindow.webContents.send('trigger-action', 'translate-text'); } },
    { label: "🤖 Expand Text (GPT)", click: () => { mainWindow.webContents.send('trigger-action', 'expand-text'); } },
    { type: "separator" },
    { label: "🚪 Quit", role: "quit" }
  ]);
  tray.setToolTip("TextFixer AI");
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createWindow();
  createTrayMenu();
  registerGlobalShortcut();

  const registered = globalShortcut.isRegistered(config.hotkey);
  if (!registered && config.hotkeyEnabled) {
    const granted = systemPreferences.isTrustedAccessibilityClient(false);
    if (!granted) {
      dialog.showMessageBox({
        type: 'info',
        title: 'Accessibility Permission Needed',
        message: 'To enable keyboard shortcuts, open System Preferences → Security & Privacy → Accessibility and enable access for Terminal and TextFixer.',
        buttons: ['Open Settings']
      }).then(result => {
        if (result.response === 0) {
          shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility');
        }
      });
    }
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
