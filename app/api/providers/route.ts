import { NextResponse } from "next/server";
import { providers } from "@/data/providers";

export function GET() {
  return NextResponse.json({ providers });
}
