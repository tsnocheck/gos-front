import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { programService } from '../services/programService';
import type { CreateProgramForm } from '../types';
import type { ProgramQueryParams, UpdateProgramData } from '../services/programService';

// Query keys
export const programKeys = {
  all: ['programs'] as const,
  lists: () => [...programKeys.all, 'list'] as const,
  list: (params: ProgramQueryParams) => [...programKeys.lists(), params] as const,
  myPrograms: () => [...programKeys.all, 'my'] as const,
  myList: (params: ProgramQueryParams) => [...programKeys.myPrograms(), params] as const,
  details: () => [...programKeys.all, 'detail'] as const,
  detail: (id: string) => [...programKeys.details(), id] as const,
  versions: (id: string) => [...programKeys.detail(id), 'versions'] as const,
  stats: () => [...programKeys.all, 'stats'] as const,
};

// Queries
export const usePrograms = (params?: ProgramQueryParams) => {
  return useQuery({
    queryKey: programKeys.list(params || {}),
    queryFn: () => programService.getPrograms(params),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useMyPrograms = (params?: ProgramQueryParams) => {
  return useQuery({
    queryKey: programKeys.myList(params || {}),
    queryFn: () => programService.getMyPrograms(params),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useProgram = (id: string) => {
  return useQuery({
    queryKey: programKeys.detail(id),
    queryFn: () => programService.getProgramById(id),
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useProgramVersions = (id: string) => {
  return useQuery({
    queryKey: programKeys.versions(id),
    queryFn: () => programService.getProgramVersions(id),
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

export const useProgramStats = () => {
  return useQuery({
    queryKey: programKeys.stats(),
    queryFn: programService.getProgramStats,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCanEditProgram = (id: string) => {
  return useQuery({
    queryKey: [...programKeys.detail(id), 'canEdit'],
    queryFn: () => programService.canEditProgram(id),
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};

// Mutations
export const useCreateProgram = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProgramForm) => {
      console.log('Creating program with data:', data);
      return programService.createProgram(data);
    },
    onSuccess: (data) => {
      console.log('Program created successfully:', data);
      // Вместо инвалидации, просто обновляем кэш добавляя новую программу
      queryClient.setQueryData(
        programKeys.list({}),
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: [data, ...oldData.data],
            total: oldData.total + 1
          };
        }
      );
      
      // И для "мои программы"
      queryClient.setQueryData(
        programKeys.myList({}),
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: [data, ...oldData.data],
            total: oldData.total + 1
          };
        }
      );
      
      // Вызываем callback если передан
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      console.error('Error creating program:', error);
      // Показываем сообщение об ошибке пользователю
      if (error?.message) {
        console.error('Server error message:', error.message);
      }
    },
  });
};

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProgramData }) =>
      programService.updateProgram(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: programKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      queryClient.invalidateQueries({ queryKey: programKeys.myPrograms() });
    },
  });
};

export const useDeleteProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => programService.deleteProgram(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.all });
    },
  });
};
