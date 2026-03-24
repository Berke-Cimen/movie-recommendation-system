import axios from 'axios';
import { NextResponse } from 'next/server';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movieId = params.id;

    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'credits',
      },
    });

    const movie = {
      id: response.data.id,
      title: response.data.title,
      overview: response.data.overview,
      posterPath: response.data.poster_path,
      backdropPath: response.data.backdrop_path,
      releaseDate: response.data.release_date,
      voteAverage: response.data.vote_average,
      voteCount: response.data.vote_count,
      popularity: response.data.popularity,
      adult: response.data.adult,
      originalLanguage: response.data.original_language,
      runtime: response.data.runtime,
      budget: response.data.budget,
      revenue: response.data.revenue,
      status: response.data.status,
      tagline: response.data.tagline,
      genres: response.data.genres,
      credits: {
        cast: response.data.credits.cast.map((actor: any) => ({
          id: actor.id,
          name: actor.name,
          character: actor.character,
          profilePath: actor.profile_path,
          order: actor.order,
        })),
        crew: response.data.credits.crew.map((member: any) => ({
          id: member.id,
          name: member.name,
          job: member.job,
          department: member.department,
          profilePath: member.profile_path,
        })),
      },
    };

    return NextResponse.json({ movie });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch movie details' }, { status: 500 });
  }
}
