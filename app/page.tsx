import { prisma } from "@/lib/prisma";
import { ReviewCard } from "@/components/review-card";

async function getReviews() {
  const reviews = await prisma.review.findMany({
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
    take: 20,
  });

  return reviews;
}

export default async function Home() {
  const reviews = await getReviews();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Latest Reviews</h1>
          <p className="text-muted-foreground">
            Discover what the community is playing
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-2">No reviews yet</h2>
            <p className="text-muted-foreground mb-6">
              Be the first to share your gaming experience!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
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
