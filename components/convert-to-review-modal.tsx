"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface CurrentlyPlaying {
  id: string;
  platform: string;
  startDate?: string | null;
  playTimeHours?: number | null;
  notes?: string | null;
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

interface ConvertToReviewModalProps {
  currentlyPlaying: CurrentlyPlaying | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConvertToReviewModal({
  currentlyPlaying,
  open,
  onOpenChange,
}: ConvertToReviewModalProps) {
  const router = useRouter();
  const [rating, setRating] = useState("5");
  const [finishDate, setFinishDate] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill content with notes when modal opens
  useState(() => {
    if (currentlyPlaying?.notes) {
      setContent(currentlyPlaying.notes);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentlyPlaying) return;

    // Validate rating
    const ratingValue = parseFloat(rating);
    if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 10) {
      setError("Rating must be between 0 and 10");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/currently-playing/${currentlyPlaying.id}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: parseFloat(rating),
          finishDate: finishDate || null,
          content: content || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to convert to review");
      }

      const data = await response.json();
      router.push(`/reviews/${data.review.id}`);
    } catch (error) {
      setError("Failed to convert to review");
      setLoading(false);
    }
  };

  if (!currentlyPlaying) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Convert to Review</DialogTitle>
          <DialogDescription>
            Add a rating and finish date to convert this to a full review
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <Card className="p-4 bg-muted">
            <div className="flex items-start gap-4">
              {currentlyPlaying.game.coverUrl && (
                <div className="relative w-16 h-24 flex-shrink-0 rounded overflow-hidden">
                  <Image
                    src={currentlyPlaying.game.coverUrl}
                    alt={currentlyPlaying.game.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{currentlyPlaying.game.title}</h3>
                <p className="text-sm text-muted-foreground">{currentlyPlaying.platform}</p>
                {currentlyPlaying.playTimeHours !== null && (
                  <p className="text-sm text-muted-foreground">
                    {currentlyPlaying.playTimeHours}h played
                  </p>
                )}
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-10) *</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={rating}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setRating("");
                    return;
                  }
                  const numValue = parseFloat(value);
                  if (numValue >= 0 && numValue <= 10) {
                    setRating(value);
                  }
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setRating("5");
                    return;
                  }
                  const numValue = parseFloat(value);
                  if (numValue < 0) {
                    setRating("0");
                  } else if (numValue > 10) {
                    setRating("10");
                  }
                }}
                required
              />
              {rating !== "" && (parseFloat(rating) < 0 || parseFloat(rating) > 10) && (
                <p className="text-sm text-red-600">Rating must be between 0 and 10</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="finishDate">Finish Date</Label>
              <Input
                id="finishDate"
                type="date"
                value={finishDate}
                onChange={(e) => setFinishDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Review Text</Label>
              <Textarea
                id="content"
                placeholder="Share your thoughts about the game..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />
              {currentlyPlaying.notes && !content && (
                <p className="text-xs text-muted-foreground">
                  Your notes will be used as the review text if you don&apos;t add anything here
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Converting..." : "Create Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

