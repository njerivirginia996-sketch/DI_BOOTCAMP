import type { ApiError } from '@story-app/types';

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');
let refreshInFlight: Promise<{ accessToken: string }> | null = null;

export class ApiRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

async function decode<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'The request could not be completed.' })) as ApiError;
    throw new ApiRequestError(error.message || 'The request could not be completed.', response.status);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  return decode<T>(response);
}

export function refreshAccessToken(): Promise<{ accessToken: string }> {
  if (!refreshInFlight) {
    refreshInFlight = apiRequest<{ accessToken: string }>('/auth/refresh', { method: 'POST' })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

export interface AuthenticatedResponse<T> {
  data: T;
  accessToken: string;
}

export async function authenticatedRequest<T>(
  path: string,
  accessToken: string,
  options: RequestInit = {},
): Promise<AuthenticatedResponse<T>> {
  const request = (token: string) => fetch(`${apiBase}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  let response = await request(accessToken);
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    response = await request(refreshed.accessToken);
    return { data: await decode<T>(response), accessToken: refreshed.accessToken };
  }
  return { data: await decode<T>(response), accessToken };
}
