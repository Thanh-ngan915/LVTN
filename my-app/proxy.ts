import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/admin")) {
        const token = request.cookies.get("token")?.value;
        if (!token) return NextResponse.redirect(new URL("/login", request.url));

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/", request.url));
            }
        } catch {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};