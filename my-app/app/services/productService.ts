const API_BASE = '';

export interface ProductVariant {
  id: number;
  size: string;
  color: string;
  priceBefore: number;
  priceAfter: number;
  currentQuantity: number;
  sold: number;
  sku: string;
}

export interface Product {
  id: number;
  name: string;
  priceBefore: number;
  priceAfter: number;
  initQuantity: number;
  currentQuantity: number;
  sold: number;
  description: string;
  status: string;
  categoryShortname: string;
  categoryName: string;
  storeId: string;
  rate: number;
  imageUrls: string[];
  variants: ProductVariant[];
}

export interface Category {
  shortname: string;
  name: string;
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export async function getProducts(
  page = 0,
  size = 12,
  sortBy = 'createdAt',
  sortDir = 'desc'
): Promise<ApiResponse<Product[]>> {
  const res = await fetch(
    `${API_BASE}/api/products?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProductById(id: number): Promise<ApiResponse<Product>> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function getProductsByCategory(
  category: string,
  page = 0,
  size = 12
): Promise<ApiResponse<Product[]>> {
  const res = await fetch(
    `${API_BASE}/api/products/category/${category}?page=${page}&size=${size}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to fetch products by category');
  return res.json();
}

export async function searchProducts(
  keyword: string,
  page = 0,
  size = 12
): Promise<ApiResponse<Product[]>> {
  const res = await fetch(
    `${API_BASE}/api/products/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to search products');
  return res.json();
}

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  const res = await fetch(`${API_BASE}/api/categories`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}
