import { apiClient } from '../lib/api';
import type { Program, ProgramStatus, ExtendedProgram, PaginatedResponse, User } from '@/types';

export interface ProgramQueryParams {
  page?: number;
  limit?: number;
  status?: ProgramStatus[];
  authorId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export type UpdateProgramData = ExtendedProgram;

export const programService = {
  async getPrograms(params?: ProgramQueryParams) {
    return apiClient.get<PaginatedResponse<ExtendedProgram>>(`/programs`, { params });
  },

  async getMyPrograms(params?: ProgramQueryParams) {
    return apiClient.get<PaginatedResponse<Program>>(`/programs/my`, { params });
  },

  async getProgramById(id: string) {
    return apiClient.get<ExtendedProgram>(`/programs/id/${id}`);
  },

  async getProgramVersions(id: string) {
    return apiClient.get<Program[]>(`/programs/${id}/versions`);
  },

  async createProgram(data: ExtendedProgram) {
    return apiClient.post<Program>(`/programs`, data);
  },

  async updateProgram(id: string, data: UpdateProgramData) {
    return apiClient.patch<Program>(`/programs/${id}`, data);
  },

  async deleteProgram(id: string) {
    return apiClient.delete(`/programs/${id}`);
  },

  async submitForExpertise(id: string): Promise<Program> {
    return apiClient.post<Program>(`/programs/${id}/submit`);
  },

  async createNewVersion(id: string): Promise<Program> {
    return apiClient.post<Program>(`/programs/${id}/new-version`);
  },

  async approveProgram(id: string, comment?: string): Promise<Program> {
    return apiClient.post<Program>(`/programs/${id}/approve`, { comment });
  },

  async rejectProgram(id: string, reason: string): Promise<Program> {
    return apiClient.post<Program>(`/programs/${id}/reject`, { reason });
  },

  async resubmitAfterRevision(id: string, data: unknown): Promise<Program> {
    return apiClient.post<Program>(`/expertise/${id}/resubmit-after-revision`, data);
  },

  async archiveProgram(id: string): Promise<Program> {
    return apiClient.patch<Program>(`/programs/${id}/archive`);
  },

  async unarchiveProgram(id: string): Promise<Program> {
    return apiClient.patch<Program>(`/programs/${id}/unarchive`);
  },

  async exportToPdf(id: string): Promise<Blob> {
    return apiClient.get(`/programs/${id}/pdf`, { responseType: 'blob' });
  },

  async getProgramStats(): Promise<{
    total: number;
    byStatus: Record<ProgramStatus, number>;
    byAuthor: Array<{ authorId: string; authorName: string; count: number }>;
  }> {
    return apiClient.get('/programs/statistics');
  },

  async canEditProgram(id: string): Promise<boolean> {
    return apiClient.get(`/programs/${id}/can-edit`);
  },

  async availableCoAuthors() {
    return apiClient.get<User[]>('/programs/co-authors');
  },
};
