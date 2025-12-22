import { API_BASE_URL } from '@/config';

export class ApiError extends Error {
  public status: number;
  public details?: any;

  constructor(message: string, status = 500, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export type FetchOptions = Omit<RequestInit, 'body' | 'headers'> & {
  body?: any;
  token?: string | null;
  timeoutMs?: number;
};

export async function apiFetch<T = any>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { body, token, timeoutMs = 10000, ...rest } = opts;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fullUrl = `${API_BASE_URL}${path}`;
  // ...
  // ...

  try {
    const res = await fetch(fullUrl, {
      ...rest,
      cache: 'no-store', // Forzar a no usar caché
      signal: controller.signal,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    clearTimeout(id);

    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (parseErr) {
      // ...
    }

    if (!res.ok) {
      const message = data?.message || data?.error || `Request failed with status ${res.status}`;
      // ...
      throw new ApiError(message, res.status, data);
    }

    return data as T;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      // ...
      throw new ApiError('Request timeout', 408);
    }
    if (err instanceof ApiError) {
      // ...
      throw err;
    }
    // ...
    throw new ApiError(err.message || 'Network error', err.status || 0, err);
  }
}

export default apiFetch;
