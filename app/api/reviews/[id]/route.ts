import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET single review
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const review = await prisma.review.findUnique({
      where: { id },
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

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

// PATCH update review
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      rating,
      platform,
      startDate,
      finishDate,
      playTimeHours,
      content,
      screenshotsToAdd,
      screenshotsToRemove,
    } = body;

    // Handle screenshot deletions
    if (screenshotsToRemove && screenshotsToRemove.length > 0) {
      await prisma.screenshot.deleteMany({
        where: {
          id: { in: screenshotsToRemove },
          reviewId: id, // Ensure we only delete screenshots from this review
        },
      });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating: rating !== undefined ? parseFloat(rating) : undefined,
        platform: platform || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        finishDate: finishDate ? new Date(finishDate) : undefined,
        playTimeHours: playTimeHours ? parseFloat(playTimeHours) : undefined,
        content: content !== undefined ? content : undefined,
        screenshots: screenshotsToAdd?.length
          ? {
              create: screenshotsToAdd.map((s: any) => ({
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
        saveFile: true,
      },
    });

    return NextResponse.json({ review: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE review
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}

