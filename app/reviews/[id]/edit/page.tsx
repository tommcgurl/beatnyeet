import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { EditReviewForm } from "@/components/edit-review-form";

async function getReview(id: string) {
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

  return review;
}

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await getReview(id);
  const session = await auth();

  if (!review) {
    notFound();
  }

  // Check if the user is the owner of the review
  if (!session?.user?.id || session.user.id !== review.userId) {
    redirect(`/reviews/${id}`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Edit Review</h1>
          <p className="text-muted-foreground">
            Update your review for {review.game.title}
          </p>
        </div>
        <EditReviewForm review={{
          ...review,
          startDate: review.startDate?.toISOString() || null,
          finishDate: review.finishDate?.toISOString() || null,
        }} />
      </div>
    </main>
  );
}

