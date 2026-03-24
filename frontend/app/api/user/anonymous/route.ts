import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST() {
  try {
    const anonymousId = uuidv4();

    return NextResponse.json({
      userId: anonymousId,
      isAnonymous: true,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create anonymous user' }, { status: 500 });
  }
}
