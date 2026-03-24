import { NextRequest, NextResponse } from 'next/server';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, movie_id } = body;

    const mlResponse = await fetch(`${ML_SERVICE_URL}/api/recommend/explain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        movie_id,
      }),
    });

    if (!mlResponse.ok) {
      return NextResponse.json(
        { error: 'ML service error', details: await mlResponse.text() },
        { status: mlResponse.status }
      );
    }

    const data = await mlResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to call ML service', details: String(error) },
      { status: 500 }
    );
  }
}
