const { OpenAI } = require("openai");

async function expandTextWithGPT(text, apiKey, model = "gpt-3.5-turbo") {
    if (!text) {
        return "Input text is empty.";
    }
    if (!apiKey) {
        // This check should ideally happen in the renderer, but double-check here.
        throw new Error("OpenAI API Key is missing.");
    }

    const openai = new OpenAI({ apiKey });

    try {
        const completion = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: "system", content: "You are a helpful assistant. Expand the following user input into a more detailed and professional text. Focus on clarity and completeness." },
                { role: "user", content: text }
            ],
        });

        if (completion.choices && completion.choices.length > 0) {
            return completion.choices[0].message.content.trim();
        } else {
            throw new Error("No response received from OpenAI.");
        }
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        // Provide a more user-friendly error message if possible
        if (error.response) {
            console.error("OpenAI API Error Details:", error.response.data);
            throw new Error(`OpenAI API Error: ${error.response.status} - ${error.response.data.error.message}`);
        } else if (error.message.includes("Incorrect API key")) {
             throw new Error("Invalid OpenAI API Key provided.");
        }
        throw error; // Re-throw other errors
    }
}

module.exports = { expandTextWithGPT };

