import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recommendationService } from "../services/recommendationService";
import type { Recommendation } from "../types/recommendation";

// Query keys
export const recommendationKeys = {
  all: ["recommendations"] as const,
  lists: () => [...recommendationKeys.all, "list"] as const,
  list: () => [...recommendationKeys.lists()] as const,
  my: () => [...recommendationKeys.all, "my"] as const,
  stats: () => [...recommendationKeys.all, "stats"] as const,
  byProgram: (programId: string) => [...recommendationKeys.all, "program", programId] as const,
  detail: (id: string) => [...recommendationKeys.all, "detail", id] as const,
};

// Queries
export const useRecommendations = () => {
  return useQuery({
    queryKey: recommendationKeys.list(),
    queryFn: recommendationService.getRecommendations,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useMyRecommendations = () => {
  return useQuery({
    queryKey: recommendationKeys.my(),
    queryFn: recommendationService.getMyRecommendations,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useRecommendationsByProgram = (programId: string) => {
  return useQuery({
    queryKey: recommendationKeys.byProgram(programId),
    queryFn: () => recommendationService.getRecommendationsByProgram(programId),
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
