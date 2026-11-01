export type WritingTaskType = "task1" | "task2";

export interface PlatformWritingTask {
  id: string;
  taskType: WritingTaskType;
  title: string;
  categoryTag: string; // e.g. "bar_chart", "line_graph", "pie_chart", "table", "process", "map", "mixed", "discuss_both_views", "opinion", etc.
  categoryLabel: string;
  prompt: string;
  imageUrl?: string; // Cloudflare R2 Public URL for Task 1
  visualDescription?: string;
  modelAnswer?: string; // Band 8-9 Model Answer
  suggestedMinutes: number;
  wordRequirement: number;
  createdAt: number;
  status?: "published" | "draft";
  isUserCreated?: boolean;
}

export const TASK1_CATEGORIES = [
  { id: "bar_chart", label: "Bar Chart" },
  { id: "line_graph", label: "Line Graph" },
  { id: "pie_chart", label: "Pie Chart" },
  { id: "table", label: "Table" },
  { id: "process", label: "Process Diagram" },
  { id: "map", label: "Map / Urban Plan" },
  { id: "mixed", label: "Mixed / Multiple Charts" },
] as const;

export const TASK2_CATEGORIES = [
  { id: "discuss_both_views", label: "Discuss Both Views" },
  { id: "opinion", label: "Opinion (Agree or Disagree)" },
  { id: "problems_solutions", label: "Problems & Solutions" },
  { id: "advantages_disadvantages", label: "Advantages & Disadvantages" },
  { id: "two_part", label: "Two-Part Questions" },
] as const;
