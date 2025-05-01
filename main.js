const { app, BrowserWindow, ipcMain, clipboard, globalShortcut } = require("electron");
const path = require("path");
const fs = require("fs");

const { correctLayout } = require("./utils/keyboardLayout");
const { cleanTemplateText } = require("./utils/textCleaner");
const { translateText } = require("./utils/translator");
const { expandTextWithGPT } = require("./utils/gptExpander");

const configPath = path.join(__dirname, "config.json");
let config = JSON.parse(fs.readFileSync(configPath, "utf8"));

function registerShortcut() {
  if (config.hotkeyEnabled && config.hotkey) {
    globalShortcut.register(config.hotkey, () => {
      const text = clipboard.readText();
      const corrected = correctLayout(text);
      console.log("📋 Original Clipboard:", text);
      console.log("✅ Corrected:", corrected);
      clipboard.writeText(corrected);
    });
  }
}

function unregisterShortcut() {
  globalShortcut.unregisterAll();
}

ipcMain.handle("correct-layout", async (_, text) => {
  try {
    return correctLayout(text);
  } catch (error) {
    console.error("Layout Error:", error);
    return { error: error.message || "Layout correction failed." };
  }
});

ipcMain.handle("clean-template", async (_, text) => {
  try {
    return cleanTemplateText(text);
  } catch (error) {
    console.error("Clean Error:", error);
    return { error: error.message || "Template cleaning failed." };
  }
});

ipcMain.handle("translate-text", async (_, { text, sourceLang, targetLang }) => {
  try {
    return await translateText(text, sourceLang, targetLang);
  } catch (error) {
    console.error("Translate Error:", error);
    return { error: error.message || "Translation failed." };
  }
});

ipcMain.handle("expand-text", async (_, { text, apiKey }) => {
  try {
    return await expandTextWithGPT(text, apiKey);
  } catch (error) {
    console.error("Expand Error:", error);
    return { error: error.message || "Expansion failed." };
  }
});

ipcMain.handle("toggle-hotkey", async (_, enabled) => {
  config.hotkeyEnabled = enabled;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  unregisterShortcut();
console.log("🟢 Global Shortcut Registered:", globalShortcut.isRegistered(config.hotkey), `(${config.hotkey})`);
      console.log("🟢 Global Shortcut Registered:", registered, "(${config.hotkey})");
  if (enabled) registerShortcut();
console.log("🟢 Global Shortcut Registered:", globalShortcut.isRegistered(config.hotkey), `(${config.hotkey})`);
      console.log("🟢 Global Shortcut Registered:", registered, "(${config.hotkey})");
});

ipcMain.handle("set-hotkey", async (_, newHotkey) => {
  config.hotkey = newHotkey;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  unregisterShortcut();
console.log("🟢 Global Shortcut Registered:", globalShortcut.isRegistered(config.hotkey), `(${config.hotkey})`);
      console.log("🟢 Global Shortcut Registered:", registered, "(${config.hotkey})");
  if (config.hotkeyEnabled) registerShortcut();
console.log("🟢 Global Shortcut Registered:", globalShortcut.isRegistered(config.hotkey), `(${config.hotkey})`);
      console.log("🟢 Global Shortcut Registered:", registered, "(${config.hotkey})");
});

ipcMain.handle("toggle-autocorrect", async (_, enabled) => {
  config.autocorrectEnabled = enabled;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  // (future: activate listener)
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile("index.html");
}

app.whenReady().then(() => {
  registerShortcut();
console.log("🟢 Global Shortcut Registered:", globalShortcut.isRegistered(config.hotkey), `(${config.hotkey})`);
      console.log("🟢 Global Shortcut Registered:", registered, "(${config.hotkey})");
  createWindow();
});

app.on("will-quit", () => unregisterShortcut());

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
