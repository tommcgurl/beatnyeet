import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { igdbId, title, coverUrl, description, platforms } = body;

    if (!igdbId || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upsert game (create or update if exists)
    const game = await prisma.game.upsert({
      where: { igdbId: parseInt(igdbId) },
      update: {
        title,
        coverUrl: coverUrl || null,
        description: description || null,
        platforms: platforms || null,
      },
      create: {
        igdbId: parseInt(igdbId),
        title,
        coverUrl: coverUrl || null,
        description: description || null,
        platforms: platforms || null,
      },
    });

    return NextResponse.json({ game });
  } catch (error) {
    console.error("Error creating/updating game:", error);
    return NextResponse.json(
      { error: "Failed to create/update game" },
      { status: 500 }
    );
  }
}


