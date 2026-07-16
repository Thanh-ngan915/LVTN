"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import Sidebar from "../../components/Sidebar";
import DashboardStats from "../../components/DashboardStats";
import UserTable from "../../components/UserTable";
import ConfirmModal from "../../components/ConfirmModal";
import ShopTable from "../../components/ShopTable";
import { StoreDTO } from "../../services/storeService";
import ProductTable from "../../components/ProductTable";
import WithdrawalTable from "../../components/WithdrawalTable";
import ComplaintTable from "../../components/ComplaintTable";
import RevenueTable from "../../components/RevenueTable";
import PolicyTable from "../../components/PolicyTable";
import PlatformVoucherTable from "../../components/PlatformVoucherTable";
import { AdminActivityProvider, useAdminActivity } from "../../components/AdminActivityContext";

interface UserDTO {
    id: string; username: string; fullName: string; email: string;
    image: string | null; status: string; role: string; storeRoleId: string | null;
}

interface ProductDTO {
    id: number;
    name: string;
    priceBefore: number;
    priceAfter: number;
    status: string;
    categoryName: string;
    storeId: string;
    currentQuantity: number;
    imageUrls: string[];
    createdBy: string;
    description: string;
}

interface ProductStats {
    total: number;
    pending: number;
    active: number;
    inactive: number;
}


type Section = "dashboard" | "users" | "shops" | "products" | "withdrawals" | "complaints" | "revenue" | "policies" | "vouchers";

function AdminDashboardContent() {
    interface AdminUser {
        fullName: string;
        username: string;
        userId: string;
        role: string;
        permissions: string;  // "ALL" hoặc "dashboard,shops,orders"
    }

    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [activeSection, setActiveSection] = useState<Section>("dashboard");
    const [confirmModal, setConfirmModal] = useState<{
        type: "role" | "status"; userId: string; value: string; label: string;
    } | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const { logActivity } = useAdminActivity();
    const [productStats, setProductStats] = useState<ProductStats | null>(null);
    const [shops, setShops] = useState<StoreDTO[]>([]);
    const [loadingShops, setLoadingShops] = useState(false);
    const [products, setProducts] = useState<ProductDTO[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const fetchProductStats = async () => {
        try {
            const res = await fetch("/api/products/stats");
            const data = await res.json();
            if (data.success) setProductStats(data.data);
        } catch {
            console.error("Không thể tải thống kê sản phẩm");
        }
    };

    const fetchShops = async (tok?: string, uid?: string) => {
        setLoadingShops(true);
        try {
            const res = await fetch("/api/stores", { headers: authHeader(tok, uid) });
            if (res.status === 401) { router.push("/login"); return; }
            if (!res.ok) { setShops([]); return; }
            const data = await res.json();
            setShops(Array.isArray(data) ? data : []);
        } catch { setShops([]); }
        finally { setLoadingShops(false); }
    };

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            let allProducts: ProductDTO[] = [];
            let page = 0;
            const size = 500;

            while (true) {
                const res = await fetch(`/api/admin/products?page=${page}&size=${size}`, { headers: authHeader() });
                if (!res.ok) break; // Check for HTTP errors
                
                const data = await res.json();
                const items = Array.isArray(data.data) ? data.data : [];
                allProducts = [...allProducts, ...items];

                // Dừng khi đã lấy hết
                if (items.length < size) break;
                page++;
            }

            setProducts(allProducts);
        } catch { setProducts([]); }
        finally { setLoadingProducts(false); }
    };

    useEffect(() => {
        const t = localStorage.getItem("token");
        const u = localStorage.getItem("user");
        if (!t) {
            router.push("/login");
            return;
        }
        setToken(t);
        let parsedUser = null;
        if (u) {
            try {
                parsedUser = JSON.parse(u);
            } catch (e) {
                console.error("Lỗi parse user từ localStorage:", e);
            }
        }
        if (parsedUser) setAdminUser(parsedUser);

        // Đọc permissions từ localStorage
        const perms: string = parsedUser?.permissions ?? "";
        const hasAll = perms === "" || perms === "ALL";

        // Truyền token và userId trực tiếp — không dùng state vì React chưa update khi gọi API
        const uid = parsedUser?.userId || "";
        if (hasAll || perms.split(",").includes("users")) fetchUsers(t, uid);
        if (hasAll || perms.split(",").includes("products")) { fetchProductStats(); fetchProducts(); }
        if (hasAll || perms.split(",").includes("shops")) fetchShops(t, uid);
    }, [router]);

    /** Tạo auth header. Luôn đọc token và userId từ localStorage để tránh stale closure */
    const authHeader = (overrideToken?: string, overrideUserId?: string): Record<string, string> => {
        let tok = overrideToken;
        let userId = overrideUserId;
        // Luôn fallback về localStorage để tránh stale state trong closure
        if (!tok || !userId) {
            try {
                const storedToken = localStorage.getItem("token");
                const storedUser = localStorage.getItem("user");
                if (!tok) tok = storedToken || token || "";
                if (!userId) userId = storedUser ? JSON.parse(storedUser).userId : (adminUser?.userId || "");
            } catch (e) {
                tok = tok || token || "";
                userId = userId || adminUser?.userId || "";
            }
        }
        return {
            Authorization: `Bearer ${tok}`,
            "Content-Type": "application/json",
            "X-User-Id": userId || "",
        };
    };

    const fetchUsers = async (tok?: string, uid?: string) => {
        setLoadingUsers(true);
        try {
            // Luôn đọc lại từ localStorage để tránh stale closure
            const storedToken = tok || localStorage.getItem("token") || token || "";
            const storedUser = uid || (() => {
                try { return JSON.parse(localStorage.getItem("user") || "{}").userId || adminUser?.userId || ""; }
                catch { return adminUser?.userId || ""; }
            })();
            const headers: HeadersInit = {
                Authorization: `Bearer ${storedToken}`,
                "Content-Type": "application/json",
                "X-User-Id": storedUser,
            };
            const res = await fetch("/api/admin/users", { headers });
            if (res.status === 401) { router.push("/login"); return; }
            if (res.status === 403) {
                // Token cũ không có permissions — yêu cầu đăng nhập lại
                showToast("⚠️ Phiên đăng nhập hết hạn hoặc không đủ quyền. Vui lòng đăng xuất và đăng nhập lại.");
                setUsers([]);
                return;
            }
            if (!res.ok) {
                const errBody = await res.text().catch(() => "");
                console.error("fetchUsers failed:", res.status, errBody);
                setUsers([]);
                return;
            }
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("fetchUsers error:", e);
            setUsers([]);
        }
        finally { setLoadingUsers(false); }
    };

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleConfirmAction = async () => {
        if (!confirmModal) return;
        setActionLoading(true);
        try {
            const { type, userId, value } = confirmModal;
            const endpoint = type === "role"
                ? `/api/admin/users/${userId}/role?role=${value}`
                : `/api/admin/users/${userId}/status?status=${value}`;
            // Đọc token và userId mới nhất từ localStorage
            const currentToken = localStorage.getItem("token") || token || "";
            const currentUserId = (() => {
                try { return JSON.parse(localStorage.getItem("user") || "{}").userId || adminUser?.userId || ""; }
                catch { return adminUser?.userId || ""; }
            })();
            const patchHeaders: HeadersInit = {
                Authorization: `Bearer ${currentToken}`,
                "Content-Type": "application/json",
                "X-User-Id": currentUserId,
            };
            const res = await fetch(endpoint, { method: "PATCH", headers: patchHeaders });
            if (!res.ok) {
                const errText = await res.text().catch(() => "");
                console.error("Action failed:", res.status, errText);
                throw new Error(errText || `HTTP ${res.status}`);
            }
            const actionLabel = type === "role" ? `Đổi role thành ${value}` : (value === "BANNED" ? "Khóa tài khoản" : "Mở tài khoản");
            showToast(type === "role" ? "✅ Đã cập nhật role" : "✅ Đã cập nhật trạng thái");
            await logActivity(actionLabel, confirmModal.label, "user");
            // Refresh với credentials mới nhất
            fetchUsers(currentToken, currentUserId);
        } catch (e) {
            console.error("handleConfirmAction error:", e);
            showToast("❌ Thao tác thất bại");
        }
        finally { setActionLoading(false); setConfirmModal(null); }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <div className={styles.layout}>
            <Sidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                adminUser={adminUser}
                onLogout={logout}
            />

            <main className={styles.main}>
                {toast && <div className={styles.toast}>{toast}</div>}

                {activeSection === "dashboard" && (
                    <DashboardStats
                    users={users}
                    productStats={productStats}
                    authHeader={authHeader}
                    />)
                }

                {activeSection === "users" && (
                    <UserTable
                        users={users}
                        loading={loadingUsers}
                        onRefresh={fetchUsers}
                        onAction={setConfirmModal}
                        authHeader={authHeader}
                    />
                )}

                {activeSection === "shops" && (
                    <ShopTable
                        shops={shops}
                        loading={loadingShops}
                        onRefresh={fetchShops}
                        authHeader={authHeader}
                        showToast={showToast}
                        logActivity={logActivity}
                    />
                )}

                {activeSection === "products" && (
                    <ProductTable
                        products={products}
                        loading={loadingProducts}
                        onRefresh={fetchProducts}
                        authHeader={authHeader}
                        showToast={showToast}
                        logActivity={logActivity}
                    />
                )}

                {activeSection === "withdrawals" && (
                    <WithdrawalTable
                        authHeader={authHeader}
                        showToast={showToast}
                        logActivity={logActivity}
                    />
                )}

                {activeSection === "complaints" && (
                    <ComplaintTable
                        authHeader={authHeader}
                        showToast={showToast}
                        logActivity={logActivity}
                    />
                )}

                {activeSection === "revenue" && (
                    <RevenueTable authHeader={authHeader} showToast={showToast} />
                )}

                {activeSection === "policies" && (
                    <PolicyTable authHeader={authHeader} showToast={showToast} logActivity={logActivity} />
                )}

                {activeSection === "vouchers" && (
                    <PlatformVoucherTable authHeader={authHeader} showToast={showToast} logActivity={logActivity} />
                )}
            </main>

            {confirmModal && (
                <ConfirmModal
                    label={confirmModal.label}
                    loading={actionLoading}
                    onConfirm={handleConfirmAction}
                    onCancel={() => setConfirmModal(null)}
                />
            )}
        </div>
    );
}

export default function AdminDashboardPage() {
    const [adminUser, setAdminUser] = useState<{ userId: string; fullName: string; username: string; role: string; permissions: string } | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const t = localStorage.getItem("token");
        const u = localStorage.getItem("user");
        if (!t) { router.push("/login"); return; }
        setToken(t);
        if (u) {
            try {
                setAdminUser(JSON.parse(u));
            } catch (e) {
                console.error("Lỗi parse user từ localStorage:", e);
            }
        }
    }, [router]);

    const authHeader = (): Record<string, string> => {
        const tok = localStorage.getItem("token") || token || "";
        const uid = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}").userId || ""; } catch { return ""; } })();
        return { Authorization: `Bearer ${tok}`, "Content-Type": "application/json", "X-User-Id": uid };
    };

    return (
        <AdminActivityProvider adminUser={adminUser} authHeader={authHeader}>
            <AdminDashboardContent />
        </AdminActivityProvider>
    );
}