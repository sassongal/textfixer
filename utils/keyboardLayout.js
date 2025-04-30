const enLayout = "`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./";
const heLayout = "~1234567890-=/\][poiuytrewq\\;lkjhgfdsa\'.,mnbvcxz";

const enToHeMap = {};
const heToEnMap = {};

for (let i = 0; i < enLayout.length; i++) {
    enToHeMap[enLayout[i]] = heLayout[i];
    heToEnMap[heLayout[i]] = enLayout[i];
}

// Add shifted characters (basic example, might need refinement)
const enShiftLayout = "~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?";
const heShiftLayout = "`!@#$%^&*()_+QWERTYUIOP}{:\"LKJHGFDSA|><MNBVCXZ";

for (let i = 0; i < enShiftLayout.length; i++) {
    enToHeMap[enShiftLayout[i]] = heShiftLayout[i];
    heToEnMap[heShiftLayout[i]] = enShiftLayout[i];
}

function isMostlyHebrew(text) {
    let hebrewChars = 0;
    for (let i = 0; i < text.length; i++) {
        if (heLayout.includes(text[i]) || heShiftLayout.includes(text[i])) {
            hebrewChars++;
        }
    }
    // Simple heuristic: if more than half the chars are Hebrew layout keys
    return hebrewChars > text.length / 2;
}

function correctLayout(text) {
    let correctedText = "";
    const targetMap = isMostlyHebrew(text) ? heToEnMap : enToHeMap;

    for (let i = 0; i < text.length; i++) {
        correctedText += targetMap[text[i]] || text[i]; // Keep original if no mapping found
    }
    return correctedText;
}

module.exports = { correctLayout };

