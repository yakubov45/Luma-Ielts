import fs from "fs";
import path from "path";

const dir = path.resolve(process.cwd(), "reading passage");

const PASSAGE_1_FILES = [
  { file: "12. The history of tea.html", id: "rd-p1-history-of-tea", title: "The History of Tea", tags: ["history", "culture", "trade"] },
  { file: "Bondi.html", id: "rd-p1-bondi", title: "Bondi Beach & Coastal Culture", tags: ["australia", "tourism", "coastal"] },
  { file: "Book review Triumph of the City.html", id: "rd-p1-triumph-of-city", title: "Book Review: Triumph of the City", tags: ["urbanism", "economics", "cities"] },
  { file: "Caral.html", id: "rd-p1-caral", title: "Caral: An Ancient South American City", tags: ["archaeology", "history", "civilization"] },
  { file: "Gobekli Tepe.html", id: "rd-p1-gobekli-tepe", title: "Gobekli Tepe: A Remarkable Discovery", tags: ["archaeology", "ancient", "history"] },
  { file: "Katherine Mansfield..html", id: "rd-p1-katherine-mansfield", title: "Katherine Mansfield: Life & Literature", tags: ["biography", "literature", "arts"] },
  { file: "Research in Antarctica.html", id: "rd-p1-research-antarctica", title: "Scientific Research & Exploration in Antarctica", tags: ["antarctica", "science", "exploration"] },
  { file: "The development of the silk industry.html", id: "rd-p1-silk-industry", title: "The Development of the Silk Industry", tags: ["history", "industry", "agriculture"] },
  { file: "What Lucy taught us.html", id: "rd-p1-what-lucy-taught-us", title: "What Lucy Taught Us: Human Evolution", tags: ["anthropology", "evolution", "paleontology"] },
  { file: "Why good ideas fail.html", id: "rd-p1-why-good-ideas-fail", title: "Why Good Ideas Fail: Innovation & Markets", tags: ["business", "innovation", "psychology"] },
];

const PASSAGE_2_FILES = [
  { file: "AUSTRALIAN ABORIGINAL ASTRONOMY - Passage 2.html", id: "rd-p2-aboriginal-astronomy", title: "Australian Aboriginal Astronomy", tags: ["astronomy", "indigenous", "culture"] },
  { file: "Coral Reefs.html", id: "rd-p2-coral-reefs", title: "Coral Reefs: Ecology & Conservation", tags: ["marine", "biology", "environment"] },
  { file: "How to be Happy.html", id: "rd-p2-how-to-be-happy", title: "The Science of Happiness", tags: ["psychology", "wellbeing", "health"] },
  { file: "MammalWeb.html", id: "rd-p2-mammalweb", title: "MammalWeb: Urban Wildlife Monitoring", tags: ["wildlife", "technology", "zoology"] },
  { file: "Saturn Spectacular.html", id: "rd-p2-saturn-spectacular", title: "Saturn Spectacular: Cassini Mission", tags: ["space", "astronomy", "exploration"] },
  { file: "Should space be explored by robots or by humans.html", id: "rd-p2-space-robots-or-humans", title: "Robots vs Humans in Space Exploration", tags: ["space", "robotics", "technology"] },
  { file: "Skyscraper Farming - Passage 2.html", id: "rd-p2-skyscraper-farming", title: "Skyscraper Farming: Vertical Agriculture", tags: ["agriculture", "architecture", "sustainability"] },
  { file: "STRESS LESS.html", id: "rd-p2-stress-less", title: "Stress Less: Neurobiology of Stress", tags: ["neuroscience", "health", "psychology"] },
  { file: "The discovery of a baby mammoth - Passage 2.html", id: "rd-p2-baby-mammoth", title: "The Discovery of a Baby Mammoth", tags: ["paleontology", "ice_age", "biology"] },
  { file: "The Tasmanian Tiger - Passage 2.html", id: "rd-p2-tasmanian-tiger", title: "The Tasmanian Tiger & De-extinction", tags: ["zoology", "extinction", "genetics"] },
];

const PASSAGE_3_FILES = [
  { file: "5. The lost animals of Australia.html", id: "rd-p3-lost-animals-australia", title: "The Lost Megafauna of Australia", tags: ["paleontology", "megafauna", "australia"] },
  { file: "Asian space return of an Asian invention.html", id: "rd-p3-asian-space", title: "Asian Space: Return of an Asian Invention", tags: ["space", "history", "technology"] },
  { file: "BUSINESS INNOVATION.html", id: "rd-p3-business-innovation", title: "Business Innovation in the 21st Century", tags: ["business", "management", "innovation"] },
  { file: "Sea Change for Salinity.html", id: "rd-p3-sea-change-salinity", title: "Sea Change for Salinity", tags: ["agriculture", "ecology", "environment"] },
  { file: "The art of deception.html", id: "rd-p3-art-of-deception", title: "The Art of Deception: Nature's Mimicry", tags: ["biology", "zoology", "evolution"] },
  { file: "The value of research into mite harvestmen.html", id: "rd-p3-mite-harvestmen", title: "Biogeographical Value of Mite Harvestmen", tags: ["entomology", "evolution", "geology"] },
  { file: "Unlocking the mystery of dreams.html", id: "rd-p3-mystery-of-dreams", title: "Unlocking the Mystery of Dreams", tags: ["neuroscience", "sleep", "psychology"] },
  { file: "Whale Culture.html", id: "rd-p3-whale-culture", title: "Whale Culture: Cetacean Social Learning", tags: ["marine", "zoology", "culture"] },
  { file: "What makes a musical expert.html", id: "rd-p3-musical-expert", title: "What Makes a Musical Expert: Talent vs Practice", tags: ["music", "psychology", "neuroscience"] },
  { file: "What should companies do to survive.html", id: "rd-p3-companies-survive", title: "Corporate Adaptability & Survival", tags: ["business", "economics", "strategy"] },
];

function extractPassageText(html) {
  const paneMatch = html.match(/<div class="passage-pane"[^>]*>([\s\S]*?)<\/div>\s*<div class="divider"/i) ||
                    html.match(/<div class="passage-pane"[^>]*>([\s\S]*?)<\/div>/i);
  const paneHtml = paneMatch ? paneMatch[1] : html;

  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  const paragraphs = [];
  let m;
  let idx = 1;
  while ((m = pRegex.exec(paneHtml)) !== null) {
    const rawText = m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (rawText.length > 20) {
      paragraphs.push({ id: `p${idx++}`, text: rawText });
    }
  }

  if (paragraphs.length === 0) {
    const cleanAll = paneHtml.replace(/<[^>]+>/g, "\n").split("\n").map(s => s.trim()).filter(s => s.length > 30);
    cleanAll.forEach((t, i) => paragraphs.push({ id: `p${i + 1}`, text: t }));
  }

  return paragraphs;
}

function extractAnswers(html) {
  const answerDataMatch = html.match(/const\s+answerData\s*=\s*\{([\s\S]*?)\};/);
  const answersMatch = html.match(/const\s+answers\s*=\s*\{([\s\S]*?)\};/);

  const answers = {};

  if (answerDataMatch) {
    const entryRegex = /(\d+)\s*:\s*\{\s*ans\s*:\s*['"]([^'"]+)['"](?:\s*,\s*exp\s*:\s*['"]([\s\S]*?)['"])?/gi;
    let em;
    while ((em = entryRegex.exec(answerDataMatch[1])) !== null) {
      const qNum = parseInt(em[1], 10);
      const ans = em[2].trim();
      const exp = em[3] ? em[3].trim() : "";
      answers[qNum] = { accepted: ans.split("|").map(s => s.trim().toLowerCase()), explanation: exp };
    }
  } else if (answersMatch) {
    const entryRegex = /(\d+)\s*:\s*['"]([^'"]+)['"]/gi;
    let em;
    while ((em = entryRegex.exec(answersMatch[1])) !== null) {
      const qNum = parseInt(em[1], 10);
      const ans = em[2].trim();
      answers[qNum] = { accepted: ans.split("|").map(s => s.trim().toLowerCase()), explanation: "" };
    }
  }

  return answers;
}

function extractQuestions(html, answers) {
  // Extract question pane
  const qPaneMatch = html.match(/<div class="question-pane"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<div class="footer-bar"/i) ||
                     html.match(/<div class="question-pane"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);
  const qPaneHtml = qPaneMatch ? qPaneMatch[1] : html;

  const questions = [];
  const qNums = Object.keys(answers).map(Number).sort((a, b) => a - b);

  // Split into instruction blocks or find questions by ID
  for (const qNum of qNums) {
    const ansInfo = answers[qNum] || { accepted: [], explanation: "" };
    
    // Look for question container: id="q{qNum}-container" or id="q{qNum}-div" or id="q{qNum}" or name="q{qNum}"
    const qContainerRegex = new RegExp(
      `<(?:li|div|tr)[^>]*id=["']q${qNum}[^"']*["'][^>]*>([\\s\\S]*?)<\\/(?:li|div|tr)>`,
      "i"
    );
    let containerMatch = qPaneHtml.match(qContainerRegex);

    // If not matched, look for <span class="q-num-box">${qNum}</span> or similar
    if (!containerMatch) {
      const spanRegex = new RegExp(
        `<(?:li|div|tr|p)[^>]*>[\\s\\S]*?<span[^>]*class=["'][^"']*q-num[^"']*["'][^>]*>\\s*${qNum}\\s*<\\/span>([\\s\\S]*?)<\\/(?:li|div|tr|p)>`,
        "i"
      );
      containerMatch = qPaneHtml.match(spanRegex);
    }

    let qHtml = containerMatch ? containerMatch[0] : "";

    // Determine question type & options
    const hasRadio = qHtml.includes(`name="q${qNum}"`) || qHtml.includes(`name='q${qNum}'`);
    const isTFNG =
      qHtml.toUpperCase().includes("TRUE") ||
      qHtml.toUpperCase().includes("FALSE") ||
      qHtml.toUpperCase().includes("YES") ||
      qHtml.toUpperCase().includes("NO") ||
      (ansInfo.accepted.some(a => ["true", "false", "not given", "yes", "no"].includes(a)));

    let type = "sentenceCompletion";
    let options = undefined;

    if (isTFNG) {
      type = "trueFalseNotGiven";
      options = [
        { id: "true", text: "TRUE" },
        { id: "false", text: "FALSE" },
        { id: "not_given", text: "NOT GIVEN" },
      ];
    } else if (hasRadio) {
      type = "singleChoice";
      // Extract radio labels
      const labelRegex = /<label[^>]*>\s*<input[^>]*value=["']([^"']+)["'][^>]*>([\s\S]*?)<\/label>/gi;
      const extractedOpts = [];
      let lm;
      while ((lm = labelRegex.exec(qHtml)) !== null) {
        const val = lm[1].trim();
        const text = lm[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
        extractedOpts.push({ id: val.toLowerCase(), text: text || val });
      }
      if (extractedOpts.length > 0) {
        options = extractedOpts;
      }
    }

    // Clean prompt text
    let promptText = qHtml
      .replace(/<span[^>]*class=["'][^"']*q-num[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, "")
      .replace(/<input[^>]*class=["'][^"']*gap-input[^"']*["'][^>]*>/gi, " _____ ")
      .replace(/<input[^>]*type=["']text["'][^>]*>/gi, " _____ ")
      .replace(/<div class="mcq-options"[\s\S]*?<\/div>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!promptText || promptText.length < 3) {
      promptText = `Question ${qNum}`;
    }

    // Determine instructions
    let instructions = "Answer the question based on the passage.";
    if (type === "trueFalseNotGiven") {
      instructions = "Choose TRUE, FALSE, or NOT GIVEN based on the passage.";
    } else if (type === "singleChoice") {
      instructions = "Choose the correct letter (A, B, C, or D).";
    } else {
      instructions = "Complete the gap with words from the passage.";
    }

    questions.push({
      id: `q${qNum}`,
      type,
      prompt: promptText,
      instructions,
      options,
      accepted: ansInfo.accepted,
      explanation: ansInfo.explanation || `The correct answer is ${ansInfo.accepted.join(" or ")}.`,
      evidence: ansInfo.explanation || "",
    });
  }

  return questions;
}

console.log("Testing full parsing (Passage + Questions + Answers) across all 30 tests...");
let totalValid = 0;
let totalQuestionsCount = 0;

for (const group of [PASSAGE_1_FILES, PASSAGE_2_FILES, PASSAGE_3_FILES]) {
  for (const item of group) {
    const fullPath = path.join(dir, item.file);
    const html = fs.readFileSync(fullPath, "utf-8");
    const paras = extractPassageText(html);
    const ans = extractAnswers(html);
    const questions = extractQuestions(html, ans);

    console.log(`[${item.id}] ${item.title}: ${paras.length} paras, ${questions.length} questions`);
    totalQuestionsCount += questions.length;
    if (paras.length > 0 && questions.length >= 10) totalValid++;
  }
}

console.log(`\n======================================================`);
console.log(`Total valid tests: ${totalValid}/30`);
console.log(`Total questions parsed: ${totalQuestionsCount}`);
console.log(`======================================================`);

