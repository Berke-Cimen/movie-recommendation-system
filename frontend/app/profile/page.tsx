"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userApi, watchlistApi, ratingsApi } from "@/lib/api";
import { Session, User } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon, Film, Star, LogOut, Link2 } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sessionData, watchlistData, ratingsData] = await Promise.all([
          userApi.getSession(),
          watchlistApi.get(),
          ratingsApi.get(),
        ]);
        setSession(sessionData);
        setWatchlistCount(watchlistData.watchlist?.length || 0);
        setRatingsCount(ratingsData.ratings?.length || 0);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        // User not logged in - redirect to sign in
        router.push("/auth/signin");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await userApi.logout();
      router.push("/auth/signin");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const handleLinkGoogle = async () => {
    // This would trigger the Google OAuth flow
    // For now, we'll just show an alert
    alert("Google account linking would be initiated here.");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-12 w-48" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Redirecting
  }

  const { user } = session;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>

        {/* User Info Card */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="h-8 w-8 text-primary" />
              )}
            </div>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>
                {user.isAnonymous ? "Guest Account" : user.email}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!user.isAnonymous && (
              <Button variant="outline" onClick={handleLinkGoogle}>
                <Link2 className="h-4 w-4 mr-2" />
                Link Google Account
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Movies Rated</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ratingsCount}</div>
              <p className="text-xs text-muted-foreground">
                Your personal ratings
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
              <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{watchlistCount}</div>
              <p className="text-xs text-muted-foreground">
                Movies in your list
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sign Out */}
        <Card>
          <CardContent className="pt-6">
            <Button variant="destructive" onClick={handleSignOut} className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
