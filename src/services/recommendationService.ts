import apiClient from '../lib/api';
import {
  type Recommendation,
  type RecommendationStatus,
  type ApiResponse,
  type PaginatedResponse,
  RecommendationField,
} from '@/types';

export interface RecommendationQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateRecommendationPayload {
  title: string;
  content: string;
  type?: RecommendationField;
  assignedToId?: string;
}

export interface UpdateRecommendationPayload {
  title?: string;
  content?: string;
  type?: string;
  assignedToId?: string;
  status?: RecommendationStatus;
}

export const recommendationService = {
  async createRecommendation(data: CreateRecommendationPayload) {
    return apiClient.post<Recommendation>('/recommendations', data);
  },

  async getRecommendations(params?: RecommendationQueryParams) {
    return apiClient.get<PaginatedResponse<Recommendation>>('/recommendations', { params });
  },

  async getMyRecommendations(params?: RecommendationQueryParams) {
    return apiClient.get<PaginatedResponse<Recommendation>>('/recommendations/my', { params });
  },

  async getRecommendationsByProgram(programId: string, params?: RecommendationQueryParams) {
    return apiClient.get<PaginatedResponse<Recommendation>>(
      `/recommendations/programs/${programId}`,
      { params },
    );
  },

  async getRecommendationStatistics() {
    return apiClient.get<ApiResponse<any>>('/recommendations/statistics');
  },

  async getRecommendationById(id: string) {
    return apiClient.get<Recommendation>(`/recommendations/${id}`);
  },

  async updateRecommendation(id: string, data: UpdateRecommendationPayload) {
    return apiClient.patch<Recommendation>(`/recommendations/${id}`, data);
  },

  async respondToRecommendation(id: string, data: { response: string }) {
    return apiClient.post(`/recommendations/${id}/respond`, data);
  },

  async giveFeedback(id: string, data: { feedback: string }) {
    return apiClient.post(`/recommendations/${id}/feedback`, data);
  },

  async archiveRecommendation(id: string) {
    return apiClient.post(`/recommendations/${id}/archive`);
  },

  async deleteRecommendation(id: string) {
    return apiClient.delete(`/recommendations/${id}`);
  },
};
