import { useAuthStore } from '@/stores/auth-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  json?: unknown;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { json, ...fetchOptions } = options;
  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (json) {
    headers['Content-Type'] = 'application/json';
    fetchOptions.body = JSON.stringify(json);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: 'POST', json: body }),
  put: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: 'PUT', json: body }),
  patch: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: 'PATCH', json: body }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
