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

  getTokens() {
    return this.tokenStorage.getTokens();
  }

  clearTokens() {
    this.tokenStorage.clearTokens();
  }

  setTokensFromAuthResponse(data) {
    const now = Date.now();
    const nextTokens = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      tokenType: data.tokenType || 'Bearer',
      accessExpiresAt: data.accessExpiresIn ? now + data.accessExpiresIn * 1000 : null,
      refreshExpiresAt: data.refreshExpiresIn ? now + data.refreshExpiresIn * 1000 : null
    };

    this.tokenStorage.setTokens(nextTokens);
    return nextTokens;
  }

  isPublicRequest(method, path) {
    return PUBLIC_ENDPOINTS.has(`${method.toUpperCase()} ${path}`);
  }

  withAuthHeaders(headers = {}) {
    const tokens = this.tokenStorage.getTokens();
    if (!tokens?.accessToken) {
      return headers;
    }

    return {
      ...headers,
      Authorization: `${tokens.tokenType || 'Bearer'} ${tokens.accessToken}`
    };
  }

  async request(method, path, { body, query, retryOnUnauthorized = true } = {}) {
    const search = query ? `?${new URLSearchParams(query).toString()}` : '';
    const url = `${this.baseUrl}${path}${search}`;
    const headers = { 'Content-Type': 'application/json' };
    const securedHeaders = this.isPublicRequest(method, path)
      ? headers
      : this.withAuthHeaders(headers);

    const response = await this.fetchImpl(url, {
      method,
      headers: securedHeaders,
      body: body === undefined ? undefined : JSON.stringify(body)
    });

    const data = await parseJsonSafely(response);

    if (response.ok) {
      if (isWrappedResponse(data)) {
        if (data.responseCode !== 'OC_OK') {
          throw extractApiError(response, data);
        }

        return data.responseEntity;
      }

      return data;
    }

    if (response.status === 401 && retryOnUnauthorized && !this.isPublicRequest(method, path)) {
      await this.refreshTokens();
      return this.request(method, path, { body, query, retryOnUnauthorized: false });
    }

    throw extractApiError(response, data);
  }

  async refreshTokens() {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const tokens = this.tokenStorage.getTokens();
      if (!tokens?.refreshToken) {
        this.tokenStorage.clearTokens();
        throw new ApiError('Refresh token is missing', { code: 'UNAUTHORIZED' });
      }

      const refreshed = await this.request('POST', '/auth/refresh', {
        body: { refreshToken: tokens.refreshToken },
        retryOnUnauthorized: false
      });

      this.setTokensFromAuthResponse(refreshed);
      return refreshed;
    })();

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  async register(payload) {
    const response = await this.request('POST', '/auth/register', { body: payload });
    this.setTokensFromAuthResponse(response);
    return response;
  }

  async login(payload) {
    const response = await this.request('POST', '/auth/login', { body: payload });
    this.setTokensFromAuthResponse(response);
    return response;
  }

  getCatalog() {
    return this.request('GET', '/gift-ideas/catalog');
  }

  createCatalogGift(payload) {
    return this.request('POST', '/gift-ideas/catalog', { body: payload });
  }

  addToWishlist(giftId) {
    return this.request('POST', '/gift-ideas/wishlist', { body: { giftId } });
  }

  removeFromWishlist(giftId) {
    return this.request('DELETE', '/gift-ideas/wishlist', { body: { giftId } });
  }

  getMyWishlist() {
    return this.request('GET', '/gift-ideas/wishlist/me');
  }

  getFriendWishlist(friendLogin) {
    return this.request('GET', `/gift-ideas/wishlist/friend/${encodeURIComponent(friendLogin)}`);
  }

  getFriendRecommendations(friendLogin) {
    return this.request('GET', `/gift-ideas/recommendations/friend/${encodeURIComponent(friendLogin)}`);
  }

  createVictim(victimData) {
    return this.request('POST', '/gift-ideas/victim', {
      body: {
        ...victimData,
        birthdate: toLocalDateTimeString(victimData.birthdate)
      }
    });
  }

  getVictims() {
    return this.request('GET', '/gift-ideas/victim');
  }

  getVictimRecommendations(victimId) {
    return this.request('GET', `/gift-ideas/recommendations/victim/${victimId}`);
  }

  addFriend(friendLogin) {
    return this.request('POST', '/friends/add', { body: { friendLogin } });
  }

  removeFriend(friendLogin) {
    return this.request('DELETE', '/friends/remove', { body: { friendLogin } });
  }

  getFriends() {
    return this.request('GET', '/friends');
  }

  searchFriends(username) {
    return this.request('GET', '/friends/search', { query: { username } });
  }
}
