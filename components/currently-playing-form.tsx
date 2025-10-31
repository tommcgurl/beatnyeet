"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GameSearch } from "./game-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface Game {
  id: number;
  name: string;
  cover?: {
    url: string;
  };
  platforms?: Array<{
    id: number;
    name: string;
  }>;
}

export function CurrentlyPlayingForm() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [platform, setPlatform] = useState("");
  const [startDate, setStartDate] = useState("");
  const [playTimeHours, setPlayTimeHours] = useState("");
  const [notes, setNotes] = useState("");
  const [screenshots, setScreenshots] = useState<Array<{ url: string; caption: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset platform when game changes
  useEffect(() => {
    setPlatform("");
  }, [selectedGame]);

  const handleFileUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Upload failed");
    }

    const data = await response.json();
    return data.url;
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const url = await handleFileUpload(file);
        setScreenshots((prev) => [...prev, { url, caption: "" }]);
      }
    } catch (error) {
      console.error("Screenshot upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload screenshots";
      setError(errorMessage);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedGame) {
      setError("Please select a game");
      return;
    }

    if (!platform) {
      setError("Please enter a platform");
      return;
    }

    setLoading(true);

    try {
      // First, ensure the game exists in our database
      const gameResponse = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          igdbId: selectedGame.id,
          title: selectedGame.name,
          coverUrl: selectedGame.cover?.url
            ? selectedGame.cover.url.replace("//", "https://").replace("t_thumb", "t_cover_big")
            : null,
        }),
      });

      const gameData = await gameResponse.json();
      const gameId = gameData.game.id;

      // Create the currently playing entry
      const response = await fetch("/api/currently-playing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          platform,
          startDate: startDate || null,
          playTimeHours: playTimeHours ? parseFloat(playTimeHours) : null,
          notes: notes || null,
          screenshots,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create currently playing entry");
      }

      const data = await response.json();
      router.push(`/profile/${data.currentlyPlaying.userId}`);
    } catch (error) {
      setError("Failed to create currently playing entry");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Game Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <GameSearch onSelectGame={setSelectedGame} selectedGame={selectedGame} />
          
          <div className="space-y-2">
            <Label htmlFor="platform">Platform *</Label>
            {selectedGame && selectedGame.platforms && selectedGame.platforms.length > 0 ? (
              <Select value={platform} onValueChange={setPlatform} required>
                <SelectTrigger id="platform" className="w-full">
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {selectedGame.platforms.map((p) => (
                    <SelectItem key={p.id} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="platform"
                placeholder={selectedGame ? "No platforms available - enter manually" : "Select a game first"}
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                required
                disabled={!selectedGame}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Progress Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Share your thoughts about the game so far..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Playtime Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="playTimeHours">Play Time (hours)</Label>
              <Input
                id="playTimeHours"
                type="number"
                min="0"
                step="0.5"
                placeholder="0"
                value={playTimeHours}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setPlayTimeHours("");
                    return;
                  }
                  const numValue = parseFloat(value);
                  if (numValue >= 0) {
                    setPlayTimeHours(value);
                  }
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  if (value !== "" && parseFloat(value) < 0) {
                    setPlayTimeHours("0");
                  }
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Screenshots</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="screenshots">Screenshots (optional)</Label>
            <Input
              id="screenshots"
              type="file"
              accept="image/*"
              multiple
              onChange={handleScreenshotUpload}
              disabled={uploading}
            />
            {uploading && (
              <p className="text-sm text-muted-foreground">Uploading files...</p>
            )}
            {screenshots.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {screenshots.map((screenshot, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={screenshot.url}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setScreenshots((prev) => prev.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={loading || uploading}>
        {loading ? "Adding Game..." : "Add to Currently Playing"}
      </Button>
    </form>
  );
}

