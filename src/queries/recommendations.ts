import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recommendationService } from '../services/recommendationService';
import type { Recommendation } from '../types/recommendation';
import type { RecommendationQueryParams } from '@/services/recommendationService';

// Query keys
export const recommendationKeys = {
  all: ['recommendations'] as const,
  lists: () => [...recommendationKeys.all, 'list'] as const,
  list: (params?: RecommendationQueryParams) =>
    [...recommendationKeys.lists(), params || {}] as const,
  my: (params?: RecommendationQueryParams) =>
    [...recommendationKeys.all, 'my', params || {}] as const,
  stats: () => [...recommendationKeys.all, 'stats'] as const,
  byProgram: (programId: string, params?: RecommendationQueryParams) =>
    [...recommendationKeys.all, 'program', programId, params || {}] as const,
  detail: (id: string) => [...recommendationKeys.all, 'detail', id] as const,
};

// Queries
export const useRecommendations = (params?: RecommendationQueryParams) => {
  return useQuery({
    queryKey: recommendationKeys.list(params),
    queryFn: () => recommendationService.getRecommendations(params),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useMyRecommendations = (params?: RecommendationQueryParams) => {
  return useQuery({
    queryKey: recommendationKeys.my(params),
    queryFn: () => recommendationService.getMyRecommendations(params),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useRecommendationsByProgram = (
  programId: string,
  params?: RecommendationQueryParams,
) => {
  return useQuery({
    queryKey: recommendationKeys.byProgram(programId, params),
    queryFn: () => recommendationService.getRecommendationsByProgram(programId, params),
    enabled: !!programId,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useRecommendation = (id: string) => {
  return useQuery({
    queryKey: recommendationKeys.detail(id),
    queryFn: () => recommendationService.getRecommendationById(id),
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useRecommendationStats = () => {
  return useQuery({
    queryKey: recommendationKeys.stats(),
    queryFn: recommendationService.getRecommendationStatistics,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations
export const useCreateRecommendation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recommendationService.createRecommendation,
    onSuccess: () => {
      // Remove cached recommendations to ensure useRecommendations is cleared
      queryClient.refetchQueries({ queryKey: recommendationKeys.lists() });
      queryClient.refetchQueries({ queryKey: recommendationKeys.all });
      queryClient.invalidateQueries({ queryKey: recommendationKeys.lists() });
    },
  });
};

export const useUpdateRecommendation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Recommendation> }) =>
      recommendationService.updateRecommendation(id, data),
    onSuccess: (_, { id }) => {
      // Remove cached recommendations to ensure useRecommendations is cleared
      queryClient.removeQueries({ queryKey: recommendationKeys.lists() });
      queryClient.removeQueries({ queryKey: recommendationKeys.all });

      queryClient.invalidateQueries({ queryKey: recommendationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: recommendationKeys.lists() });
    },
  });
};

export const useRespondToRecommendation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, response }: { id: string; response: string }) =>
      recommendationService.respondToRecommendation(id, { response }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: recommendationKeys.detail(id) });
    },
  });
};

export const useGiveFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback: string }) =>
      recommendationService.giveFeedback(id, { feedback }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: recommendationKeys.detail(id) });
    },
  });
};

export const useArchiveRecommendation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recommendationService.archiveRecommendation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: recommendationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: recommendationKeys.lists() });
    },
  });
};

export const useDeleteRecommendation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recommendationService.deleteRecommendation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recommendationKeys.lists() });
    },
  });
};
