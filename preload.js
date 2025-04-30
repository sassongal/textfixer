const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // Add functions here to expose specific IPC channels
  correctLayout: (text) => ipcRenderer.invoke("correct-layout", text),
  cleanTemplate: (text) => ipcRenderer.invoke("clean-template", text),
  translateText: (text, sourceLang, targetLang) => ipcRenderer.invoke("translate-text", text, sourceLang, targetLang),
  expandText: (text, apiKey) => ipcRenderer.invoke("expand-text", text, apiKey) // Expose expander function
});

console.log("Preload script loaded.");

