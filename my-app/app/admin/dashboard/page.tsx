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


type Section = "dashboard" | "users" | "shops" | "products" | "withdrawals";

export default function AdminDashboardPage() {
    interface AdminUser {
        fullName: string;
        username: string;
        userId: string;
        role: string;
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

    const fetchShops = async () => {
        setLoadingShops(true);
        try {
            const res = await fetch("/api/stores", { headers: authHeader() });
            if (res.status === 403) { router.push("/login"); return; }
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
        if (u) setAdminUser(JSON.parse(u));
    }, [router]);

    useEffect(() => {
        if (token) {
            fetchUsers();
            fetchProductStats();
            fetchShops();
            fetchProducts();
        }
    }, [token]);

    const authHeader = () => ({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    });

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const res = await fetch("/api/admin/users", { headers: authHeader() });
            if (res.status === 403) { router.push("/login"); return; }
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch { setUsers([]); }
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
            const res = await fetch(endpoint, { method: "PATCH", headers: authHeader() });
            if (!res.ok) throw new Error();
            showToast(type === "role" ? "✅ Đã cập nhật role" : "✅ Đã cập nhật trạng thái");
            fetchUsers();
        } catch { showToast("❌ Thao tác thất bại"); }
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
                    />
                )}

                {activeSection === "products" && (
                    <ProductTable
                        products={products}
                        loading={loadingProducts}
                        onRefresh={fetchProducts}
                        authHeader={authHeader}
                        showToast={showToast}
                    />
                )}

                {activeSection === "withdrawals" && (
                    <WithdrawalTable
                        authHeader={authHeader}
                        showToast={showToast}
                    />
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