import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReviewCard } from "@/components/review-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

async function getGameWithReviews(gameId: string) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      reviews: {
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
      },
    },
  });

  return game;
}

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = await getGameWithReviews(id);

  if (!game) {
    notFound();
  }

  const averageRating = game.reviews.length > 0
    ? game.reviews.reduce((sum, review) => sum + review.rating, 0) / game.reviews.length
    : 0;

  const platforms = game.platforms ? game.platforms.split(", ") : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start space-x-6">
              {game.coverUrl && (
                <div className="relative w-40 h-56 flex-shrink-0">
                  <Image
                    src={game.coverUrl}
                    alt={game.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">{game.title}</h1>
                {game.description && (
                  <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                    {game.description}
                  </p>
                )}
                {platforms.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {platforms.map((platform, index) => (
                      <Badge key={index} variant="secondary">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold">{game.reviews.length}</p>
                    <p className="text-muted-foreground">Reviews</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
                    <p className="text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="mb-6">
          <h2 className="text-2xl font-bold">Community Reviews</h2>
        </div>

        {game.reviews.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {game.reviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={{
                  ...review,
                  createdAt: review.createdAt.toISOString(),
                }} 
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

