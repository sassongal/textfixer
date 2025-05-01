document.addEventListener("DOMContentLoaded", async () => {
  console.log("Renderer loaded.");

  const inputText = document.getElementById("inputText");
  const outputText = document.getElementById("outputText");
  const correctLayoutBtn = document.getElementById("correctLayoutBtn");
  const cleanTemplateBtn = document.getElementById("cleanTemplateBtn");
  const translateFrom = document.getElementById("translateFrom");
  const translateTo = document.getElementById("translateTo");
  const translateBtn = document.getElementById("translateBtn");
  const expandTextBtn = document.getElementById("expandTextBtn");
  const apiKeyInput = document.getElementById("apiKey");

  correctLayoutBtn.addEventListener("click", async () => {
    const text = inputText.value;
    if (!text) return (outputText.value = "Input is empty");
    outputText.value = "Fixing layout...";
    const result = await window.electronAPI.correctLayout(text);
    outputText.value = result?.error || result;
  });

  cleanTemplateBtn.addEventListener("click", async () => {
    const text = inputText.value;
    if (!text) return (outputText.value = "Input is empty");
    outputText.value = "Cleaning template...";
    const result = await window.electronAPI.cleanTemplate(text);
    outputText.value = result?.error || result;
  });

  translateBtn.addEventListener("click", async () => {
    const from = translateFrom.value;
    const to = translateTo.value;
    const text = inputText.value;
    if (!text) return (outputText.value = "Input is empty");
    if (from === to) return (outputText.value = "Languages are the same");
    outputText.value = `Translating from ${from} to ${to}...`;
    const result = await window.electronAPI.translateText(text, from, to);
    outputText.value = result?.error || result;
  });

  expandTextBtn.addEventListener("click", async () => {
    const text = inputText.value;
    const apiKey = apiKeyInput.value;
    if (!text) return (outputText.value = "Input is empty");
    if (!apiKey) return (outputText.value = "Missing OpenAI API key");
    outputText.value = "Expanding text...";
    const result = await window.electronAPI.expandText(text, apiKey);
    outputText.value = result?.error || result;
  });

  // Hotkey + autocorrect toggles
  document.getElementById("hotkeyToggle").addEventListener("change", (e) => {
    window.settingsAPI.toggleHotkey(e.target.checked);
  });

  document.getElementById("hotkeyInput").addEventListener("change", (e) => {
      window.settingsAPI.setHotkey(e.target.value.trim());
    });

    document.getElementById("autocorrectToggle").addEventListener("change", (e) => {
    window.settingsAPI.toggleAutocorrect(e.target.checked);
  });
});
