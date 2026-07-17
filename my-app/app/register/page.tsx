"use client";

import { useState, useEffect } from "react";
import styles from "./register.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    address: "",
  });
  const [token, setToken] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    const e = params.get("email");
    if (t && e) {
      setToken(t);
      setFormData(prev => ({ ...prev, email: e }));
      setIsVerifying(false);
    }
  }, []);

  const API_REGISTER = "/api/auth/register";
  const API_SEND_LINK = "/api/auth/send-link";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setMessage({ text: "Vui lòng nhập email.", type: "error" });
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(API_SEND_LINK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email.trim() }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage({ text: data.message || "Không thể gửi email xác thực.", type: "error" });
      } else {
        setMessage({ text: "Link xác thực đã được gửi! Vui lòng kiểm tra hộp thư email của bạn.", type: "success" });
      }
    } catch (error) {
      setMessage({ text: "Lỗi kết nối. Vui lòng thử lại sau.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(API_REGISTER, {
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
          token: token,
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
      setMessage({ text: `Đăng ký thành công! Chào mừng ${data.fullName}. Đang chuyển hướng sang trang đăng nhập...`, type: "success" });
      setFormData({ username: "", password: "", fullName: "", email: "", address: "" });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Fetch error:", error);
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      setMessage({
        text: `Lỗi kết nối đến API Gateway. Vui lòng thử lại sau.\nChi tiết: ${errorMessage}`,
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
            <div className={`${styles.alert} ${message.type === "success" ? styles.success : message.type === "error" ? styles.error : styles.info}`}>
              {message.text}
            </div>
          )}

          {isVerifying ? (
            <form onSubmit={handleSendLink}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email của bạn</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Nhập địa chỉ email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className={`${styles.btnPrimary} ${loading ? styles.btnLoading : ""}`} disabled={loading}>
                <span className={styles.btnText}>GỬI LINK XÁC THỰC</span>
                {loading && <span className={styles.loader}></span>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  style={{ backgroundColor: "rgba(255,255,255,0.1)", cursor: "not-allowed", color: "#94a3b8" }}
                />
              </div>

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



              <button type="submit" className={`${styles.btnPrimary} ${loading ? styles.btnLoading : ""}`} disabled={loading}>
                <span className={styles.btnText}>HOÀN TẤT ĐĂNG KÝ</span>
                {loading && <span className={styles.loader}></span>}
              </button>
            </form>
          )}

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
