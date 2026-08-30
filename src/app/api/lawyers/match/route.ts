import { NextResponse } from "next/server";
import { getMatchedLawyers } from "@/lib/lawyer-match";

export async function POST(req: Request) {
  try {
    const { category, lawyerType, city } = await req.json();

    const matched = await getMatchedLawyers(category || lawyerType || "", city || null);

    return NextResponse.json(matched);
  } catch (error) {
    console.error("Match lawyers API error:", error);
    return NextResponse.json({ error: "Failed to match lawyers" }, { status: 500 });
  }
}
