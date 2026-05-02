const API_BASE = '';

export interface CartItemDTO {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  productName: string;
  priceBefore: number;
  priceAfter: number;
  productImage: string | null;
  categoryName: string | null;
  storeId: string;
  status: string;
}

export interface CartApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Lấy userId từ localStorage
 */
function getUserId(): string {
  if (typeof window === 'undefined') return '';
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.userId || '';
    }
  } catch (e) {
    console.error('Failed to get userId from localStorage', e);
  }
  return '';
}

/**
 * Lấy giỏ hàng của user
 */
export async function getCart(): Promise<CartApiResponse<CartItemDTO[]>> {
  const userId = getUserId();
  if (!userId) {
    return { success: false, message: 'Chưa đăng nhập', data: [] };
  }
  const res = await fetch(`${API_BASE}/api/cart`, {
    headers: { 'X-User-Id': userId },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch cart');
  return res.json();
}

/**
 * Thêm sản phẩm vào giỏ hàng
 */
export async function addToCart(
  productId: string,
  quantity: number = 1
): Promise<CartApiResponse<CartItemDTO>> {
  const userId = getUserId();
  if (!userId) {
    throw new Error('Vui lòng đăng nhập để thêm vào giỏ hàng');
  }
  const res = await fetch(`${API_BASE}/api/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Lỗi thêm vào giỏ hàng' }));
    throw new Error(errorData.message || 'Lỗi thêm vào giỏ hàng');
  }
  return res.json();
}

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 */
export async function updateCartItem(
  cartItemId: string,
  quantity: number
): Promise<CartApiResponse<CartItemDTO>> {
  const userId = getUserId();
  if (!userId) throw new Error('Chưa đăng nhập');
  const res = await fetch(`${API_BASE}/api/cart/${cartItemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
    },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Lỗi cập nhật giỏ hàng' }));
    throw new Error(errorData.message || 'Lỗi cập nhật giỏ hàng');
  }
  return res.json();
}

/**
 * Xóa sản phẩm khỏi giỏ hàng
 */
export async function removeFromCart(cartItemId: string): Promise<CartApiResponse<void>> {
  const userId = getUserId();
  if (!userId) throw new Error('Chưa đăng nhập');
  const res = await fetch(`${API_BASE}/api/cart/${cartItemId}`, {
    method: 'DELETE',
    headers: { 'X-User-Id': userId },
  });
  if (!res.ok) throw new Error('Failed to remove from cart');
  return res.json();
}

/**
 * Xóa toàn bộ giỏ hàng
 */
export async function clearCart(): Promise<CartApiResponse<void>> {
  const userId = getUserId();
  if (!userId) throw new Error('Chưa đăng nhập');
  const res = await fetch(`${API_BASE}/api/cart`, {
    method: 'DELETE',
    headers: { 'X-User-Id': userId },
  });
  if (!res.ok) throw new Error('Failed to clear cart');
  return res.json();
}

/**
 * Đếm số lượng sản phẩm trong giỏ hàng
 */
export async function getCartCount(): Promise<number> {
  const userId = getUserId();
  if (!userId) return 0;
  try {
    const res = await fetch(`${API_BASE}/api/cart/count`, {
      headers: { 'X-User-Id': userId },
      cache: 'no-store',
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.data || 0;
  } catch {
    return 0;
  }
}
