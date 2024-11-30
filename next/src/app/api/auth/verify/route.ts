import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/utils/jwt';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'Token valid',
      user: payload
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}