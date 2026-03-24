import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(`${ML_SERVICE_URL}/watchlist`, {
      params: { user_id: userId },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, movieId } = body;

    if (!userId || !movieId) {
      return NextResponse.json(
        { error: 'userId and movieId are required' },
        { status: 400 }
      );
    }

    const response = await axios.post(`${ML_SERVICE_URL}/watchlist`, {
      user_id: userId,
      movie_id: movieId,
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add to watchlist' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const movieId = searchParams.get('movieId');

  if (!userId || !movieId) {
    return NextResponse.json(
      { error: 'userId and movieId are required' },
      { status: 400 }
    );
  }

  try {
    await axios.delete(`${ML_SERVICE_URL}/watchlist`, {
      params: { user_id: userId, movie_id: movieId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove from watchlist' }, { status: 500 });
  }
}
