const translate = require('@iamtraction/google-translate');

function normalizeLang(lang) {
    if (lang.toLowerCase() === "he") return "iw"; // old Google code for Hebrew
    return lang.toLowerCase();
}

async function translateText(text, sourceLang, targetLang) {
    if (!text) return "";

    try {
        const res = await translate(text, {
            from: normalizeLang(sourceLang),
            to: normalizeLang(targetLang)
        });

        return res.text;
    } catch (error) {
        console.error("Google Translate Error:", error);
        throw new Error("Translation failed");
    }
}

module.exports = { translateText };
