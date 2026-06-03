import styles from "../admin/dashboard/dashboard.module.css";

interface Props {
    label: string;
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ label, loading, onConfirm, onCancel }: Props) {
    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
                <div className={styles.confirmIcon}>⚠️</div>
                <h3>Xác nhận thao tác</h3>
                <p>{label}</p>
                <div className={styles.confirmActions}>
                    <button className={styles.btnCancel} onClick={onCancel}>Hủy</button>
                    <button className={styles.btnConfirm} onClick={onConfirm} disabled={loading}>
                        {loading ? "Đang xử lý..." : "Xác nhận"}
                    </button>
                </div>
            </div>
        </div>
    );
}