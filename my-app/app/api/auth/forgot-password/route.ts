import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8085';
    const response = await fetch(`${userServiceUrl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Forgot password proxy error:', error?.message || error);
    return NextResponse.json(
      { message: 'Backend service unavailable. Please ensure UserService is running on port 8085.' },
      { status: 503 }
    );
  }
}
