import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReviewCard } from "@/components/review-card";
import { ReviewCardWithActions } from "@/components/review-card-with-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getUserWithReviews(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
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

  return user;
}

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await getUserWithReviews(userId);
  const session = await auth();

  if (!user) {
    notFound();
  }

  const isOwnProfile = session?.user?.id === userId;

  const averageRating = user.reviews.length > 0
    ? user.reviews.reduce((sum, review) => sum + review.rating, 0) / user.reviews.length
    : 0;

  const totalPlayTime = user.reviews.reduce(
    (sum, review) => sum + (review.playTimeHours || 0),
    0
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback className="text-3xl">
                  {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {user.name || "Anonymous User"}
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-3xl font-bold">{user.reviews.length}</p>
                <p className="text-muted-foreground">Reviews</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
                <p className="text-muted-foreground">Avg Rating</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-3xl font-bold">{totalPlayTime.toFixed(0)}h</p>
                <p className="text-muted-foreground">Total Playtime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-2xl font-bold">Reviews</h2>
        </div>

        {user.reviews.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No reviews yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.reviews.map((review) => (
              isOwnProfile ? (
                <ReviewCardWithActions
                  key={review.id}
                  review={{
                    ...review,
                    createdAt: review.createdAt.toISOString(),
                  }}
                  showDeleteButton={true}
                />
              ) : (
                <ReviewCard 
                  key={review.id} 
                  review={{
                    ...review,
                    createdAt: review.createdAt.toISOString(),
                  }} 
                />
              )
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

