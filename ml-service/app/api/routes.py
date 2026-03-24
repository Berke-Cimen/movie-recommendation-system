from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    RecommendRequest,
    RecommendResponse,
    ExplainRequest,
    ExplainResponse,
)
from app.services.recommender import recommend_movies, explain_recommendation

router = APIRouter()


@router.post("/recommend", response_model=RecommendResponse)
async def get_recommendations(request: RecommendRequest):
    """Get movie recommendations for a user based on their ratings."""
    try:
        recommendations, total = recommend_movies(
            user_id=request.user_id,
            movie_ids=request.movie_ids,
            ratings=request.ratings,
            exclude_ids=request.exclude_ids,
            limit=request.limit,
            offset=request.offset,
        )
        return RecommendResponse(recommendations=recommendations, total=total)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail="Service temporarily unavailable")
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/recommend/explain", response_model=ExplainResponse)
async def explain_recommend(request: ExplainRequest):
    """Get an explanation for why a movie was recommended to a user."""
    try:
        explanation = explain_recommendation(
            user_id=request.user_id,
            movie_id=request.movie_id,
        )
        return ExplainResponse(explanation=explanation)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail="Service temporarily unavailable")
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
