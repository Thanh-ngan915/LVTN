"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./change-password.module.css";

export default function ChangePasswordPage() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setMessage({ text: "Mật khẩu mới không khớp", type: "error" });
            return;
        }
        setSaving(true);
        setMessage(null);

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (!token || !storedUser) { router.push("/login"); return; }
        const userId = JSON.parse(storedUser).userId;

        try {
            const res = await fetch(`/api/users/${userId}/password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
                },
                body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || "Đổi mật khẩu thất bại");
            }

            setMessage({ text: "Đổi mật khẩu thành công!", type: "success" });
            setTimeout(() => router.push("/profile"), 1200);
        } catch (err: any) {
            setMessage({ text: err.message || "Lỗi kết nối", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <button onClick={() => router.push("/profile")} className={styles.back}>
                    ← Quay lại
                </button>
                <h1 className={styles.title}>Đổi mật khẩu</h1>
                <p className={styles.subtitle}>Nhập mật khẩu hiện tại và mật khẩu mới</p>

                {message && (
                    <div className={`${styles.alert} ${message.type === "success" ? styles.alertSuccess : styles.alertError}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label className={styles.label}>Mật khẩu hiện tại</label>
                        <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)}
                               className={styles.input} placeholder="Nhập mật khẩu hiện tại" required />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Mật khẩu mới</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                               className={styles.input} placeholder="Tối thiểu 8 ký tự" required minLength={8} />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Xác nhận mật khẩu mới</label>
                        <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)}
                               className={styles.input} placeholder="Nhập lại mật khẩu mới" required minLength={8} />
                    </div>
                    <div className={styles.actions}>
                        <button type="button" onClick={() => router.push("/profile")} className={styles.cancelBtn}>Hủy</button>
                        <button type="submit" disabled={saving} className={styles.saveBtn}>
                            {saving ? "Đang lưu..." : "Xác nhận"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}