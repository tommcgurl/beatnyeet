"use client";

import { useEffect, useState } from "react";
import { CurrentlyPlayingCard } from "@/components/currently-playing-card";
import { ConvertToReviewModal } from "@/components/convert-to-review-modal";
import { useSession } from "next-auth/react";
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

export default function PlayingPage() {
  const { data: session } = useSession();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForConversion, setSelectedForConversion] = useState<CurrentlyPlaying | null>(null);
  const [convertModalOpen, setConvertModalOpen] = useState(false);

  useEffect(() => {
    fetchCurrentlyPlaying();
  }, []);

  const fetchCurrentlyPlaying = async () => {
    try {
      const response = await fetch("/api/currently-playing");
      const data = await response.json();
      setCurrentlyPlaying(data.currentlyPlaying || []);
    } catch (error) {
      console.error("Error fetching currently playing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = (id: string) => {
    const entry = currentlyPlaying.find((cp) => cp.id === id);
    if (entry) {
      setSelectedForConversion(entry);
      setConvertModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setCurrentlyPlaying((prev) => prev.filter((cp) => cp.id !== id));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Currently Playing</h1>
            <p className="text-muted-foreground">
              Games that the community is actively playing
            </p>
          </div>
          {session && currentlyPlaying.length > 0 && (
            <Button asChild>
              <Link href="/playing/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Game
              </Link>
            </Button>
          )}
        </div>

        {currentlyPlaying.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No games currently being played</p>
            {session && (
              <Button asChild>
                <Link href="/playing/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Game
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentlyPlaying.map((cp) => (
              <CurrentlyPlayingCard
                key={cp.id}
                currentlyPlaying={cp}
                showActions={session?.user?.id === cp.user.id}
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
    </main>
  );
}

