"use client";

import { cn, getImageUrl } from "@/lib/utils";
import { Movie } from "@/types";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export function MovieCard({ movie, className }: MovieCardProps) {
  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  return (
    <Link
      href={`/movie/${movie.id}`}
      className={cn(
        "group relative overflow-hidden rounded-lg transition-transform duration-200 hover:scale-105",
        className
      )}
    >
      <div className="aspect-[2/3] relative">
        <Image
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {movie.vote_average > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 px-2 py-1 rounded-full">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-white">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}
      </div>
      <div className="p-2">
        <h3 className="font-semibold text-sm truncate">{movie.title}</h3>
        {year && <p className="text-xs text-muted-foreground">{year}</p>}
      </div>
    </Link>
  );
}
