import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // Xử lý gửi API lên backend
        const backendUrl = "http://userservice:8085/api/auth/send-verification-link";
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || "Failed to send link" },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
