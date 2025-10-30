"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Search } from "lucide-react";
import Image from "next/image";

interface Game {
  id: number;
  name: string;
  cover?: {
    url: string;
  };
  summary?: string;
  platforms?: Array<{
    id: number;
    name: string;
  }>;
}

interface GameSearchProps {
  onSelectGame: (game: Game) => void;
  selectedGame?: Game | null;
}

export function GameSearch({ onSelectGame, selectedGame }: GameSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/games/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.games || []);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectGame = (game: Game) => {
    onSelectGame(game);
    setQuery("");
    setShowResults(false);
  };

  const handleClearSelection = () => {
    onSelectGame(null as any);
    setQuery("");
  };

  if (selectedGame) {
    return (
      <div className="space-y-2">
        <Label>Selected Game</Label>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-4">
            {selectedGame.cover?.url && (
              <div className="relative w-20 h-28 flex-shrink-0 rounded-md overflow-hidden shadow-md">
                <Image
                  src={selectedGame.cover.url.replace("//", "https://").replace("t_thumb", "t_cover_small")}
                  alt={selectedGame.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-lg leading-tight mb-1">
                    {selectedGame.name}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      IGDB ID: {selectedGame.id}
                    </Badge>
                    {selectedGame.platforms && selectedGame.platforms.length > 0 && (
                      selectedGame.platforms.slice(0, 4).map((platform) => (
                        <Badge key={platform.id} variant="outline" className="text-xs">
                          {platform.name}
                        </Badge>
                      ))
                    )}
                    {selectedGame.platforms && selectedGame.platforms.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{selectedGame.platforms.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="flex-shrink-0 p-1.5 hover:bg-red-100 dark:hover:bg-red-950/30 rounded-full transition-colors group"
                  title="Change game"
                >
                  <X className="h-4 w-4 text-muted-foreground group-hover:text-red-600 dark:group-hover:text-red-400" />
                </button>
              </div>
              {selectedGame.summary && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                  {selectedGame.summary}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2" ref={searchRef}>
      <Label htmlFor="game-search">Search for a game</Label>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="game-search"
            type="text"
            placeholder="Type to search games..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setShowResults(true);
            }}
            className="pl-9"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}
        </div>

        {showResults && results.length > 0 && (
          <Card className="absolute z-50 w-full max-h-96 overflow-y-auto mt-2 shadow-lg">
            <div className="p-1">
              {results.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => handleSelectGame(game)}
                  className="w-full flex items-start gap-3 p-3 hover:bg-accent rounded-lg transition-colors text-left"
                >
                  {game.cover?.url && (
                    <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={game.cover.url.replace("//", "https://").replace("t_thumb", "t_cover_small")}
                        alt={game.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm leading-tight mb-1">{game.name}</p>
                    {game.platforms && game.platforms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1">
                        {game.platforms.slice(0, 3).map((platform) => (
                          <Badge key={platform.id} variant="outline" className="text-xs py-0 px-1.5">
                            {platform.name}
                          </Badge>
                        ))}
                        {game.platforms.length > 3 && (
                          <Badge variant="outline" className="text-xs py-0 px-1.5">
                            +{game.platforms.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    {game.summary && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {game.summary}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {query.length >= 2 && !loading && results.length === 0 && (
          <Card className="absolute z-50 w-full mt-2 p-4 text-center text-sm text-muted-foreground">
            No games found. Try a different search term.
          </Card>
        )}
      </div>
    </div>
  );
}


