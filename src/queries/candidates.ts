import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { candidateService, type UpdateCandidateData } from '../services/candidateService';
import { adminKeys } from '@/queries/admin.ts';

// Query keys
export const candidateKeys = {
  all: ['candidates'] as const,
  lists: () => [...candidateKeys.all, 'list'] as const,
  list: () => [...candidateKeys.lists()] as const,
  stats: () => [...candidateKeys.all, 'stats'] as const,
  detail: (id: string) => [...candidateKeys.all, 'detail', id] as const,
};

// Queries
export const useCandidates = () => {
  return useQuery({
    queryKey: candidateKeys.list(),
    queryFn: candidateService.getCandidates,
  });
};

export const useCandidate = (id: string) => {
  return useQuery({
    queryKey: candidateKeys.detail(id),
    queryFn: () => candidateService.getCandidateById(id),
    enabled: !!id,
  });
};

export const useCandidateStats = () => {
  return useQuery({
    queryKey: candidateKeys.stats(),
    queryFn: candidateService.getCandidateStats,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations
export const useCreateCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: candidateService.createCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
    },
  });
};

export const useUpdateCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCandidateData }) =>
      candidateService.updateCandidate(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
    },
  });
};

export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: candidateService.deleteCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
    },
  });
};

export const useInviteCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: candidateService.inviteCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
    },
  });
};

export const useInviteMultipleCandidates = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: candidateService.inviteMultipleCandidates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
    },
  });
};

export const useRejectCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: candidateService.rejectCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
    },
  });
};

export const useApproveCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: candidateService.approveCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
};
