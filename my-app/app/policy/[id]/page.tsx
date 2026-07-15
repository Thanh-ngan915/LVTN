'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './page.module.css';

export default function PolicyPage() {
    const params = useParams();
    const id = params?.id as string;
    const [policy, setPolicy] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetch('/api/policies')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const found = data.find((p: any) => p.id === id);
                    setPolicy(found);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className={styles.page}>Đang tải...</div>;

    if (!policy) return (
        <div className={styles.page}>
            <Header onSearch={() => {}} />
            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Không tìm thấy chính sách</h1>
                    <Link href="/" className={styles.backButton}>
                        ← Quay lại trang chủ
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );

    return (
        <div className={styles.page}>
            <Header onSearch={() => {}} />
            <main className={styles.main}>
                <div className={styles.container}>
                    <Link href="/" className={styles.backButton}>
                        ← Quay lại trang chủ
                    </Link>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{policy.title}</h1>
                        <div className={styles.date}>Cập nhật lần cuối: {new Date(policy.updatedAt || policy.createdAt).toLocaleDateString('vi-VN')}</div>
                    </div>
                    <div className={styles.content}>
                        {policy.content}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
