from typing import Any


class Explainer:
    """Generates human-readable explanations for movie recommendations."""

    def generate(
        self,
        movie_id: int,
        movie_features: dict[str, Any],
        user_rated_movies: list[int],
        content_score: float,
        collab_score: float,
    ) -> tuple[list[str], float]:
        """Generate explanation for a movie recommendation.

        Args:
            movie_id: The recommended movie ID
            movie_features: Dictionary of movie features (title, genres, etc.)
            user_rated_movies: List of movie IDs the user has already rated
            content_score: Content-based similarity score
            collab_score: Collaborative filtering score

        Returns:
            Tuple of (list of reason strings, confidence float between 0 and 1)
        """
        reasons = []
        confidence = 0.0

        genres = movie_features.get("genres", [])
        if genres and isinstance(genres, list):
            top_genres = genres[:3]
            reasons.append(f"Matches your interest in {' & '.join(top_genres)} movies")

        if content_score > 0.7:
            reasons.append("Highly similar to movies you enjoyed")
            confidence += content_score * 0.5
        elif content_score > 0.4:
            reasons.append("Similar to your preferred content")
            confidence += content_score * 0.3

        if collab_score > 0.7:
            reasons.append("Recommended by users with similar taste")
            confidence += collab_score * 0.5
        elif collab_score > 0.4:
            reasons.append("Popular among users like you")
            confidence += collab_score * 0.3

        title = movie_features.get("title", "This movie")
        if movie_id in user_rated_movies:
            reasons = [f"You already rated {title}"]
            confidence = 1.0

        confidence = min(confidence, 1.0)
        if not reasons:
            reasons = [f"Recommended {title} for you"]

        return reasons, confidence
