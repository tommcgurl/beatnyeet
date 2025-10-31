"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Gamepad2 } from "lucide-react";
import { useState } from "react";

interface CurrentlyPlaying {
  id: string;
  platform: string;
  startDate?: string | null;
  playTimeHours?: number | null;
  notes?: string | null;
  createdAt: string;
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

interface CurrentlyPlayingCardProps {
  currentlyPlaying: CurrentlyPlaying;
  showActions?: boolean;
  onConvert?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function CurrentlyPlayingCard({ 
  currentlyPlaying, 
  showActions = false,
  onConvert,
  onDelete,
}: CurrentlyPlayingCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove this game from your currently playing list?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/currently-playing/${currentlyPlaying.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      if (onDelete) {
        onDelete(currentlyPlaying.id);
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete entry");
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-950/30 dark:to-blue-950/30">
          {currentlyPlaying.game.coverUrl ? (
            <Image
              src={currentlyPlaying.game.coverUrl}
              alt={currentlyPlaying.game.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Gamepad2 className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-500 hover:bg-green-600 text-white">
              In Progress
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div>
          <Link 
            href={`/games/${currentlyPlaying.game.id}`}
            className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2"
          >
            {currentlyPlaying.game.title}
          </Link>
          <Badge variant="outline" className="mt-1">
            {currentlyPlaying.platform}
          </Badge>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link 
            href={`/profile/${currentlyPlaying.user.id}`}
            className="flex items-center space-x-2 hover:text-primary transition-colors"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={currentlyPlaying.user.image || ""} alt={currentlyPlaying.user.name || ""} />
              <AvatarFallback className="text-xs">
                {currentlyPlaying.user.name?.charAt(0).toUpperCase() || currentlyPlaying.user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{currentlyPlaying.user.name || "Anonymous"}</span>
          </Link>
        </div>

        <div className="space-y-1 text-sm">
          {currentlyPlaying.startDate && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Started {formatDate(currentlyPlaying.startDate)}</span>
            </div>
          )}
          {currentlyPlaying.playTimeHours !== null && currentlyPlaying.playTimeHours !== undefined && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{currentlyPlaying.playTimeHours}h played</span>
            </div>
          )}
        </div>

        {currentlyPlaying.notes && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {currentlyPlaying.notes}
          </p>
        )}

        {currentlyPlaying.screenshots.length > 0 && (
          <div className="flex gap-1 overflow-x-auto">
            {currentlyPlaying.screenshots.slice(0, 4).map((screenshot) => (
              <div key={screenshot.id} className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                <Image
                  src={screenshot.url}
                  alt="Screenshot"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {currentlyPlaying.screenshots.length > 4 && (
              <div className="w-16 h-16 flex-shrink-0 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                +{currentlyPlaying.screenshots.length - 4}
              </div>
            )}
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => onConvert && onConvert(currentlyPlaying.id)}
          >
            Convert to Review
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

