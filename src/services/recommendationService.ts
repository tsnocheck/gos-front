import apiClient from "../lib/api";
import type { Recommendation } from "../types/recommendation";
import type { ApiResponse, PaginatedResponse } from "../types/common";

export const recommendationService = {
    async createRecommendation(data: Recommendation) {
        return apiClient.post<Recommendation>('/recommendations', data);
    },

    async getRecommendations() {
        return apiClient.get<PaginatedResponse<Recommendation>>('/recommendations');
    },

    async getMyRecommendations() {
        return apiClient.get<PaginatedResponse<Recommendation>>('/recommendations/my');
    },

    async getRecommendationsByProgram(programId: string) {
        return apiClient.get<PaginatedResponse<Recommendation>>(`/recommendations/programs/${programId}`);
    },

    async getRecommendationStatistics() {
        return apiClient.get<ApiResponse<any>>('/recommendations/statistics');
    },

    async getRecommendationById(id: string) {
        return apiClient.get<Recommendation>(`/recommendations/${id}`);
    },

    async updateRecommendation(id: string, data: Partial<Recommendation>) {
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
