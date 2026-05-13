'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import styles from '../checkout.module.css';

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'success' | 'failed' | 'error'>('loading');
  const [message, setMessage] = useState('Đang xác thực giao dịch...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Gửi toàn bộ query params nhận được từ VNPay về backend để kiểm tra checksum
        const queryString = searchParams.toString();
        const res = await fetch(`/api/orders/vnpay-callback?${queryString}`);
        const data = await res.json();

        if (data.success) {
          setStatus('success');
          setMessage('Thanh toán thành công! Cảm ơn bạn đã mua hàng.');
        } else {
          setStatus('failed');
          setMessage(data.message || 'Thanh toán thất bại hoặc giao dịch bị hủy.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Đã có lỗi xảy ra trong quá trình xác thực thanh toán.');
      } finally {
        setLoading(false);
      }
    };

    if (searchParams.get('vnp_ResponseCode')) {
      verifyPayment();
    } else {
      setLoading(false);
      setStatus('error');
      setMessage('Không tìm thấy thông tin giao dịch.');
    }
  }, [searchParams]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.successContainer}>
        <div className={styles.successCard}>
          {loading ? (
            <div className={styles.loadingPulse}>
              <div className={styles.spinner}></div>
              <p>Đang xác thực giao dịch...</p>
            </div>
          ) : (
            <>
              <div className={`${styles.successIcon} ${status !== 'success' ? styles.errorIcon : ''}`}>
                {status === 'success' ? '✅' : '❌'}
              </div>
              <h1 className={styles.successTitle}>
                {status === 'success' ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
              </h1>
              <p className={styles.successSub}>{message}</p>
              
              {status === 'success' && (
                <div className={styles.paymentDetails}>
                    <p>Mã giao dịch: <strong>{searchParams.get('vnp_TransactionNo')}</strong></p>
                    <p>Số tiền: <strong>{formatPrice(Number(searchParams.get('vnp_Amount')) / 100)}</strong></p>
                </div>
              )}

              <div className={styles.successActions}>
                <button 
                    className={styles.successBtnPrimary} 
                    onClick={() => router.push('/')}
                >
                  Tiếp tục mua sắm
                </button>
                <button 
                    className={styles.successBtnSecondary} 
                    onClick={() => router.push('/order/history')}
                >
                  Lịch sử đơn hàng
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <PaymentResultContent />
    </Suspense>
  );
}
