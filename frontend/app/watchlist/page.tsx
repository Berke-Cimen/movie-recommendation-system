"use client";

import { useEffect, useState } from "react";
import { watchlistApi } from "@/lib/api";
import { WatchlistItem } from "@/types";
import { MovieCard } from "@/components/movie/movie-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Film } from "lucide-react";
import Link from "next/link";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWatchlist() {
      try {
        const { watchlist: items } = await watchlistApi.get();
        setWatchlist(items);
      } catch (error) {
        console.error("Failed to fetch watchlist:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWatchlist();
  }, []);

  const handleRemove = async (item: WatchlistItem) => {
    setRemovingId(item.id);
    try {
      await watchlistApi.remove(item.movieId);
      setWatchlist((prev) => prev.filter((i) => i.id !== item.id));
    } catch (error) {
      console.error("Failed to remove from watchlist:", error);
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/3] rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Film className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your watchlist is empty</h1>
        <p className="text-muted-foreground mb-8">
          Start adding movies to your watchlist to see them here.
        </p>
        <Button asChild>
          <Link href="/">Browse Movies</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {watchlist.map((item) => (
          <div key={item.id} className="relative group">
            <MovieCard movie={item.movie} />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemove(item)}
              disabled={removingId === item.id}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
