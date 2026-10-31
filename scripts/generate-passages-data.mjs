import fs from "fs";
import path from "path";

const dir = path.resolve(process.cwd(), "reading passage");

export const PASSAGE_1_SPECS = [
  { file: "12. The history of tea.html", id: "rd-p1-history-of-tea", title: "The History of Tea", topic: "History & Ancient Trade", tags: ["history", "culture", "trade"] },
  { file: "Bondi.html", id: "rd-p1-bondi", title: "Bondi Beach & Coastal Culture", topic: "Geography & Ocean Culture", tags: ["australia", "tourism", "coastal"] },
  { file: "Book review Triumph of the City.html", id: "rd-p1-triumph-of-city", title: "Book Review: Triumph of the City", topic: "Urbanism & Economics", tags: ["urbanism", "economics", "cities"] },
  { file: "Caral.html", id: "rd-p1-caral", title: "Caral: An Ancient South American City", topic: "Archaeology & Ancient Civilizations", tags: ["archaeology", "history", "civilization"] },
  { file: "Gobekli Tepe.html", id: "rd-p1-gobekli-tepe", title: "Gobekli Tepe: A Remarkable Discovery", topic: "Archaeology & Human Settlement", tags: ["archaeology", "ancient", "history"] },
  { file: "Katherine Mansfield..html", id: "rd-p1-katherine-mansfield", title: "Katherine Mansfield: Life & Literature", topic: "Literature & Modernist Biography", tags: ["biography", "literature", "arts"] },
  { file: "Research in Antarctica.html", id: "rd-p1-research-antarctica", title: "Scientific Research & Exploration in Antarctica", topic: "Polar Science & Climate History", tags: ["antarctica", "science", "exploration"] },
  { file: "The development of the silk industry.html", id: "rd-p1-silk-industry", title: "The Development of the Silk Industry", topic: "Agriculture, Trade & Technology", tags: ["history", "industry", "agriculture"] },
  { file: "What Lucy taught us.html", id: "rd-p1-what-lucy-taught-us", title: "What Lucy Taught Us: Human Evolution", topic: "Anthropology & Human Origins", tags: ["anthropology", "evolution", "paleontology"] },
  { file: "Why good ideas fail.html", id: "rd-p1-why-good-ideas-fail", title: "Why Good Ideas Fail: Innovation & Markets", topic: "Innovation & Market Psychology", tags: ["business", "innovation", "psychology"] },
];

export const PASSAGE_2_SPECS = [
  { file: "AUSTRALIAN ABORIGINAL ASTRONOMY - Passage 2.html", id: "rd-p2-aboriginal-astronomy", title: "Australian Aboriginal Astronomy", topic: "Indigenous Astronomy & Navigation", tags: ["astronomy", "indigenous", "culture"] },
  { file: "Coral Reefs.html", id: "rd-p2-coral-reefs", title: "Coral Reefs: Ecology & Conservation", topic: "Marine Ecosystems & Climate Change", tags: ["marine", "biology", "environment"] },
  { file: "How to be Happy.html", id: "rd-p2-how-to-be-happy", title: "The Science of Happiness", topic: "Positive Psychology & Brain Health", tags: ["psychology", "wellbeing", "health"] },
  { file: "MammalWeb.html", id: "rd-p2-mammalweb", title: "MammalWeb: Urban Wildlife Monitoring", topic: "Citizen Science & Camera Trapping", tags: ["wildlife", "technology", "zoology"] },
  { file: "Saturn Spectacular.html", id: "rd-p2-saturn-spectacular", title: "Saturn Spectacular: Cassini Mission", topic: "Planetary Science & Space Exploration", tags: ["space", "astronomy", "exploration"] },
  { file: "Should space be explored by robots or by humans.html", id: "rd-p2-space-robots-or-humans", title: "Robots vs Humans in Space Exploration", topic: "Aerospace Robotics & Human Spaceflight", tags: ["space", "robotics", "technology"] },
  { file: "Skyscraper Farming - Passage 2.html", id: "rd-p2-skyscraper-farming", title: "Skyscraper Farming: Vertical Agriculture", topic: "Urban Agriculture & Sustainable Design", tags: ["agriculture", "architecture", "sustainability"] },
  { file: "STRESS LESS.html", id: "rd-p2-stress-less", title: "Stress Less: Neurobiology of Stress", topic: "Neuroscience, Cortisol & Stress Management", tags: ["neuroscience", "health", "psychology"] },
  { file: "The discovery of a baby mammoth - Passage 2.html", id: "rd-p2-baby-mammoth", title: "The Discovery of a Baby Mammoth", topic: "Pleistocene Paleontology & Permafrost", tags: ["paleontology", "ice_age", "biology"] },
  { file: "The Tasmanian Tiger - Passage 2.html", id: "rd-p2-tasmanian-tiger", title: "The Tasmanian Tiger & De-extinction", topic: "Conservation Genetics & De-extinction", tags: ["zoology", "extinction", "genetics"] },
];

export const PASSAGE_3_SPECS = [
  { file: "5. The lost animals of Australia.html", id: "rd-p3-lost-animals-australia", title: "The Lost Megafauna of Australia", topic: "Quaternary Extinctions & Australia Megafauna", tags: ["paleontology", "megafauna", "australia"] },
  { file: "Asian space return of an Asian invention.html", id: "rd-p3-asian-space", title: "Asian Space: Return of an Asian Invention", topic: "Rocketry History & Asia's Space Odyssey", tags: ["space", "history", "technology"] },
  { file: "BUSINESS INNOVATION.html", id: "rd-p3-business-innovation", title: "Business Innovation in the 21st Century", topic: "Disruptive Innovation & Corporate Growth", tags: ["business", "management", "innovation"] },
  { file: "Sea Change for Salinity.html", id: "rd-p3-sea-change-salinity", title: "Sea Change for Salinity", topic: "Soil Degradation & Salt-tolerant Crops", tags: ["agriculture", "ecology", "environment"] },
  { file: "The art of deception.html", id: "rd-p3-art-of-deception", title: "The Art of Deception: Nature's Mimicry", topic: "Evolutionary Mimicry & Animal Camouflage", tags: ["biology", "zoology", "evolution"] },
  { file: "The value of research into mite harvestmen.html", id: "rd-p3-mite-harvestmen", title: "Biogeographical Value of Mite Harvestmen", topic: "Biogeography, Continental Drift & Arachnology", tags: ["entomology", "evolution", "geology"] },
  { file: "Unlocking the mystery of dreams.html", id: "rd-p3-mystery-of-dreams", title: "Unlocking the Mystery of Dreams", topic: "Cognitive Neuroscience & REM Sleep Function", tags: ["neuroscience", "sleep", "psychology"] },
  { file: "Whale Culture.html", id: "rd-p3-whale-culture", title: "Whale Culture: Cetacean Social Learning", topic: "Cetacean Behavioral Culture & Communication", tags: ["marine", "zoology", "culture"] },
  { file: "What makes a musical expert.html", id: "rd-p3-musical-expert", title: "What Makes a Musical Expert: Talent vs Practice", topic: "Cognitive Skill Acquisition & Neuroplasticity", tags: ["music", "psychology", "neuroscience"] },
  { file: "What should companies do to survive.html", id: "rd-p3-companies-survive", title: "Corporate Adaptability & Survival", topic: "Organizational Agility & Strategic Renewal", tags: ["business", "economics", "strategy"] },
];

function cleanHtmlText(s) {
  if (!s) return "";
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function parseParagraphs(html) {
  const paneMatch = html.match(/<div class="passage-pane"[^>]*>([\s\S]*?)<\/div>\s*<div class="divider"/i) ||
                    html.match(/<div class="passage-pane"[^>]*>([\s\S]*?)<\/div>/i);
  const pane = paneMatch ? paneMatch[1] : html;

  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  const paragraphs = [];
  let m;
  let idx = 1;
  while ((m = pRegex.exec(pane)) !== null) {
    const text = cleanHtmlText(m[1]);
    if (text.length > 25 && !text.toLowerCase().includes("reading passage") && !text.toLowerCase().includes("you should spend about 20 minutes")) {
      paragraphs.push({ id: `p${idx++}`, text });
    }
  }

  if (paragraphs.length === 0) {
    const rawLines = cleanHtmlText(pane).split("\n").map(s => s.trim()).filter(s => s.length > 35);
    rawLines.forEach((t, i) => paragraphs.push({ id: `p${i + 1}`, text: t }));
  }

  return paragraphs;
}

function parseAnswers(html) {
  const answerDataMatch = html.match(/const\s+answerData\s*=\s*(\{[\s\S]*?\});/);
  const answersMatch = html.match(/const\s+answers\s*=\s*(\{[\s\S]*?\});/);

  if (answerDataMatch) {
    try {
      const fn = new Function(`return ${answerDataMatch[1]};`);
      const raw = fn();
      const res = {};
      for (const [k, v] of Object.entries(raw)) {
        const qNum = parseInt(k, 10);
        const ans = (typeof v === "string" ? v : v.ans || "").trim();
        const exp = (typeof v === "object" && v.exp) ? cleanHtmlText(v.exp) : "";
        const accepted = ans.split("|").map(s => s.trim().toLowerCase());
        res[qNum] = { accepted, explanation: exp };
      }
      return res;
    } catch {
      // fallback regex
    }
  }

  if (answersMatch) {
    try {
      const fn = new Function(`return ${answersMatch[1]};`);
      const raw = fn();
      const res = {};
      for (const [k, v] of Object.entries(raw)) {
        const qNum = parseInt(k, 10);
        const ans = String(v).trim();
        const accepted = ans.split("|").map(s => s.trim().toLowerCase());
        res[qNum] = { accepted, explanation: "" };
      }
      return res;
    } catch {
      // fallback regex
    }
  }

  return {};
}

function cleanOptionText(text, optKey) {
  if (!text) return "";
  let clean = text.trim();
  if (optKey) {
    const prefixRegex = new RegExp(`^(?:\\(?${optKey}\\)?[\\s\\:\\.\\—\\-]+|${optKey}\\s+)`, "i");
    clean = clean.replace(prefixRegex, "").trim();
  }
  return clean;
}

function parseInstructionBanners(html) {
  const bannerRegex = /<div class="instruction-(?:box|banner)"[\s\S]*?<\/div>/gi;
  const banners = [];
  let m;
  while ((m = bannerRegex.exec(html)) !== null) {
    const text = cleanHtmlText(m[0]);
    // Skip general passage time guidance (e.g. "You should spend about 20 minutes...")
    if (/spend about 20 minutes/i.test(text) || /based on Reading Passage/i.test(text)) {
      continue;
    }
    const rangeMatch = text.match(/Questions?\s*(\d+)\s*[-–—]\s*(\d+)/i) || text.match(/Questions?\s*(\d+)/i);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : start;
      banners.push({ start, end, text });
    }
  }
  return banners;
}

function parseOptionsPool(html) {
  const pool = {};

  // 1) <li><strong>A</strong> ... </li>
  const liRegex = /<li[^>]*>\s*(?:<strong>)?\s*([A-I])\s*(?:<\/strong>)?\s*[:\.-]?\s*([\s\S]*?)<\/li>/gi;
  let m;
  while ((m = liRegex.exec(html)) !== null) {
    const letter = m[1].toUpperCase();
    const text = cleanHtmlText(m[2]);
    if (text.length > 2) {
      pool[letter] = cleanOptionText(text, letter);
    }
  }

  // 2) Draggable headings: <div class="draggable-heading" ... data-val="I"><span class="roman">i</span> text</div>
  const headRegex = /<div class="draggable-heading"[^>]*data-val=["']([^"']+)["'][^>]*>([\s\S]*?)<\/div>/gi;
  while ((m = headRegex.exec(html)) !== null) {
    const roman = m[1].toUpperCase();
    const text = cleanHtmlText(m[2]);
    if (text.length > 2) {
      pool[roman] = cleanOptionText(text, roman);
    }
  }

  return pool;
}

function parseQuestions(html, answers, banners, optionsPool) {
  const qNums = Object.keys(answers).map(Number).sort((a, b) => a - b);
  const questions = [];

  // Pre-parse matrix table rows strictly per <tr> so rows never bleed into each other
  const matrixTableRows = {};
  const trAllRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trm;
  while ((trm = trAllRegex.exec(html)) !== null) {
    const trContent = trm[1];
    const qNumMatch = trContent.match(/<td[^>]*class=["'][^"']*m-qnum[^"']*["'][^>]*>\s*(\d+)\s*<\/td>/i);
    if (qNumMatch) {
      const num = parseInt(qNumMatch[1], 10);
      const textMatch = trContent.match(/<td[^>]*class=["'][^"']*m-text[^"']*["'][^>]*>([\s\S]*?)<\/td>/i);
      const promptText = textMatch ? cleanHtmlText(textMatch[1]) : "";

      const radioVals = [];
      const valRegex = /value=["']([A-I]|(?:I|II|III|IV|V|VI|VII|VIII|IX|X))["']/gi;
      let vm;
      while ((vm = valRegex.exec(trContent)) !== null) {
        radioVals.push(vm[1].toUpperCase());
      }
      matrixTableRows[num] = { prompt: promptText, radioVals };
    }
  }

  for (const qNum of qNums) {
    const ansInfo = answers[qNum] || { accepted: [], explanation: "" };

    // Find banner instruction: prioritize narrower ranges
    let instructions = "";
    const matchingBanners = banners.filter(b => qNum >= b.start && qNum <= b.end);
    if (matchingBanners.length > 0) {
      matchingBanners.sort((a, b) => (a.end - a.start) - (b.end - b.start));
      instructions = matchingBanners[0].text;
    }

    let prompt = "";
    let options = undefined;
    let type = "sentenceCompletion";

    // 1) Matching matrix table row
    if (matrixTableRows[qNum]) {
      const row = matrixTableRows[qNum];
      prompt = row.prompt;
      type = "singleChoice";
      if (row.radioVals.length > 0) {
        options = row.radioVals.map(val => ({
          id: val.toLowerCase(),
          text: optionsPool[val] ? optionsPool[val] : val,
        }));
      }
    }

    // 2) Sliced question block by marker
    if (!prompt) {
      const qMarker = new RegExp(
        `(?:<!--\\s*Question\\s*${qNum}\\s*-->|<span[^>]*class=["'][^"']*(?:q-num|q-num-plain|q-num-box)[^"']*["'][^>]*>\\s*${qNum}\\s*<|<li[^>]*id=["']q${qNum}-container["']|id=["']q${qNum}["']|name=["']q${qNum}["'])`,
        "i"
      );
      const matchPos = html.search(qMarker);

      if (matchPos !== -1) {
        const nextQ = qNum + 1;
        const nextMarker = new RegExp(
          `(?:<!--\\s*Question\\s*${nextQ}\\s*-->|<span[^>]*class=["'][^"']*(?:q-num|q-num-plain|q-num-box)[^"']*["'][^>]*>\\s*${nextQ}\\s*<|<li[^>]*id=["']q${nextQ}-container["']|id=["']q${nextQ}["']|name=["']q${nextQ}["']|<div class=["']instruction)`,
          "i"
        );
        const subHtml = html.slice(matchPos);
        const nextMatch = subHtml.slice(25).search(nextMarker);
        const qBlock = nextMatch !== -1 ? subHtml.slice(0, nextMatch + 25) : subHtml.slice(0, 900);

        // Check if question has radio labels
        const labelRegex = /<label[^>]*>\s*<input[^>]*value=["']([^"']+)["'][^>]*>([\s\S]*?)<\/label>/gi;
        const extractedOpts = [];
        let lm;
        while ((lm = labelRegex.exec(qBlock)) !== null) {
          const val = lm[1].trim();
          const optText = cleanHtmlText(lm[2]);
          extractedOpts.push({
            id: val.toLowerCase(),
            text: cleanOptionText(optText || val, val),
          });
        }

        const isTF =
          qBlock.toUpperCase().includes("TRUE") ||
          qBlock.toUpperCase().includes("YES") ||
          ansInfo.accepted.some(a => ["true", "false", "not given", "yes", "no"].includes(a));

        if (isTF) {
          type = "trueFalseNotGiven";
          const isYesNo = qBlock.toUpperCase().includes("YES") || ansInfo.accepted.some(a => ["yes", "no"].includes(a));
          options = isYesNo
            ? [
                { id: "yes", text: "YES" },
                { id: "no", text: "NO" },
                { id: "not_given", text: "NOT GIVEN" },
              ]
            : [
                { id: "true", text: "TRUE" },
                { id: "false", text: "FALSE" },
                { id: "not_given", text: "NOT GIVEN" },
              ];
        } else if (extractedOpts.length > 0) {
          type = "singleChoice";
          options = extractedOpts;
        }

        // Clean prompt
        let pText = qBlock
          .replace(/<label[\s\S]*?<\/label>/gi, "")
          .replace(/<span[^>]*class=["'][^"']*q-num[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, "")
          .replace(/<input[^>]*class=["'][^"']*gap-input[^"']*["'][^>]*>/gi, " _____ ")
          .replace(/<input[^>]*type=["']text["'][^>]*>/gi, " _____ ")
          .replace(/<input[^>]+>/gi, "");
        
        prompt = cleanHtmlText(pText);
        // Clean leading question numbers e.g. "27." or "27 "
        prompt = prompt.replace(/^\d+[\.\)]?\s*/, "").trim();
      }
    }

    // 3) Heading questions without table (e.g. Paragraph A..F)
    if (Object.keys(optionsPool).some(k => ["I", "II", "III", "IV", "V"].includes(k)) && ansInfo.accepted.some(a => ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"].includes(a))) {
      type = "singleChoice";
      const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
      const pIdx = qNum - qNums[0];
      if (!prompt || prompt.length < 5) {
        prompt = `Paragraph ${letters[pIdx] || pIdx + 1}`;
      }
      options = Object.keys(optionsPool).map(k => ({
        id: k.toLowerCase(),
        text: optionsPool[k],
      }));
    }

    if (!prompt || prompt.length < 3) {
      prompt = `Question ${qNum}`;
    }

    if (!instructions || /spend about 20 minutes/i.test(instructions)) {
      if (type === "trueFalseNotGiven") {
        instructions = "Do the following statements agree with the information in the passage? Choose TRUE, FALSE, or NOT GIVEN.";
      } else if (type === "singleChoice") {
        instructions = "Choose the correct letter, A, B, C or D.";
      } else {
        instructions = "Complete the sentences below. Choose words from the passage.";
      }
    }

    let wordLimit = undefined;
    if (type === "sentenceCompletion") {
      if (/ONE WORD ONLY/i.test(instructions)) wordLimit = 1;
      else if (/NO MORE THAN TWO WORDS/i.test(instructions)) wordLimit = 2;
      else if (/NO MORE THAN THREE WORDS/i.test(instructions)) wordLimit = 3;
    }

    questions.push({
      id: `q${qNum}`,
      type,
      prompt,
      instructions,
      options,
      wordLimit,
      accepted: ansInfo.accepted,
      explanation: ansInfo.explanation || `The correct answer is "${ansInfo.accepted.join(' / ')}".`,
      evidence: ansInfo.explanation || "",
    });
  }

  return questions;
}

export function parseSpec(spec, passageNum) {
  const fullPath = path.join(dir, spec.file);
  const html = fs.readFileSync(fullPath, "utf-8");
  const paragraphs = parseParagraphs(html);
  const answers = parseAnswers(html);
  const banners = parseInstructionBanners(html);
  const pool = parseOptionsPool(html);
  const questions = parseQuestions(html, answers, banners, pool);

  return {
    id: spec.id,
    title: spec.title,
    passageNumber: passageNum,
    topic: spec.topic,
    tags: spec.tags,
    skill: "reading",
    examTrack: "academic",
    estimatedDuration: 20,
    passages: [
      {
        passageNumber: passageNum,
        title: spec.title,
        timeGuidance: `You should spend about 20 minutes on Questions 1-${questions.length}, which are based on Reading Passage ${passageNum}.`,
        paragraphs,
        questionRange: { start: 1, end: questions.length },
      },
    ],
    section: {
      title: spec.title,
      paragraphs,
      questions,
    },
  };
}

console.log("Parsing all 30 passage files...");
const p1Tests = PASSAGE_1_SPECS.map(s => parseSpec(s, 1));
const p2Tests = PASSAGE_2_SPECS.map(s => parseSpec(s, 2));
const p3Tests = PASSAGE_3_SPECS.map(s => parseSpec(s, 3));

console.log(`Parsed: P1=${p1Tests.length}, P2=${p2Tests.length}, P3=${p3Tests.length}`);

// Build 10 Full Mock Exams combining P1 + P2 + P3
const mockTests = [];
for (let i = 0; i < 10; i++) {
  const p1 = p1Tests[i];
  const p2 = p2Tests[i];
  const p3 = p3Tests[i];

  const mockNum = i + 1;
  const mockId = `rd-mock-${mockNum}`;
  const mockTitle = `IELTS Academic Reading Mock Test ${mockNum}`;
  const mockTopic = `${p1.title} · ${p2.title} · ${p3.title}`;

  const mockPassages = [
    {
      passageNumber: 1,
      title: p1.title,
      timeGuidance: "You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1.",
      paragraphs: p1.section.paragraphs,
      questionRange: { start: 1, end: 13 },
    },
    {
      passageNumber: 2,
      title: p2.title,
      timeGuidance: "You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2.",
      paragraphs: p2.section.paragraphs,
      questionRange: { start: 14, end: 26 },
    },
    {
      passageNumber: 3,
      title: p3.title,
      timeGuidance: "You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3.",
      paragraphs: p3.section.paragraphs,
      questionRange: { start: 27, end: 40 },
    },
  ];

  // Combined paragraphs as fallback
  const combinedParagraphs = [
    ...p1.section.paragraphs.map((p, idx) => ({ id: `m${mockNum}-p1-${idx + 1}`, text: p.text })),
    ...p2.section.paragraphs.map((p, idx) => ({ id: `m${mockNum}-p2-${idx + 1}`, text: p.text })),
    ...p3.section.paragraphs.map((p, idx) => ({ id: `m${mockNum}-p3-${idx + 1}`, text: p.text })),
  ];

  // Re-index questions 1 to 40
  // P1: questions 1 to 13
  // P2: questions 14 to 26
  // P3: questions 27 to 40
  const combinedQuestions = [
    ...p1.section.questions.map((q, qIdx) => ({
      ...q,
      id: `q${qIdx + 1}`,
      prompt: q.prompt,
    })),
    ...p2.section.questions.map((q, qIdx) => ({
      ...q,
      id: `q${13 + qIdx + 1}`,
      prompt: q.prompt,
    })),
    ...p3.section.questions.map((q, qIdx) => ({
      ...q,
      id: `q${26 + qIdx + 1}`,
      prompt: q.prompt,
    })),
  ];

  mockTests.push({
    id: mockId,
    title: mockTitle,
    topic: mockTopic,
    tags: ["full_mock", "academic", "timed_60min"],
    skill: "reading",
    examTrack: "academic",
    estimatedDuration: 60,
    passages: mockPassages,
    section: {
      title: mockTitle,
      paragraphs: combinedParagraphs,
      questions: combinedQuestions,
    },
  });
}

console.log(`Generated ${mockTests.length} Full Mock Tests (40 questions each).`);

// Build Catalog Items
const catalogItems = [];

// 1. Full Mocks (10 items)
mockTests.forEach((m, idx) => {
  catalogItems.push({
    id: m.id,
    category: "full_tests",
    title: m.title,
    topic: m.topic,
    typeBadge: "To‘liq Mock Test",
    typeBadgeColor: "primary",
    itemCountLabel: "3 ta matn · 40 ta savol",
    durationMinutes: 60,
    targetTestId: m.id,
  });
});

// 2. Passage 1 (10 items)
p1Tests.forEach(p => {
  catalogItems.push({
    id: p.id,
    category: "single_passages",
    title: `Passage 1: ${p.title}`,
    topic: p.topic,
    typeBadge: "Passage 1 (Oson/O‘rta)",
    typeBadgeColor: "emerald",
    itemCountLabel: "1 ta matn · 13 ta savol",
    durationMinutes: 20,
    targetTestId: p.id,
  });
});

// 3. Passage 2 (10 items)
p2Tests.forEach(p => {
  catalogItems.push({
    id: p.id,
    category: "single_passages",
    title: `Passage 2: ${p.title}`,
    topic: p.topic,
    typeBadge: "Passage 2 (O‘rta/Murakkab)",
    typeBadgeColor: "indigo",
    itemCountLabel: "1 ta matn · 13 ta savol",
    durationMinutes: 20,
    targetTestId: p.id,
  });
});

// 4. Passage 3 (10 items)
p3Tests.forEach(p => {
  catalogItems.push({
    id: p.id,
    category: "single_passages",
    title: `Passage 3: ${p.title}`,
    topic: p.topic,
    typeBadge: "Passage 3 (Murakkab/Akademik)",
    typeBadgeColor: "amber",
    itemCountLabel: "1 ta matn · 14 ta savol",
    durationMinutes: 20,
    targetTestId: p.id,
  });
});

// 5. Question-Type Drills
catalogItems.push(
  {
    id: "drill-tfng-mastery",
    category: "question_type",
    title: "True / False / Not Given & Yes / No Mastery Drill",
    topic: "Scientific Fact Verification & Inference",
    typeBadge: "True / False / NG",
    typeBadgeColor: "purple",
    itemCountLabel: "1 ta matn · 8 ta savol",
    durationMinutes: 12,
    questionTypeTag: "tfng",
    targetTestId: "rd-p1-history-of-tea",
  },
  {
    id: "drill-sentence-completion",
    category: "question_type",
    title: "Sentence Completion & Word Limits Practice",
    topic: "Contextual Vocabulary & Precision",
    typeBadge: "Sentence Completion",
    typeBadgeColor: "purple",
    itemCountLabel: "1 ta matn · 7 ta savol",
    durationMinutes: 10,
    questionTypeTag: "sentence_completion",
    targetTestId: "rd-p1-silk-industry",
  },
  {
    id: "drill-multiple-choice",
    category: "question_type",
    title: "Single & Multiple Choice Strategic Selection",
    topic: "Academic Elimination & Synthesis",
    typeBadge: "Multiple Choice",
    typeBadgeColor: "purple",
    itemCountLabel: "1 ta matn · 8 ta savol",
    durationMinutes: 12,
    questionTypeTag: "multiple_choice",
    targetTestId: "rd-p3-lost-animals-australia",
  },
  {
    id: "drill-matching-headings",
    category: "question_type",
    title: "Matching Headings & Main Idea Drill",
    topic: "Paragraph Synthesis & Roman Numerals",
    typeBadge: "Matching Headings",
    typeBadgeColor: "purple",
    itemCountLabel: "1 ta matn · 6 ta savol",
    durationMinutes: 12,
    questionTypeTag: "matching_headings",
    targetTestId: "rd-p2-skyscraper-farming",
  }
);

console.log(`Generated ${catalogItems.length} Catalog Items.`);

// Write generated data to src/lib/reading/passages-data.ts
const code = `import { SampleReadingTest } from "./sample-data";

export interface ReadingCatalogItem {
  id: string;
  category: "full_tests" | "single_passages" | "question_type";
  title: string;
  topic: string;
  typeBadge: string;
  typeBadgeColor?: "primary" | "indigo" | "emerald" | "amber" | "purple";
  itemCountLabel: string;
  durationMinutes: number;
  questionTypeTag?: string;
  targetTestId: string;
}

export const PASSAGE_1_TESTS: SampleReadingTest[] = ${JSON.stringify(p1Tests, null, 2)};

export const PASSAGE_2_TESTS: SampleReadingTest[] = ${JSON.stringify(p2Tests, null, 2)};

export const PASSAGE_3_TESTS: SampleReadingTest[] = ${JSON.stringify(p3Tests, null, 2)};

export const FULL_MOCK_TESTS: SampleReadingTest[] = ${JSON.stringify(mockTests, null, 2)};

export const ALL_READING_TESTS: SampleReadingTest[] = [
  ...FULL_MOCK_TESTS,
  ...PASSAGE_1_TESTS,
  ...PASSAGE_2_TESTS,
  ...PASSAGE_3_TESTS,
];

export const ALL_READING_CATALOG_ITEMS: ReadingCatalogItem[] = ${JSON.stringify(catalogItems, null, 2)};
`;

const outputPath = path.resolve(process.cwd(), "src/lib/reading/passages-data.ts");
fs.writeFileSync(outputPath, code, "utf-8");
console.log(`Saved passages data to ${outputPath} (${(code.length / 1024).toFixed(1)} KB)`);
