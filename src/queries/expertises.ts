import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { expertiseService } from '../services/expertiseService';
import type {
  Expertise,
  CreateExpertiseDto,
  SubmitExpertiseDto,
  SendForRevisionDto,
  AssignExpertDto,
  ExpertiseQueryDto,
  UpdateExpertiseDto,
} from '@/types';
import type { ExpertiseQueryParams } from '@/services/expertiseService';
import { programKeys } from './programs';

// Query keys
export const expertiseKeys = {
  all: ['expertises'] as const,
  lists: () => [...expertiseKeys.all, 'list'] as const,
  list: (params?: ExpertiseQueryParams) => [...expertiseKeys.lists(), params || {}] as const,
  my: (params?: ExpertiseQueryParams) => [...expertiseKeys.all, 'my', params || {}] as const,
  details: () => [...expertiseKeys.all, 'detail'] as const,
  detail: (id: string) => [...expertiseKeys.details(), id] as const,
  stats: () => [...expertiseKeys.all, 'stats'] as const,
};

// Queries
export const useExpertises = (params?: ExpertiseQueryParams) => {
  return useQuery({
    queryKey: expertiseKeys.list(params),
    queryFn: () => expertiseService.getExpertises(params),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useMyExpertises = (params?: ExpertiseQueryParams) => {
  return useQuery({
    queryKey: expertiseKeys.my(params),
    queryFn: () => expertiseService.getMyExpertises(params),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useExpertise = (id: string) => {
  return useQuery({
    queryKey: expertiseKeys.detail(id),
    queryFn: async () => (await expertiseService.getExpertiseById(id)) as Expertise,
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useExpertiseStatistics = () => {
  return useQuery({
    queryKey: expertiseKeys.stats(),
    queryFn: expertiseService.getExpertiseStatistics,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations
export const useCreateExpertise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExpertiseDto) => expertiseService.createExpertise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expertiseKeys.lists() });
    },
  });
};

export const useUpdateExpertise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpertiseDto }) =>
      expertiseService.updateExpertise(id, data),
    onSuccess: (_, variables) => {
      const { id } = variables;
      queryClient.invalidateQueries({ queryKey: expertiseKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: expertiseKeys.lists() });
    },
  });
};

export const useSubmitExpertise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubmitExpertiseDto }) =>
      expertiseService.submitExpertise(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expertiseKeys.my() });
    },
  });
};

export const useAssignExpertToProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ programId, data }: { programId: string; data: AssignExpertDto }) =>
      expertiseService.assignExpertToProgram(programId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expertiseKeys.lists() });
    },
  });
};

export const useDeleteExpertise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expertiseService.deleteExpertise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expertiseKeys.lists() });
    },
  });
};

export const useMyPrograms = () => {
  return useQuery({
    queryKey: [...expertiseKeys.all, 'my-programs'],
    queryFn: expertiseService.getMyPrograms,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useExpertisesForReplacement = () => {
  return useQuery({
    queryKey: [...expertiseKeys.all, 'for-replacement'],
    queryFn: expertiseService.getExpertisesForReplacement,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useReplaceExpert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      expertiseId,
      oldExpertId,
      newExpertId,
    }: {
      expertiseId: string;
      oldExpertId: string;
      newExpertId: string;
    }) => expertiseService.replaceExpert(expertiseId, oldExpertId, newExpertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expertiseKeys.all });
    },
  });
};

export const useReplaceExpertInAllExpertises = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ oldExpertId, newExpertId }: { oldExpertId: string; newExpertId: string }) =>
      expertiseService.replaceExpertInAllExpertises(oldExpertId, newExpertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expertiseKeys.lists() });
    },
  });
};

export const useAvailablePrograms = () => {
  return useQuery({
    queryKey: [...expertiseKeys.all, 'available-programs'],
    queryFn: expertiseService.getAvailablePrograms,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useProgramPdf = (programId: string) => {
  return useQuery({
    queryKey: [...expertiseKeys.all, 'program-pdf', programId],
    queryFn: () => expertiseService.getProgramPdf(programId),
    enabled: !!programId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useCreateCriteriaConclusion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ expertiseId, data }: { expertiseId: string; data: Expertise }) =>
      expertiseService.createCriteriaConclusion(expertiseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expertiseKeys.lists() });
    },
  });
};

export const useExpertTable = (params: ExpertiseQueryDto) => {
  return useQuery({
    queryKey: [...expertiseKeys.all, 'expert-table', params],
    queryFn: () => expertiseService.getExpertTable(params),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useMyExpertisesList = (status?: string) => {
  return useQuery({
    queryKey: [...expertiseKeys.all, 'my-expertises', status],
    queryFn: () => expertiseService.getMyExpertisesList(status),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useSendForRevision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; body: SendForRevisionDto }) =>
      expertiseService.sendForRevision(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expertiseKeys.all });
      queryClient.invalidateQueries({ queryKey: programKeys.all });
    },
  });
};
