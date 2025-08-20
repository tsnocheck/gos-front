import apiClient from "../lib/api";
import type {
  PaginatedResponse,
  Expertise,
  ExpertiseCriteriaDto,
  ExpertTableFilters,
  CreateExpertiseDto,
  UpdateExpertiseDto,
  CompleteExpertiseDto,
} from "../types";

export const expertiseService = {
  async createExpertise(data: CreateExpertiseDto) {
    return apiClient.post<Expertise>("/expertise", data);
  },

  async getExpertises() {
    return apiClient.get<PaginatedResponse<Expertise>>("/expertise");
  },

  async getMyExpertises() {
    return apiClient.get<PaginatedResponse<Expertise>>("/expertise/my");
  },

  async getExpertiseById(id: string) {
    return apiClient.get<Expertise>(`/expertise/${id}`);
  },

  async updateExpertise(id: string, data: UpdateExpertiseDto) {
    return apiClient.patch<Expertise>(`/expertise/${id}`, data);
  },

  async getExpertiseStatistics() {
    return apiClient.get("/expertise/statistics");
  },

  async completeExpertise(id: string, data: CompleteExpertiseDto) {
    return apiClient.post(`/expertise/${id}/complete`, data);
  },

  async assignExpertToProgram(programId: string, data: { expertId: string }) {
    return apiClient.post(`/expertise/programs/${programId}/assign`, data);
  },

  async deleteExpertise(id: string) {
    return apiClient.delete(`/expertise/${id}`);
  },

  async getMyPrograms() {
    return apiClient.get("/expertise/my-programs");
  },

  async getExpertisesForReplacement() {
    return apiClient.get("/expertise/for-replacement");
  },

  async replaceExpert(
    expertiseId: string,
    oldExpertId: string,
    newExpertId: string
  ) {
    return apiClient.put(`/expertise/${expertiseId}/replace-expert`, {
      oldExpertId,
      newExpertId,
    });
  },

  async replaceExpertInAllExpertises(oldExpertId: string, newExpertId: string) {
    return apiClient.put(
      `/expertise/replace-expert-all/${oldExpertId}/${newExpertId}`
    );
  },

  async getAvailablePrograms() {
    return apiClient.get("/expertise/available-programs");
  },

  async getProgramPdf(programId: string) {
    return apiClient.get(`/expertise/program/${programId}/pdf`, {
      responseType: "blob",
    });
  },

  async createCriteriaConclusion(
    expertiseId: string,
    data: ExpertiseCriteriaDto
  ) {
    return apiClient.post(
      `/expertise/${expertiseId}/criteria-conclusion`,
      data
    );
  },

  async getExpertTable(params: ExpertTableFilters) {
    return apiClient.get("/expertise/expert/my-table", { params });
  },

  async getMyExpertisesList(status?: string) {
    return apiClient.get("/expertise/my-expertises", { params: { status } });
  },
};
