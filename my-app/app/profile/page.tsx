"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            router.push("/login");
            return;
        }

        const userData = JSON.parse(storedUser);
        const userId = userData.userId;

        if (!userId) {
           router.push("/login")
            return;
        }

        fetch(`/api/users/${userId}/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
            },
        })
            .then((res) => {
                console.log("Response status:", res.status);
                if (res.status === 403) throw new Error("Hết phiên làm việc");
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                console.log("Profile data:", data);
                setUser(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/login");
            });
    }, [router]);

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
    };

    if (loading) return <div className={styles.wrapper}>Đang tải...</div>;

    return (
        <div className={styles.wrapper}>
            <div className={styles.backgroundShapes}>
                <div className={`${styles.shape} ${styles.shape1}`}></div>
                <div className={`${styles.shape} ${styles.shape2}`}></div>
                <div className={`${styles.shape} ${styles.shape3}`}></div>
            </div>

            <div className={styles.container}>
                <div className={styles.glassmorphism}>
                    <button className={styles.btnBackHome} onClick={() => router.push("/")}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        <span>Quay lại trang chủ</span>
                    </button>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatarWrapper}>
                            <img
                                src={user.image || "https://ui-avatars.com/api/?name=" + user.fullName}
                                alt="Avatar"
                                className={styles.avatar}
                            />
                        </div>
                        <div className={styles.titleInfo}>
                            <h1>{user.fullName}</h1>
                            <span className={styles.badge}>{user.status || "Thành viên"}</span>
                        </div>
                    </div>

                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <label>Tên đăng nhập</label>
                            <p>@{user.username}</p>
                        </div>
                        <div className={styles.infoItem}>
                            <label>Email</label>
                            <p>{user.email}</p>
                        </div>
                        <div className={styles.infoItem}>
                            <label>Ngày sinh</label>
                            <p>{user.birthday ? new Date(user.birthday).toLocaleDateString("vi-VN") : "Chưa cập nhật"}</p>
                        </div>
                        <div className={styles.infoItem}>
                            <label>Địa chỉ</label>
                            <p>{user.address || "Chưa cập nhật"}</p>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.btnEdit} onClick={() => router.push("/profile/edit")}>
                            Chỉnh sửa trang cá nhân</button>
                        <button className={styles.btnEdit} onClick={() => router.push("/profile/edit-username")}>
                            Đổi username
                        </button>
                        <button className={styles.btnEdit} onClick={() => router.push("/profile/change-password")}>
                            Đổi mật khẩu
                        </button>
                        <button className={styles.btnLogout} onClick={handleLogout}>Đăng xuất</button>
                    </div>
                </div>
            </div>
        </div>
    );
}