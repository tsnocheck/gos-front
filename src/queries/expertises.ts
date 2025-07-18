import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {expertiseService} from '../services/expertiseService';
import type { Expertise } from '../types';


// Query keys
export const expertiseKeys = {
    all: ['expertises'] as const,
    lists: () => [...expertiseKeys.all, 'list'] as const,
    list: () => [...expertiseKeys.lists()] as const,
    my: () => [...expertiseKeys.all, 'my'] as const,
    details: () => [...expertiseKeys.all, 'detail'] as const,
    detail: (id: string) => [...expertiseKeys.details(), id] as const,
    stats: () => [...expertiseKeys.all, 'stats'] as const,
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
        mutationFn: expertiseService.createExpertise,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: expertiseKeys.lists() });
        },
    });
};

export const useUpdateExpertise = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Expertise> }) => expertiseService.updateExpertise(id, data),
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
        mutationFn: (id: string) => expertiseService.completeExpertise(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: expertiseKeys.lists() });
        },
    });
};

export const useAssignExpertToProgram = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ programId, expertId }: { programId: string; expertId: string }) =>
            expertiseService.assignExpertToProgram(programId, { expertId }),
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
