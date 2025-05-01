#!/bin/bash

set -e

PROJECT_DIR="$(pwd)"
echo "🔧 Applying modern UI and tray integration in: $PROJECT_DIR"

# --- 1. Patch index.html to modern UI ---
cat <<'EOF' > "$PROJECT_DIR/index.html"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TextFixer</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="container">
    <h1>🛠️ TextFixer</h1>
    <textarea id="inputText" placeholder="Paste or type here..."></textarea>
    <div class="button-row">
      <button id="correctLayoutBtn">🔤 Fix Layout</button>
      <button id="cleanTemplateBtn">🧹 Clean Template</button>
      <button id="translateBtn">🌐 Translate</button>
      <button id="expandTextBtn">✨ Expand with GPT</button>
    </div>
    <textarea id="outputText" readonly placeholder="Result will appear here..."></textarea>
    <div class="settings">
      <input type="password" id="apiKey" placeholder="🔑 OpenAI API Key" />
      <label><input type="checkbox" id="hotkeyToggle" checked /> Enable Global Hotkey</label>
      <label><input type="checkbox" id="autocorrectToggle" /> Enable Auto-Correction</label>
    </div>
  </div>
  <script src="renderer.js"></script>
</body>
</html>
EOF

# --- 2. Patch style.css to modern UI ---
cat <<'EOF' > "$PROJECT_DIR/style.css"
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f6f8fa;
  color: #333;
}
.container {
  max-width: 720px;
  margin: 30px auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
h1 {
  text-align: center;
}
textarea {
  width: 100%;
  min-height: 120px;
  margin-bottom: 12px;
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: vertical;
}
.button-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}
button {
  flex: 1 1 45%;
  padding: 10px;
  font-size: 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
button:hover {
  background: #0056b3;
}
.settings {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
EOF

# --- 3. Patch main.js to add tray menu ---
sed -i '' '/createWindow()/a\
  const { Menu, Tray } = require("electron");\
  const iconPath = path.join(__dirname, "build", "icon.icns");\
  let tray = new Tray(iconPath);\
  const trayMenu = Menu.buildFromTemplate([\
    { label: "Show", click: () => win.show() },\
    { label: "Quit", click: () => app.quit() }\
  ]);\
  tray.setContextMenu(trayMenu);\
  tray.setToolTip("TextFixer");
' "$PROJECT_DIR/main.js"

# --- 4. Git commit + push ---
git add .
git commit -m "🎨 Modern UI + 🧭 Tray menu integration"
git push --force origin main

echo "✅ All done. UI and tray ready. Run: npm start"
