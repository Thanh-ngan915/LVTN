const API_BASE = '';

export interface StoreDTO {
    id: string;
    name: string;
    image: string;
    location: string;
    description: string;
    status: string;
}

export interface StoreProfileResponseDTO {
    store: StoreDTO;
    productCount: number;
    followerCount: number;
    rating: number;
    responseRate: number;
}

export async function getStoreById(storeId: string): Promise<StoreProfileResponseDTO> {
    const res = await fetch(`${API_BASE}/api/stores/${storeId}`, {
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch store');
    return res.json();
}
