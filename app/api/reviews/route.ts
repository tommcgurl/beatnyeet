import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all reviews
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const gameId = searchParams.get("gameId");

    const where: any = {};
    if (userId) where.userId = userId;
    if (gameId) where.gameId = gameId;

    const reviews = await prisma.review.findMany({
      where,
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
        saveFile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST create new review
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      gameId,
      rating,
      platform,
      startDate,
      finishDate,
      playTimeHours,
      content,
      screenshots,
      saveFile,
    } = body;

    if (!gameId || rating === undefined || !platform) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create review with screenshots and save file
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        gameId,
        rating: parseFloat(rating),
        platform,
        startDate: startDate ? new Date(startDate) : null,
        finishDate: finishDate ? new Date(finishDate) : null,
        playTimeHours: playTimeHours ? parseFloat(playTimeHours) : null,
        content: content || null,
        screenshots: screenshots?.length
          ? {
              create: screenshots.map((s: any) => ({
                url: s.url,
                caption: s.caption || null,
              })),
            }
          : undefined,
        saveFile: saveFile
          ? {
              create: {
                url: saveFile.url,
                filename: saveFile.filename,
              },
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
        saveFile: true,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

