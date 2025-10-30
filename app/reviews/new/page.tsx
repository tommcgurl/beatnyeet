import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ReviewForm } from "@/components/review-form";

export default async function NewReviewPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create a Review</h1>
          <p className="text-muted-foreground">
            Share your gaming experience with the community
          </p>
        </div>

        <ReviewForm />
      </div>
    </main>
  );
}

