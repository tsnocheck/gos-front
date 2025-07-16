import apiClient from "../lib/api.ts";
import type {Expertise} from "../types";

export const expertiseService = {
    async createExpertise(data) {
        return apiClient.post('/expertise', data);
    },

    async getExpertises() {
        return apiClient.get<Expertise[]>('/expertise');
    },

    async getMyExpertises() {
        return apiClient.get<Expertise[]>('/expertise');
    },

    async getExpertiseById(id: string) {
        return apiClient.get(`/expertise/${id}`);
    },

    async updateExpertise(id: string) {
        return apiClient.patch(`/expertise/${id}`);
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