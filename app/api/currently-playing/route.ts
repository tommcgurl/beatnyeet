import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all currently playing entries (with optional userId filter)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const currentlyPlaying = await prisma.currentlyPlaying.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        game: true,
        screenshots: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ currentlyPlaying });
  } catch (error) {
    console.error("Error fetching currently playing:", error);
    return NextResponse.json(
      { error: "Failed to fetch currently playing" },
      { status: 500 }
    );
  }
}

// POST create new currently playing entry
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      gameId,
      platform,
      startDate,
      playTimeHours,
      notes,
      screenshots,
    } = body;

    if (!gameId || !platform) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create currently playing entry with screenshots
    const currentlyPlaying = await prisma.currentlyPlaying.create({
      data: {
        userId: session.user.id,
        gameId,
        platform,
        startDate: startDate ? new Date(startDate) : null,
        playTimeHours: playTimeHours ? parseFloat(playTimeHours) : null,
        notes: notes || null,
        screenshots: screenshots?.length
          ? {
              create: screenshots.map((s: any) => ({
                url: s.url,
                caption: s.caption || null,
              })),
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        game: true,
        screenshots: true,
      },
    });

    return NextResponse.json({ currentlyPlaying }, { status: 201 });
  } catch (error) {
    console.error("Error creating currently playing:", error);
    return NextResponse.json(
      { error: "Failed to create currently playing entry" },
      { status: 500 }
    );
  }
}

