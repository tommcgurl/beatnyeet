"use client";

import { useState } from "react";
import { CurrentlyPlayingCard } from "@/components/currently-playing-card";
import { ConvertToReviewModal } from "@/components/convert-to-review-modal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

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

interface CurrentlyPlayingSectionProps {
  currentlyPlaying: CurrentlyPlaying[];
  isOwnProfile: boolean;
}

export function CurrentlyPlayingSection({
  currentlyPlaying,
  isOwnProfile,
}: CurrentlyPlayingSectionProps) {
  const [entries, setEntries] = useState(currentlyPlaying);
  const [selectedForConversion, setSelectedForConversion] = useState<CurrentlyPlaying | null>(null);
  const [convertModalOpen, setConvertModalOpen] = useState(false);

  const handleConvert = (id: string) => {
    const entry = entries.find((cp) => cp.id === id);
    if (entry) {
      setSelectedForConversion(entry);
      setConvertModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((cp) => cp.id !== id));
  };

  if (entries.length === 0 && !isOwnProfile) {
    return null;
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Currently Playing</h2>
          {isOwnProfile && (
            <Button asChild>
              <Link href="/playing/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Game
              </Link>
            </Button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No games currently playing</p>
            {isOwnProfile && (
              <Button asChild variant="outline">
                <Link href="/playing/new">Add your first game</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((cp) => (
              <CurrentlyPlayingCard
                key={cp.id}
                currentlyPlaying={cp}
                showActions={isOwnProfile}
                onConvert={handleConvert}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <ConvertToReviewModal
        currentlyPlaying={selectedForConversion}
        open={convertModalOpen}
        onOpenChange={setConvertModalOpen}
      />
    </>
  );
}

