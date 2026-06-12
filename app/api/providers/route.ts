import { NextResponse } from "next/server";
import { multiAgentApiProviders } from "@/lib/providers";

export function GET() {
  return NextResponse.json({ providers: multiAgentApiProviders });
}
