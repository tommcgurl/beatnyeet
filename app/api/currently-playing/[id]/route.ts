import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET single currently playing entry
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentlyPlaying = await prisma.currentlyPlaying.findUnique({
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
      },
    });

    if (!currentlyPlaying) {
      return NextResponse.json(
        { error: "Currently playing entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ currentlyPlaying });
  } catch (error) {
    console.error("Error fetching currently playing:", error);
    return NextResponse.json(
      { error: "Failed to fetch currently playing entry" },
      { status: 500 }
    );
  }
}

// PATCH update currently playing entry
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
    const body = await request.json();

    // Check if user owns this entry
    const existing = await prisma.currentlyPlaying.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Currently playing entry not found" },
        { status: 404 }
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { platform, startDate, playTimeHours, notes, screenshots } = body;

    // Handle screenshots separately
    if (screenshots !== undefined) {
      // Delete existing screenshots
      await prisma.currentlyPlayingScreenshot.deleteMany({
        where: { currentlyPlayingId: id },
      });

      // Create new screenshots
      if (screenshots.length > 0) {
        await prisma.currentlyPlayingScreenshot.createMany({
          data: screenshots.map((s: any) => ({
            currentlyPlayingId: id,
            url: s.url,
            caption: s.caption || null,
          })),
        });
      }
    }

    // Update the entry
    const currentlyPlaying = await prisma.currentlyPlaying.update({
      where: { id },
      data: {
        platform: platform || undefined,
        startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : undefined,
        playTimeHours: playTimeHours !== undefined ? (playTimeHours ? parseFloat(playTimeHours) : null) : undefined,
        notes: notes !== undefined ? (notes || null) : undefined,
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

    return NextResponse.json({ currentlyPlaying });
  } catch (error) {
    console.error("Error updating currently playing:", error);
    return NextResponse.json(
      { error: "Failed to update currently playing entry" },
      { status: 500 }
    );
  }
}

// DELETE currently playing entry
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

    // Check if user owns this entry
    const existing = await prisma.currentlyPlaying.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Currently playing entry not found" },
        { status: 404 }
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.currentlyPlaying.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting currently playing:", error);
    return NextResponse.json(
      { error: "Failed to delete currently playing entry" },
      { status: 500 }
    );
  }
}

