"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./forgot-password.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ text: data.message || "Có lỗi xảy ra. Vui lòng thử lại.", type: "error" });
        return;
      }

      setSubmitted(true);
      setMessage({ text: data.message, type: "success" });
    } catch (error) {
      setMessage({ text: "Không thể kết nối đến server. Vui lòng thử lại.", type: "error" });
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
            <div className={styles.iconWrapper}>🔑</div>
            <h1>Quên mật khẩu</h1>
            <p>Nhập email đăng ký để nhận link đặt lại mật khẩu</p>
          </div>

          {message && (
            <div className={`${styles.alert} ${message.type === "success" ? styles.success : styles.error}`}>
              {message.text}
            </div>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Địa chỉ Email</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>✉️</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`${styles.btnPrimary} ${loading ? styles.btnLoading : ""}`}
                disabled={loading}
              >
                <span className={styles.btnText}>GỬI LINK ĐẶT LẠI MẬT KHẨU</span>
                {loading && <span className={styles.loader}></span>}
              </button>
            </form>
          ) : (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>📬</div>
              <h3>Kiểm tra hộp thư của bạn!</h3>
              <p>
                Chúng tôi đã gửi link đặt lại mật khẩu đến <strong>{email}</strong>.
                Link có hiệu lực trong <strong>15 phút</strong>.
              </p>
              <p className={styles.spamNote}>
                Không thấy email? Kiểm tra thư mục <strong>Spam / Junk Mail</strong>.
              </p>
              <button
                className={styles.btnSecondary}
                onClick={() => { setSubmitted(false); setMessage(null); setEmail(""); }}
              >
                Gửi lại email
              </button>
            </div>
          )}

          <div className={styles.footerForm}>
            <p>
              Nhớ mật khẩu rồi? <Link href="/login">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
