"use client";

import Link from "next/link";
import { Film, Search, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";

export default function Navbar() {
  const { isConnected, isAuthenticated } = useAppStore();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-8">
          <Film className="h-6 w-6 text-blue-500" />
          <span className="hidden font-bold text-lg text-white sm:inline-block">
            MovieRec
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/watchlist"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Watchlist
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Profile
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* WebSocket Connection Indicator */}
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
              title={isConnected ? "Connected" : "Disconnected"}
            />
            <span className="hidden text-xs text-gray-400 sm:inline-block">
              {isConnected ? "Live" : "Offline"}
            </span>
          </div>

          {/* Search Button */}
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5 text-gray-300" />
          </Button>

          {/* User Icon / Sign In */}
          {isAuthenticated ? (
            <Button variant="ghost" size="icon" aria-label="User profile">
              <User className="h-5 w-5 text-gray-300" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" aria-label="Sign in">
              <LogIn className="h-5 w-5 text-gray-300" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
