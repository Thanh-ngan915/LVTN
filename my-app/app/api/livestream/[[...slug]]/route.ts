import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const match = pathname.match(/\/api\/auth(.*)/);
    const path = '/api/auth' + (match?.[1] || '');

    try {
        const body = await request.text();
        const response = await fetch(`http://localhost:8085${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { message: 'Backend unavailable' },
            { status: 503 }
        );
    }
}