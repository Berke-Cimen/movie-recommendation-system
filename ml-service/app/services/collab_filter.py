from surprise import SVD
from surprise.dataset import Dataset
from surprise.reader import Reader
import pandas as pd


class CollaborativeFiltering:
    def __init__(self):
        self._model = None
        self._trained = False

    def fit(self, ratings_df: pd.DataFrame) -> None:
        """Train SVD on user ratings data.

        Args:
            ratings_df: DataFrame with columns ['user_id', 'movie_id', 'rating']
        """
        reader = Reader(rating_scale=(0.5, 5.0))
        data = Dataset.load_from_df(
            ratings_df[['user_id', 'movie_id', 'rating']], reader
        )
        trainset = data.build_full_trainset()
        self._model = SVD()
        self._model.fit(trainset)
        self._trained = True

    def predict(self, user_id: int, movie_id: int) -> float:
        """Predict rating for a user-movie pair.

        Args:
            user_id: The user ID
            movie_id: The movie ID

        Returns:
            Predicted rating
        """
        if not self._trained:
            raise RuntimeError("Model not trained. Call fit() first.")
        return self._model.predict(user_id, movie_id).est

    def get_recommendations(
        self,
        user_id: int,
        rated_movie_ids: list[int],
        exclude_ids: list[int],
        limit: int,
    ) -> list[tuple[int, float]]:
        """Get top movie recommendations for a user.

        Args:
            user_id: The user ID
            rated_movie_ids: Movie IDs the user has already rated
            exclude_ids: Additional movie IDs to exclude
            limit: Maximum number of recommendations to return

        Returns:
            List of (movie_id, predicted_rating) tuples
        """
        if not self._trained:
            raise RuntimeError("Model not trained. Call fit() first.")

        all_excluded = set(rated_movie_ids) | set(exclude_ids)

        # For simplicity, return top-rated movies by predicted rating
        # In production, this would iterate over candidate movies
        results = []
        for movie_id in range(1, 10000):
            if movie_id not in all_excluded:
                pred = self._model.predict(user_id, movie_id).est
                results.append((movie_id, pred))
                if len(results) >= limit * 10:
                    break

        results.sort(key=lambda x: x[1], reverse=True)
        return results[:limit]

    def is_ready(self) -> bool:
        """Check if the model is trained and ready.

        Returns:
            True if trained, False otherwise
        """
        return self._trained
