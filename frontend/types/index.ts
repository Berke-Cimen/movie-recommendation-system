export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
  director?: string;
  cast?: string[];
  runtime?: number;
}

export interface Recommendation {
  movieId: number;
  score: number;
  movie?: Movie;
  explanation: {
    reasons: string[];
    confidence: number;
  };
}

export interface Rating {
  id: string;
  userId: string;
  movieId: number;
  score: number;
  createdAt: string;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  movieId: number;
  movie: Movie;
  addedAt: string;
}

export interface User {
  id: string;
  email?: string;
  name: string;
  avatarUrl?: string;
  isAnonymous: boolean;
}

export interface Session {
  user: User;
  isAnonymous: boolean;
}
