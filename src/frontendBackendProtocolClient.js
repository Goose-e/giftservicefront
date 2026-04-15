const PUBLIC_ENDPOINTS = new Set([
  'POST /auth/register',
  'POST /auth/login',
  'POST /auth/refresh',
  'GET /gift-ideas/catalog'
]);

export class ApiError extends Error {
  constructor(message, details = {}) {
    super(message || 'API request failed');
    this.name = 'ApiError';
    this.details = details;
  }
}

export class InMemoryTokenStorage {
  constructor(initialTokens = null) {
    this.tokens = initialTokens;
  }

  getTokens() {
    return this.tokens;
  }

  setTokens(tokens) {
    this.tokens = tokens;
  }

  clearTokens() {
    this.tokens = null;
  }
}

export class LocalStorageTokenStorage {
  constructor(storageKey = 'gift-service-auth') {
    this.storageKey = storageKey;
  }

  getTokens() {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  setTokens(tokens) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(tokens));
    }
  }

  clearTokens() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }
}

export class GiftServiceApiClient {
    constructor({
                    baseUrl,
                    fetchImpl = globalThis.fetch.bind(globalThis),
                    tokenStorage = new InMemoryTokenStorage()
                }) {
        if (!baseUrl) {
            throw new Error('baseUrl is required');
        }

        if (typeof fetchImpl !== 'function') {
            throw new Error('fetch implementation is required');
        }

        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.fetchImpl = fetchImpl;
        this.tokenStorage = tokenStorage;
        this.refreshPromise = null;
    }
}

function isWrappedResponse(data) {
  return data && typeof data === 'object' && 'responseCode' in data;
}

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function extractApiError(response, data) {
  if (isWrappedResponse(data)) {
    return new ApiError(data.error || data.message || 'Request failed', {
      status: response.status,
      code: data.responseCode,
      message: data.message,
      error: data.error,
      errors: data.errors,
      responseEntity: data.responseEntity
    });
  }

  if (data && typeof data === 'object' && 'error' in data) {
    return new ApiError(data.message || data.error || 'Unauthorized', {
      status: response.status,
      code: String(data.error).toUpperCase(),
      message: data.message,
      error: data.error
    });
  }

  return new ApiError(`HTTP ${response.status}`, {
    status: response.status,
    code: 'HTTP_ERROR',
    body: data
  });
}

export function toLocalDateTimeString(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new ApiError('Invalid birthdate format', { code: 'BAD_REQUEST' });
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
