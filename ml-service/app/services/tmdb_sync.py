import httpx
from typing import Any


class TMDBClient:
    """Client for interacting with The Movie Database (TMDB) API."""

    BASE_URL = "https://api.themoviedb.org/3"

    def __init__(self, api_key: str):
        """Initialize TMDB client.

        Args:
            api_key: TMDB API key for authentication
        """
        self._api_key = api_key
        self._client = httpx.AsyncClient(timeout=30.0)

    async def get_movie(self, movie_id: int) -> dict[str, Any]:
        """Fetch movie details by ID.

        Args:
            movie_id: TMDB movie ID

        Returns:
            Movie details dictionary
        """
        response = await self._client.get(
            f"{self.BASE_URL}/movie/{movie_id}",
            params={"api_key": self._api_key},
        )
        response.raise_for_status()
        return response.json()

    async def get_movie_credits(self, movie_id: int) -> dict[str, Any]:
        """Fetch movie credits (cast and crew) by movie ID.

        Args:
            movie_id: TMDB movie ID

        Returns:
            Credits dictionary containing cast and crew
        """
        response = await self._client.get(
            f"{self.BASE_URL}/movie/{movie_id}/credits",
            params={"api_key": self._api_key},
        )
        response.raise_for_status()
        return response.json()

    async def get_popular_movies(self, page: int = 1) -> dict[str, Any]:
        """Fetch popular movies.

        Args:
            page: Page number for pagination

        Returns:
            Dictionary with popular movies list and pagination info
        """
        response = await self._client.get(
            f"{self.BASE_URL}/movie/popular",
            params={"api_key": self._api_key, "page": page},
        )
        response.raise_for_status()
        return response.json()

    async def sync_movie(self, movie_id: int) -> dict[str, Any]:
        """Fetch and sync complete movie data including credits.

        Args:
            movie_id: TMDB movie ID

        Returns:
            Combined movie data with credits
        """
        movie = await self.get_movie(movie_id)
        credits_data = await self.get_movie_credits(movie_id)
        movie["credits"] = credits_data
        return movie

    async def close(self) -> None:
        """Close the HTTP client."""
        await self._client.aclose()
