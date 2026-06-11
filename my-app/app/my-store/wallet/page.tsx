"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./wallet.module.css";
import StoreSidebar from "../../components/StoreSidebar";

interface Wallet {
    id?: string;
    storeId?: string;
    availableBalance?: number;
    pendingBalance?: number;
    reservedBalance?: number;
    totalEarned?: number;
    totalWithdrawn?: number;
}

interface WalletTransaction {
    id?: string;
    type?: string;
    direction?: string;
    amount?: number;
    balanceBefore?: number;
    balanceAfter?: number;
    referenceId?: string;
    referenceType?: string;
    note?: string;
    status?: string;
    createdAt?: string;
}

interface WithdrawalRequest {
    id?: string;
    storeId?: string;
    amount?: number;
    bankName?: string;
    bankAccountNumber?: string;
    accountHolderName?: string;
    status?: string;
    rejectReason?: string;
    createdAt?: string;
    processedAt?: string;
}

interface WithdrawForm {
    amount: string;
    bankAccountNumber: string;
    bankName: string;
    accountHolderName: string;
}

function fmtVND(n?: number) {
    if (n == null) return "—";
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(n);
}

function fmtDate(s?: string) {
    if (!s) return "—";
    const d = new Date(s);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function getUserId(): string {
    if (typeof window === "undefined") return "";
    try {
        const user = localStorage.getItem("user");
        if (!user) return "";
        return JSON.parse(user).userId ?? "";
    } catch { return ""; }
}

function getAuthHeader(): string {
    if (typeof window === "undefined") return "";
    const token = localStorage.getItem("token");
    if (!token) return "";
    return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
}

const TYPE_LABEL: Record<string, string> = {
    ORDER_RECEIVED: "Tiền đơn hàng",
    WITHDRAWAL: "Rút tiền",
    REFUND_DEDUCT: "Hoàn trả",
};

const WITHDRAW_STATUS_LABEL: Record<string, string> = {
    PENDING: "Chờ duyệt",
    APPROVED: "Đã duyệt",
    PROCESSING: "Đang xử lý",
    COMPLETED: "Hoàn thành",
    REJECTED: "Từ chối",
};

export default function WalletPage() {
    const [storeId, setStoreId] = useState("");
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
    const [activeTab, setActiveTab] = useState<"transactions" | "withdrawals">("transactions");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<WithdrawForm>({
        amount: "",
        bankAccountNumber: "",
        bankName: "",
        accountHolderName: "",
    });

    const fetchWallet = useCallback(async (sid: string) => {
        try {
            const res = await fetch("/api/wallet/me", {
                headers: { "X-Store-Id": sid, "Authorization": getAuthHeader() },
            });
            if (res.ok) setWallet(await res.json());
        } catch {
            setError("Không thể tải thông tin ví");
        }
    }, []);

    const fetchTransactions = useCallback(async (sid: string) => {
        try {
            const res = await fetch("/api/wallet/me/transactions?page=0&size=50", {
                headers: { "X-Store-Id": sid, "Authorization": getAuthHeader() },
            });
            if (res.ok) {
                const json = await res.json();
                setTransactions(json.content ?? []);
            }
        } catch { }
    }, []);

    const fetchWithdrawals = useCallback(async (sid: string) => {
        try {
            const res = await fetch("/api/wallet/me/withdrawals?page=0&size=20", {
                headers: { "X-Store-Id": sid, "Authorization": getAuthHeader() },
            });
            if (res.ok) {
                const json = await res.json();
                setWithdrawals(json.content ?? []);
            }
        } catch { }
    }, []);

    // Bước 1: lấy storeId từ API
    useEffect(() => {
        const userId = getUserId();
        if (!userId) { setLoading(false); return; }
        fetch(`/api/stores/my-store?userId=${userId}`, {
            headers: { "Authorization": getAuthHeader() },
        })
            .then(r => r.json())
            .then(store => setStoreId(store.id ?? ""))
            .catch(() => setLoading(false));
    }, []);

    // Bước 2: khi có storeId thì fetch wallet data
    useEffect(() => {
        if (!storeId) return;
        Promise.all([
            fetchWallet(storeId),
            fetchTransactions(storeId),
            fetchWithdrawals(storeId),
        ]).finally(() => setLoading(false));
    }, [storeId, fetchWallet, fetchTransactions, fetchWithdrawals]);

    async function handleWithdraw() {
        const amount = parseFloat(form.amount);

        if (!amount || amount <= 0) { setError("Số tiền phải lớn hơn 0"); return; }
        if (amount > (wallet?.availableBalance ?? 0)) { setError("Số dư khả dụng không đủ"); return; }
        if (!form.bankName.trim()) { setError("Vui lòng nhập tên ngân hàng"); return; }
        if (!form.bankAccountNumber.trim()) { setError("Vui lòng nhập số tài khoản"); return; }
        if (!form.accountHolderName.trim()) { setError("Vui lòng nhập tên chủ tài khoản"); return; }

        setSubmitting(true);
        setError("");
        try {
            const res = await fetch("/api/wallet/me/withdraw", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Store-Id": storeId,
                    "X-User-Id": getUserId(),
                    "Authorization": getAuthHeader(),
                },
                body: JSON.stringify({
                    amount,
                    bankAccountNumber: form.bankAccountNumber,
                    bankName: form.bankName,
                    accountHolderName: form.accountHolderName,
                }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message ?? "Lỗi gửi yêu cầu");

            setSuccessMsg("Yêu cầu rút tiền đã được gửi, chờ admin duyệt!");
            setShowModal(false);
            setForm({ amount: "", bankAccountNumber: "", bankName: "", accountHolderName: "" });
            await Promise.all([fetchWallet(storeId), fetchWithdrawals(storeId)]);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Lỗi không xác định");
        } finally {
            setSubmitting(false);
        }
    }

    function closeModal() {
        setShowModal(false);
        setError("");
        setForm({ amount: "", bankAccountNumber: "", bankName: "", accountHolderName: "" });
    }

    if (loading) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.spinner} />
                <span>Đang tải ví...</span>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <StoreSidebar />

            <main className={styles.main}>
                <div className={styles.topbar}>
                    <div>
                        <h1 className={styles.pageTitle}>💰 Ví của shop</h1>
                        <p className={styles.pageSubtitle}>Quản lý doanh thu và yêu cầu rút tiền</p>
                    </div>
                    <button
                        className={styles.btnWithdraw}
                        disabled={(wallet?.availableBalance ?? 0) <= 0}
                        onClick={() => { setError(""); setShowModal(true); }}
                    >
                        Rút tiền
                    </button>
                </div>

                {successMsg && <div className={styles.alertSuccess}>✅ {successMsg}</div>}
                {error && !showModal && <div className={styles.alertError}>⚠️ {error}</div>}

                <div className={styles.balanceRow}>
                    <div className={`${styles.balanceCard} ${styles.balanceAvailable}`}>
                        <div className={styles.balanceIcon}>💵</div>
                        <div>
                            <div className={styles.balanceLabel}>Khả dụng</div>
                            <div className={styles.balanceAmount}>{fmtVND(wallet?.availableBalance)}</div>
                            <div className={styles.balanceHint}>Có thể rút ngay</div>
                        </div>
                    </div>
                    <div className={`${styles.balanceCard} ${styles.balancePending}`}>
                        <div className={styles.balanceIcon}>⏳</div>
                        <div>
                            <div className={styles.balanceLabel}>Đang chờ</div>
                            <div className={styles.balanceAmount}>{fmtVND(wallet?.pendingBalance)}</div>
                            <div className={styles.balanceHint}>Giải phóng sau 3 ngày</div>
                        </div>
                    </div>
                    <div className={`${styles.balanceCard} ${styles.balanceReserved}`}>
                        <div className={styles.balanceIcon}>🔒</div>
                        <div>
                            <div className={styles.balanceLabel}>Đang giữ</div>
                            <div className={styles.balanceAmount}>{fmtVND(wallet?.reservedBalance)}</div>
                            <div className={styles.balanceHint}>Yêu cầu rút đang xử lý</div>
                        </div>
                    </div>
                    <div className={`${styles.balanceCard} ${styles.balanceTotal}`}>
                        <div className={styles.balanceIcon}>📈</div>
                        <div>
                            <div className={styles.balanceLabel}>Tổng đã kiếm</div>
                            <div className={styles.balanceAmount}>{fmtVND(wallet?.totalEarned)}</div>
                            <div className={styles.balanceHint}>Đã rút: {fmtVND(wallet?.totalWithdrawn)}</div>
                        </div>
                    </div>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === "transactions" ? styles.tabActive : ""}`}
                        onClick={() => setActiveTab("transactions")}
                    >
                        Lịch sử giao dịch
                        {transactions.length > 0 && <span className={styles.tabBadge}>{transactions.length}</span>}
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === "withdrawals" ? styles.tabActive : ""}`}
                        onClick={() => setActiveTab("withdrawals")}
                    >
                        Yêu cầu rút tiền
                        {withdrawals.filter(w => w.status === "PENDING").length > 0 && (
                            <span className={styles.tabBadge}>{withdrawals.filter(w => w.status === "PENDING").length}</span>
                        )}
                    </button>
                </div>

                {activeTab === "transactions" && (
                    <div className={styles.tableSection}>
                        {transactions.length === 0 ? (
                            <div className={styles.empty}>
                                <div className={styles.emptyIcon}>📭</div>
                                <p className={styles.emptyText}>Chưa có giao dịch nào</p>
                            </div>
                        ) : (
                            <div className={styles.tableWrap}>
                                <table className={styles.table}>
                                    <thead>
                                    <tr>
                                        <th>Loại</th>
                                        <th>Mã tham chiếu</th>
                                        <th style={{ textAlign: "right" }}>Số tiền</th>
                                        <th style={{ textAlign: "right" }}>Số dư sau</th>
                                        <th>Ghi chú</th>
                                        <th>Thời gian</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id}>
                                            <td>
                                                    <span className={`${styles.txBadge} ${tx.direction === "IN" ? styles.txIn : styles.txOut}`}>
                                                        {tx.direction === "IN" ? "▲" : "▼"} {TYPE_LABEL[tx.type ?? ""] ?? tx.type}
                                                    </span>
                                            </td>
                                            <td className={styles.refId}>{tx.referenceId ?? "—"}</td>
                                            <td style={{ textAlign: "right" }}>
                                                    <span className={tx.direction === "IN" ? styles.amountIn : styles.amountOut}>
                                                        {tx.direction === "IN" ? "+" : "-"}{fmtVND(tx.amount)}
                                                    </span>
                                            </td>
                                            <td style={{ textAlign: "right" }} className={styles.dateText}>{fmtVND(tx.balanceAfter)}</td>
                                            <td className={styles.noteText}>{tx.note ?? "—"}</td>
                                            <td className={styles.dateText}>{fmtDate(tx.createdAt)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "withdrawals" && (
                    <div className={styles.tableSection}>
                        {withdrawals.length === 0 ? (
                            <div className={styles.empty}>
                                <div className={styles.emptyIcon}>💸</div>
                                <p className={styles.emptyText}>Chưa có yêu cầu rút tiền nào</p>
                            </div>
                        ) : (
                            <div className={styles.tableWrap}>
                                <table className={styles.table}>
                                    <thead>
                                    <tr>
                                        <th>Ngân hàng</th>
                                        <th>Số tài khoản</th>
                                        <th>Chủ tài khoản</th>
                                        <th style={{ textAlign: "right" }}>Số tiền</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày tạo</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {withdrawals.map((w) => (
                                        <tr key={w.id}>
                                            <td className={styles.bankName}>{w.bankName ?? "—"}</td>
                                            <td className={styles.dateText}>{w.bankAccountNumber ?? "—"}</td>
                                            <td>{w.accountHolderName ?? "—"}</td>
                                            <td style={{ textAlign: "right" }}>
                                                <span className={styles.amountOut}>{fmtVND(w.amount)}</span>
                                            </td>
                                            <td>
                                                    <span className={`${styles.wdBadge} ${styles[`wd_${w.status}` as keyof typeof styles] ?? ""}`}>
                                                        {WITHDRAW_STATUS_LABEL[w.status ?? ""] ?? w.status}
                                                    </span>
                                                {w.status === "REJECTED" && w.rejectReason && (
                                                    <div className={styles.rejectReason}>↳ {w.rejectReason}</div>
                                                )}
                                            </td>
                                            <td className={styles.dateText}>{fmtDate(w.createdAt)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {showModal && (
                <div className={styles.overlay} onClick={closeModal}>
                    <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalIcon}>💸</div>
                        <h3>Yêu cầu rút tiền</h3>
                        <p>Số dư khả dụng: <strong>{fmtVND(wallet?.availableBalance)}</strong></p>
                        {error && <div className={styles.modalError}>⚠️ {error}</div>}
                        <div className={styles.formGroup}>
                            <label>Số tiền muốn rút (VNĐ)</label>
                            <input type="number" className={styles.formInput} placeholder="VD: 500000"
                                   value={form.amount} onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Tên ngân hàng</label>
                            <input className={styles.formInput} placeholder="VD: Vietcombank"
                                   value={form.bankName} onChange={(e) => setForm(f => ({ ...f, bankName: e.target.value }))} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Số tài khoản</label>
                            <input className={styles.formInput} placeholder="VD: 1234567890"
                                   value={form.bankAccountNumber} onChange={(e) => setForm(f => ({ ...f, bankAccountNumber: e.target.value }))} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Tên chủ tài khoản</label>
                            <input className={styles.formInput} placeholder="VD: NGUYEN VAN A"
                                   value={form.accountHolderName} onChange={(e) => setForm(f => ({ ...f, accountHolderName: e.target.value }))} />
                        </div>
                        <div className={styles.confirmActions}>
                            <button className={styles.btnCancel} onClick={closeModal}>Huỷ</button>
                            <button className={styles.btnSave} disabled={submitting} onClick={handleWithdraw}>
                                {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}