import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();

        const response = await fetch('http://localhost:8085/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
        });

        const data = await response.json();

        const res = NextResponse.json(data, { status: response.status });

        // Set cookie để middleware đọc được
        if (response.ok && data.token) {
            res.cookies.set('token', data.token, {
                httpOnly: false,
                path: '/',
                maxAge: 60 * 60 * 24, // 1 ngày
                sameSite: 'lax',
            });
        }

        return res;
    } catch (error) {
        console.error('Login proxy error:', error);
        return NextResponse.json(
            { message: 'Backend service unavailable. Please ensure UserService is running on port 8085.' },
            { status: 503 }
        );
    }
}