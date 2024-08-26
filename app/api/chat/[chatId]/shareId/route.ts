import { v4 } from "uuid";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } },
) {
  try {
    const { chatId } = params;

    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ status: 401 });

    const chat = await prisma.chat.findFirstOrThrow({
      where: { id: chatId, userId: session.user.id },
    });

    return NextResponse.json(chat.shareId);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { chatId: string } },
) {
  try {
    const { chatId } = params;
    if (!chatId) throw new Error("chatId is required");

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ status: 401 });
    }

    await prisma.chat.update({
      where: { id: chatId, userId: session.user.id },
      data: {
        shareId: null,
      },
    });

    return NextResponse.json({});
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { chatId: string } },
) {
  try {
    const { chatId } = params;
    if (!chatId) throw new Error("chatId is required");

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const shareId = v4();
    await prisma.chat.update({
      where: { id: chatId, userId: session.user.id },
      data: {
        shareId,
      },
    });

    return NextResponse.json({ shareId });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
