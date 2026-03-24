"use client";

import MovieCarousel from "@/components/MovieCarousel";
import { useAppStore } from "@/store/useAppStore";

export default function Home() {
  const { trendingMovies, popularMovies, topRatedMovies, recommendedMovies } =
    useAppStore();

  return (
    <div className="space-y-12 pb-8">
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Discover Your Next Favorite Movie
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            AI-powered recommendations tailored just for you
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 space-y-12">
        <MovieCarousel title="Trending Now" movies={trendingMovies} />
        <MovieCarousel title="Popular This Week" movies={popularMovies} />
        <MovieCarousel title="Top Rated" movies={topRatedMovies} />
        <MovieCarousel title="Recommended For You" movies={recommendedMovies} />
      </div>
    </div>
  );
}
