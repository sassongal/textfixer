function cleanTemplateText(text) {
    let cleanedText = text;

    // Remove common LLM prompt indicators at the start of lines
    cleanedText = cleanedText.replace(/^\s*(User:|Assistant:|Prompt:|Human:|AI:|>|#)\s*/gm, "");

    // Remove code block fences (``` ... ```)
    // This is a simple approach; might remove content if fences are nested or unbalanced
    cleanedText = cleanedText.replace(/```[\s\S]*?```/g, "");

    // Remove common single-line code comments (basic)
    cleanedText = cleanedText.replace(/^\s*(\/\/|#|--|;).*$/gm, "");

    // Remove common multi-line comment markers (very basic, might leave content)
    cleanedText = cleanedText.replace(/\/\*|\*\//g, "");

    // Remove leading/trailing whitespace from each line
    cleanedText = cleanedText.split("\n").map(line => line.trim()).join("\n");

    // Remove excessive blank lines (more than 2 consecutive)
    cleanedText = cleanedText.replace(/\n{3,}/g, "\n\n");

    // Trim overall leading/trailing whitespace
    cleanedText = cleanedText.trim();

    return cleanedText;
}

module.exports = { cleanTemplateText };

