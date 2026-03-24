"use client";

import { Button } from "@/components/ui/button";
import { MovieCard } from "./movie-card";
import { MovieSkeleton } from "./movie-skeleton";
import { Movie } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
}

export function MovieCarousel({ title, movies, isLoading }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="opacity-80 hover:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="opacity-80 hover:opacity-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollRef}
        onScroll={updateScrollButtons}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <MovieSkeleton key={i} className="min-w-[150px]" />
            ))
          : movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                className="min-w-[150px] md:min-w-[200px]"
              />
            ))}
      </div>
    </section>
  );
}
