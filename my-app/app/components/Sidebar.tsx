import styles from "../admin/dashboard/dashboard.module.css";
import AdminNotificationBell from "./AdminNotificationBell";

type SectionKey = "dashboard" | "users" | "shops" | "products" | "withdrawals" | "complaints" | "revenue" | "policies" | "vouchers";

interface Props {
    activeSection: SectionKey;
    setActiveSection: (s: SectionKey) => void;
    adminUser: any;
    onLogout: () => void;
}

/** Danh sách tất cả menu items */
const ALL_MENU_ITEMS: { key: SectionKey; icon: string; label: string }[] = [
    { key: "dashboard",   icon: "📊", label: "Dashboard" },
    { key: "users",       icon: "👥", label: "Người dùng" },
    { key: "shops",       icon: "🛍️", label: "Quản lý Shop" },
    { key: "products",    icon: "📦", label: "Sản phẩm" },
    { key: "withdrawals", icon: "💸", label: "Rút tiền" },
    { key: "complaints",  icon: "⚖️", label: "Khiếu nại" },
    { key: "revenue",     icon: "💰", label: "Doanh thu" },
    { key: "policies",    icon: "📜", label: "Chính sách" },
    { key: "vouchers",    icon: "🎟️", label: "Voucher Sàn" },
];

/**
 * Kiểm tra xem admin có quyền xem section này không.
 * permissions = "ALL" → xem tất cả
 * permissions = "dashboard,shops,orders" → chỉ xem dashboard, shops
 */
function canAccess(section: SectionKey, permissions: string): boolean {
    if (!permissions || permissions === "ALL") return true;
    const allowed = permissions.split(",").map(s => s.trim().toLowerCase());
    return allowed.includes(section.toLowerCase());
}

export default function Sidebar({ activeSection, setActiveSection, adminUser, onLogout }: Props) {
    const permissions: string = adminUser?.permissions || "ALL";

    const visibleItems = ALL_MENU_ITEMS.filter(item => canAccess(item.key, permissions));

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <span className={styles.sidebarTitle}>Admin Panel</span>
                <AdminNotificationBell />
            </div>
            <nav className={styles.nav}>
                {visibleItems.map(item => (
                    <button
                        key={item.key}
                        className={`${styles.navItem} ${activeSection === item.key ? styles.navActive : ""}`}
                        onClick={() => setActiveSection(item.key)}
                    >
                        <span>{item.icon}</span> {item.label}
                    </button>
                ))}
            </nav>
            <div className={styles.sidebarFooter}>
                <div className={styles.adminInfo}>
                    <div className={styles.adminAvatar}>
                        {adminUser?.fullName?.[0] ?? "A"}
                    </div>
                    <div>
                        <div className={styles.adminName}>{adminUser?.fullName ?? "Admin"}</div>
                        <div className={styles.adminRole}>
                            {permissions === "ALL" ? "Quản trị viên" : "Quản lý"}
                        </div>
                    </div>
                </div>
                <button className={styles.logoutBtn} onClick={onLogout}>🚪 Đăng xuất</button>
            </div>
        </aside>
    );
}