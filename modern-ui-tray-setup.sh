#!/bin/bash

PROJECT_DIR="/Users/galsasson/Downloads/home/ubuntu/temp-clean-textfixer"
ICON_FILE_NAME="iconTemplate.png"
ICON_PATH="$PROJECT_DIR/$ICON_FILE_NAME"

if [ ! -f "$ICON_PATH" ]; then
  echo "❌ קובץ האייקון $ICON_FILE_NAME לא נמצא בתיקייה: $PROJECT_DIR"
  exit 1
fi

cd "$PROJECT_DIR" || exit 1

# ✅ Update index.html - clean style + tray styling
sed -i '' '/<link rel="stylesheet"/a\
<style>
  body { font-family: Arial, sans-serif; background: #f3f3f3; color: #333; }
  .container { max-width: 800px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
  textarea, input { width: 100%; font-size: 16px; margin: 10px 0; }
  button { margin: 5px; padding: 10px 20px; border: none; background: #007BFF; color: white; border-radius: 5px; cursor: pointer; }
  button:hover { background: #0056b3; }
</style>' index.html

# ✅ Replace preload.js to expose tray controls
cat <<'EOF' > preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  correctLayout: (text) => ipcRenderer.invoke("correct-layout", text),
  cleanTemplate: (text) => ipcRenderer.invoke("clean-template", text),
  translateText: (text, sourceLang, targetLang) => ipcRenderer.invoke("translate-text", { text, sourceLang, targetLang }),
  expandText: (text, apiKey) => ipcRenderer.invoke("expand-text", { text, apiKey })
});

contextBridge.exposeInMainWorld("settingsAPI", {
  toggleHotkey: (enabled) => ipcRenderer.invoke("toggle-hotkey", enabled),
  toggleAutocorrect: (enabled) => ipcRenderer.invoke("toggle-autocorrect", enabled)
});
EOF

# ✅ Update main.js - tray and permissions
cat <<'EOF' >> main.js

const { Tray, Menu, dialog, shell } = require("electron");
let tray = null;

function createTray() {
  tray = new Tray(path.join(__dirname, "iconTemplate.png"));
  const menu = Menu.buildFromTemplate([
    { label: "🪄 Correct Layout", click: () => { mainWindow.webContents.send('trigger-action', 'correct-layout'); } },
    { label: "🧼 Clean Template", click: () => { mainWindow.webContents.send('trigger-action', 'clean-template'); } },
    { label: "🌐 Translate Text", click: () => { mainWindow.webContents.send('trigger-action', 'translate-text'); } },
    { label: "🤖 Expand Text (GPT)", click: () => { mainWindow.webContents.send('trigger-action', 'expand-text'); } },
    { type: "separator" },
    { label: "🚪 Quit", role: "quit" }
  ]);
  tray.setToolTip("TextFixer AI");
  tray.setContextMenu(menu);
}

app.whenReady().then(() => {
  createTray();
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
EOF

# ✅ Final message
clear
echo "✅ סיימנו! עכשיו יש תפריט מגש עליון, עיצוב מודרני, ואזהרת הרשאה אם נדרש."
echo "🔄 הפעל מחדש את האפליקציה עם: npm start"
