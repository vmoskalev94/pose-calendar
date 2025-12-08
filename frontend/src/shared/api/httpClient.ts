// src/shared/api/httpClient.ts
import axios from 'axios';

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export const httpClient = axios.create({
    baseURL: API_BASE_URL,
});

// ключ тот же, что в AuthContext
const TOKEN_KEY = 'pose-calendar/token';

// Request interceptor: подставляем Authorization, если токен есть
httpClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token && !config.headers?.Authorization) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }

    return config;
});

// Можно добавить простую обработку 401 (пока только лог)
httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // здесь позже сделаем logout() через глобальный хэндлер
            console.warn('HTTP 401 from API', error.response?.config?.url);
        }
        return Promise.reject(error);
    }
);
