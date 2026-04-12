"use client";

import { useState } from "react";
import styles from "./login.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  const API_URL = "http://localhost:8080/api/auth/login";

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
