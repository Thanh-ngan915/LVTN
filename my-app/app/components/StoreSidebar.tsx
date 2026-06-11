"use client";

import { useRouter, usePathname } from "next/navigation";
import styles from "../my-store/my-store.module.css";

export default function StoreSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const NAV = [
        { icon: "📦", label: "Sản phẩm",   href: "/my-store" },
        { icon: "📋", label: "Đơn hàng",   href: "/seller/orders" },
        { icon: "🎟️", label: "Voucher",    href: "/my-store/vouchers" },
        { icon: "⭐", label: "Đánh giá",   href: "/my-store/ratings" },
        { icon: "🏷️", label: "Khuyến mãi", href: "/my-store/promotions" },
        { icon: "💰", label: "Ví của shop", href: "/my-store/wallet" },
        { icon: "💬", label: "Chat với khách", href: "/seller/chat" },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarLogo} onClick={() => router.push("/")}>
                <span>✦</span> ANVI
            </div>
            <nav className={styles.sidebarNav}>
                {NAV.map((item) => (
                    <button
                        key={item.href}
                        className={`${styles.navItem} ${pathname === item.href ? styles.navActive : ""}`}
                        onClick={() => router.push(item.href)}
                    >
                        <span>{item.icon}</span> {item.label}
                    </button>
                ))}
            </nav>
            <div className={styles.sidebarFooter}>
                <button className={styles.navItem} onClick={() => router.push("/")}>
                    <span>🏠</span> Về trang chủ
                </button>
            </div>
        </aside>
    );
}