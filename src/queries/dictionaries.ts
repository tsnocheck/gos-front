import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dictionaryService } from '../services/dictionaryService';
import type { UpdateDictionaryData } from '../services/dictionaryService';
import { DictionaryType } from '../types/dictionary';

// Query keys
export const dictionaryKeys = {
  all: ['dictionaries'] as const,
  types: () => [...dictionaryKeys.all, 'types'] as const,
  list: (type: DictionaryType | string) => [...dictionaryKeys.all, 'list', type] as const,
};

// Queries
export const useDictionaryTypes = () => {
  return useQuery({
    queryKey: dictionaryKeys.types(),
    queryFn: dictionaryService.getDictionaryTypes,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useDictionariesByType = (type: DictionaryType | string) => {
  return useQuery({
    queryKey: dictionaryKeys.list(type),
    queryFn: () => dictionaryService.getDictionaryByType(type),
    enabled: !!type,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useActionsByFunctions = (functionsIds: string[], enabled = true) => {
  return useQuery({
    queryKey: [dictionaryKeys.all, 'actions', functionsIds],
    queryFn: () => dictionaryService.getActionsByFunctions(functionsIds),
    enabled: enabled && functionsIds?.length > 0,
  });
};

// Mutations
export const useCreateDictionary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dictionaryService.createDictionary,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: dictionaryKeys.list(variables.type) });
    },
  });
};

export const useUpdateDictionary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDictionaryData }) => dictionaryService.updateDictionary(id, data),
    onSuccess: (_data, variables) => {
      const type = (variables.data as { type?: DictionaryType })?.type;
      if (type) {
        queryClient.invalidateQueries({ queryKey: dictionaryKeys.list(type) });
      } else {
        queryClient.invalidateQueries({ queryKey: dictionaryKeys.all });
      }
    },
  });
};

export const useDeleteDictionary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dictionaryService.deleteDictionary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dictionaryKeys.all });
    },
  });
}; 