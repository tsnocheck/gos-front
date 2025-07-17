import apiClient from "../lib/api";
import type { PaginatedResponse, Expertise } from "../types";

export const expertiseService = {
    async createExpertise(data: Expertise) {
        return apiClient.post<Expertise>('/expertise', data);
    },

    async getExpertises() {
        return apiClient.get<PaginatedResponse<Expertise>>('/expertise');
    },

    async getMyExpertises() {
        return apiClient.get<PaginatedResponse<Expertise>>('/expertise/my');
    },

    async getExpertiseById(id: string) {
        return apiClient.get<Expertise>(`/expertise/${id}`);
    },

    async updateExpertise(id: string, data: Partial<Expertise>) {
        return apiClient.patch<Expertise>(`/expertise/${id}`, data);
    },

    async getExpertiseStatistics() {
        return apiClient.get('/expertise/statistics');
    },

    async completeExpertise(id: string) {
        return apiClient.post(`/expertise/${id}/complete`);
    },

    async assignExpertToProgram(programId: string, data: { expertId: string }) {
        return apiClient.post(`/expertise/programs/${programId}/assign`, data);
    },

    async deleteExpertise(id: string) {
        return apiClient.delete(`/expertise/${id}`);
    },
}