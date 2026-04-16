"use client";

import { useState } from "react";
import styles from "./register.module.css";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const API_URL = "/api/auth/register";

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
          "Accept": "application/json",
        },
        mode: "cors",
        credentials: "include",
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password.trim(),
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Lỗi không xác định" }));
        let errorMsg = "Có lỗi xảy ra, vui lòng thử lại!";
        if (errorData.message) {
          errorMsg = errorData.message;
        } else if (errorData.messages) {
          errorMsg = Object.values(errorData.messages).join(" | ");
        }
        setMessage({ text: errorMsg, type: "error" });
        return;
      }

      const data = await response.json();
      setMessage({ text: `Đăng ký thành công! Chào mừng ${data.fullName}`, type: "success" });
      setFormData({ username: "", password: "", fullName: "", email: "", address: "" });
    } catch (error) {
      console.error("Fetch error:", error);
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      setMessage({ 
        text: `Lỗi kết nối đến API Gateway (${API_URL}). Vui lòng kiểm tra:\n1. API Gateway đang chạy ở port 8080\n2. User Service đang chạy ở port 8085\n3. CORS đã được cấu hình đúng\n\nChi tiết: ${errorMessage}`, 
        type: "error" 
      });
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
            <h1>Tạo tài khoản</h1>
            <p>Tham gia vào hệ thống hệ vi dịch vụ Anvi System.</p>
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
                minLength={3}
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
                placeholder="Mật khẩu bảo mật"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="fullName">Họ và tên</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="VD: Nguyễn Văn A"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Địa chỉ email liên hệ"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="address">Địa chỉ (Tuỳ chọn)</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Nhập nơi bạn đang sống"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className={`${styles.btnPrimary} ${loading ? styles.btnLoading : ""}`} disabled={loading}>
              <span className={styles.btnText}>ĐĂNG KÝ NGAY</span>
              {loading && <span className={styles.loader}></span>}
            </button>
          </form>

          <div className={styles.footerForm}>
            <p>
              Đã có tài khoản? <Link href="/login">Đăng nhập ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
