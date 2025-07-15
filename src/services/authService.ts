import { apiClient } from '../lib/api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // Сохраняем токен в localStorage
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
    }
    
    return response;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    // Сохраняем токен в localStorage
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
    }
    
    return response;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
    }
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh');
    
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
    }
    
    return response;
  },

  async resetPassword(email: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { email });
  },

  async setPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/auth/set-password', { token, password });
  },

  // Проверка аутентификации
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  // Получение токена
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
};
