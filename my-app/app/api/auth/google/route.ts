import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json(
        { message: 'Authorization code is missing' },
        { status: 400 }
      );
    }
    
    // Forward request to UserService directly (bypass API Gateway)
    const response = await fetch(`http://localhost:8085/api/auth/google/callback?code=${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Google auth proxy error:', error);
    return NextResponse.json(
      { message: 'Backend service unavailable. Please ensure UserService is running on port 8085.' },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    
    // Forward request to UserService directly (bypass API Gateway)
    const response = await fetch('http://localhost:8085/api/auth/google/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    const data = await response.json();
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Google auth proxy error:', error);
    return NextResponse.json(
      { message: 'Backend service unavailable. Please ensure UserService is running on port 8085.' },
      { status: 503 }
    );
  }
}
