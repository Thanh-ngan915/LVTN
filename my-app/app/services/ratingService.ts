const API_BASE = '';

export interface RatingMaterialDTO {
  url: string;
}

export interface RatingReplyDTO {
  id: number;
  ratingId: number;
  ratingReplyId: number | null;
  url: string | null;
  stars: number | null;
  isReply: boolean;
  createdBy: string;
  createdAt: string;
  userFullName: string;
  userImage: string | null;
}

export interface RatingDTO {
  id: number;
  storeId: number;
  orderId: number;
  stars: number;
  isReply: boolean;
  createdBy: string;
  createdAt: string;
  userFullName: string;
  userImage: string | null;
  materialUrls: string[];
  replies: RatingReplyDTO[];
}

export interface RatingSummaryDTO {
  averageStars: number;
  totalRatings: number;
  starCounts: Record<number, number>;
}

export interface RatingApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Lấy đánh giá theo productId
 */
export async function getRatingsByProduct(
  productId: number,
  page = 0,
  size = 10,
  star?: number
): Promise<RatingApiResponse<RatingDTO[]>> {
  let url = `${API_BASE}/api/ratings/product/${productId}?page=${page}&size=${size}`;
  if (star !== undefined && star !== null) {
    url += `&star=${star}`;
  }
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch ratings');
  return res.json();
}

/**
 * Lấy tóm tắt đánh giá (trung bình sao, đếm theo sao)
 */
export async function getRatingSummary(
  productId: number
): Promise<RatingApiResponse<RatingSummaryDTO>> {
  const res = await fetch(`${API_BASE}/api/ratings/product/${productId}/summary`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch rating summary');
  return res.json();
}

/**
 * Gửi đánh giá mới
 */
export async function submitRating(
  orderId: number,
  storeId: number,
  stars: number,
  comment: string,
  materialUrls: string[],
  username: string
): Promise<RatingApiResponse<RatingDTO>> {
  const res = await fetch(`${API_BASE}/api/ratings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Name': username,
    },
    body: JSON.stringify({
      orderId,
      storeId,
      stars,
      comment,
      materialUrls,
    }),
  });
  if (!res.ok) throw new Error('Failed to submit rating');
  return res.json();
}

/**
 * Reply cho một đánh giá
 */
export async function submitReply(
  ratingId: number,
  comment: string,
  username: string,
  url?: string,
  stars?: number,
  parentReplyId?: number
): Promise<RatingApiResponse<RatingReplyDTO>> {
  const res = await fetch(`${API_BASE}/api/ratings/${ratingId}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Name': username,
    },
    body: JSON.stringify({
      comment,
      url: url || null,
      stars: stars || null,
      parentReplyId: parentReplyId || null,
    }),
  });
  if (!res.ok) throw new Error('Failed to submit reply');
  return res.json();
}
