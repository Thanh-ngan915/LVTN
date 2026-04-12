import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('[route] GET /api/livestream/rooms');
  
  try {
    const response = await fetch('http://localhost:8086/api/livestream/rooms', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log(`[route] Response: ${response.status}`);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[route] Error:', error);
    return NextResponse.json(
      { error: 'Backend unavailable', message: String(error) },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('[route] POST /api/livestream/rooms');
  
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    const userId = request.headers.get('userId');
    const username = request.headers.get('username');
    
    if (userId) headers['userId'] = userId;
    if (username) headers['username'] = username;

    const body = await request.json().catch(() => undefined);

    const response = await fetch('http://localhost:8086/api/livestream/rooms', {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[route] Error:', error);
    return NextResponse.json(
      { error: 'Backend unavailable', message: String(error) },
      { status: 503 }
    );
  }
}
