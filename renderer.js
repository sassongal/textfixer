// This file will handle interactions with the UI (index.html)

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Renderer script loaded.");

    // Get references to UI elements
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");
    const correctLayoutBtn = document.getElementById("correctLayoutBtn");
    const cleanTemplateBtn = document.getElementById("cleanTemplateBtn");
    const translateFrom = document.getElementById("translateFrom");
    const translateTo = document.getElementById("translateTo");
    const translateBtn = document.getElementById("translateBtn");
    const expandTextBtn = document.getElementById("expandTextBtn");
    const apiKeyInput = document.getElementById("apiKey");

    // Add event listeners for buttons
    correctLayoutBtn.addEventListener("click", async () => {
        console.log("Correct Layout button clicked");
        const textToCorrect = inputText.value;
        if (!textToCorrect) {
            outputText.value = "Input text is empty.";
            return;
        }
        try {
            outputText.value = "Correcting layout..."; // Provide feedback
            const result = await window.electronAPI.correctLayout(textToCorrect);
            if (result && result.error) {
                 outputText.value = `Layout Correction Error: ${result.error}`;
            } else if (result !== null) {
                outputText.value = result;
            } else {
                outputText.value = "Error during layout correction (unknown).";
            }
        } catch (error) {
            console.error("Error calling correctLayout:", error);
            outputText.value = `Error: ${error.message}`;
        }
    });

    cleanTemplateBtn.addEventListener("click", async () => {
        console.log("Clean Template button clicked");
        const textToClean = inputText.value;
        if (!textToClean) {
            outputText.value = "Input text is empty.";
            return;
        }
        try {
            outputText.value = "Cleaning text..."; // Provide feedback
            const result = await window.electronAPI.cleanTemplate(textToClean);
             if (result && result.error) {
                 outputText.value = `Template Cleaning Error: ${result.error}`;
            } else if (result !== null) {
                outputText.value = result;
            } else {
                outputText.value = "Error during template cleaning (unknown).";
            }
        } catch (error) {
            console.error("Error calling cleanTemplate:", error);
            outputText.value = `Error: ${error.message}`;
        }
    });

    translateBtn.addEventListener("click", async () => {
        console.log("Translate button clicked");
        const fromLang = translateFrom.value;
        const toLang = translateTo.value;
        const textToTranslate = inputText.value;

        if (!textToTranslate) {
            outputText.value = "Input text is empty.";
            return;
        }
        if (fromLang === toLang) {
            outputText.value = "Source and target languages are the same.";
            return;
        }

        try {
            outputText.value = `Translating from ${fromLang} to ${toLang}...`; // Provide feedback
            const result = await window.electronAPI.translateText(textToTranslate, fromLang, toLang);
            if (result && result.error) {
                outputText.value = `Translation Error: ${result.error}`;
            } else if (result !== null) {
                outputText.value = result;
            } else {
                outputText.value = "Error during translation (unknown).";
            }
        } catch (error) {
            console.error("Error calling translateText:", error);
            outputText.value = `Translation Error: ${error.message}`;
        }
    });

    expandTextBtn.addEventListener("click", async () => {
        console.log("Expand Text button clicked");
        const textToExpand = inputText.value;
        const apiKey = apiKeyInput.value;

        if (!textToExpand) {
            outputText.value = "Input text is empty.";
            return;
        }
        if (!apiKey) {
            alert("Please enter your OpenAI API Key in the settings section.");
            outputText.value = "OpenAI API Key is missing.";
            return;
        }

        try {
            outputText.value = "Expanding text with OpenAI..."; // Provide feedback
            const result = await window.electronAPI.expandText(textToExpand, apiKey);
            if (result && result.error) {
                // Display specific errors from the main process
                outputText.value = `Text Expansion Error: ${result.error}`;
            } else if (result !== null) {
                outputText.value = result;
            } else {
                outputText.value = "Error during text expansion (unknown).";
            }
        } catch (error) {
            console.error("Error calling expandText:", error);
            outputText.value = `Text Expansion Error: ${error.message}`;
        }
    });
});

