import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    
    // Forward request to UserService directly (bypass API Gateway)
    const response = await fetch('http://localhost:8085/api/auth/register', {
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
    console.error('Register proxy error:', error);
    return NextResponse.json(
      { message: 'Backend service unavailable. Please ensure UserService is running on port 8085.' },
      { status: 503 }
    );
  }
}
