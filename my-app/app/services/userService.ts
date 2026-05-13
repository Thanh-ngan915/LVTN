const API_BASE = '';

export interface UserProfile {
  id: string;
  image: string;
  fullName: string;
  email: string;
  address: string;
  role: string;
  status: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/api/users/${userId}/profile`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}
