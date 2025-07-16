import { apiClient } from '../lib/api';
import type { Program, ProgramStatus, CreateProgramForm, PaginatedResponse } from '../types';

export interface ProgramQueryParams {
  page?: number;
  limit?: number;
  status?: ProgramStatus;
  authorId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateProgramData extends Partial<CreateProgramForm> {
  status?: ProgramStatus;
}

export const programService = {
  // Основные операции с программами
  async getPrograms(params?: ProgramQueryParams) {
    return apiClient.get<PaginatedResponse<Program>>(`/programs`, { params });
  },

  async getMyPrograms(params?: ProgramQueryParams) {
    return apiClient.get<PaginatedResponse<Program>>(`/programs/my`, { params });
  },

  async getProgramById(id: string): Promise<Program> {
    return apiClient.get<Program>(`/programs/${id}`);
  },

  async createProgram(data: CreateProgramForm): Promise<Program> {
    return apiClient.post<Program>('/programs', data);
  },

  async updateProgram(id: string, data: UpdateProgramData): Promise<Program> {
    return apiClient.patch<Program>(`/programs/${id}`, data);
  },

  async deleteProgram(id: string): Promise<void> {
    await apiClient.delete(`/programs/${id}`);
  },

  // Операции с версиями
  async getProgramVersions(id: string): Promise<Program[]> {
    return apiClient.get<Program[]>(`/programs/${id}/versions`);
  },

  async createNewVersion(id: string): Promise<Program> {
    return apiClient.post<Program>(`/programs/${id}/new-version`);
  },

  // Операции с экспертизой
  async submitForExpertise(id: string): Promise<Program> {
    return apiClient.post<Program>(`/programs/${id}/submit`);
  },

  async approveProgram(id: string, comment?: string): Promise<Program> {
    return apiClient.post<Program>(`/programs/${id}/approve`, { comment });
  },

  async rejectProgram(id: string, reason: string): Promise<Program> {
    return apiClient.post<Program>(`/programs/${id}/reject`, { reason });
  },

  // Операции с архивом
  async archiveProgram(id: string): Promise<Program> {
    return apiClient.post<Program>(`/programs/${id}/archive`);
  },

  async unarchiveProgram(id: string): Promise<Program> {
    return apiClient.post<Program>(`/programs/${id}/unarchive`);
  },

  // Проверка возможности редактирования
  async canEditProgram(id: string): Promise<{ canEdit: boolean; reason?: string }> {
    return apiClient.get(`/programs/${id}/can-edit`);
  },

  // Экспорт программы в PDF
  async exportToPdf(id: string): Promise<Blob> {
    return apiClient.get(`/programs/${id}/pdf`, { responseType: 'blob' });
  },

  // Получение статистики
  async getProgramStats(): Promise<{
    total: number;
    byStatus: Record<ProgramStatus, number>;
    byAuthor: Array<{ authorId: string; authorName: string; count: number }>;
  }> {
    return apiClient.get('/programs/statistics');
  }
};
