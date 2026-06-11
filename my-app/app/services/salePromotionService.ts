// services/salePromotionService.ts
const API_BASE = '';

export interface SalePromotionDTO {
    id: string;
    title: string;
    description: string;
    type: string;
    status: number;
    startDate: string;
    endDate: string;
    storeId: string;
}

export interface SalePromotionRequestDTO {
    title: string;
    description: string;
    type: string;
    startDate: string;
    endDate: string;
}

export interface ProductPromotionDTO {
    id: string;
    productId: string;
    salePromotionId: string;
    name: string;
    image: string;
    priceAfter: number;
    quantity: number;
    bought: number;
    isDelete: boolean;
    startDate?: string;
    endDate?: string;
}

export interface ProductPromotionRequestDTO {
    productId: string;
    priceAfter: number;
    quantity: number;
}

function getAuthHeaders(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('token') || '';
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
        'Authorization': `Bearer ${token}`,
        'X-User-Id': user.userId || '',
    };
}

// ---- SalePromotion ----

export async function getSalePromotions(storeId: string): Promise<SalePromotionDTO[]> {
    const res = await fetch(`${API_BASE}/api/stores/${storeId}/sale-promotions`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Lỗi lấy danh sách KM');
    return res.json();
}

export async function getDeletedSalePromotions(storeId: string): Promise<SalePromotionDTO[]> {
    const res = await fetch(`${API_BASE}/api/stores/${storeId}/sale-promotions/deleted`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Lỗi lấy danh sách KM đã xóa');
    return res.json();
}

export async function getSalePromotionById(storeId: string, id: string): Promise<SalePromotionDTO> {
    const res = await fetch(`${API_BASE}/api/stores/${storeId}/sale-promotions/${id}`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Lỗi lấy chi tiết KM');
    return res.json();
}

export async function createSalePromotion(storeId: string, data: SalePromotionRequestDTO): Promise<SalePromotionDTO> {
    const res = await fetch(`${API_BASE}/api/stores/${storeId}/sale-promotions`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Lỗi tạo KM');
    return res.json();
}

export async function updateSalePromotion(storeId: string, id: string, data: SalePromotionRequestDTO): Promise<SalePromotionDTO> {
    const res = await fetch(`${API_BASE}/api/stores/${storeId}/sale-promotions/${id}`, {
        method: 'PUT',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'Lỗi cập nhật KM');
    }
    return res.json();
}

export async function deleteSalePromotion(storeId: string, id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/stores/${storeId}/sale-promotions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Lỗi xóa KM');
}

export async function restoreSalePromotion(storeId: string, id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/stores/${storeId}/sale-promotions/${id}/restore`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Lỗi khôi phục KM');
}

// ---- ProductPromotion ----

export async function getProductsByPromotion(storeId: string, salePromotionId: string): Promise<ProductPromotionDTO[]> {
    const res = await fetch(`${API_BASE}/api/stores/${storeId}/sale-promotions/${salePromotionId}/products`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Lỗi lấy sản phẩm KM');
    return res.json();
}

export async function addProductToPromotion(storeId: string, salePromotionId: string, data: ProductPromotionRequestDTO): Promise<ProductPromotionDTO> {
    const res = await fetch(`${API_BASE}/api/stores/${storeId}/sale-promotions/${salePromotionId}/products`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Lỗi thêm sản phẩm vào KM');
    return res.json();
}

export async function removeProductFromPromotion(storeId: string, salePromotionId: string, id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/stores/${storeId}/sale-promotions/${salePromotionId}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Lỗi xóa sản phẩm khỏi KM');
}

export async function getActiveProductPromotions(): Promise<ProductPromotionDTO[]> {
    const res = await fetch(`${API_BASE}/api/stores/promotions/active`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Lỗi lấy sản phẩm khuyến mãi hoạt động');
    return res.json();
}