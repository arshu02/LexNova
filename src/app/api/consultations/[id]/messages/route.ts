import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const matterId = params.id;

  try {
    const messages = await prisma.message.findMany({
      where: { matterId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const matterId = params.id;
  const { senderId, text } = await req.json();

  if (!senderId || !text) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const message = await prisma.message.create({
      data: {
        matterId,
        senderId,
        text,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
