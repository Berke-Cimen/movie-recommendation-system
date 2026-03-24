"use client";

import { Film } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900">
      <div className="container mx-auto flex h-16 items-center justify-center px-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Film className="h-5 w-5 text-blue-500" />
          <span className="text-sm">Powered by TMDB API</span>
        </div>
      </div>
    </footer>
  );
}
