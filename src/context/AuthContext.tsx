import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setStorageItem, removeStorageItem, storageKeys } from '../utils/storage';
import { authService } from '../services/auth.service';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; name: string; role: string; hotelId: string } | null;
  rememberMe: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    rememberMe: false,
    isLoading: true, // Start with loading state
  });

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          isAuthenticated: true,
          user,
          rememberMe: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Save auth state to localStorage when it changes
  useEffect(() => {
    if (authState.isAuthenticated) {
      setStorageItem(storageKeys.auth, authState);
    }
  }, [authState]);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    try {
      // Call backend API for authentication
      const response = await authService.login({ email, password });

      // Store the access token - check different possible response structures
      const responseAny = response as any;
      const token = response.accessToken || responseAny.data?.accessToken || responseAny.data?.data?.accessToken;
      
      if (!token) {
        console.error('Login failed: No token found in response');
        return false;
      }

      localStorage.setItem('authToken', token);

      // Create user data from email (backend doesn't return user details in login response)
      const user = {
        email: email,
        name: email.split('@')[0],
        role: 'USER', // Default role, can be fetched separately if needed
        hotelId: '', // Can be fetched separately if needed
      };

      // Store user data
      localStorage.setItem('user', JSON.stringify(user));

      setAuthState({
        isAuthenticated: true,
        user,
        rememberMe,
        isLoading: false,
      });

      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call backend logout API
      await authService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local state
      setAuthState({
        isAuthenticated: false,
        user: null,
        rememberMe: false,
        isLoading: false,
      });
      removeStorageItem(storageKeys.auth);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

