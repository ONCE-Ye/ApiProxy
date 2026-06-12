import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

type PageAnnotation = {
  id: string;
  page: string;
  x: number;
  y: number;
  target: string;
  text: string;
  comment: string;
  createdAt: string;
};

const annotationDir = path.join(process.cwd(), ".annotations");
const annotationFile = path.join(annotationDir, "page-notes.json");

async function readAnnotations(): Promise<PageAnnotation[]> {
  try {
    const contents = await readFile(annotationFile, "utf8");
    const parsed = JSON.parse(contents);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET() {
  return NextResponse.json({ annotations: await readAnnotations() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const comment = typeof body.comment === "string" ? body.comment.trim() : "";

    if (!comment) {
      return NextResponse.json({ error: "comment is required" }, { status: 400 });
    }

    const annotations = await readAnnotations();
    const nextAnnotation: PageAnnotation = {
      id: "note-" + Date.now().toString(),
      page: typeof body.page === "string" ? body.page : "/",
      x: Number.isFinite(body.x) ? Math.round(body.x) : 0,
      y: Number.isFinite(body.y) ? Math.round(body.y) : 0,
      target: typeof body.target === "string" ? body.target : "unknown",
      text: typeof body.text === "string" ? body.text : "",
      comment,
      createdAt: new Date().toISOString()
    };

    const nextAnnotations = [nextAnnotation, ...annotations];
    await mkdir(annotationDir, { recursive: true });
    await writeFile(annotationFile, JSON.stringify(nextAnnotations, null, 2) + "\n", "utf8");

    return NextResponse.json({ annotations: nextAnnotations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed to save annotation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
