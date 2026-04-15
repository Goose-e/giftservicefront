import { GiftServiceApiClient, LocalStorageTokenStorage } from '../frontendBackendProtocolClient';

export const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiClient = new GiftServiceApiClient({
  baseUrl: baseURL,
  tokenStorage: new LocalStorageTokenStorage()
});
