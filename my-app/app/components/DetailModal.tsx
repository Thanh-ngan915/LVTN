import styles from "../admin/dashboard/dashboard.module.css";

interface UserDTO {
    id: string; username: string; fullName: string; email: string;
    image: string | null; status: string; role: string;
    storeRoleId: string | null; address?: string | null;
    birthday?: string | null; rankId?: string | null;
}

interface Props {
    user: UserDTO;
    onClose: () => void;
}

export default function DetailModal({ user, onClose }: Props) {
    const fields = [
        { label: "User ID", value: user.id },
        { label: "Username", value: user.username },
        { label: "Email", value: user.email },
        { label: "Role", value: user.role },
        { label: "Trạng thái", value: user.status },
        { label: "Địa chỉ", value: user.address ?? "—" },
        { label: "Ngày sinh", value: user.birthday
                ? new Date(user.birthday).toLocaleDateString("vi-VN") : "—" },
        { label: "Store Role ID", value: user.storeRoleId ?? "—" },
    ];

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.detailBox} onClick={(e) => e.stopPropagation()}>
                {/* Avatar */}
                <div className={styles.detailAvatar}>
                    {user.image ? (
                        <img src={user.image} alt={user.fullName}
                             className={styles.detailAvatarImg} />
                    ) : (
                        <div className={styles.detailAvatarFallback}>
                            {user.fullName?.[0] ?? "?"}
                        </div>
                    )}
                </div>

                <h3 className={styles.detailName}>{user.fullName}</h3>
                <span className={`${styles.badge} ${
                    user.role === "ADMIN" ? styles.badgeAdmin
                        : user.role === "SELLER" ? styles.badgeSeller
                            : styles.badgeUser
                }`}>{user.role}</span>

                {/* Info list */}
                <div className={styles.detailFields}>
                    {fields.map(({ label, value }) => (
                        <div key={label} className={styles.detailRow}>
                            <span className={styles.detailLabel}>{label}</span>
                            <span className={styles.detailValue}>{value}</span>
                        </div>
                    ))}
                </div>

                <button className={styles.btnCancel} onClick={onClose}
                        style={{ marginTop: 16, width: "100%" }}>
                    Đóng
                </button>
            </div>
        </div>
    );
}