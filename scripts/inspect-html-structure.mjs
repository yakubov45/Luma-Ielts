import fs from "fs";
import path from "path";

const dir = path.resolve(process.cwd(), "reading passage");
const sampleFiles = [
  "12. The history of tea.html",
  "Bondi.html",
  "Coral Reefs.html",
  "Skyscraper Farming - Passage 2.html",
  "5. The lost animals of Australia.html",
  "Whale Culture.html",
];

for (const file of sampleFiles) {
  const content = fs.readFileSync(path.join(dir, file), "utf-8");
  console.log(`\n=================== ${file} ===================`);

  // Check passage paragraphs
  const pMatches = content.match(/<p>[\s\S]*?<\/p>/gi) || [];
  console.log(`Found ${pMatches.length} <p> tags`);

  // Check instruction boxes
  const instrMatches = content.match(/<div class="instruction-box"[\s\S]*?<\/div>/gi) || [];
  console.log(`Found ${instrMatches.length} instruction boxes:`);
  instrMatches.forEach((ib) => {
    const clean = ib.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    console.log(`  - ${clean.slice(0, 80)}...`);
  });

  // Check question elements
  const inputMatches = content.match(/<input[^>]+>/gi) || [];
  const radioMatches = content.match(/type="radio"/gi) || [];
  const textMatches = content.match(/type="text"|class="gap-input"/gi) || [];
  const selectMatches = content.match(/<select[\s\S]*?<\/select>/gi) || [];

  console.log(`Inputs: total=${inputMatches.length}, radios=${radioMatches.length}, textInputs=${textMatches.length}, selects=${selectMatches.length}`);

  // Check answers
  const answerDataMatch = content.match(/const\s+answerData\s*=\s*\{([\s\S]*?)\};/);
  const answersMatch = content.match(/const\s+answers\s*=\s*\{([\s\S]*?)\};/);
  if (answerDataMatch) {
    console.log(`answerData found with size: ${answerDataMatch[1].length} chars`);
  } else if (answersMatch) {
    console.log(`answers found with size: ${answersMatch[1].length} chars`);
  } else {
    console.log(`NO answer variable found directly!`);
  }
}
