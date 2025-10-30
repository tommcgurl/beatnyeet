"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Screenshot {
  id: string;
  url: string;
  caption?: string | null;
}

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
}

export function ScreenshotGallery({ screenshots }: ScreenshotGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < screenshots.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  if (screenshots.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {screenshots.map((screenshot, index) => (
          <button
            key={screenshot.id}
            onClick={() => setSelectedIndex(index)}
            className="relative aspect-video rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
          >
            <Image
              src={screenshot.url}
              alt={screenshot.caption || `Screenshot ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent className="max-w-5xl p-0" showCloseButton={false}>
          <VisuallyHidden>
            <DialogTitle>
              {selectedIndex !== null && screenshots[selectedIndex].caption
                ? screenshots[selectedIndex].caption
                : `Screenshot ${(selectedIndex ?? 0) + 1} of ${screenshots.length}`}
            </DialogTitle>
          </VisuallyHidden>
          {selectedIndex !== null && (
            <div className="relative">
              <div className="relative aspect-video">
                <Image
                  src={screenshots[selectedIndex].url}
                  alt={screenshots[selectedIndex].caption || `Screenshot ${selectedIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
              {screenshots[selectedIndex].caption && (
                <div className="p-4 bg-background">
                  <p className="text-sm text-muted-foreground">
                    {screenshots[selectedIndex].caption}
                  </p>
                </div>
              )}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setSelectedIndex(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {screenshots.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    onClick={handlePrevious}
                    disabled={selectedIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onClick={handleNext}
                    disabled={selectedIndex === screenshots.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-sm">
                {selectedIndex + 1} / {screenshots.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}


