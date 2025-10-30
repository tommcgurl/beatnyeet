import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  platform: string;
  content?: string | null;
  createdAt: string;
  playTimeHours?: number | null;
  user: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
  };
  game: {
    id: string;
    title: string;
    coverUrl?: string | null;
  };
  screenshots: Array<{
    id: string;
    url: string;
  }>;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Link href={`/reviews/${review.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.user.image || ""} alt={review.user.name || ""} />
                <AvatarFallback>
                  {review.user.name?.charAt(0).toUpperCase() || review.user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{review.user.name || "Anonymous"}</p>
                <p className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-lg">{review.rating.toFixed(1)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-4">
            {review.game.coverUrl && (
              <div className="relative w-20 h-28 flex-shrink-0">
                <Image
                  src={review.game.coverUrl}
                  alt={review.game.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg mb-2">{review.game.title}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{review.platform}</Badge>
                {review.playTimeHours && (
                  <Badge variant="outline">{review.playTimeHours}h played</Badge>
                )}
              </div>
            </div>
          </div>
          {review.content && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {review.content}
            </p>
          )}
          {review.screenshots.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {review.screenshots.slice(0, 3).map((screenshot) => (
                <div key={screenshot.id} className="relative w-24 h-16 flex-shrink-0">
                  <Image
                    src={screenshot.url}
                    alt="Screenshot"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ))}
              {review.screenshots.length > 3 && (
                <div className="w-24 h-16 flex items-center justify-center bg-muted rounded text-sm font-medium">
                  +{review.screenshots.length - 3}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}


