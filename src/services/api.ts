import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../config/env';

// Get API base URL from centralized configuration

// Create axios instance with default config
export const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
    (response) => {
        // Check if backend returned an error in the response body
        // Backend uses custom statusCode field (e.g., 4004 for errors)
        if (response.data && typeof response.data.statusCode === 'number') {
            // Success codes are usually 2000-2999
            if (response.data.statusCode < 2000 || response.data.statusCode >= 5000) {
                // This is an error response, reject it
                const error: any = new Error(response.data.statusMessage || 'An error occurred');
                error.response = {
                    data: response.data,
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                    config: response.config,
                };
                return Promise.reject(error);
            }
        }
        return response;
    },
    (error: AxiosError) => {
        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
            console.error('Access forbidden - insufficient permissions');
        }

        // Handle 500 Internal Server Error
        if (error.response?.status === 500) {
            console.error('Server error - please try again later');
        }

        return Promise.reject(error);
    }
);

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message || 'An error occurred';
    }
    return 'An unexpected error occurred';
};

// Export axios for direct use if needed
export { axios };
