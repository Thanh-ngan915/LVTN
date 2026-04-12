"use client";

import { useState } from "react";
import styles from "./login.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

const GOOGLE_CLIENT_ID = "262862647958-7g338hg8pm0e617d0dk4c67jqumhr2nu.apps.googleusercontent.com";
const GOOGLE_REDIRECT_URI = "http://localhost:3000/auth/google/callback";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  const API_URL = "http://localhost:8080/api/auth/login";

  const handleGoogleLogin = () => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "select_account",
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok || response.status === 200) {
        // Save JWT Token
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data));
        }
        
        setMessage({ text: data.message || `Đăng nhập thành công! Chào ${data.fullName}`, type: "success" });
        
        // Optional: Redirect to Dashboard after 1.5 seconds
        // setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        let errorMsg = "Tài khoản hoặc mật khẩu không chính xác.";
        if (data.message) {
          errorMsg = data.message;
        } else if (data.messages) {
          errorMsg = Object.values(data.messages).join(" | ");
        }
        setMessage({ text: errorMsg, type: "error" });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage({ text: "Lỗi kết nối. Hãy chắc chắn API Gateway (8080) đang hoạt động.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.backgroundShapes}>
        <div className={`${styles.shape} ${styles.shape1}`}></div>
        <div className={`${styles.shape} ${styles.shape2}`}></div>
        <div className={`${styles.shape} ${styles.shape3}`}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.glassmorphism}>
          <div className={styles.header}>
            <h1>Đăng nhập</h1>
            <p>Truy cập vào hệ thống Anvi System.</p>
          </div>

          {message && (
            <div className={`${styles.alert} ${message.type === "success" ? styles.success : styles.error}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Nhập username"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Mật khẩu của bạn"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className={`${styles.btnPrimary} ${loading ? styles.btnLoading : ""}`} disabled={loading}>
              <span className={styles.btnText}>ĐĂNG NHẬP</span>
              {loading && <span className={styles.loader}></span>}
            </button>
          </form>

          <div className={styles.divider}>
            <span>HOẶC</span>
          </div>

          <button type="button" onClick={handleGoogleLogin} className={styles.btnGoogle}>
            <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: "12px" }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Đăng nhập với Google</span>
          </button>

          <div className={styles.footerForm}>
            <p>
              Chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
