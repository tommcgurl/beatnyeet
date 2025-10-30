import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScreenshotGallery } from "@/components/screenshot-gallery";
import { DeleteReviewButton } from "@/components/delete-review-button";
import { Star, Calendar, Clock, Download, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

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

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await getReview(id);
  const session = await auth();

  if (!review) {
    notFound();
  }

  const isOwner = session?.user?.id === review.userId;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={review.user.image || ""} alt={review.user.name || ""} />
                  <AvatarFallback>
                    {review.user.name?.charAt(0).toUpperCase() || review.user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link href={`/profile/${review.user.id}`} className="font-bold text-xl hover:underline">
                    {review.user.name || "Anonymous"}
                  </Link>
                  <p className="text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-950/30 px-4 py-2 rounded-lg">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-2xl">{review.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">/ 10</span>
                </div>
                {isOwner && (
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/reviews/${review.id}/edit`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Review
                      </Link>
                    </Button>
                    <DeleteReviewButton reviewId={review.id} redirectPath="/" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-6">
              {review.game.coverUrl && (
                <div className="relative w-32 h-44 flex-shrink-0">
                  <Image
                    src={review.game.coverUrl}
                    alt={review.game.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-3">{review.game.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {review.platform}
                  </Badge>
                  {review.playTimeHours && (
                    <Badge variant="outline" className="text-base px-3 py-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {review.playTimeHours}h played
                    </Badge>
                  )}
                </div>
                {(review.startDate || review.finishDate) && (
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {review.startDate && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Started: {formatDate(review.startDate)}
                      </div>
                    )}
                    {review.finishDate && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Finished: {formatDate(review.finishDate)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {review.content && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Review</h2>
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {review.content}
                </p>
              </div>
            )}

            {review.screenshots.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Screenshots</h2>
                <ScreenshotGallery screenshots={review.screenshots} />
              </div>
            )}

            {review.saveFile && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Save File</h2>
                <Button asChild variant="outline">
                  <a href={review.saveFile.url} download>
                    <Download className="h-4 w-4 mr-2" />
                    Download {review.saveFile.filename}
                  </a>
                </Button>
              </div>
            )}

            {review.game.description && (
              <div>
                <h2 className="text-xl font-semibold mb-3">About the Game</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {review.game.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

