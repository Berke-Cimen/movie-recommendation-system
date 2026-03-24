from pydantic import BaseModel, Field
from typing import List


class RecommendRequest(BaseModel):
    user_id: int
    movie_ids: List[int]
    ratings: List[float]
    exclude_ids: List[int] = Field(default_factory=list)
    limit: int = 20
    offset: int = 0


class RecommendationExplanation(BaseModel):
    reasons: List[str]
    confidence: float


class MovieRecommendation(BaseModel):
    movie_id: int
    score: float
    explanation: RecommendationExplanation


class RecommendResponse(BaseModel):
    recommendations: List[MovieRecommendation]
    total: int


class ExplainRequest(BaseModel):
    user_id: str
    movie_id: int


class ExplainResponse(BaseModel):
    explanation: RecommendationExplanation
