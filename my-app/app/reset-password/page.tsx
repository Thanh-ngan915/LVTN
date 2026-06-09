"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./reset-password.module.css";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage({ text: "Link không hợp lệ. Vui lòng yêu cầu đặt lại mật khẩu mới.", type: "error" });
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: "Mật khẩu xác nhận không khớp.", type: "error" });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ text: "Mật khẩu phải có ít nhất 6 ký tự.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: formData.newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ text: data.message || "Có lỗi xảy ra. Vui lòng thử lại.", type: "error" });
        return;
      }

      setDone(true);
      setMessage({ text: data.message, type: "success" });
      setTimeout(() => router.push("/login"), 3000);
    } catch (error) {
      setMessage({ text: "Không thể kết nối đến server. Vui lòng thử lại.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Tính strength của password
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: "Quá ngắn", color: "#ef4444", width: "20%" };
    if (pwd.length < 8) return { label: "Yếu", color: "#f59e0b", width: "40%" };
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pwd)) return { label: "Mạnh", color: "#10b981", width: "100%" };
    if (/(?=.*[a-zA-Z])(?=.*\d)/.test(pwd)) return { label: "Trung bình", color: "#3b82f6", width: "70%" };
    return { label: "Yếu", color: "#f59e0b", width: "40%" };
  };

  const strength = getPasswordStrength(formData.newPassword);

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
            <div className={styles.iconWrapper}>{done ? "✅" : "🔐"}</div>
            <h1>{done ? "Hoàn thành!" : "Tạo mật khẩu mới"}</h1>
            <p>
              {done
                ? "Mật khẩu đã được đặt lại thành công"
                : "Nhập mật khẩu mới cho tài khoản của bạn"}
            </p>
          </div>

          {message && (
            <div className={`${styles.alert} ${message.type === "success" ? styles.success : styles.error}`}>
              {message.text}
              {done && <p className={styles.redirectNote}>Đang chuyển về trang đăng nhập...</p>}
            </div>
          )}

          {!token && !done && (
            <div className={styles.invalidToken}>
              <p>🚫 Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</p>
              <Link href="/forgot-password" className={styles.btnLink}>
                Yêu cầu link mới
              </Link>
            </div>
          )}

          {token && !done && (
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="newPassword">Mật khẩu mới</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    placeholder="Tối thiểu 6 ký tự"
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {/* Password strength bar */}
                {strength && (
                  <div className={styles.strengthWrapper}>
                    <div className={styles.strengthBar}>
                      <div
                        className={styles.strengthFill}
                        style={{ width: strength.width, background: strength.color }}
                      />
                    </div>
                    <span className={styles.strengthLabel} style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {formData.confirmPassword && (
                    <span className={styles.matchIcon}>
                      {formData.newPassword === formData.confirmPassword ? "✅" : "❌"}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className={`${styles.btnPrimary} ${loading ? styles.btnLoading : ""}`}
                disabled={loading || !token}
              >
                <span className={styles.btnText}>ĐẶT LẠI MẬT KHẨU</span>
                {loading && <span className={styles.loader}></span>}
              </button>
            </form>
          )}

          {done && (
            <Link href="/login" className={styles.btnPrimary} style={{ textDecoration: "none", display: "flex", justifyContent: "center" }}>
              Đăng nhập ngay
            </Link>
          )}

          <div className={styles.footerForm}>
            <p>
              <Link href="/forgot-password">← Gửi lại email</Link>
              {" · "}
              <Link href="/login">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ color: "#fff", textAlign: "center", paddingTop: "40vh" }}>Đang tải...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
