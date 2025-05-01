const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// Import utilities (assumes you have these modules ready)
const { correctLayout } = require("./utils/keyboardLayout");
const { cleanTemplateText } = require("./utils/textCleaner");
const { translateText } = require("./utils/translator");
const { expandTextWithGPT } = require("./utils/gptExpander");

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
  // Correct keyboard layout
  ipcMain.handle("correct-layout", async (event, text) => {
    try {
      const correctedText = correctLayout(text);
      return correctedText;
    } catch (error) {
      console.error("Error correcting layout:", error);
      return { error: error.message || "Layout correction failed." };
    }
  });

  // Clean templated text
  ipcMain.handle("clean-template", async (event, text) => {
    try {
      const cleanedText = cleanTemplateText(text);
      return cleanedText;
    } catch (error) {
      console.error("Error cleaning template text:", error);
      return { error: error.message || "Template cleaning failed." };
    }
  });

  // Translate text
  ipcMain.handle("translate-text", async (event, { text, sourceLang, targetLang }) => {
    try {
      const translatedText = await translateText(text, sourceLang, targetLang);
      return translatedText;
    } catch (error) {
      console.error("Error translating text:", error);
      return { error: error.message || "Translation failed." };
    }
  });

  // Expand text using GPT
  ipcMain.handle("expand-text", async (event, { text, apiKey }) => {
    try {
      const expandedText = await expandTextWithGPT(text, apiKey);
      return expandedText;
    } catch (error) {
      console.error("Error expanding text with GPT:", error);
      return { error: error.message || "Text expansion failed." };
    }
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
