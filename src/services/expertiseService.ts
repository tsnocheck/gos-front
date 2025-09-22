import apiClient from '../lib/api';
import type {
  PaginatedResponse,
  Expertise,
  CreateExpertiseDto,
  SubmitExpertiseDto,
  SendForRevisionDto,
  AssignExpertDto,
  ExpertiseQueryDto,
  UpdateExpertiseDto,
} from '@/types';

export interface ExpertiseQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const expertiseService = {
  async createExpertise(data: CreateExpertiseDto) {
    return apiClient.post<Expertise>('/expertise', data);
  },

  async getExpertises(params?: ExpertiseQueryParams) {
    return apiClient.get<PaginatedResponse<Expertise>>('/expertise', { params });
  },

  async getMyExpertises(params?: ExpertiseQueryParams) {
    return apiClient.get<PaginatedResponse<Expertise>>('/expertise/my', { params });
  },

  async getExpertiseById(id: string) {
    return apiClient.get<Expertise>(`/expertise/${id}`);
  },

  async updateExpertise(id: string, data: UpdateExpertiseDto) {
    return apiClient.patch<Expertise>(`/expertise/${id}`, data);
  },

  async getExpertiseStatistics() {
    return apiClient.get('/expertise/statistics');
  },

  async submitExpertise(id: string, data: SubmitExpertiseDto) {
    return apiClient.post(`/expertise/${id}/submit`, data);
  },

  async assignExpertToProgram(programId: string, data: AssignExpertDto) {
    return apiClient.post(`/expertise/programs/${programId}/assign`, data);
  },

  async deleteExpertise(id: string) {
    return apiClient.delete(`/expertise/${id}`);
  },

  async getMyPrograms() {
    return apiClient.get('/expertise/my-programs');
  },

  async getExpertisesForReplacement() {
    return apiClient.get('/expertise/for-replacement');
  },

  async replaceExpert(expertiseId: string, oldExpertId: string, newExpertId: string) {
    return apiClient.put(`/expertise/${expertiseId}/replace-expert`, {
      oldExpertId,
      newExpertId,
    });
  },

  async replaceExpertInAllExpertises(oldExpertId: string, newExpertId: string) {
    return apiClient.put(`/expertise/replace-expert-all/${oldExpertId}/${newExpertId}`);
  },

  async getAvailablePrograms() {
    return apiClient.get('/expertise/available-programs');
  },

  async getProgramPdf(programId: string) {
    return apiClient.get(`/expertise/program/${programId}/pdf`, {
      responseType: 'blob',
    });
  },

  async createCriteriaConclusion(expertiseId: string, data: Expertise) {
    return apiClient.post(`/expertise/${expertiseId}/criteria-conclusion`, data);
  },

  async getExpertTable(params: ExpertiseQueryDto) {
    return apiClient.get('/expertise/expert/my-table', { params });
  },

  async getMyExpertisesList(status?: string) {
    return apiClient.get('/expertise/my-expertises', { params: { status } });
  },

  async sendForRevision(data: { id: string; body: SendForRevisionDto }) {
    return apiClient.post(`/expertise/${data.id}/send-for-revision`, data.body);
  },
};
