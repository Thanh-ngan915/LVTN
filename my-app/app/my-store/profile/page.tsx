"use client";

import { useState, useRef, useEffect } from "react";
import StoreSidebar from "../../components/StoreSidebar";
import styles from "./profile.module.css";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_STORE_SERVICE_URL ?? "http://localhost:8080";

interface StoreDTO {
    id: string;
    name: string;
    image: string;
    location: string;
    description: string;
    status: string;
    createdBy: string;
    createdAt: string;
    updateAt: string;
}
interface Province { code: number; name: string; }
interface District { code: number; name: string; }
interface Ward     { code: number; name: string; }

export default function StoreProfilePage() {
    const [store, setStore]               = useState<StoreDTO | null>(null);
    const [form, setForm]                 = useState<Partial<StoreDTO>>({});
    const [editing, setEditing]           = useState(false);
    const [loading, setLoading]           = useState(true);
    const [saving, setSaving]             = useState(false);
    const [success, setSuccess]           = useState("");
    const [error, setError]               = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards,     setWards]     = useState<Ward[]>([]);
    const [selProvince, setSelProvince] = useState("");
    const [selDistrict, setSelDistrict] = useState("");
    const [selWard,     setSelWard]     = useState("");
    const [street,      setStreet]      = useState("");

    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/p/")
            .then(r => r.json())
            .then(setProvinces);
    }, []);

    // Lấy userId từ localStorage / cookie / auth context của bạn
    const getUserId = () => {
        const user = JSON.parse(localStorage.getItem("user") ?? "{}");
        return user.userId ?? "";
    };

    // ── Fetch store ──────────────────────────────────────
    useEffect(() => {
        const fetchStore = async () => {
            setLoading(true);
            setError("");
            try {
                const userId = getUserId();
                const res = await fetch(`${API_BASE}/api/stores/my-store?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
                    },
                });
                if (!res.ok) throw new Error("Không thể tải thông tin shop");
                const data: StoreDTO = await res.json();
                setStore(data);
                setForm(data);
                setAvatarPreview(data.image ?? "");
            } catch (e) {
                setError(e instanceof Error ? e.message : "Lỗi không xác định");
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, []);

    // ── Handlers ─────────────────────────────────────────
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // Preview ngay lập tức
        setAvatarPreview(URL.createObjectURL(file));

        if (file.size > 5 * 1024 * 1024) {
            setError("Ảnh quá lớn, vui lòng chọn ảnh dưới 5MB");
            return;
        }

        setSaving(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "kltn_user_avatar"); // Preset từ hệ thống của bạn
            
            const res = await fetch("https://api.cloudinary.com/v1_1/dqghfi8be/image/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error?.message || "Upload thất bại");
            }
            
            // Lưu đường dẫn ảnh thật từ Cloudinary
            setForm((prev) => ({ ...prev, image: data.secure_url }));
        } catch (err: any) {
            setError(err.message || "Lỗi khi upload ảnh");
        } finally {
            setSaving(false);
        }
    };

    // Khi chọn tỉnh → fetch huyện
    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        setSelProvince(code);
        setSelDistrict("");
        setSelWard("");
        setDistricts([]);
        setWards([]);
        if (!code) return;
        const res = await fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`);
        const data = await res.json();
        setDistricts(data.districts ?? []);
        buildLocation(street, "", "", data.name);
    };

// Khi chọn huyện → fetch xã
    const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        setSelDistrict(code);
        setSelWard("");
        setWards([]);
        if (!code) return;
        const res = await fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`);
        const data = await res.json();
        setWards(data.wards ?? []);
        const pName = provinces.find(p => p.code === Number(selProvince))?.name ?? "";
        buildLocation(street, "", data.name, pName);
    };

// Khi chọn xã
    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        setSelWard(code);
        const ward = wards.find(w => w.code === Number(code));
        const dist = districts.find(d => d.code === Number(selDistrict));
        const prov = provinces.find(p => p.code === Number(selProvince));
        buildLocation(street, ward?.name ?? "", dist?.name ?? "", prov?.name ?? "");
    };

// Khi nhập số nhà / đường
    const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStreet(e.target.value);
        const ward = wards.find(w => w.code === Number(selWard));
        const dist = districts.find(d => d.code === Number(selDistrict));
        const prov = provinces.find(p => p.code === Number(selProvince));
        buildLocation(e.target.value, ward?.name ?? "", dist?.name ?? "", prov?.name ?? "");
    };

// Ghép thành chuỗi location
    const buildLocation = (st: string, w: string, d: string, p: string) => {
        const parts = [st, w, d, p].filter(Boolean);
        setForm(prev => ({ ...prev, location: parts.join(", ") }));
    };

    const handleSave = async () => {
        if (!form.name?.trim()) {
            setError("Tên shop không được để trống.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const userId = getUserId();
            const res = await fetch(`${API_BASE}/api/stores/my-store?userId=${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
                },
                body: JSON.stringify({
                    name:        form.name,
                    image:       form.image,
                    location:    form.location,
                    description: form.description,
                }),
            });
            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Cập nhật thất bại");
            }
            const updated: StoreDTO = await res.json();
            setStore(updated);
            setForm(updated);
            setAvatarPreview(updated.image ?? "");
            setEditing(false);
            setSuccess("Cập nhật thông tin shop thành công!");
            setTimeout(() => setSuccess(""), 3500);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Có lỗi xảy ra");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (!store) return;
        setForm(store);
        setAvatarPreview(store.image ?? "");
        setEditing(false);
        setError("");
    };

    // ── Status ───────────────────────────────────────────
    const statusLabel: Record<string, { text: string; cls: string }> = {
        active:  { text: "Đang hoạt động", cls: styles.statusActive },
        banned:  { text: "Bị khoá",         cls: styles.statusInactive },
        pending: { text: "Chờ duyệt",        cls: styles.statusPending },
    };
    const status = statusLabel[store?.status ?? "pending"] ?? statusLabel.pending;

    // ── Loading screen ───────────────────────────────────
    if (loading) {
        return (
            <div className={styles.page}>
                <StoreSidebar />
                <main className={styles.main}>
                    <div className={styles.loadingWrap}>
                        <div className={styles.spinner} />
                        <p>Đang tải thông tin shop…</p>
                    </div>
                </main>
            </div>
        );
    }

    // ── No store ─────────────────────────────────────────
    if (!store && !loading) {
        return (
            <div className={styles.page}>
                <StoreSidebar />
                <main className={styles.main}>
                    <div className={styles.emptyWrap}>
                        <span className={styles.emptyIcon}>🏪</span>
                        <p>Bạn chưa có shop. Hãy đăng ký shop trước!</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <StoreSidebar />

            <main className={styles.main}>
                {/* Topbar */}
                <div className={styles.topbar}>
                    <div>
                        <h1 className={styles.pageTitle}>Hồ sơ cửa hàng</h1>
                        <p className={styles.pageSubtitle}>Quản lý thông tin hiển thị công khai của shop</p>
                    </div>
                    {!editing && (
                        <button className={styles.btnEdit} onClick={() => setEditing(true)}>
                            ✏️ Chỉnh sửa
                        </button>
                    )}
                </div>

                {/* Alerts */}
                {success && <div className={styles.alertSuccess}>✅ {success}</div>}
                {error   && <div className={styles.alertError}>⚠️ {error}</div>}

                <div className={styles.grid}>
                    {/* Left: Avatar card */}
                    <div className={styles.avatarCard}>
                        <div className={styles.avatarWrap}>
                            <Image
                                src={avatarPreview || "https://placehold.co/120x120/e8e4de/8a8a9a?text=Shop"}
                                alt="Avatar shop"
                                width={120}
                                height={120}
                                className={styles.avatar}
                            />
                            {editing && (
                                <button
                                    className={styles.avatarOverlay}
                                    onClick={() => fileRef.current?.click()}
                                    title="Đổi ảnh"
                                >
                                    <span className={styles.cameraIcon}>📷</span>
                                    <span className={styles.cameraLabel}>Thay ảnh</span>
                                </button>
                            )}
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleAvatarChange}
                            />
                        </div>

                        <h2 className={styles.avatarName}>{store!.name}</h2>
                        <span className={`${styles.statusBadge} ${status.cls}`}>{status.text}</span>

                        <div className={styles.metaList}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaIcon}>📍</span>
                                <span className={styles.metaText}>{store!.location || "Chưa cập nhật"}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaIcon}>📅</span>
                                <span className={styles.metaText}>
                                    Tham gia{" "}
                                    {new Date(store!.createdAt).toLocaleDateString("vi-VN", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaIcon}>🆔</span>
                                <span className={styles.metaText}>{store!.id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form card */}
                    <div className={styles.formCard}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Thông tin cửa hàng</span>
                            {editing && <span className={styles.editingBadge}>Đang chỉnh sửa</span>}
                        </div>

                        <div className={styles.fieldGrid}>
                            {/* Tên shop */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Tên cửa hàng <span className={styles.required}>*</span>
                                </label>
                                {editing ? (
                                    <input
                                        name="name"
                                        value={form.name ?? ""}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="Nhập tên cửa hàng..."
                                        maxLength={100}
                                    />
                                ) : (
                                    <p className={styles.fieldValue}>{store!.name}</p>
                                )}
                            </div>

                            {/* Địa chỉ */}
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Địa chỉ</label>
                                {editing ? (
                                    <div className={styles.locationWrap}>
                                        <div className={styles.locationSelects}>
                                            <select className={styles.select} value={selProvince} onChange={handleProvinceChange}>
                                                <option value="">-- Tỉnh / Thành phố --</option>
                                                {provinces.map(p => (
                                                    <option key={p.code} value={p.code}>{p.name}</option>
                                                ))}
                                            </select>

                                            <select className={styles.select} value={selDistrict} onChange={handleDistrictChange} disabled={!selProvince}>
                                                <option value="">-- Quận / Huyện --</option>
                                                {districts.map(d => (
                                                    <option key={d.code} value={d.code}>{d.name}</option>
                                                ))}
                                            </select>

                                            <select className={styles.select} value={selWard} onChange={handleWardChange} disabled={!selDistrict}>
                                                <option value="">-- Phường / Xã --</option>
                                                {wards.map(w => (
                                                    <option key={w.code} value={w.code}>{w.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <input
                                            className={styles.input}
                                            placeholder="Số nhà, tên đường..."
                                            value={street}
                                            onChange={handleStreetChange}
                                        />

                                        {form.location && (
                                            <p className={styles.locationPreview}>📍 {form.location}</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className={styles.fieldValue}>
                                        {store!.location || <span className={styles.emptyField}>Chưa cập nhật</span>}
                                    </p>
                                )}
                            </div>

                            {/* URL ảnh (fallback) */}
                            {editing && (
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        URL ảnh đại diện{" "}
                                        <span className={styles.hint}>(hoặc tải lên ở bên trái)</span>
                                    </label>
                                    <input
                                        name="image"
                                        value={form.image ?? ""}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setAvatarPreview(e.target.value);
                                        }}
                                        className={styles.input}
                                        placeholder="https://..."
                                    />
                                </div>
                            )}

                            {/* Mô tả */}
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Mô tả cửa hàng</label>
                                {editing ? (
                                    <textarea
                                        name="description"
                                        value={form.description ?? ""}
                                        onChange={handleChange}
                                        className={styles.textarea}
                                        placeholder="Giới thiệu về cửa hàng của bạn..."
                                        rows={4}
                                        maxLength={1000}
                                    />
                                ) : (
                                    <p className={styles.fieldValue}>
                                        {store!.description || <span className={styles.emptyField}>Chưa có mô tả</span>}
                                    </p>
                                )}
                                {editing && (
                                    <span className={styles.charCount}>{form.description?.length ?? 0}/1000</span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {editing && (
                            <div className={styles.actions}>
                                <button className={styles.btnCancel} onClick={handleCancel} disabled={saving}>
                                    Huỷ
                                </button>
                                <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
                                    {saving ? (
                                        <><span className={styles.btnSpinner} /> Đang lưu…</>
                                    ) : (
                                        "💾 Lưu thay đổi"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats row */}
                <div className={styles.statsRow}>
                    {[
                        { icon: "🆔", label: "Store ID",       value: store!.id.slice(0, 8) + "…" },
                        { icon: "📋", label: "Trạng thái",     value: status.text },
                        { icon: "📅", label: "Ngày tạo",       value: new Date(store!.createdAt).toLocaleDateString("vi-VN") },
                        { icon: "🔄", label: "Cập nhật lần cuối", value: new Date(store!.updateAt).toLocaleDateString("vi-VN") },
                    ].map((s) => (
                        <div key={s.label} className={styles.statCard}>
                            <span className={styles.statIcon}>{s.icon}</span>
                            <span className={styles.statValue}>{s.value}</span>
                            <span className={styles.statLabel}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}