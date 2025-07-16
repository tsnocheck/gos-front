import apiClient from "../lib/api";

export const recommendationService = {
    async createRecommendation(data: unknown) {
        return apiClient.post('/recommendations', data);
    },

    async getRecommendations() {
        return apiClient.get('/recommendations');
    },

    async getMyRecommendations() {
        return apiClient.get('/recommendations/my');
    },

    async getRecommendationsByProgram(programId: string) {
        return apiClient.get(`/recommendations/programs/${programId}`);
    },

    async getRecommendationStatistics() {
        return apiClient.get('/recommendations/statistics');
    },

    async getRecommendationById(id: string) {
        return apiClient.get(`/recommendations/${id}`);
    },

    async updateRecommendation(id: string, data: unknown) {
        return apiClient.patch(`/recommendations/${id}`, data);
    },

    async respondToRecommendation(id: string, data: unknown) {
        return apiClient.post(`/recommendations/${id}/respond`, data);
    },

    async giveFeedback(id: string, data: unknown) {
        return apiClient.post(`/recommendations/${id}/feedback`, data);
    },

    async archiveRecommendation(id: string) {
        return apiClient.post(`/recommendations/${id}/archive`);
    },

    async deleteRecommendation(id: string) {
        return apiClient.delete(`/recommendations/${id}`);
    },
};
