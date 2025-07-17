import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { programService } from '../services/programService';
import type { Program } from '../types/program';
import type { CreateProgramForm } from '../types/forms';
import type { ProgramQueryParams, UpdateProgramData } from '../services/programService';
import { UserRole, UserStatus } from '../types/user';
import { ProgramStatus } from '../types/program';

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
        initialData: {
            data: [
                {
                    id: 'p1',
                    title: 'Программа 1',
                    description: 'Описание программы 1',
                    status: ProgramStatus.APPROVED,
                    programCode: 'CODE-1',
                    duration: 72,
                    targetAudience: 'Учителя',
                    competencies: 'Компетенции',
                    learningOutcomes: 'Результаты',
                    content: 'Содержание',
                    methodology: 'Методология',
                    assessment: 'Оценка',
                    materials: 'Материалы',
                    requirements: 'Требования',
                    nprContent: '',
                    pmrContent: '',
                    vrContent: '',
                    version: 1,
                    parentId: undefined,
                    submittedAt: '2023-12-01T10:00:00.000Z',
                    approvedAt: '2023-12-01T10:00:00.000Z',
                    archivedAt: undefined,
                    rejectionReason: undefined,
                    author: {
                        id: 'a1',
                        email: 'author1@example.com',
                        password: '',
                        roles: [UserRole.AUTHOR],
                        status: UserStatus.ACTIVE,
                        createdAt: '2023-12-01T10:00:00.000Z',
                        updatedAt: '2023-12-01T10:00:00.000Z',
                    },
                    authorId: 'a1',
                    approvedBy: undefined,
                    approvedById: undefined,
                    expertises: [],
                    createdAt: '2023-12-01T10:00:00.000Z',
                    updatedAt: '2023-12-01T10:00:00.000Z',
                },
                {
                    id: 'p2',
                    title: 'Программа 2',
                    description: 'Описание программы 2',
                    status: ProgramStatus.DRAFT,
                    programCode: 'CODE-2',
                    duration: 36,
                    targetAudience: 'Студенты',
                    competencies: '',
                    learningOutcomes: '',
                    content: '',
                    methodology: '',
                    assessment: '',
                    materials: '',
                    requirements: '',
                    nprContent: '',
                    pmrContent: '',
                    vrContent: '',
                    version: 1,
                    parentId: undefined,
                    submittedAt: undefined,
                    approvedAt: undefined,
                    archivedAt: undefined,
                    rejectionReason: undefined,
                    author: {
                        id: 'a2',
                        email: 'author2@example.com',
                        password: '',
                        roles: [UserRole.AUTHOR],
                        status: UserStatus.ACTIVE,
                        createdAt: '2023-12-01T10:00:00.000Z',
                        updatedAt: '2023-12-01T10:00:00.000Z',
                    },
                    authorId: 'a2',
                    approvedBy: undefined,
                    approvedById: undefined,
                    expertises: [],
                    createdAt: '2023-12-01T10:00:00.000Z',
                    updatedAt: '2023-12-01T10:00:00.000Z',
                },
            ] satisfies Program[],
            total: 2,
            page: 1,
            limit: 10,
        },
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
            return programService.createProgram(data);
        },
        onSuccess: (data: Program) => {
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
        onError: (error: any) => {
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
