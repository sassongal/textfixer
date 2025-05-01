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
  setHotkey: (hotkey) => ipcRenderer.invoke("set-hotkey", hotkey),
  toggleHotkey: (enabled) => ipcRenderer.invoke("toggle-hotkey", enabled),
  toggleAutocorrect: (enabled) => ipcRenderer.invoke("toggle-autocorrect", enabled)
});
