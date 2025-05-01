const fs = require("fs");
const path = require("path");

const basePath = process.cwd();
const configPath = path.join(basePath, "config.json");
let config = JSON.parse(fs.readFileSync(configPath, "utf8"));

// === PATCH index.html ===
let html = fs.readFileSync(path.join(basePath, "index.html"), "utf8");
if (!html.includes("hotkeyInput")) {
  html = html.replace(
    "<!-- Add more settings later as needed -->",
    `<label for="hotkeyInput">Global Hotkey:</label>
     <input type="text" id="hotkeyInput" value="${config.hotkey || ""}" />
     <!-- Add more settings later as needed -->`
  );
  fs.writeFileSync(path.join(basePath, "index.html"), html, "utf8");
}

// === PATCH renderer.js ===
let renderer = fs.readFileSync(path.join(basePath, "renderer.js"), "utf8");
if (!renderer.includes("hotkeyInput")) {
  renderer = renderer.replace(
    "document.getElementById(\"autocorrectToggle\").addEventListener(\"change\",",
    `document.getElementById("hotkeyInput").addEventListener("change", (e) => {
      window.settingsAPI.setHotkey(e.target.value.trim());
    });

    document.getElementById("autocorrectToggle").addEventListener("change",`
  );
  fs.writeFileSync(path.join(basePath, "renderer.js"), renderer, "utf8");
}

// === PATCH preload.js ===
let preload = fs.readFileSync(path.join(basePath, "preload.js"), "utf8");
if (!preload.includes("setHotkey")) {
  preload = preload.replace(
    "contextBridge.exposeInMainWorld(\"settingsAPI\", {",
    `contextBridge.exposeInMainWorld("settingsAPI", {
  setHotkey: (hotkey) => ipcRenderer.invoke("set-hotkey", hotkey),`
  );
  fs.writeFileSync(path.join(basePath, "preload.js"), preload, "utf8");
}

// === PATCH main.js ===
let main = fs.readFileSync(path.join(basePath, "main.js"), "utf8");
if (!main.includes("set-hotkey")) {
  main = main.replace(
    'ipcMain.handle("toggle-autocorrect", async (_, enabled) => {',
    `ipcMain.handle("set-hotkey", async (_, newHotkey) => {
  config.hotkey = newHotkey;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  unregisterShortcut();
  if (config.hotkeyEnabled) registerShortcut();
});

ipcMain.handle("toggle-autocorrect", async (_, enabled) => {`
  );
  fs.writeFileSync(path.join(basePath, "main.js"), main, "utf8");
}

console.log("✅ All patches applied. You can now start the app with updated hotkey config.");
