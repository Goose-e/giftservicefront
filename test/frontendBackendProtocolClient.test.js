import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ApiError,
  GiftServiceApiClient,
  InMemoryTokenStorage,
  toLocalDateTimeString
} from '../src/frontendBackendProtocolClient.js';

test('toLocalDateTimeString serializes date in LocalDateTime format', () => {
  const date = new Date(2024, 0, 2, 3, 4, 5);
  assert.equal(toLocalDateTimeString(date), '2024-01-02T03:04:05');
});

test('request unwraps standard backend envelope', async () => {
  const fetchImpl = async () => ({
    ok: true,
    status: 200,
    async json() {
      return {
        responseCode: 'OC_OK',
        responseEntity: { hello: 'world' }
      };
    }
  });

  const client = new GiftServiceApiClient({
    baseUrl: 'http://localhost:8080',
    fetchImpl
  });

  const data = await client.getCatalog();
  assert.deepEqual(data, { hello: 'world' });
});


test('getCatalog sends auth header when token exists', async () => {
  let authorizationHeader;
  const storage = new InMemoryTokenStorage({
    accessToken: 'catalog-access',
    refreshToken: 'catalog-refresh',
    tokenType: 'Bearer'
  });

  const fetchImpl = async (_url, options) => {
    authorizationHeader = options.headers.Authorization;
    return {
      ok: true,
      status: 200,
      async json() {
        return {
          responseCode: 'OC_OK',
          responseEntity: []
        };
      }
    };
  };

  const client = new GiftServiceApiClient({
    baseUrl: 'http://localhost:8080',
    fetchImpl,
    tokenStorage: storage
  });

  await client.getCatalog();
  assert.equal(authorizationHeader, 'Bearer catalog-access');
});

test('request handles backend wrapped business error', async () => {
  const fetchImpl = async () => ({
    ok: false,
    status: 400,
    async json() {
      return {
        responseCode: 'BAD_REQUEST',
        message: 'Login already exists',
        error: 'Login already exists',
        responseEntity: { error: 'Login already exists' }
      };
    }
  });

  const client = new GiftServiceApiClient({
    baseUrl: 'http://localhost:8080',
    fetchImpl
  });

  await assert.rejects(() => client.login({ login: 'u', password: 'p' }), (err) => {
    assert.ok(err instanceof ApiError);
    assert.equal(err.message, 'Login already exists');
    assert.equal(err.details.code, 'BAD_REQUEST');
    return true;
  });
});

test('auto refreshes access token on 401 and retries request', async () => {
  let requestCount = 0;
  const storage = new InMemoryTokenStorage({
    accessToken: 'old-access',
    refreshToken: 'refresh',
    accessExpiresAt: Date.now() + 60_000,
    refreshExpiresAt: Date.now() + 60_000,
    tokenType: 'Bearer'
  });

  const fetchImpl = async (url) => {
    requestCount += 1;

    if (url.endsWith('/friends')) {
      if (requestCount === 1) {
        return {
          ok: false,
          status: 401,
          async json() {
            return {
              error: 'unauthorized',
              message: 'Full authentication is required to access this resource'
            };
          }
        };
      }

      return {
        ok: true,
        status: 200,
        async json() {
          return {
            responseCode: 'OC_OK',
            responseEntity: { friends: [] }
          };
        }
      };
    }

    return {
      ok: true,
      status: 200,
      async json() {
        return {
          responseCode: 'OC_OK',
          responseEntity: {
            accessToken: 'new-access',
            refreshToken: 'new-refresh',
            accessExpiresIn: 3600,
            refreshExpiresIn: 86400,
            tokenType: 'Bearer'
          }
        };
      }
    };
  };

  const client = new GiftServiceApiClient({
    baseUrl: 'http://localhost:8080',
    fetchImpl,
    tokenStorage: storage
  });

  const result = await client.getFriends();
  assert.deepEqual(result, { friends: [] });
  assert.equal(client.getTokens().accessToken, 'new-access');
});
