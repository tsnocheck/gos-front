import { apiClient } from '../lib/api';
import type {LoginCredentials, RegisterData, AuthResponse, User, UserIdentity} from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  async register(data: RegisterData) {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
    }
  },

  async getId() {
    return apiClient.get<UserIdentity>('/auth/me');
  },

  async getUser() {
    return apiClient.get<User>('/users/profile')
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
