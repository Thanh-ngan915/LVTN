"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#0f172a", color: "#e2e8f0" }}>
        <p>Đang tải...</p>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Đang xử lý đăng nhập bằng Google...");

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      setMessage("Bạn đã huỷ đăng nhập bằng Google.");
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    if (!code) {
      setStatus("error");
      setMessage("Không nhận được mã xác thực từ Google.");
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    // Exchange code for JWT token via backend (using Next.js proxy)
    const exchangeCode = async () => {
      try {
        const response = await fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code,
            redirectUri: "http://localhost:3000/auth/google/callback",
          }),
        });

        const data = await response.json();

        if (response.ok && data.token) {
          // Save JWT and user info
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data));

          setStatus("success");
          setMessage(`Chào mừng ${data.fullName}! Đăng nhập thành công.`);

          // Redirect to home after 1.5 seconds
          setTimeout(() => router.push("/"), 1500);
        } else {
          setStatus("error");
          setMessage(data.message || "Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
          setTimeout(() => router.push("/login"), 3000);
        }
      } catch (err) {
        console.error("Google callback error:", err);
        setStatus("error");
        setMessage("Lỗi kết nối. Hãy chắc chắn server đang hoạt động.");
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    exchangeCode();
  }, [searchParams, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "#e2e8f0",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(30, 41, 59, 0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "48px 40px",
          textAlign: "center",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        {/* Google Icon */}
        <div style={{ marginBottom: "24px" }}>
          <svg width="64" height="64" viewBox="0 0 24 24" style={{ margin: "0 auto" }}>
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        </div>

        {/* Spinner for loading */}
        {status === "loading" && (
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid rgba(99, 102, 241, 0.3)",
              borderTopColor: "#6366f1",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 24px auto",
            }}
          />
        )}

        {/* Success Icon */}
        {status === "success" && (
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "rgba(16, 185, 129, 0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px auto",
              border: "2px solid rgba(16, 185, 129, 0.5)",
            }}
          >
            <span style={{ color: "#34d399", fontSize: "24px" }}>✓</span>
          </div>
        )}

        {/* Error Icon */}
        {status === "error" && (
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "rgba(244, 63, 94, 0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px auto",
              border: "2px solid rgba(244, 63, 94, 0.5)",
            }}
          >
            <span style={{ color: "#fb7185", fontSize: "24px" }}>✗</span>
          </div>
        )}

        <h2
          style={{
            fontSize: "1.4rem",
            fontWeight: "700",
            marginBottom: "12px",
            background: "linear-gradient(to right, #60a5fa, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {status === "loading" && "Đang xác thực..."}
          {status === "success" && "Thành công!"}
          {status === "error" && "Có lỗi xảy ra"}
        </h2>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "0.95rem",
            lineHeight: "1.6",
          }}
        >
          {message}
        </p>

        {status !== "loading" && (
          <p style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "16px" }}>
            Đang chuyển hướng...
          </p>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
