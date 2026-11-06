import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Vite environment variable with relative fallback that routes through the Vite /api proxy
export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || '';

/**
 * Standard Spring Boot ApiResponse envelope format
 */
export interface BackendApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Centralized Axios instance for ProjectKit.
 * Features:
 * - Bearer JWT injection
 * - 15-second timeout
 * - 401 Token Refresh with queue mechanism
 * - Safe error handling (prevents duplicate retries for payment creation)
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach JWT Bearer Token if present
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('projectkit_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor: Handle 401 token refresh and structured responses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!error.response) {
      // Network disconnect or backend offline
      return Promise.reject(error);
    }

    const { status } = error.response;

    // Do NOT auto-retry payment creation or verification to preserve idempotency
    const url = originalRequest?.url || '';
    const isPaymentRequest = url.includes('/api/payments') || url.includes('/api/orders');

    if (status === 401 && !originalRequest._retry && !isPaymentRequest) {
      const refreshToken = localStorage.getItem('projectkit_refresh_token');

      if (!refreshToken) {
        localStorage.removeItem('projectkit_auth_token');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('projectkit:auth-expired'));
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const newAuthData = refreshResponse.data?.data;
        if (newAuthData?.accessToken) {
          localStorage.setItem('projectkit_auth_token', newAuthData.accessToken);
          if (newAuthData.refreshToken) {
            localStorage.setItem('projectkit_refresh_token', newAuthData.refreshToken);
          }

          apiClient.defaults.headers.common.Authorization = `Bearer ${newAuthData.accessToken}`;
          processQueue(null, newAuthData.accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAuthData.accessToken}`;
          }
          return apiClient(originalRequest);
        } else {
          throw new Error('Refresh response missing token');
        }
      } catch (refreshErr) {
        processQueue(refreshErr as AxiosError, null);
        localStorage.removeItem('projectkit_auth_token');
        localStorage.removeItem('projectkit_refresh_token');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('projectkit:auth-expired'));
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
