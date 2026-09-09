export const TOKEN_KEY = 'expertTalkz_auth_token';
export const USER_KEY = 'expertTalkz_active_user';

/**
 * Retrieves the stored JWT auth token from either localStorage or sessionStorage.
 */
export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
  } catch (e) {
    return null;
  }
};

/**
 * Retrieves the stored active user object from either localStorage or sessionStorage.
 */
export const getActiveUser = <T = any>(): T | null => {
  try {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    return null;
  }
};

/**
 * Checks whether the current session is stored persistently (Remember Me / localStorage).
 */
export const isPersistentSession = (): boolean => {
  try {
    return !!localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return false;
  }
};

/**
 * Stores the authentication credentials.
 * If rememberMe is true: saves in localStorage (persists across browser restarts).
 * If rememberMe is false: saves in sessionStorage (cleared when browser tab/window is closed).
 */
export const setAuthSession = (token: string, user: any, rememberMe: boolean = false): void => {
  try {
    const userStr = typeof user === 'string' ? user : JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, userStr);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(USER_KEY, userStr);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  } catch (e) {
    console.error('Failed to store session in Web Storage:', e);
  }
};

/**
 * Clears all authentication credentials from both localStorage and sessionStorage.
 */
export const clearAuthSession = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error('Failed to clear session storage:', e);
  }
};

/**
 * Safely decodes a JWT payload without external libraries.
 */
export const getDecodedToken = (token: string): any | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

/**
 * Checks if a JWT token is expired or will expire within the buffer window (in milliseconds).
 */
export const isTokenExpired = (token: string, bufferMs: number = 5000): boolean => {
  try {
    const decoded = getDecodedToken(token);
    if (!decoded || !decoded.exp) return true;
    const expiryMs = decoded.exp * 1000;
    return expiryMs <= Date.now() + bufferMs;
  } catch (e) {
    return true;
  }
};

/**
 * Returns the remaining time until token expiration in milliseconds.
 * Returns 0 if already expired or invalid.
 */
export const getTokenRemainingMs = (token: string): number => {
  try {
    const decoded = getDecodedToken(token);
    if (!decoded || !decoded.exp) return 0;
    const remaining = decoded.exp * 1000 - Date.now();
    return Math.max(0, remaining);
  } catch (e) {
    return 0;
  }
};
