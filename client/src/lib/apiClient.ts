/**
 * Unified API Client
 * 
 * - Prepends baseURL from config
 * - Handles 401 globally (for "Reconnect" flow)
 * - Handles null/undefined gracefully
 * - Provides consistent error handling
 */

import { API_BASE } from '@/config/api';

// Global fetch types
type FetchRequestInit = globalThis.RequestInit;
type FetchHeadersInit = globalThis.HeadersInit;

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  isUnauthorized: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

/**
 * Global 401 handler - can be set by app to trigger reconnect flow
 */
let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(handler: () => void) {
  onUnauthorized = handler;
}

/**
 * Unified fetch wrapper
 */
export async function apiClient<T>(
  endpoint: string,
  options: FetchRequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  
  const defaultHeaders: FetchHeadersInit = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    // Handle 401 globally
    if (response.status === 401) {
      if (onUnauthorized) {
        onUnauthorized();
      }
      return {
        data: null,
        error: 'Unauthorized - Please reconnect',
        status: 401,
        isUnauthorized: true,
      };
    }

    // Handle other errors
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch {
        // Ignore JSON parse errors for error response
      }
      
      return {
        data: null,
        error: errorMessage,
        status: response.status,
        isUnauthorized: false,
      };
    }

    // Parse successful response
    const data = await response.json();
    
    // Handle envelope format { success, data, ... }
    if (data && typeof data === 'object' && 'data' in data) {
      return {
        data: data.data as T,
        error: null,
        status: response.status,
        isUnauthorized: false,
      };
    }

    // Direct data format
    return {
      data: data as T,
      error: null,
      status: response.status,
      isUnauthorized: false,
    };
  } catch (err) {
    // Network or other errors
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return {
      data: null,
      error: errorMessage,
      status: 0,
      isUnauthorized: false,
    };
  }
}

/**
 * GET request helper
 */
export function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiClient<T>(endpoint, { method: 'GET' });
}

/**
 * POST request helper
 */
export function apiPost<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
  return apiClient<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Safe value accessor - handles null/undefined gracefully
 */
export function safeValue<T>(value: T | null | undefined, defaultValue: T): T {
  return value ?? defaultValue;
}

/**
 * Safe number accessor
 */
export function safeNumber(value: number | string | null | undefined, defaultValue = 0): number {
  if (value === null || value === undefined) return defaultValue;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? defaultValue : num;
}

/**
 * Safe string accessor
 */
export function safeString(value: string | null | undefined, defaultValue = ''): string {
  return value ?? defaultValue;
}
