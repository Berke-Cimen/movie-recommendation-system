"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { moviesApi, recommendationsApi, ratingsApi, watchlistApi } from "@/lib/api";
import { Movie } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MovieCarousel } from "@/components/movie/movie-carousel";
import { Play, Plus, Check, Star, Info } from "lucide-react";

function MovieDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="relative h-[400px] md:h-[500px]">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      <div className="container mx-auto px-4 -mt-40 relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="w-[200px] h-[300px] rounded-lg shrink-0 hidden md:block" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <div className="flex gap-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StarRating({
  value,
  onChange,
  readOnly = false,
}: {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          className={`p-1 transition-colors ${
            readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
          }`}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => !readOnly && onChange?.(star)}
        >
          <Star
            className={`h-6 w-6 ${
              star <= (hover || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-500"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function RecommendationExplanation({
  movieId,
  isVisible,
}: {
  movieId: number;
  isVisible: boolean;
}) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsLoading(true);
      recommendationsApi
        .explain(movieId)
        .then((res) => setExplanation(res.explanation))
        .catch(() => setExplanation(null))
        .finally(() => setIsLoading(false));
    }
  }, [movieId, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="bg-card rounded-lg p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Info className="h-4 w-4 text-primary" />
        <h3 className="font-semibold">Why Recommended</h3>
      </div>
      {isLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : explanation ? (
        <p className="text-sm text-muted-foreground">{explanation}</p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Personalized recommendation based on your viewing history.
        </p>
      )}
    </div>
  );
}

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = Number(params.id);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [movieData, similarData] = await Promise.all([
          moviesApi.getMovie(movieId),
          moviesApi.getSimilar(movieId, { limit: 10 }),
        ]);
        setMovie(movieData);
        setSimilarMovies(similarData.movies || []);
      } catch (error) {
        console.error("Failed to fetch movie data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (movieId) {
      fetchData();
    }
  }, [movieId]);

  useEffect(() => {
    async function checkWatchlist() {
      try {
        const { inWatchlist: inList } = await watchlistApi.check(movieId);
        setInWatchlist(inList);
      } catch {
        // User not logged in or other error
      }
    }

    async function checkRating() {
      try {
        const { ratings } = await ratingsApi.getUserRatings();
        const found = ratings.find((r) => r.movieId === movieId);
        if (found) setUserRating(found.score);
      } catch {
        // User not logged in or other error
      }
    }

    checkWatchlist();
    checkRating();
  }, [movieId]);

  const handleRating = async (score: number) => {
    try {
      await ratingsApi.rate(movieId, score);
      setUserRating(score);
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  const handleWatchlist = async () => {
    try {
      if (inWatchlist) {
        await watchlistApi.remove(movieId);
        setInWatchlist(false);
      } else {
        await watchlistApi.add(movieId);
        setInWatchlist(true);
      }
    } catch (error) {
      console.error("Failed to update watchlist:", error);
    }
  };

  if (isLoading) {
    return <MovieDetailSkeleton />;
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Movie not found</h1>
        <p className="text-muted-foreground mt-2">
          The movie you are looking for does not exist.
        </p>
      </div>
    );
  }

  const year = movie.releaseDate?.split("-")[0] || "N/A";
  const runtimeHours = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  return (
    <div className="space-y-8">
      {/* Backdrop */}
      <div className="relative h-[400px] md:h-[500px]">
        {movie.backdropPath ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdropPath}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster */}
          {movie.posterPath && (
            <div className="shrink-0 hidden md:block">
              <div className="relative w-[200px] h-[300px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold">{movie.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <span>{year}</span>
                {runtimeHours && <span>{runtimeHours}</span>}
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {movie.voteAverage.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>

            {/* Director & Cast */}
            {movie.director && (
              <div>
                <span className="text-muted-foreground">Director: </span>
                <span>{movie.director}</span>
              </div>
            )}
            {movie.cast && movie.cast.length > 0 && (
              <div>
                <span className="text-muted-foreground">Cast: </span>
                <span>{movie.cast.slice(0, 5).join(", ")}</span>
              </div>
            )}

            {/* Synopsis */}
            <p className="text-lg leading-relaxed max-w-3xl">{movie.overview}</p>

            {/* User Rating */}
            <div className="space-y-2">
              <span className="text-muted-foreground">Your Rating:</span>
              <StarRating value={userRating} onChange={handleRating} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg">
                <Play className="h-5 w-5 mr-2" />
                Play
              </Button>
              <Button size="lg" variant="outline" onClick={handleWatchlist}>
                {inWatchlist ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Add to Watchlist
                  </>
                )}
              </Button>
            </div>

            {/* Recommendation Explanation */}
            <RecommendationExplanation
              movieId={movieId}
              isVisible={showExplanation}
            />
            {!showExplanation && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExplanation(true)}
              >
                <Info className="h-4 w-4 mr-2" />
                Why recommended?
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div className="container mx-auto px-4 pb-12">
          <MovieCarousel title="Similar Movies" movies={similarMovies} />
        </div>
      )}
    </div>
  );
}
