'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';

interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  percent: number;
  maximum: number;
  endDate: string;
  status: number;
}

export default function PromotionsPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8090/api/vouchers')
      .then(res => res.json())
      .then(data => setVouchers(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Header />
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '1rem' }}>Tất cả Khuyến Mãi</h1>
        
        {loading ? (
          <p>Đang tải khuyến mãi...</p>
        ) : vouchers.length === 0 ? (
          <p>Hiện không có khuyến mãi nào.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {vouchers.map(v => (
              <div key={v.id} style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#e53e3e', marginBottom: '0.5rem' }}>Mã: {v.code}</h3>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{v.title}</p>
                <p style={{ color: '#555', marginBottom: '0.5rem' }}>{v.description}</p>
                <p style={{ fontWeight: 'bold', color: '#3182ce' }}>{v.percent ? `Giảm ${v.percent}%` : 'Khuyến mãi'}</p>
                {v.endDate && <p style={{ fontSize: '14px', color: '#888', marginTop: '0.5rem' }}>HSD: {new Date(v.endDate).toLocaleDateString('vi-VN')}</p>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
