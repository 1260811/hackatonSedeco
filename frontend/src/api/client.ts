import { useAuthStore } from '@/stores/authStore';
import type { ApiError } from '@/types/api';
import { HttpError } from '@/utils/errors';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  idempotencyKey?: string;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, idempotencyKey } = options;
  const token = useAuthStore.getState().token;

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };
  if (token) finalHeaders.Authorization = `Bearer ${token}`;
  if (idempotencyKey) finalHeaders['Idempotency-Key'] = idempotencyKey;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  const data: unknown = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const apiError = (data ?? {
      code: 'INTERNAL_ERROR',
      message: response.statusText,
    }) as ApiError;
    if (response.status === 401) {
      useAuthStore.getState().clear();
    }
    throw new HttpError(response.status, apiError);
  }

  return data as T;
}
