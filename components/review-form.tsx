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

export function ReviewForm() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [rating, setRating] = useState<string>("5");
  const [platform, setPlatform] = useState("");
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [playTimeHours, setPlayTimeHours] = useState("");
  const [content, setContent] = useState("");
  const [screenshots, setScreenshots] = useState<Array<{ url: string; caption: string }>>([]);
  const [saveFile, setSaveFile] = useState<{ url: string; filename: string } | null>(null);
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
    setError(""); // Clear previous errors
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
      // Reset the file input so the same file can be selected again
      e.target.value = "";
    }
  };

  const handleSaveFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(""); // Clear previous errors
    try {
      const url = await handleFileUpload(file);
      setSaveFile({ url, filename: file.name });
    } catch (error) {
      console.error("Save file upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload save file";
      setError(errorMessage);
    } finally {
      setUploading(false);
      // Reset the file input so the same file can be selected again
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

    // Validate rating
    const ratingValue = parseFloat(rating);
    if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 10) {
      setError("Rating must be between 0 and 10");
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

      // Create the review
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          rating: parseFloat(rating),
          platform,
          startDate: startDate || null,
          finishDate: finishDate || null,
          playTimeHours: playTimeHours ? parseFloat(playTimeHours) : null,
          content: content || null,
          screenshots,
          saveFile,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create review");
      }

      const data = await response.json();
      router.push(`/reviews/${data.review.id}`);
    } catch (error) {
      setError("Failed to create review");
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
          <CardTitle className="text-xl">Your Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                // Allow empty string for clearing
                if (value === "") {
                  setRating("");
                  return;
                }
                const numValue = parseFloat(value);
                // Only update if within valid range
                if (numValue >= 0 && numValue <= 10) {
                  setRating(value);
                }
              }}
              onBlur={(e) => {
                // On blur, ensure we have a valid value
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
              className={
                rating !== "" && (parseFloat(rating) < 0 || parseFloat(rating) > 10)
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {rating !== "" && (parseFloat(rating) < 0 || parseFloat(rating) > 10) && (
              <p className="text-sm text-red-600">Rating must be between 0 and 10</p>
            )}
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
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Playtime Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label htmlFor="finishDate">Finish Date</Label>
              <Input
                id="finishDate"
                type="date"
                value={finishDate}
                onChange={(e) => setFinishDate(e.target.value)}
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
                  // Allow empty string
                  if (value === "") {
                    setPlayTimeHours("");
                    return;
                  }
                  const numValue = parseFloat(value);
                  // Only update if non-negative
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
          <CardTitle className="text-xl">Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="screenshots">Screenshots</Label>
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

          <div className="space-y-2">
            <Label htmlFor="saveFile">Save File (optional)</Label>
            <Input
              id="saveFile"
              type="file"
              onChange={handleSaveFileUpload}
              disabled={uploading}
            />
            {uploading && (
              <p className="text-sm text-muted-foreground">Uploading file...</p>
            )}
            {saveFile && (
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">{saveFile.filename}</span>
                <button
                  type="button"
                  onClick={() => setSaveFile(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={loading || uploading}>
        {loading ? "Creating Review..." : "Create Review"}
      </Button>
    </form>
  );
}


