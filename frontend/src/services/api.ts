import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
});

// Interceptor para injetar o token JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: unknown) => {
        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    }
);

// Interceptor para capturar erros de resposta (Ex: Token Expirado = 401)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            localStorage.removeItem('access_token');
            if (window.location.hash !== '#/login') {
                window.location.href = '#/login';
            }
        }
        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    }
);
