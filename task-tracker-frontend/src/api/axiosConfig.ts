import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosError } from 'axios'

// in-memory access token store
// access token is stored in memory (NOT localStorage) for security.
// it is lost on page refresh — the silent refresh mechanism restores it.
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

export const getAccessToken = (): string | null => {
    return accessToken;
};

// ─── Axios instance ───
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Send HttpOnly cookies (refresh token) with every request
});

// ─── Request interceptor: attach access token ───
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Response interceptor: auto-refresh on 401 ───
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token!);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Only attempt refresh for 401 errors on non-auth endpoints
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/login') &&
            !originalRequest.url?.includes('/auth/register') &&
            !originalRequest.url?.includes('/auth/refresh')
        ) {
            if (isRefreshing) {
                // Queue this request until the refresh completes
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call the refresh endpoint — the HttpOnly cookie is sent automatically
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = data.data.token;
                setAccessToken(newAccessToken);

                // Notify AuthProvider of the new token/user via custom event
                window.dispatchEvent(
                    new CustomEvent('auth:refreshed', {
                        detail: {
                            token: newAccessToken,
                            email: data.data.email,
                            userId: data.data.userId,
                        },
                    })
                );

                processQueue(null, newAccessToken);

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                setAccessToken(null);

                // Notify AuthProvider that session is lost
                window.dispatchEvent(new CustomEvent('auth:session-expired'));

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;