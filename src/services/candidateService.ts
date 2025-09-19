import { apiClient } from '../lib/api';
import type { Candidate, User } from '../types';

export interface CreateCandidateData {
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  organization?: string;
  position?: string;
  proposedRoles: string[];
  comment?: string;
}

export interface UpdateCandidateData {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phone?: string;
  organization?: string;
  position?: string;
  proposedRoles?: string[];
  comment?: string;
  status?: string;
}

export const candidateService = {
  async getCandidates(): Promise<Candidate[]> {
    return apiClient.get<Candidate[]>('/candidates');
  },

  async getCandidateById(id: string): Promise<Candidate> {
    return apiClient.get<Candidate>(`/candidates/${id}`);
  },

  async getCandidateStats() {
    return apiClient.get('/candidates/stats');
  },

  async createCandidate(data: CreateCandidateData): Promise<Candidate> {
    return apiClient.post<Candidate>('/auth/register-candidate', data);
  },

  async updateCandidate(id: string, data: UpdateCandidateData): Promise<Candidate> {
    return apiClient.put<Candidate>(`/candidates/${id}`, data);
  },

  async inviteCandidate(id: string): Promise<void> {
    await apiClient.post(`/candidates/${id}/invite`);
  },

  async inviteMultipleCandidates(candidateIds: string[]): Promise<void> {
    await apiClient.post('/candidates/invite-multiple', { candidateIds });
  },

  async rejectCandidate(id: string): Promise<Candidate> {
    return apiClient.put<Candidate>(`/candidates/${id}/reject`);
  },

  async deleteCandidate(id: string): Promise<void> {
    await apiClient.delete(`/candidates/${id}`);
  },

  async approveCandidate(
    id: string,
  ): Promise<{ message: string; user: User; temporaryPassword: string }> {
    return apiClient.post(`/candidates/${id}/approve`);
  },
};
