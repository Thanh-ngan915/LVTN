"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./edit-profile.module.css";

interface UserDTO {
    username: string;
    fullName: string;
    email: string;
    image?: string;
    birthday?: string;
    address?: string;
}

export default function EditProfilePage() {
    const [form, setForm] = useState<UserDTO>({
        username: "",
        fullName: "",
        email: "",
        image: "",
        birthday: "",
        address: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const router = useRouter();

    interface Province { code: number; name: string; }
    interface District { code: number; name: string; }
    interface Ward     { code: number; name: string; }

// Thêm states (sau const [saving, setSaving])
    const [provinces,   setProvinces]   = useState<Province[]>([]);
    const [districts,   setDistricts]   = useState<District[]>([]);
    const [wards,       setWards]       = useState<Ward[]>([]);
    const [selProvince, setSelProvince] = useState("");
    const [selDistrict, setSelDistrict] = useState("");
    const [selWard,     setSelWard]     = useState("");
    const [street,      setStreet]      = useState("");
    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/p/")
            .then(r => r.json())
            .then(setProvinces);
    }, []);

// Thêm handlers (trước handleSubmit)
    const buildAddress = (st: string, w: string, d: string, p: string) => {
        const parts = [st, w, d, p].filter(Boolean);
        setForm(prev => ({ ...prev, address: parts.join(", ") }));
    };

    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        setSelProvince(code);
        setSelDistrict(""); setSelWard("");
        setDistricts([]); setWards([]);
        if (!code) return;
        const data = await fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`).then(r => r.json());
        setDistricts(data.districts ?? []);
        buildAddress(street, "", "", data.name);
    };

    const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        setSelDistrict(code); setSelWard(""); setWards([]);
        if (!code) return;
        const data = await fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`).then(r => r.json());
        setWards(data.wards ?? []);
        const pName = provinces.find(p => p.code === Number(selProvince))?.name ?? "";
        buildAddress(street, "", data.name, pName);
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        setSelWard(code);
        const ward = wards.find(w => w.code === Number(code));
        const dist = districts.find(d => d.code === Number(selDistrict));
        const prov = provinces.find(p => p.code === Number(selProvince));
        buildAddress(street, ward?.name ?? "", dist?.name ?? "", prov?.name ?? "");
    };

    const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStreet(e.target.value);
        const ward = wards.find(w => w.code === Number(selWard));
        const dist = districts.find(d => d.code === Number(selDistrict));
        const prov = provinces.find(p => p.code === Number(selProvince));
        buildAddress(e.target.value, ward?.name ?? "", dist?.name ?? "", prov?.name ?? "");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (!token || !storedUser) { router.push("/login"); return; }

        const userId = JSON.parse(storedUser).userId;
        if (!userId) { router.push("/login"); return; }

        fetch(`/api/users/${userId}/profile`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
            },
        })
            .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
            .then((data) => {
                setForm({
                    username: data.username || "",
                    fullName: data.fullName || "",
                    email: data.email || "",
                    image: data.image || "",
                    birthday: data.birthday
                        ? data.birthday.toString().split("T")[0]
                        : "",
                    address: data.address || "",
                });
                setLoading(false);
            })
            .catch(() => router.push("/login"));
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        console.log("Token:", token);
        console.log("StoredUser:", storedUser);
        if (!token || !storedUser) { router.push("/login"); return; }
        const userId = JSON.parse(storedUser).userId;

        try {
            const res = await fetch(`/api/users/${userId}/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: form.username,
                    fullName: form.fullName,
                    email: form.email,
                    birthday: form.birthday ? `${form.birthday}T00:00:00` : null,
                    address: form.address,
                }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || "Cập nhật thất bại");
            }

            setMessage({ text: "Cập nhật thành công!", type: "success" });
            setTimeout(() => router.push("/profile"), 1200);
        } catch (err: any) {
            setMessage({ text: err.message || "Lỗi kết nối", type: "error" });
        } finally {
            setSaving(false);
        }
    };
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (!token || !storedUser) return;
        const userId = JSON.parse(storedUser).userId;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`/api/users/${userId}/avatar`, {
                method: "POST",
                headers: {
                    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error("Upload thất bại");
            const imgUrl = await res.text();
            setForm({ ...form, image: imgUrl });
            setMessage({ text: "Đổi ảnh thành công!", type: "success" });
        } catch (err) {
            setMessage({ text: "Không thể upload ảnh", type: "error" });
        }
    };

    if (loading) return <div className={styles.wrapper}>Đang tải...</div>;

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <button onClick={() => router.push("/profile")} className={styles.back}>
                    ← Quay lại
                </button>
                <h1 className={styles.title}>Chỉnh sửa trang cá nhân</h1>

                {message && (
                    <div className={`${styles.alert} ${message.type === "success" ? styles.alertSuccess : styles.alertError}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.avatarSection}>
                        <img
                            src={form.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.fullName || "U")}`}
                            alt="Avatar"
                            className={styles.avatar}
                        />
                        <div>
                            <span className={styles.avatarLabel}>@{form.username}</span>
                            <label className={styles.uploadBtn}>
                                Đổi ảnh
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    style={{ display: "none" }}
                                />
                            </label>
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Họ và tên</label>
                        <input
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Nguyễn Văn A"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="email@example.com"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Ngày sinh</label>
                        <input
                            name="birthday"
                            type="date"
                            value={form.birthday}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Địa chỉ</label>

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

                        {form.address && (
                            <p className={styles.locationPreview}>📍 {form.address}</p>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={() => router.push("/profile")}
                            className={styles.cancelBtn}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className={styles.saveBtn}
                        >
                            {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}