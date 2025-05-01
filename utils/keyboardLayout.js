// utils/keyboardLayout.js

// מיפוי בין מקשים בפריסת מקלדת אנגלית לפריסת עברית רגילה (US -> IL)
const enToHeMap = {
    a: "ש", b: "נ", c: "ב", d: "ג", e: "ק", f: "כ", g: "ע",
    h: "י", i: "ן", j: "ח", k: "ל", l: "ך", m: "צ", n: "מ",
    o: "ם", p: "פ", q: "/", r: "ר", s: "ד", t: "א", u: "ו",
    v: "ה", w: "'", x: "ס", y: "ט", z: "ז", "'": ",", ",": "ת",
    ".": "ץ", ";": "ף", "[": "]", "]": "[", "\\": "\\", "`": ";",
    "/": ".", "-": "-", "=": "=",
    A: "ש", B: "נ", C: "ב", D: "ג", E: "ק", F: "כ", G: "ע",
    H: "י", I: "ן", J: "ח", K: "ל", L: "ך", M: "צ", N: "מ",
    O: "ם", P: "פ", Q: "/", R: "ר", S: "ד", T: "א", U: "ו",
    V: "ה", W: "'", X: "ס", Y: "ט", Z: "ז"
  };
  
  // יצירת המיפוי ההפוך: עברית → אנגלית
  const heToEnMap = {};
  Object.entries(enToHeMap).forEach(([en, he]) => {
    heToEnMap[he] = en;
  });
  
  // פונקציה לזיהוי אם הטקסט הוא בעיקר בעברית (מבוסס על Unicode)
  function isMostlyHebrew(text) {
    const hebrewCharRegex = /[\u0590-\u05FF]/;
    const hebrewCount = [...text].filter(c => hebrewCharRegex.test(c)).length;
    return hebrewCount > text.length / 2;
  }
  
  // הפונקציה הראשית שמתקנת את הטקסט
  function correctLayout(text) {
    const map = isMostlyHebrew(text) ? heToEnMap : enToHeMap;
    return [...text].map(char => map[char] || char).join('');
  }
  
  module.exports = { correctLayout };
  