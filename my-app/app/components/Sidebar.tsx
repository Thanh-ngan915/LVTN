import styles from "../admin/dashboard/dashboard.module.css";

interface Props {
    activeSection: "dashboard" | "users" | "sellers";
    setActiveSection: (s: "dashboard" | "users" | "sellers") => void;
    adminUser: any;
    onLogout: () => void;
}

export default function Sidebar({ activeSection, setActiveSection, adminUser, onLogout }: Props) {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <span className={styles.sidebarTitle}>Admin Panel</span>
            </div>
            <nav className={styles.nav}>
                <button
                    className={`${styles.navItem} ${activeSection === "dashboard" ? styles.navActive : ""}`}
                    onClick={() => setActiveSection("dashboard")}
                >
                    <span>📊</span> Dashboard
                </button>
                <button
                    className={`${styles.navItem} ${activeSection === "users" ? styles.navActive : ""}`}
                    onClick={() => setActiveSection("users")}
                >
                    <span>👥</span> Người dùng
                </button>
                <button
                    className={`${styles.navItem} ${activeSection === "sellers" ? styles.navActive : ""}`}
                    onClick={() => setActiveSection("sellers")}
                >
                    <span>🏪</span> Người bán
                </button>
            </nav>
            <div className={styles.sidebarFooter}>
                <div className={styles.adminInfo}>
                    <div className={styles.adminAvatar}>
                        {adminUser?.fullName?.[0] ?? "A"}
                    </div>
                    <div>
                        <div className={styles.adminName}>{adminUser?.fullName ?? "Admin"}</div>
                        <div className={styles.adminRole}>Administrator</div>
                    </div>
                </div>
                <button className={styles.logoutBtn} onClick={onLogout}>🚪 Đăng xuất</button>
            </div>
        </aside>
    );
}