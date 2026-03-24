import axios from 'axios';
import type { Movie, Recommendation, Rating, WatchlistItem, Session } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Movies API
export const moviesApi = {
  getTrending: async (params?: { page?: number; limit?: number; genre?: string }) => {
    const { data } = await api.get<{ movies: Movie[]; total: number }>('/movies', { params });
    return data;
  },
  getAll: async (params?: { page?: number; limit?: number; genre?: string }) => {
    return moviesApi.getTrending(params);
  },
  getMovie: async (id: number) => {
    const { data } = await api.get<Movie>(`/movies/${id}`);
    return data;
  },
  getById: async (id: number) => {
    return moviesApi.getMovie(id);
  },
  getPopular: async (params?: { page?: number; limit?: number }) => {
    const { data } = await api.get<{ movies: Movie[]; total: number }>('/movies/popular', { params });
    return data;
  },
  getTopRated: async (params?: { page?: number; limit?: number }) => {
    const { data } = await api.get<{ movies: Movie[]; total: number }>('/movies/top-rated', { params });
    return data;
  },
  getSimilar: async (movieId: number, params?: { limit?: number }) => {
    const { data } = await api.get<{ movies: Movie[] }>(`/movies/${movieId}/similar`, { params });
    return data;
  },
  search: async (query: string, params?: { page?: number; limit?: number }) => {
    const { data } = await api.get<{ movies: Movie[]; total: number }>('/movies/search', { params: { q: query, ...params } });
    return data;
  },
  getGenres: async () => {
    const { data } = await api.get<{ genres: string[] }>('/movies/genres');
    return data;
  },
};

// Recommendations API
export const recommendationsApi = {
  get: async (params?: { limit?: number; genres?: string[] }) => {
    const { data } = await api.get<{ recommendations: Recommendation[] }>('/recommendations', { params });
    return data;
  },
  getForUser: async (params?: { limit?: number; genres?: string[] }) => {
    return recommendationsApi.get(params);
  },
  explain: async (movieId: number) => {
    const { data } = await api.get<{ explanation: string }>(`/recommendations/${movieId}/explain`);
    return data;
  },
  explainRecommendation: async (movieId: number) => {
    return recommendationsApi.explain(movieId);
  },
  getByGenre: async (genre: string, params?: { limit?: number }) => {
    const { data } = await api.get<{ recommendations: Recommendation[] }>('/recommendations', { params: { genres: [genre], ...params } });
    return data;
  },
  getForMovie: async (movieId: number, params?: { limit?: number }) => {
    const { data } = await api.get<{ recommendations: Recommendation[] }>(`/recommendations/movie/${movieId}`, { params });
    return data;
  },
  addFeedback: async (movieId: number, feedback: 'like' | 'dislike' | 'skip') => {
    const { data } = await api.post('/recommendations/feedback', { movieId, feedback });
    return data;
  },
};

// Ratings API
export const ratingsApi = {
  get: async () => {
    const { data } = await api.get<{ ratings: Rating[] }>('/ratings');
    return data;
  },
  getUserRatings: async () => {
    return ratingsApi.get();
  },
  submit: async (movieId: number, score: number) => {
    const { data } = await api.post<Rating>('/ratings', { movieId, score });
    return data;
  },
  rate: async (movieId: number, score: number) => {
    return ratingsApi.submit(movieId, score);
  },
  update: async (ratingId: string, score: number) => {
    const { data } = await api.put<Rating>(`/ratings/${ratingId}`, { score });
    return data;
  },
  delete: async (ratingId: string) => {
    await api.delete(`/ratings/${ratingId}`);
  },
};

// Watchlist API
export const watchlistApi = {
  get: async () => {
    const { data } = await api.get<{ watchlist: WatchlistItem[] }>('/watchlist');
    return data;
  },
  add: async (movieId: number) => {
    const { data } = await api.post<WatchlistItem>('/watchlist', { movieId });
    return data;
  },
  remove: async (movieId: number) => {
    await api.delete(`/watchlist/${movieId}`);
  },
  check: async (movieId: number) => {
    const { data } = await api.get<{ inWatchlist: boolean }>(`/watchlist/${movieId}`);
    return data;
  },
};

// User API
export const userApi = {
  getProfile: async () => {
    const { data } = await api.get<Session>('/user/session');
    return data;
  },
  getSession: async () => {
    return userApi.getProfile();
  },
  getHistory: async (params?: { limit?: number; offset?: number }) => {
    const { data } = await api.get<{ history: Movie[] }>('/user/history', { params });
    return data;
  },
  createAnonymous: async () => {
    const { data } = await api.post<Session>('/user/anonymous');
    return data;
  },
  linkAccount: async (provider: 'google' | 'email', token?: string) => {
    const { data } = await api.post<Session>('/user/link', { provider, token });
    return data;
  },
  login: async (email: string, password: string) => {
    const { data } = await api.post<Session>('/user/login', { email, password });
    return data;
  },
  register: async (name: string, email: string, password: string) => {
    const { data } = await api.post<Session>('/user/register', { name, email, password });
    return data;
  },
  logout: async () => {
    await api.post('/user/logout');
  },
  updateProfile: async (updates: { name?: string; avatarUrl?: string }) => {
    const { data } = await api.put<Session>('/user/profile', updates);
    return data;
  },
};

export default api;
