"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

interface Review {
  id: string;
  rating: number;
  platform: string;
  startDate?: string | null;
  finishDate?: string | null;
  playTimeHours?: number | null;
  content?: string | null;
  game: {
    id: string;
    title: string;
    coverUrl?: string | null;
    platforms?: string | null;
  };
  screenshots: Array<{
    id: string;
    url: string;
    caption?: string | null;
  }>;
  saveFile?: {
    id: string;
    url: string;
    filename: string;
  } | null;
}

interface EditReviewFormProps {
  review: Review;
}

export function EditReviewForm({ review }: EditReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState<string>(review.rating.toString());
  const [platform, setPlatform] = useState(review.platform);
  const [startDate, setStartDate] = useState(
    review.startDate ? new Date(review.startDate).toISOString().split("T")[0] : ""
  );
  const [finishDate, setFinishDate] = useState(
    review.finishDate ? new Date(review.finishDate).toISOString().split("T")[0] : ""
  );
  const [playTimeHours, setPlayTimeHours] = useState(
    review.playTimeHours ? review.playTimeHours.toString() : ""
  );
  const [content, setContent] = useState(review.content || "");
  const [existingScreenshots, setExistingScreenshots] = useState<Array<{ id: string; url: string; caption: string }>>(
    review.screenshots.map((s) => ({ id: s.id, url: s.url, caption: s.caption || "" }))
  );
  const [newScreenshots, setNewScreenshots] = useState<Array<{ url: string; caption: string }>>([]);
  const [screenshotsToRemove, setScreenshotsToRemove] = useState<string[]>([]);
  const [saveFile, setSaveFile] = useState<{ url: string; filename: string } | null>(
    review.saveFile ? { url: review.saveFile.url, filename: review.saveFile.filename } : null
  );
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availablePlatforms = review.game.platforms
    ? JSON.parse(review.game.platforms)
    : [];

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
        setNewScreenshots((prev) => [...prev, { url, caption: "" }]);
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

  const handleRemoveExistingScreenshot = (id: string) => {
    setExistingScreenshots((prev) => prev.filter((s) => s.id !== id));
    setScreenshotsToRemove((prev) => [...prev, id]);
  };

  const handleRemoveNewScreenshot = (index: number) => {
    setNewScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const url = await handleFileUpload(file);
      setSaveFile({ url, filename: file.name });
    } catch (error) {
      console.error("Save file upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload save file";
      setError(errorMessage);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: parseFloat(rating),
          platform,
          startDate: startDate || null,
          finishDate: finishDate || null,
          playTimeHours: playTimeHours ? parseFloat(playTimeHours) : null,
          content: content || null,
          screenshotsToAdd: newScreenshots.length > 0 ? newScreenshots : undefined,
          screenshotsToRemove: screenshotsToRemove.length > 0 ? screenshotsToRemove : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update review");
      }

      const data = await response.json();
      router.push(`/reviews/${review.id}`);
      router.refresh();
    } catch (error) {
      setError("Failed to update review");
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
          <div className="space-y-2">
            <Label>Game</Label>
            <div className="p-3 bg-muted rounded-md">
              <p className="font-semibold">{review.game.title}</p>
              <p className="text-sm text-muted-foreground">Game cannot be changed when editing</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="platform">Platform *</Label>
            {availablePlatforms && availablePlatforms.length > 0 ? (
              <Select value={platform} onValueChange={setPlatform} required>
                <SelectTrigger id="platform" className="w-full">
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlatforms.map((p: any) => (
                    <SelectItem key={p.id} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="platform"
                placeholder="Enter platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                required
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
            
            {(existingScreenshots.length > 0 || newScreenshots.length > 0) && (
              <div className="space-y-3 mt-3">
                {existingScreenshots.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Current Screenshots</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {existingScreenshots.map((screenshot) => (
                        <div key={screenshot.id} className="relative group">
                          <img
                            src={screenshot.url}
                            alt="Screenshot"
                            className="w-full h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingScreenshot(screenshot.id)}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {newScreenshots.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">New Screenshots</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {newScreenshots.map((screenshot, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={screenshot.url}
                            alt={`New screenshot ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewScreenshot(index)}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Current Save File</Label>
            <p className="text-sm text-muted-foreground">
              Save file editing is not yet supported. To change the save file, please delete and recreate the review.
            </p>
            {saveFile && (
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">{saveFile.filename}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" size="lg" className="flex-1" disabled={loading || uploading}>
          {loading ? "Updating Review..." : "Update Review"}
        </Button>
      </div>
    </form>
  );
}

