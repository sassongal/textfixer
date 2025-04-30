const fetch = require("node-fetch");

const LIBRETRANSLATE_API_URL = "https://libretranslate.com/translate"; // Using the public instance

async function translateText(text, sourceLang, targetLang) {
    if (!text) {
        return "";
    }

    try {
        const response = await fetch(LIBRETRANSLATE_API_URL, {
            method: "POST",
            body: JSON.stringify({
                q: text,
                source: sourceLang,
                target: targetLang,
                format: "text"
            }),
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error(`LibreTranslate API error: ${response.status} - ${errorData}`);
            throw new Error(`Translation failed with status: ${response.status}`);
        }

        const data = await response.json();
        return data.translatedText;
    } catch (error) {
        console.error("Error calling LibreTranslate API:", error);
        throw error; // Re-throw the error to be caught by the IPC handler
    }
}

module.exports = { translateText };

