"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./edit-username.module.css";

export default function EditUsernamePage() {
    const [newUsername, setNewUsername] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (!token || !storedUser) { router.push("/login"); return; }
        const userId = JSON.parse(storedUser).userId;

        try {
            const res = await fetch(
                `/api/users/${userId}/username?newUsername=${encodeURIComponent(newUsername)}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || "Đổi username thất bại");
            }

            // Cập nhật lại localStorage
            const userData = JSON.parse(storedUser);
            userData.username = newUsername;
            localStorage.setItem("user", JSON.stringify(userData));

            setMessage({ text: "Đổi username thành công!", type: "success" });
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
                <h1 className={styles.title}>Đổi tên đăng nhập</h1>
                <p className={styles.subtitle}>Username mới sẽ được dùng để đăng nhập</p>

                {message && (
                    <div className={`${styles.alert} ${message.type === "success" ? styles.alertSuccess : styles.alertError}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label className={styles.label}>Username mới</label>
                        <input
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className={styles.input}
                            placeholder="Nhập username mới"
                            required
                            minLength={3}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={() => router.push("/profile")}
                            className={styles.cancelBtn}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className={styles.saveBtn}
                        >
                            {saving ? "Đang lưu..." : "Xác nhận"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}