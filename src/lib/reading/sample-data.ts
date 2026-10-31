export interface SampleQuestion {
  id: string;
  type: "singleChoice" | "trueFalseNotGiven" | "sentenceCompletion";
  prompt: string;
  instructions: string;
  options?: { id: string; text: string }[];
  wordLimit?: number;
  accepted: string[];
  explanation: string;
  evidence: string;
}

export interface ReadingPassageData {
  passageNumber: 1 | 2 | 3;
  title: string;
  subtitle?: string;
  timeGuidance?: string;
  paragraphs: { id: string; text: string }[];
  questionRange: { start: number; end: number };
}

export interface SampleReadingTest {
  id: string;
  title: string;
  skill: "reading";
  examTrack: "academic";
  tags: string[];
  estimatedDuration: number;
  passageNumber?: 1 | 2 | 3;
  topic?: string;
  passages?: ReadingPassageData[];
  source?: string;
  creator?: string;
  license?: string;
  attribution?: string;
  publishedVersion?: string;
  status?: string;
  aiGenerated?: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  schemaVersion?: number;
  section: {
    title: string;
    paragraphs: { id: string; text: string }[];
    questions: SampleQuestion[];
  };
}

import { ALL_READING_TESTS } from "./passages-data";

export const BASE_DRILL_TESTS: SampleReadingTest[] = [
  {
    id: "urban-gardens-drill",
    title: "Urban Gardens: A Short Academic Drill",
    skill: "reading",
    examTrack: "academic",
    tags: ["environment", "cities", "sustainability"],
    estimatedDuration: 8,
    section: {
      title: "Urban Gardens and Sustainable Cities",
      paragraphs: [
        {
          id: "p1",
          text: "In many crowded cities around the globe, unused rooftops, balconies, and small abandoned plots of land are rapidly being converted into community gardens. These green micro-spaces have the potential to produce fresh, nutrient-rich food in close proximity to urban dwellers, thereby significantly reducing the transportation distance and carbon emissions associated with long-distance food distribution."
        },
        {
          id: "p2",
          text: "The primary purpose of urban gardening initiatives is not necessarily to replace large-scale commercial farming, which remains essential for staple crops. Instead, many urban agriculture projects place a deliberate emphasis on educational outreach. Volunteers, schoolchildren, and local residents gain practical knowledge of how biological seasons, nutrient-dense soil, and efficient water management directly influence crop growth. Simultaneously, these sites provide vital psychological respite and foster social cohesion among neighbours."
        },
        {
          id: "p3",
          text: "Nevertheless, urban cultivators encounter distinct environmental challenges. Atmospheric pollutants from vehicular traffic can deposit heavy metals onto foliage, necessitating careful site selection, raised garden beds, and rigorous soil testing. When managed correctly, however, urban farms contribute measurably to temperature reduction, rainwater filtration, and local biodiversity."
        }
      ],
      questions: [
        {
          id: "q1",
          type: "singleChoice",
          prompt: "What is highlighted in paragraph 1 as a key environmental advantage of urban gardens?",
          instructions: "Choose the correct letter (A, B, or C).",
          options: [
            { id: "a", text: "Food needs to travel a much shorter distance to consumers." },
            { id: "b", text: "It completely eliminates the need for commercial freight." },
            { id: "c", text: "Urban apartments require less artificial cooling." }
          ],
          accepted: ["a"],
          explanation: "Paragraph 1 explicitly notes that producing food close to urban dwellers reduces transportation distance and related emissions.",
          evidence: "reducing the transportation distance and carbon emissions"
        },
        {
          id: "q2",
          type: "trueFalseNotGiven",
          prompt: "The main goal of every urban garden is to substitute traditional commercial farms.",
          instructions: "Choose True, False, or Not Given based on the text.",
          accepted: ["false"],
          explanation: "Paragraph 2 states that the primary purpose is 'not necessarily to replace large-scale commercial farming'. Therefore, the statement contradicts the text (False).",
          evidence: "The primary purpose of urban gardening initiatives is not necessarily to replace large-scale commercial farming"
        },
        {
          id: "q3",
          type: "sentenceCompletion",
          prompt: "In educational urban projects, participants observe the influence of seasons, soil quality, and _____ on vegetable health.",
          instructions: "Write NO MORE THAN TWO WORDS from the passage for the answer.",
          wordLimit: 2,
          accepted: ["water", "water management"],
          explanation: "Paragraph 2 explains that volunteers learn how 'seasons, nutrient-dense soil, and efficient water management directly influence crop growth'.",
          evidence: "seasons, nutrient-dense soil, and efficient water management"
        }
      ]
    }
  },
  {
    id: "cognitive-bilingualism",
    title: "Cognitive Advantages of Bilingualism",
    skill: "reading",
    examTrack: "academic",
    tags: ["psychology", "neuroscience", "language"],
    estimatedDuration: 10,
    section: {
      title: "The Bilingual Brain: Executive Function and Plasticity",
      paragraphs: [
        {
          id: "p1",
          text: "For much of the twentieth century, many educators and psychologists cautioned that raising children in a bilingual environment would create mental confusion, dilute vocabulary acquisition, and impair academic achievement. Recent neuroimaging investigations and rigorous behavioural paradigms, however, have thoroughly overturned this archaic view, revealing that navigating two linguistic systems confers robust cognitive benefits."
        },
        {
          id: "p2",
          text: "The core cognitive mechanism enhanced by dual-language fluency is the brain’s executive function system. This suite of mental processes includes attention control, working memory, inhibitory control, and task switching. Because both languages remain perpetually active in a bilingual individual's mind, the speaker must continually suppress intrusive vocabulary from the unintended language while retrieving lexical items from the active one."
        },
        {
          id: "p3",
          text: "This constant mental workout appears to build what neuroscientists term cognitive reserve. Epidemiological studies suggest that lifelong bilingualism delays the symptomatic onset of neurodegenerative disorders, such as Alzheimer's disease, by an average of four to five years compared with monolingual cohorts, even when underlying pathological damage in the brain is equivalent."
        }
      ],
      questions: [
        {
          id: "q1",
          type: "singleChoice",
          prompt: "What was the prevalent belief during most of the 20th century regarding bilingual children?",
          instructions: "Choose the correct letter (A, B, or C).",
          options: [
            { id: "a", text: "They possessed an innate advantage in cognitive flexibility." },
            { id: "b", text: "Bilingualism was likely to impede intellectual progress and create confusion." },
            { id: "c", text: "Their working memory exceeded that of monolingual peers." }
          ],
          accepted: ["b"],
          explanation: "Paragraph 1 mentions that 20th-century psychologists cautioned bilingualism would create mental confusion and impair achievement.",
          evidence: "cautioned that raising children in a bilingual environment would create mental confusion"
        },
        {
          id: "q2",
          type: "trueFalseNotGiven",
          prompt: "In a bilingual speaker, the language not currently spoken is completely shut down by the brain.",
          instructions: "Choose True, False, or Not Given based on the text.",
          accepted: ["false"],
          explanation: "Paragraph 2 states 'both languages remain perpetually active in a bilingual individual's mind', so it is never completely shut down.",
          evidence: "both languages remain perpetually active in a bilingual individual's mind"
        },
        {
          id: "q3",
          type: "sentenceCompletion",
          prompt: "Lifelong bilingualism has been shown to postpone the onset of Alzheimer's symptoms through the development of _____.",
          instructions: "Write NO MORE THAN TWO WORDS from the text.",
          wordLimit: 2,
          accepted: ["cognitive reserve"],
          explanation: "Paragraph 3 notes this mental exercise creates what scientists call 'cognitive reserve'.",
          evidence: "neuroscientists term cognitive reserve"
        }
      ]
    }
  },
  {
    id: "climate-architecture-drill",
    title: "Passive Solar Architecture & Thermal Efficiency",
    skill: "reading",
    examTrack: "academic",
    tags: ["architecture", "engineering", "sustainability"],
    estimatedDuration: 10,
    source: "Cambridge Academic Drill",
    license: "CC BY 4.0",
    publishedVersion: "v1",
    section: {
      title: "Bioclimatic Architecture and Modern Urban Building",
      paragraphs: [
        {
          id: "p1",
          text: "Contemporary civil engineering has increasingly shifted attention towards bioclimatic architectural principles. Rather than relying heavily on energy-intensive mechanical heating, ventilation, and air-conditioning (HVAC) systems, passive solar buildings utilize natural ambient energy fluxes, cross-ventilation, and high thermal mass materials to regulate interior microclimates efficiently."
        },
        {
          id: "p2",
          text: "A central component of this design methodology is strategic building orientation relative to cardinal solar vectors. South-facing double-glazed fenestrations maximize winter thermal gain, while precisely calculated architectural overhangs block intense high-angle summer sunlight. Dense structural masonry or rammed-earth walls act as thermal batteries, absorbing excessive daytime warmth and gently dissipating it through infrared radiation during chillier nighttime hours."
        },
        {
          id: "p3",
          text: "Lifecycle assessment studies demonstrate that although initial construction of bioclimatic structures can occasionally require specialized craftsmanship, operational energy savings quickly eclipse the marginal capital premium. Over a thirty-year operating horizon, passive structures routinely achieve a sixty to seventy percent reduction in net electrical consumption compared to conventional concrete-and-glass corporate towers."
        }
      ],
      questions: [
        {
          id: "q1",
          type: "singleChoice",
          prompt: "What is the primary function of dense structural masonry in passive buildings?",
          instructions: "Choose the correct letter (A, B, or C).",
          options: [
            { id: "a", text: "To eliminate the need for exterior window glazing." },
            { id: "b", text: "To absorb daytime heat and release it during cooler night periods." },
            { id: "c", text: "To actively pump refrigerated air through interior conduits." }
          ],
          accepted: ["b"],
          explanation: "Paragraph 2 states dense masonry walls act as thermal batteries, absorbing daytime warmth and dissipating it at night.",
          evidence: "absorbing excessive daytime warmth and gently dissipating it through infrared radiation during chillier nighttime hours"
        },
        {
          id: "q2",
          type: "trueFalseNotGiven",
          prompt: "Architectural overhangs are designed to prevent solar heat from entering windows during the winter months.",
          instructions: "Choose True, False, or Not Given based on the text.",
          accepted: ["false"],
          explanation: "Paragraph 2 notes overhangs block high-angle summer sunlight while allowing lower winter rays to enter for heating.",
          evidence: "while precisely calculated architectural overhangs block intense high-angle summer sunlight"
        },
        {
          id: "q3",
          type: "sentenceCompletion",
          prompt: "Over three decades of operation, passive solar facilities can reduce net electrical consumption by up to _____ percent.",
          instructions: "Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
          wordLimit: 2,
          accepted: ["70", "seventy", "60 to 70", "sixty to seventy"],
          explanation: "Paragraph 3 notes passive buildings achieve a sixty to seventy percent reduction in electrical consumption.",
          evidence: "sixty to seventy percent reduction in net electrical consumption"
        }
      ]
    }
  },
  {
    id: "renewable-energy-drill",
    title: "Grid-Scale Battery Storage and Decarbonisation",
    skill: "reading",
    examTrack: "academic",
    tags: ["energy", "technology", "climate"],
    estimatedDuration: 10,
    source: "Cambridge Academic Drill",
    license: "CC BY 4.0",
    publishedVersion: "v1",
    section: {
      title: "The Role of Utility Storage in Renewable Energy Integration",
      paragraphs: [
        {
          id: "p1",
          text: "The global transition away from fossil-fueled thermal electricity towards renewable generators like wind turbines and solar photovoltaic arrays has exposed a major structural challenge: supply intermittency. Power generation rarely coincides perfectly with consumer demand curves, leading to massive midday curtailment or severe evening supply bottlenecks."
        },
        {
          id: "p2",
          text: "To resolve this mismatch, international transmission operators are aggressively deploying utility-scale energy storage facilities. Lithium iron phosphate (LFP) installations provide rapid millisecond frequency response to stabilize alternating current grids, while emerging redox flow batteries offer promising scalability for long-duration bulk energy reserve across multi-day low-wind episodes."
        },
        {
          id: "p3",
          text: "Another innovative vector involves the commercial repurposing of retired electric vehicle batteries. Known as second-life battery systems, these packs still retain seventy to eighty percent of their original capacity—sufficient for stationary commercial balancing despite having degraded past automotive performance benchmarks."
        }
      ],
      questions: [
        {
          id: "q1",
          type: "singleChoice",
          prompt: "Why is large-scale storage vital for power grids relying on renewable sources?",
          instructions: "Choose the correct letter (A, B, or C).",
          options: [
            { id: "a", text: "It bridges the gap between fluctuating energy generation and consumer demand." },
            { id: "b", text: "It replaces high-voltage transmission cables with wireless transmitters." },
            { id: "c", text: "It converts electrical current into liquid fossil fuel reserves." }
          ],
          accepted: ["a"],
          explanation: "Paragraph 1 notes that power generation rarely matches demand curves, causing curtailment or supply shortages.",
          evidence: "Power generation rarely coincides perfectly with consumer demand curves"
        },
        {
          id: "q2",
          type: "trueFalseNotGiven",
          prompt: "Redox flow batteries are primarily used in lightweight mobile smartphones.",
          instructions: "Choose True, False, or Not Given based on the text.",
          accepted: ["false"],
          explanation: "Paragraph 2 explicitly states redox flow batteries are used for multi-day utility grid long-duration energy reserves.",
          evidence: "emerging redox flow batteries offer promising scalability for long-duration bulk energy reserve"
        },
        {
          id: "q3",
          type: "sentenceCompletion",
          prompt: "Electric vehicle batteries that are decommissioned from cars can be reused in _____ stationary storage installations.",
          instructions: "Write NO MORE THAN TWO WORDS from the text.",
          wordLimit: 2,
          accepted: ["second-life", "second life"],
          explanation: "Paragraph 3 discusses 'second-life battery systems' which retain 70-80% capacity for stationary installations.",
          evidence: "Known as second-life battery systems, these packs still retain seventy to eighty percent"
        }
      ]
    }
  }
];

export const SAMPLE_READING_TESTS: SampleReadingTest[] = [
  ...ALL_READING_TESTS,
  ...BASE_DRILL_TESTS,
];
