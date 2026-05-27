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

export interface OrderItemRequestDTO {
  productId: number;
  variantId?: number;
  quantity: number;
  productPriceBefore: number;
  productPriceAfter: number;
  productName?: string;
  productImage?: string;
  color?: string;
  size?: string;
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
  items?: OrderItemRequestDTO[];
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
  rated?: boolean;
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

export interface OrderItem {
    productId: number;
    productName: string;
    productImage: string;
    color: string;
    size: string;
    quantity: number;
    priceAfter: number;
}

export interface Order {
    id: number;
    storeId: string;
    status: string;
    createdAt: string;
    items: OrderItem[];
    rated?: boolean;
}

export interface RatingForm {
    orderId: number;
    storeId: string;
    stars: number;
    comment: string;
    materialUrls: string[];
}

export interface ReviewModalProps {
    order: Order;
    onClose: () => void;
    onSuccess: (orderId: number) => void;
}

function getToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') || '';
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

function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  const userId = getUserId();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (userId) headers['X-User-Id'] = userId;
  return headers;
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
      ...getAuthHeaders(),
    },
    body: JSON.stringify(request),
  });

  const data = await res.json();
  console.log("BE response:", data);
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
    headers: { ...getAuthHeaders() },
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
    headers: { ...getAuthHeaders() },
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
    headers: { ...getAuthHeaders() },
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
    headers: { ...getAuthHeaders() },
    cache: 'no-store',
  });
  if (!res.ok) return { success: true, message: '', data: [] };
  return res.json();
}
//hủy đơn
export async function cancelOrder(orderId: number): Promise<OrderApiResponse<OrderResponseDTO>> {
    const res = await fetch(`${API_BASE}/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: { ...getAuthHeaders() },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Hủy đơn thất bại');
    return data;
}

export interface RatingRequestDTO {
    orderId: number;
    stars: number;
    comment: string;
}

export interface RatingDTO {
    id: number;
    orderId: number;
    productId: number;
    userId: string;
    stars: number;
    comment: string;
    createdAt: string;
}
//đánh giá đơn hàng
export async function submitRating(
    request: RatingRequestDTO
): Promise<OrderApiResponse<RatingDTO>> {
    const res = await fetch(`/api/orders/ratings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(request),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Đánh giá thất bại');
    return data;
}
