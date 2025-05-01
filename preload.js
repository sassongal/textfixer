const { contextBridge, ipcRenderer } = require("electron");

// Expose selected IPC functions to the renderer process safely
contextBridge.exposeInMainWorld("electronAPI", {
  correctLayout: (text) => ipcRenderer.invoke("correct-layout", text),
  cleanTemplate: (text) => ipcRenderer.invoke("clean-template", text),
  translateText: (text, sourceLang, targetLang) =>
    ipcRenderer.invoke("translate-text", { text, sourceLang, targetLang }),
  expandText: (text, apiKey) =>
    ipcRenderer.invoke("expand-text", { text, apiKey })
});

console.log("Preload script loaded.");
