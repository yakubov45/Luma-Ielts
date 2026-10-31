import fs from "fs";
import path from "path";

const dir = path.resolve(process.cwd(), "reading passage");

const ALL_FILES = [
  // Passage 1
  "12. The history of tea.html",
  "Bondi.html",
  "Book review Triumph of the City.html",
  "Caral.html",
  "Gobekli Tepe.html",
  "Katherine Mansfield..html",
  "Research in Antarctica.html",
  "The development of the silk industry.html",
  "What Lucy taught us.html",
  "Why good ideas fail.html",
  // Passage 2
  "AUSTRALIAN ABORIGINAL ASTRONOMY - Passage 2.html",
  "Coral Reefs.html",
  "How to be Happy.html",
  "MammalWeb.html",
  "Saturn Spectacular.html",
  "Should space be explored by robots or by humans.html",
  "Skyscraper Farming - Passage 2.html",
  "STRESS LESS.html",
  "The discovery of a baby mammoth - Passage 2.html",
  "The Tasmanian Tiger - Passage 2.html",
  // Passage 3
  "5. The lost animals of Australia.html",
  "Asian space return of an Asian invention.html",
  "BUSINESS INNOVATION.html",
  "Sea Change for Salinity.html",
  "The art of deception.html",
  "The value of research into mite harvestmen.html",
  "Unlocking the mystery of dreams.html",
  "Whale Culture.html",
  "What makes a musical expert.html",
  "What should companies do to survive.html",
];

function checkQuestionsPrompt(html) {
  const issues = [];
  // Find all answer numbers
  const answerDataMatch = html.match(/const\s+answerData\s*=\s*\{([\s\S]*?)\};/);
  const answersMatch = html.match(/const\s+answers\s*=\s*\{([\s\S]*?)\};/);
  
  let qNums = [];
  if (answerDataMatch) {
    const m = answerDataMatch[1].match(/\b\d+\s*:\s*\{/g) || [];
    qNums = m.map(s => parseInt(s.match(/\d+/)[0], 10));
  } else if (answersMatch) {
    const m = answersMatch[1].match(/\b\d+\s*:\s*['"]/g) || [];
    qNums = m.map(s => parseInt(s.match(/\d+/)[0], 10));
  }

  return qNums;
}

console.log("Checking question numbers across all 30 files:");
for (const file of ALL_FILES) {
  const html = fs.readFileSync(path.join(dir, file), "utf-8");
  const qNums = checkQuestionsPrompt(html);
  const min = Math.min(...qNums);
  const max = Math.max(...qNums);
  console.log(`${file}: ${qNums.length} questions (Q${min}–Q${max})`);
}
