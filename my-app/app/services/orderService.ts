const API_BASE = '';

export interface DeliveryInformationDTO {
  id?: number;
  userId?: number;
  recipientName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  isDefault?: boolean;
}

export interface VoucherDTO {
  id: number;
  code: string;
  name: string;
  description: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number | null;
  storeId: number | null;
  startDate: string | null;
  endDate: string | null;
  quantity: number | null;
  usedCount: number;
  status: string;
}

export interface OrderRequestDTO {
  productId: number;
  variantId?: number;
  quantity: number;
  storeId: string;
  productPriceBefore: number;
  productPriceAfter: number;
  voucherId?: number | null;
  paymentMethod: 'COD' | 'VNPAY';
  productName?: string;
  productImage?: string;
  color?: string;
  size?: string;
  recipientName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
}

export interface OrderResponseDTO {
  id: number;
  userId: string;
  storeId: string;
  total: number;
  discount: number;
  pay: number;
  shippingFee: number;
  voucherId: number | null;
  deliveryInformationId: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  deliveryInformation: DeliveryInformationDTO | null;
  voucherInfo: {
    id: number;
    code: string;
    name: string;
    discountType: string;
    discountValue: number;
    maxDiscount: number | null;
  } | null;
  items: {
    productId: number;
    productName: string | null;
    productImage: string | null;
    color: string | null;
    size: string | null;
    quantity: number;
    priceBefore: number;
    priceAfter: number;
  }[];
}

export interface OrderApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function getUserId(): string {
  if (typeof window === 'undefined') return '';
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.userId || '';
    }
  } catch (e) {
    console.error('Failed to get userId', e);
  }
  return '';
}

/**
 * Tạo đơn hàng mới (Mua Ngay)
 */
export async function createOrder(
  request: OrderRequestDTO
): Promise<OrderApiResponse<OrderResponseDTO>> {
  const userId = getUserId();
  if (!userId) throw new Error('Vui lòng đăng nhập để đặt hàng');

  const res = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
    },
    body: JSON.stringify(request),
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Đặt hàng thất bại');
  return data;
}

/**
 * Lấy voucher của shop
 */
export async function getVouchersByStore(
  storeId: string
): Promise<OrderApiResponse<VoucherDTO[]>> {
  const res = await fetch(`${API_BASE}/api/orders/vouchers/${storeId}`, {
    cache: 'no-store',
  });
  if (!res.ok) return { success: true, message: '', data: [] };
  return res.json();
}

/**
 * Lấy danh sách địa chỉ giao hàng của user
 */
export async function getDeliveryByUser(): Promise<OrderApiResponse<DeliveryInformationDTO[]>> {
  const userId = getUserId();
  if (!userId) return { success: false, message: 'Chưa đăng nhập', data: [] };

  const res = await fetch(`${API_BASE}/api/orders/delivery`, {
    headers: { 'X-User-Id': userId },
    cache: 'no-store',
  });
  if (!res.ok) return { success: true, message: '', data: [] };
  return res.json();
}

/**
 * Lấy thông tin đơn hàng
 */
export async function getOrderById(
  orderId: number
): Promise<OrderApiResponse<OrderResponseDTO>> {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Không tìm thấy đơn hàng');
  return res.json();
}

/**
 * Lấy danh sách đơn hàng của user
 */
export async function getOrdersByUser(): Promise<OrderApiResponse<OrderResponseDTO[]>> {
  const userId = getUserId();
  if (!userId) return { success: false, message: 'Chưa đăng nhập', data: [] };

  const res = await fetch(`${API_BASE}/api/orders/user`, {
    headers: { 'X-User-Id': userId },
    cache: 'no-store',
  });
  if (!res.ok) return { success: true, message: '', data: [] };
  return res.json();
}
