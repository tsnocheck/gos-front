import { apiClient } from '../lib/api';
import type { LoginCredentials, RegisterData, AuthResponse, User, UserIdentity } from '@/types';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phone?: string;
  position?: string;
  workplace?: string;
  department?: string;
}

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
    return apiClient.get<User>('/users/profile');
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    return apiClient.patch<User>('/users/profile', data);
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh');

    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
    }

    return response;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return apiClient.post('/auth/change-password', data);
  },

  async resetPassword(data: { token: string; newPassword: string }) {
    await apiClient.post('/auth/reset-password', data);
  },

  async forgotPassword(data: { email: string }) {
    return apiClient.post('/auth/forgot-password', data);
  },

  // Проверка аутентификации
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  // Получение токена
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },
};
