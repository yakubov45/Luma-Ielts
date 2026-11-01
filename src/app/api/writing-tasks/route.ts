import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PlatformWritingTask } from "@/lib/types/writing";

const DATA_FILE = path.join(process.cwd(), "src", "data", "writing-tasks.json");

function readTasksFromFile(): PlatformWritingTask[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    console.error("Error reading writing-tasks.json:", err);
    return [];
  }
}

function writeTasksToFile(tasks: PlatformWritingTask[]): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing writing-tasks.json:", err);
  }
}

export async function GET() {
  const tasks = readTasksFromFile();
  return NextResponse.json({ success: true, tasks });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const existing = readTasksFromFile();

    const id = body.id || `task1-${Date.now()}`;
    const fullTask: PlatformWritingTask = {
      ...body,
      id,
      createdAt: body.createdAt || Date.now(),
      status: body.status || "published",
    };

    const filtered = existing.filter((t) => t.id !== id);
    const updated = [fullTask, ...filtered];

    writeTasksToFile(updated);

    return NextResponse.json({ success: true, task: fullTask });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to save writing task" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const existing = readTasksFromFile();
    const updated = existing.filter((t) => t.id !== id);
    writeTasksToFile(updated);

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete writing task" },
      { status: 500 }
    );
  }
}
