#!/bin/bash

PROJECT_DIR="$(pwd)"

echo "🔧 Updating files in: $PROJECT_DIR"

# 1. Write config.json
cat <<EOF > "$PROJECT_DIR/config.json"
{
  "hotkeyEnabled": true,
  "autocorrectEnabled": false,
  "hotkey": "CommandOrControl+Shift+L"
}
EOF

# 2. Overwrite preload.js
cat <<EOF > "$PROJECT_DIR/preload.js"
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  correctLayout: (text) => ipcRenderer.invoke("correct-layout", text),
  cleanTemplate: (text) => ipcRenderer.invoke("clean-template", text),
  translateText: (text, sourceLang, targetLang) =>
    ipcRenderer.invoke("translate-text", { text, sourceLang, targetLang }),
  expandText: (text, apiKey) =>
    ipcRenderer.invoke("expand-text", { text, apiKey })
});

contextBridge.exposeInMainWorld("settingsAPI", {
  toggleHotkey: (enabled) => ipcRenderer.invoke("toggle-hotkey", enabled),
  toggleAutocorrect: (enabled) => ipcRenderer.invoke("toggle-autocorrect", enabled)
});
EOF

# 3. Append to renderer.js
cat <<'EOF' >> "$PROJECT_DIR/renderer.js"

document.getElementById("hotkeyToggle").addEventListener("change", (e) => {
  window.settingsAPI.toggleHotkey(e.target.checked);
});

document.getElementById("autocorrectToggle").addEventListener("change", (e) => {
  window.settingsAPI.toggleAutocorrect(e.target.checked);
});
EOF

# 4. Patch index.html (if not already present)
SETTINGS_FILE="$PROJECT_DIR/index.html"
if ! grep -q "id=\"hotkeyToggle\"" "$SETTINGS_FILE"; then
  echo "🔧 Patching index.html..."
  sed -i '' '/<!-- Add more settings later as needed -->/a\\
<div>\\
  <label><input type="checkbox" id="hotkeyToggle" checked /> Enable Global Hotkey (Ctrl+Shift+L)</label>\\
</div>\\
<div>\\
  <label><input type="checkbox" id="autocorrectToggle" /> Enable Auto-Correction (experimental)</label>\\
</div>
' "$SETTINGS_FILE"
else
  echo "✔️ index.html already contains hotkey toggle section."
fi

echo "✅ Done. Restart your Electron app."
