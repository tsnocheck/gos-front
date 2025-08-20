import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { expertiseService } from "../services/expertiseService";
import type { Expertise, CreateExpertiseDto, UpdateExpertiseDto, CompleteExpertiseDto } from "../types";
import type { ExpertiseCriteriaDto, ExpertTableFilters } from "../types/expertise";

// Query keys
export const expertiseKeys = {
  all: ["expertises"] as const,
  lists: () => [...expertiseKeys.all, "list"] as const,
  list: () => [...expertiseKeys.lists()] as const,
  my: () => [...expertiseKeys.all, "my"] as const,
  details: () => [...expertiseKeys.all, "detail"] as const,
  detail: (id: string) => [...expertiseKeys.details(), id] as const,
  stats: () => [...expertiseKeys.all, "stats"] as const,
};

// Queries
export const useExpertises = () => {
  return useQuery({
    queryKey: expertiseKeys.list(),
    queryFn: expertiseService.getExpertises,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useMyExpertises = () => {
  return useQuery({
    queryKey: expertiseKeys.my(),
    queryFn: expertiseService.getMyExpertises,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useExpertise = (id: string) => {
  return useQuery({
    queryKey: expertiseKeys.detail(id),
    queryFn: async () =>
      (await expertiseService.getExpertiseById(id)) as Expertise,
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

export const useCompleteExpertise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CompleteExpertiseDto }) => expertiseService.completeExpertise(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expertiseKeys.lists() });
    },
  });
};

export const useAssignExpertToProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      programId,
      expertId,
    }: {
      programId: string;
      expertId: string;
    }) => expertiseService.assignExpertToProgram(programId, { expertId }),
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
    queryKey: [...expertiseKeys.all, "my-programs"],
    queryFn: expertiseService.getMyPrograms,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useExpertisesForReplacement = () => {
  return useQuery({
    queryKey: [...expertiseKeys.all, "for-replacement"],
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
      queryClient.invalidateQueries({ queryKey: expertiseKeys.lists() });
    },
  });
};

export const useReplaceExpertInAllExpertises = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      oldExpertId,
      newExpertId,
    }: {
      oldExpertId: string;
      newExpertId: string;
    }) =>
      expertiseService.replaceExpertInAllExpertises(oldExpertId, newExpertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expertiseKeys.lists() });
    },
  });
};

export const useAvailablePrograms = () => {
  return useQuery({
    queryKey: [...expertiseKeys.all, "available-programs"],
    queryFn: expertiseService.getAvailablePrograms,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useProgramPdf = (programId: string) => {
  return useQuery({
    queryKey: [...expertiseKeys.all, "program-pdf", programId],
    queryFn: () => expertiseService.getProgramPdf(programId),
    enabled: !!programId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useCreateCriteriaConclusion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      expertiseId,
      data,
    }: {
      expertiseId: string;
      data: ExpertiseCriteriaDto;
    }) => expertiseService.createCriteriaConclusion(expertiseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expertiseKeys.lists() });
    },
  });
};

export const useExpertTable = (params: ExpertTableFilters) => {
  return useQuery({
    queryKey: [...expertiseKeys.all, "expert-table", params],
    queryFn: () => expertiseService.getExpertTable(params),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useMyExpertisesList = (status?: string) => {
  return useQuery({
    queryKey: [...expertiseKeys.all, "my-expertises", status],
    queryFn: () => expertiseService.getMyExpertisesList(status),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};
