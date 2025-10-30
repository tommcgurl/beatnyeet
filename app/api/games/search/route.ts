import { NextResponse } from "next/server";
import { searchGames } from "@/lib/igdb";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    // Search IGDB
    const games = await searchGames(query);

    // Cache games in our database
    for (const game of games) {
      const platforms = game.platforms?.map((p) => p.name).join(", ") || "";
      const coverUrl = game.cover?.url
        ? game.cover.url.replace("//", "https://").replace("t_thumb", "t_cover_big")
        : null;

      await prisma.game.upsert({
        where: { igdbId: game.id },
        update: {
          title: game.name,
          coverUrl,
          description: game.summary || null,
          platforms,
        },
        create: {
          igdbId: game.id,
          title: game.name,
          coverUrl,
          description: game.summary || null,
          platforms,
        },
      });
    }

    return NextResponse.json({ games });
  } catch (error) {
    console.error("Game search error:", error);
    return NextResponse.json(
      { error: "Failed to search games" },
      { status: 500 }
    );
  }
}


