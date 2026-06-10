import { NextResponse } from "next/server";
import { agents } from "@/data/agents";

export function GET() {
  return NextResponse.json({ agents });
}
