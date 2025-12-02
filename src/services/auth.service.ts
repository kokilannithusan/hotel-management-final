import { api } from './api';

// Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    expiresIn: number;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface VerifyOTPRequest {
    email: string;
    otp: string;
}

export interface ResetPasswordRequest {
    email: string;
    otp: string;
    newPassword: string;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    hotelId: string;
}

// Authentication Service
export const authService = {
    /**
     * Login with email and password
     */
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },

    /**
     * Logout current user
     */
    logout: async (): Promise<void> => {
        try {
            await api.post('/auth/logout');
        } finally {
            // Always clear local storage even if API call fails
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
    },

    /**
     * Send password reset OTP to email
     */
    forgotPassword: async (request: ForgotPasswordRequest): Promise<void> => {
        await api.post('/auth/otp', request);
    },

    /**
     * Verify OTP code
     */
    verifyOTP: async (request: VerifyOTPRequest): Promise<void> => {
        await api.post('/auth/otp/verify', request);
    },

    /**
     * Reset password with OTP
     */
    resetPassword: async (request: ResetPasswordRequest): Promise<void> => {
        await api.put('/auth/new-password', {
            email: request.email,
            newPassword: request.newPassword,
            confirmPassword: request.newPassword,
        });
    },

    /**
     * Get current authenticated user
     */
    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<User>('/auth/me');
        return response.data;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('authToken');
    },

    /**
     * Get stored user from localStorage
     */
    getStoredUser: (): User | null => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    },

    /**
     * Store user in localStorage
     */
    storeUser: (user: User): void => {
        localStorage.setItem('user', JSON.stringify(user));
    },
};
