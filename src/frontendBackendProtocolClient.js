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
    fetchImpl = globalThis.fetch,
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

  setTokensFromAuthPayload(payload) {
    const now = Date.now();
    const tokens = {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      accessExpiresAt: now + Number(payload.accessExpiresIn || 0) * 1000,
      refreshExpiresAt: now + Number(payload.refreshExpiresIn || 0) * 1000,
      tokenType: payload.tokenType || 'Bearer'
    };

    this.tokenStorage.setTokens(tokens);
    return tokens;
  }

  clearTokens() {
    this.tokenStorage.clearTokens();
  }

  isAccessTokenExpired(tokens = this.getTokens()) {
    if (!tokens?.accessToken || !tokens?.accessExpiresAt) {
      return true;
    }

    return Date.now() >= tokens.accessExpiresAt;
  }

  async register({ username, login, password }) {
    const payload = await this.request('POST', '/auth/register', {
      username,
      login,
      password
    });
    this.setTokensFromAuthPayload(payload);
    return payload;
  }

  async login({ login, password }) {
    const payload = await this.request('POST', '/auth/login', {
      login,
      password
    });
    this.setTokensFromAuthPayload(payload);
    return payload;
  }

  async refreshToken() {
    if (!this.refreshPromise) {
      this.refreshPromise = this.#refreshTokenInternal().finally(() => {
        this.refreshPromise = null;
      });
    }

    return this.refreshPromise;
  }

  async #refreshTokenInternal() {
    const tokens = this.getTokens();
    if (!tokens?.refreshToken) {
      throw new ApiError('Refresh token is missing', { code: 'UNAUTHORIZED' });
    }

    const payload = await this.request(
      'POST',
      '/auth/refresh',
      { refreshToken: tokens.refreshToken },
      { skipAuthRefresh: true }
    );

    this.setTokensFromAuthPayload({
      ...payload,
      refreshToken: payload.refreshToken,
      accessToken: payload.accessToken,
      accessExpiresIn: payload.accessExpiresIn,
      refreshExpiresIn: payload.refreshExpiresIn,
      tokenType: payload.tokenType || tokens.tokenType
    });

    return payload;
  }

  async addFriend(friendLogin) {
    return this.request('POST', '/friends/add', { friendLogin });
  }

  async removeFriend(friendLogin) {
    return this.request('DELETE', '/friends/remove', { friendLogin });
  }

  async getFriends() {
    return this.request('GET', '/friends');
  }

  async searchFriends(username) {
    return this.request('GET', '/friends/search', undefined, {
      query: { username }
    });
  }

  async getCatalog() {
    return this.request('GET', '/gift-ideas/catalog');
  }

  async createCatalogGift({ giftName, giftAvgPrice, tagName }) {
    return this.request('POST', '/gift-ideas/catalog', {
      giftName,
      giftAvgPrice,
      tagName
    });
  }

  async addToWishlist(giftId) {
    return this.request('POST', '/gift-ideas/wishlist', { giftId });
  }

  async removeFromWishlist(giftId) {
    return this.request('DELETE', '/gift-ideas/wishlist', { giftId });
  }

  async getMyWishlist() {
    return this.request('GET', '/gift-ideas/wishlist/me');
  }

  async getFriendWishlist(friendLogin) {
    return this.request(
      'GET',
      `/gift-ideas/wishlist/friend/${encodeURIComponent(friendLogin)}`
    );
  }

  async getFriendRecommendations(friendLogin) {
    return this.request(
      'GET',
      `/gift-ideas/recommendations/friend/${encodeURIComponent(friendLogin)}`
    );
  }

  async createVictim({ gender, birthdate, country, city, info }) {
    return this.request('POST', '/gift-ideas/victim', {
      gender,
      birthdate: toLocalDateTimeString(birthdate),
      country,
      city,
      info
    });
  }

  async getVictims() {
    return this.request('GET', '/gift-ideas/victim');
  }

  async getVictimRecommendations(victimId) {
    return this.request('GET', `/gift-ideas/recommendations/victim/${victimId}`);
  }

  async request(method, path, body, options = {}) {
    const { query, skipAuthRefresh = false, retryOnUnauthorized = true } = options;
    const url = this.#buildUrl(path, query);

    const endpointKey = `${method.toUpperCase()} ${path}`;
    const isPublicEndpoint = PUBLIC_ENDPOINTS.has(endpointKey);

    if (!isPublicEndpoint && !skipAuthRefresh && this.isAccessTokenExpired()) {
      await this.refreshToken();
    }

    const headers = {
      Accept: 'application/json'
    };

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    const tokens = this.getTokens();
    if (!isPublicEndpoint && tokens?.accessToken) {
      headers.Authorization = `${tokens.tokenType || 'Bearer'} ${tokens.accessToken}`;
    }

    const response = await this.fetchImpl(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });

    const data = await parseJsonSafely(response);

    if (
      response.status === 401 &&
      !skipAuthRefresh &&
      !isPublicEndpoint &&
      retryOnUnauthorized
    ) {
      try {
        await this.refreshToken();
      } catch {
        this.clearTokens();
        throw extractApiError(response, data);
      }

      return this.request(method, path, body, {
        ...options,
        retryOnUnauthorized: false
      });
    }

    if (!response.ok) {
      throw extractApiError(response, data);
    }

    if (isWrappedResponse(data)) {
      if (data.responseCode !== 'OC_OK') {
        throw extractApiError(response, data);
      }
      return data.responseEntity;
    }

    return data;
  }

  #buildUrl(path, query) {
    const url = new URL(path, `${this.baseUrl}/`);

    if (query && typeof query === 'object') {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
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
