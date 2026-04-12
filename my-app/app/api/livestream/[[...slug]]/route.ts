import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  
  // Extract path after /api/livestream
  const match = pathname.match(/\/api\/livestream(.*)/);
  const path = '/api/livestream' + (match?.[1] || '');
  
  console.log(`[API GET] ${path}`);
  
  try {
    const backendUrl = `http://localhost:8086${path}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    console.log(`[API GET] Connecting to ${backendUrl}`);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log(`[API GET] Response status: ${response.status}`);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`[API GET] Error:`, error);
    return NextResponse.json(
      { error: 'Backend unavailable', message: String(error) },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Extract path after /api/livestream
  const match = pathname.match(/\/api\/livestream(.*)/);
  const path = '/api/livestream' + (match?.[1] || '');
  
  console.log(`[API POST] ${path}`);
  
  try {
    // Extract headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    const userId = request.headers.get('userid') || request.headers.get('userId');
    const username = request.headers.get('username');
    
    if (userId) headers['userId'] = userId;
    if (username) headers['username'] = username;

    let body: any = undefined;
    try {
      const text = await request.text();
      body = text ? JSON.parse(text) : undefined;
    } catch (e) {
      console.log('[API POST] Could not parse body');
    }

    const backendUrl = `http://localhost:8086${path}`;
    console.log(`[API POST] Connecting to ${backendUrl}`, { headers, bodyType: body ? 'object' : 'empty' });
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    console.log(`[API POST] Response status: ${response.status}`);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`[API POST] Error:`, error);
    return NextResponse.json(
      { error: 'Backend unavailable', message: String(error) },
      { status: 503 }
    );
  }
}
