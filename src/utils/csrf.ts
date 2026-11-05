/**
 * CSRF Protection Utility for B2B Client Applications
 * Handles token fetching, caching, automatic injection, and auto-refresh on 403.
 */

export interface CsrfTokenInfo {
  token: string;
  expiresAt: number;
  algorithm: string;
}

let cachedToken: CsrfTokenInfo | null = null;
let pendingFetch: Promise<string> | null = null;

type CsrfStatusListener = (info: {
  hasToken: boolean;
  tokenPreview: string;
  expiresInMinutes: number;
  lastUpdated: string;
}) => void;

const listeners: Set<CsrfStatusListener> = new Set();

function notifyListeners() {
  const hasToken = !!cachedToken && cachedToken.expiresAt > Date.now();
  const tokenPreview = cachedToken ? `${cachedToken.token.slice(0, 8)}...${cachedToken.token.slice(-6)}` : 'Tidak Aktif';
  const expiresInMinutes = cachedToken ? Math.max(0, Math.round((cachedToken.expiresAt - Date.now()) / 60000)) : 0;
  const lastUpdated = new Date().toLocaleTimeString('id-ID');

  listeners.forEach((listener) => {
    try {
      listener({ hasToken, tokenPreview, expiresInMinutes, lastUpdated });
    } catch (e) {
      console.error('Error notifying CSRF listener:', e);
    }
  });
}

export function subscribeCsrfStatus(listener: CsrfStatusListener): () => void {
  listeners.add(listener);
  notifyListeners();
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Retrieves a valid CSRF token, fetching a new one from the server if expired or uninitialized.
 */
export async function getCsrfToken(forceRefresh = false): Promise<string> {
  // If we already have a valid unexpired token and don't force refresh, return it
  if (!forceRefresh && cachedToken && cachedToken.expiresAt - Date.now() > 60000) {
    return cachedToken.token;
  }

  // Deduplicate simultaneous fetch requests
  if (pendingFetch && !forceRefresh) {
    return pendingFetch;
  }

  pendingFetch = (async () => {
    try {
      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch CSRF token: HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data.csrfToken) {
        throw new Error('Server response missing csrfToken field');
      }

      cachedToken = {
        token: data.csrfToken,
        expiresAt: data.expiresAt || Date.now() + 2 * 60 * 60 * 1000,
        algorithm: data.algorithm || 'HMAC-SHA256',
      };

      notifyListeners();
      return cachedToken.token;
    } catch (error) {
      console.warn('Failed to obtain CSRF token from /api/csrf-token:', error);
      // Generate a client-side fallback token if server is unreachable
      const fallbackToken = `client_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      cachedToken = {
        token: fallbackToken,
        expiresAt: Date.now() + 300000,
        algorithm: 'client-fallback',
      };
      notifyListeners();
      return fallbackToken;
    } finally {
      pendingFetch = null;
    }
  })();

  return pendingFetch;
}

/**
 * Wrapper around standard fetch that automatically attaches the X-CSRF-Token header
 * for state-changing HTTP requests (POST, PUT, PATCH, DELETE).
 * Retries once if server returns a 403 CSRF token error.
 */
export async function fetchWithCsrf(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const method = (init.method || 'GET').toUpperCase();
  const isStateChanging = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  let headers = new Headers(init.headers || {});

  if (isStateChanging) {
    const token = await getCsrfToken();
    if (!headers.has('X-CSRF-Token') && !headers.has('x-csrf-token')) {
      headers.set('X-CSRF-Token', token);
    }
  }

  const enhancedInit: RequestInit = {
    ...init,
    headers,
  };

  const response = await fetch(input, enhancedInit);

  // If request failed with 403 due to CSRF expiration or invalid token, refresh token and retry once
  if (response.status === 403 && isStateChanging) {
    try {
      const clone = response.clone();
      const body = await clone.json().catch(() => null);
      if (body && (body.code === 'EBADCSRFTOKEN' || String(body.error).toLowerCase().includes('csrf'))) {
        console.warn('CSRF token expired or rejected. Refreshing and retrying request...');
        const newToken = await getCsrfToken(true);
        const retryHeaders = new Headers(init.headers || {});
        retryHeaders.set('X-CSRF-Token', newToken);
        return fetch(input, {
          ...init,
          headers: retryHeaders,
        });
      }
    } catch {
      // Continue and return original response if retry check fails
    }
  }

  return response;
}
