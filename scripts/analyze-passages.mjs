import fs from "fs";
import path from "path";

const dir = path.resolve(process.cwd(), "reading passage");
const files = fs.readdirSync(dir);
const results = [];

for (const file of files) {
  if (!file.endsWith(".html")) continue;
  const content = fs.readFileSync(path.join(dir, file), "utf-8");

  // Title
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  let title = titleMatch ? titleMatch[1].replace("IELTS Reading Simulator - ", "").trim() : file;
  title = title.replace(/\s+/g, " ");

  // Heading inside passage pane
  const h2Match = content.match(/<div class="passage-pane"[^>]*>\s*<h2>([^<]+)<\/h2>/i) ||
                  content.match(/<h2>([^<]+)<\/h2>/i);
  const heading = h2Match ? h2Match[1].trim() : "";

  // Passage number
  let passageNum = null;
  const bannerMatch = content.match(/Reading Passage\s*(\d)/i);
  if (bannerMatch) {
    passageNum = parseInt(bannerMatch[1], 10);
  } else {
    const fileMatch = file.match(/Passage\s*(\d)/i);
    if (fileMatch) passageNum = parseInt(fileMatch[1], 10);
  }

  // Answer data (either answerData or answers)
  let answerCount = 0;
  let answerKeys = {};
  const answerDataMatch = content.match(/const\s+answerData\s*=\s*\{([\s\S]*?)\};/);
  const answersMatch = content.match(/const\s+answers\s*=\s*\{([\s\S]*?)\};/);

  if (answerDataMatch) {
    const ansMatches = answerDataMatch[1].match(/\b\d+\s*:\s*\{/g);
    answerCount = ansMatches ? ansMatches.length : 0;
  } else if (answersMatch) {
    const ansMatches = answersMatch[1].match(/\b\d+\s*:\s*['"][^'"]+['"]/g);
    answerCount = ansMatches ? ansMatches.length : 0;
  }

  results.push({
    file,
    title,
    heading,
    passageNum,
    answerCount,
    hasAnswerData: !!answerDataMatch,
    hasAnswers: !!answersMatch,
    size: content.length,
  });
}

// Group by passageNum
const p1 = results.filter((r) => r.passageNum === 1);
const p2 = results.filter((r) => r.passageNum === 2);
const p3 = results.filter((r) => r.passageNum === 3);
const unknown = results.filter((r) => !r.passageNum);

console.log(`\n=== PASSAGE 1 (${p1.length} ta) ===`);
p1.forEach((r, i) => console.log(`${i + 1}. [${r.file}] "${r.heading || r.title}" -> ${r.answerCount} savol/javob`));

console.log(`\n=== PASSAGE 2 (${p2.length} ta) ===`);
p2.forEach((r, i) => console.log(`${i + 1}. [${r.file}] "${r.heading || r.title}" -> ${r.answerCount} savol/javob`));

console.log(`\n=== PASSAGE 3 (${p3.length} ta) ===`);
p3.forEach((r, i) => console.log(`${i + 1}. [${r.file}] "${r.heading || r.title}" -> ${r.answerCount} savol/javob`));

if (unknown.length > 0) {
  console.log(`\n=== UNKNOWN / DUPLICATE (${unknown.length} ta) ===`);
  unknown.forEach((r, i) => console.log(`${i + 1}. [${r.file}] "${r.heading || r.title}" -> ${r.answerCount} savol/javob`));
}

