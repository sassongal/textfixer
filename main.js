const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { correctLayout } = require("./utils/keyboardLayout");
const { cleanTemplateText } = require("./utils/textCleaner");
const { translateText } = require("./utils/translator");
const { expandTextWithGPT } = require("./utils/gptExpander"); // Import the GPT expander utility

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true, // Recommended for security
      nodeIntegration: false // Recommended for security
    }
  });

  mainWindow.loadFile("index.html");

  // Open the DevTools (optional)
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  // Set up IPC listener for keyboard layout correction
  ipcMain.handle("correct-layout", async (event, text) => {
    try {
      const correctedText = correctLayout(text);
      return correctedText;
    } catch (error) {
      console.error("Error correcting layout:", error);
      return { error: error.message || "Layout correction failed." };
    }
  });

  // Set up IPC listener for template text cleaning
  ipcMain.handle("clean-template", async (event, text) => {
    try {
      const cleanedText = cleanTemplateText(text);
      return cleanedText;
    } catch (error) {
      console.error("Error cleaning template text:", error);
      return { error: error.message || "Template cleaning failed." };
    }
  });

  // Set up IPC listener for translation
  ipcMain.handle("translate-text", async (event, text, sourceLang, targetLang) => {
    try {
      const translatedText = await translateText(text, sourceLang, targetLang);
      return translatedText;
    } catch (error) {
      console.error("Error translating text:", error);
      return { error: error.message || "Translation failed." };
    }
  });

  // Set up IPC listener for text expansion with GPT
  ipcMain.handle("expand-text", async (event, text, apiKey) => {
    try {
      const expandedText = await expandTextWithGPT(text, apiKey);
      return expandedText;
    } catch (error) {
      console.error("Error expanding text with GPT:", error);
      // Return specific error messages caught in the utility
      return { error: error.message || "Text expansion failed." };
    }
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

