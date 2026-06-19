"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import RegisterShopModal from "../components/RegisterShopModal";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [showShopModal, setShowShopModal] = useState(false);
    const [hasStore, setHasStore] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [userRole, setUserRole] = useState<string|null>(null);
    const [storeRoleId, setStoreRoleId] = useState<string|null>(null);
    // ✅ THÊM STATE WALLET
    const [wallet, setWallet] = useState<any>(null);
    const [walletLoading, setWalletLoading] = useState(true);

    const compressImage = (file: File, maxSizeMB = 2): Promise<File> => {
        return new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d")!;
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                const MAX_PX = 1200;
                let { width, height } = img;
                if (width > MAX_PX || height > MAX_PX) {
                    if (width > height) {
                        height = Math.round((height * MAX_PX) / width);
                        width = MAX_PX;
                    } else {
                        width = Math.round((width * MAX_PX) / height);
                        height = MAX_PX;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                URL.revokeObjectURL(url);

                let quality = 0.8;
                const tryCompress = () => {
                    canvas.toBlob((blob) => {
                        if (!blob) return resolve(file);
                        if (blob.size > maxSizeMB * 1024 * 1024 && quality > 0.2) {
                            quality -= 0.1;
                            tryCompress();
                        } else {
                            resolve(new File([blob], file.name, { type: "image/jpeg" }));
                        }
                    }, "image/jpeg", quality);
                };
                tryCompress();
            };

            img.src = url;
        });
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const storedUser = localStorage.getItem("user");
        const userId = storedUser ? JSON.parse(storedUser).userId : null;
        if (!userId) { alert("Vui lòng đăng nhập lại"); return; }

        const token = localStorage.getItem("token");

        setUploading(true);
        try {
            const compressed = await compressImage(file, 2);
            const formData = new FormData();
            formData.append("file", compressed);
            formData.append("upload_preset", "kltn_user_avatar");

            const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dqghfi8be/image/upload",
                { method: "POST", body: formData });
            const cloudData = await cloudRes.json();
            if (!cloudRes.ok) throw new Error("Upload Cloudinary thất bại");

            const beRes = await fetch(`/api/users/${userId}/avatar`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}`,
                },
                body: JSON.stringify({ imageUrl: cloudData.secure_url }),
            });
            if (!beRes.ok) throw new Error("Lưu avatar thất bại");

            setUser((prev: any) => ({ ...prev, image: cloudData.secure_url }));
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Upload thất bại, thử lại!");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const u = JSON.parse(storedUser);
            setUserRole(u.role);
        }
    }, []);

    // page.tsx - Thay phần fetch wallet
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
            router.push("/login");
            return;
        }

        // ✅ FETCH PROFILE
        fetch(`/api/users/${userId}/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (res.status === 403) throw new Error("Hết phiên làm việc");
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setUser(data);
                setLoading(false);
                setUserRole(data.role);
                setStoreRoleId(data.storeRoleId);
                fetch(`/api/stores/has-store?userId=${userId}`, {
                    headers: {
                        Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`
                    }
                })
                    .then(r => r.json())
                    .then(has => setHasStore(has))
                    .catch(() => {});
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/login");
            });

        // ✅ FETCH WALLET - CẢI THIỆN PHẦN NÀY
        fetch(`/api/users/wallet/${userId}/balance`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
            },
        })
            .then((res) => {
                console.log("Wallet response status:", res.status);
                if (res.status === 404) {
                    console.warn("Wallet endpoint not found");
                    setWallet(null);
                    return null;
                }
                if (!res.ok) {
                    console.error("Wallet fetch failed:", res.status, res.statusText);
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                if (data) {
                    setWallet({
                        availableBalance: data.availableBalance ?? 0,
                        totalReceived: data.totalReceived ?? 0,
                    });
                }
                setWalletLoading(false);
            })
            .catch((err) => {
                console.error("Wallet fetch error:", err);
                setWallet(null);
                setWalletLoading(false);
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
                            <label htmlFor="avatar-upload" className={styles.avatarOverlay}>
                                {uploading ? "⏳" : "📷"}
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleAvatarUpload}
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

                    {/* ✅ SECTION VÍ */}
                    <div className={styles.walletSection}>
                        <h2 className={styles.sectionTitle}>💰 Ví của tôi</h2>
                        {walletLoading ? (
                            <p>Đang tải ví...</p>
                        ) : wallet ? (
                            <div className={styles.walletGrid}>
                                <div className={styles.walletCard}>
                                    <div className={styles.walletLabel}>Số dư khả dụng</div>
                                    <div className={styles.walletAmount}>
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                            wallet.availableBalance || 0
                                        )}
                                    </div>
                                </div>
                                <div className={styles.walletCard}>
                                    <div className={styles.walletLabel}>Tổng nhận được</div>
                                    <div className={styles.walletAmount}>
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                            wallet.totalReceived || 0
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>Chưa có dữ liệu ví</p>
                        )}

                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                            <button
                                className={styles.btnEdit}
                                onClick={() => router.push("/wallet")}
                            >
                                Xem chi tiết ví
                            </button>
                            <button
                                className={styles.btnShop}
                                onClick={() => router.push("/wallet/withdraw")}
                                disabled={!wallet || wallet.availableBalance <= 0}
                                style={{ opacity: (!wallet || wallet.availableBalance <= 0) ? 0.5 : 1 }}
                            >
                                💸 Rút tiền
                            </button>
                        </div>
                    </div>

                    {/* GIAO HÀNG & ĐÁNH GIÁ */}
                    <div className={styles.orderSection}>
                        <h2 className={styles.sectionTitle}>Quản lý mua sắm</h2>
                        <div className={styles.orderGrid}>
                            <div className={styles.orderCard} onClick={() => router.push("/order/history")}>
                                <div className={styles.orderIcon}>🚚</div>
                                <div className={styles.orderInfo}>
                                    <strong>Đơn hàng</strong>
                                    <span>Theo dõi vận chuyển</span>
                                </div>
                            </div>
                            <div className={styles.orderCard} onClick={() => router.push("/reviews")}>
                                <div className={styles.orderIcon}>⭐</div>
                                <div className={styles.orderInfo}>
                                    <strong>Đánh giá</strong>
                                    <span>Viết nhận xét sản phẩm</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.btnEdit} onClick={() => router.push("/profile/edit")}>
                            Chỉnh sửa trang cá nhân
                        </button>
                        <button className={styles.btnEdit} onClick={() => router.push("/profile/edit-username")}>
                            Đổi username
                        </button>
                        <button className={styles.btnEdit} onClick={() => router.push("/profile/change-password")}>
                            Đổi mật khẩu
                        </button>
                        {userRole === "ADMIN" ? (
                            <button className={styles.btnShop} onClick={() => router.push("/admin")}>
                                🛡️ Trang Admin
                            </button>
                        ) : storeRoleId ? (
                            <button className={styles.btnShop} onClick={() => router.push("/my-store")}>
                                🏪 Quản lý shop
                            </button>
                        ) : hasStore ? (
                            <button className={styles.btnShop} style={{ opacity: 0.7, cursor: "default" }}>
                                ⏳ Shop đang chờ duyệt
                            </button>
                        ) : (
                            <button className={styles.btnShop} onClick={() => setShowShopModal(true)}>
                                🏪 Đăng ký bán hàng
                            </button>
                        )}
                        <button className={styles.btnLogout} onClick={handleLogout}>Đăng xuất</button>
                    </div>
                </div>
            </div>
            {showShopModal && (
                <RegisterShopModal
                    userId={JSON.parse(localStorage.getItem("user")!).userId}
                    onClose={() => setShowShopModal(false)}
                    onSuccess={() => {
                        setShowShopModal(false);
                        setHasStore(true);
                        alert("🎉 Đăng ký shop thành công! Chờ xét duyệt trong 24 giờ.");
                    }}
                />
            )}
        </div>
    );
}