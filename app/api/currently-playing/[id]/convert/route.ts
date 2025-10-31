import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST convert currently playing entry to review
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { rating, finishDate, content } = body;

    if (rating === undefined) {
      return NextResponse.json(
        { error: "Rating is required" },
        { status: 400 }
      );
    }

    // Get the currently playing entry with all its data
    const currentlyPlaying = await prisma.currentlyPlaying.findUnique({
      where: { id },
      include: {
        screenshots: true,
        game: true,
      },
    });

    if (!currentlyPlaying) {
      return NextResponse.json(
        { error: "Currently playing entry not found" },
        { status: 404 }
      );
    }

    if (currentlyPlaying.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create the review with data from currently playing
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        gameId: currentlyPlaying.gameId,
        rating: parseFloat(rating),
        platform: currentlyPlaying.platform,
        startDate: currentlyPlaying.startDate,
        finishDate: finishDate ? new Date(finishDate) : null,
        playTimeHours: currentlyPlaying.playTimeHours,
        content: content || currentlyPlaying.notes || null,
        screenshots: currentlyPlaying.screenshots.length
          ? {
              create: currentlyPlaying.screenshots.map((s) => ({
                url: s.url,
                caption: s.caption,
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
        saveFile: true,
      },
    });

    // Delete the currently playing entry
    await prisma.currentlyPlaying.delete({
      where: { id },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Error converting to review:", error);
    return NextResponse.json(
      { error: "Failed to convert to review" },
      { status: 500 }
    );
  }
}

