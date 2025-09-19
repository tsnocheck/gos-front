import { apiClient } from '../lib/api';
import type { User, UserRole, UserStatus } from '../types';

export interface AdminCreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  position?: string;
  workplace?: string;
  department?: string;
  subjects?: string[];
  academicDegree?: string;
  role: UserRole;
}

export interface AdminUpdateUserData extends Partial<Omit<AdminCreateUserData, 'email' | 'role'>> {
  userId: string;
}

export interface ChangeUserRoleData {
  userId: string;
  roles: UserRole[];
}

export interface ChangeUserStatusData {
  userId: string;
  status: UserStatus;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface GetExpertsTableParams {
  search?: string;
  subject?: string;
  region?: string;
  workplace?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export const adminService = {
  // Управление пользователями
  async getUsers(params?: GetUsersParams) {
    return apiClient.get<User[]>(`/admin/users`, { params });
  },

  async getPendingUsers() {
    return apiClient.get<User[]>('/admin/users/pending');
  },

  async getUsersByRole(role: UserRole) {
    return apiClient.get<User[]>(`/admin/users/role/${role}`);
  },

  async getUsersByStatus(status: UserStatus): Promise<User[]> {
    return apiClient.get<User[]>(`/admin/users/status/${status}`);
  },

  async createUser(data: AdminCreateUserData): Promise<User> {
    return apiClient.post<User>('/admin/users', data);
  },

  async updateUser({ userId, ...data }: AdminUpdateUserData): Promise<User> {
    return apiClient.patch<User>(`/admin/users/${userId}`, data);
  },

  async approveUser(userId: string): Promise<User> {
    return apiClient.post<User>(`/admin/users/${userId}/approve`);
  },

  async changeUserRole(data: ChangeUserRoleData): Promise<User> {
    return apiClient.patch<User>('/admin/users/role', data);
  },

  async changeUserStatus(data: ChangeUserStatusData): Promise<User> {
    return apiClient.patch<User>('/admin/users/status', data);
  },

  async sendInvitation(userId: string): Promise<void> {
    await apiClient.post(`/admin/users/${userId}/send-invitation`);
  },

  async archiveUser(userId: string): Promise<User> {
    return apiClient.post<User>(`/admin/users/${userId}/archive`);
  },

  async unarchiveUser(userId: string): Promise<User> {
    return apiClient.post<User>(`/admin/users/${userId}/unarchive`);
  },

  async hideUser(userId: string): Promise<User> {
    return apiClient.post<User>(`/admin/users/${userId}/hide`);
  },

  async deleteUser(userId: string): Promise<void> {
    await apiClient.post(`/admin/users/${userId}/hide`);
  },

  async getExpertsTable(params?: GetExpertsTableParams) {
    await apiClient.get<{
      experts: User[];
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/experts/table', { params });
  },

  // Массовые операции
  async bulkApproveUsers(userIds: string[]): Promise<void> {
    await apiClient.post('/admin/users/bulk-approve', { userIds });
  },

  async bulkChangeStatus(userIds: string[], status: UserStatus): Promise<void> {
    await apiClient.patch('/admin/users/bulk-status', { userIds, status });
  },

  async bulkChangeRole(userIds: string[], roles: UserRole[]): Promise<void> {
    await apiClient.patch('/admin/users/bulk-role', { userIds, roles });
  },

  // Статистика
  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    archived: number;
    hidden: number;
    byRole: Record<UserRole, number>;
  }> {
    return apiClient.get('/admin/users/stats');
  },
};
