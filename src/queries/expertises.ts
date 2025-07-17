import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {expertiseService} from '../services/expertiseService';
import type { Expertise } from '../types/expertise';
import { ExpertiseStatus } from '../types/expertise';
import { ProgramStatus } from '../types/program';
import { UserStatus } from '../types/user';
import { UserRole } from '../types/user';

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
        initialData: () => ({
            data: [
                {
                    id: '1',
                    status: ExpertiseStatus.APPROVED,
                    generalFeedback: 'Отличная программа',
                    recommendations: 'Добавить больше практики',
                    conclusion: 'Одобрено',
                    relevanceScore: 9,
                    contentQualityScore: 8,
                    methodologyScore: 8,
                    practicalValueScore: 7,
                    innovationScore: 6,
                    totalScore: 8.0,
                    reviewedAt: '2023-12-01T10:00:00.000Z',
                    expertComments: 'Все хорошо',
                    isRecommendedForApproval: true,
                    program: {
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
                    programId: 'p1',
                    expert: {
                        id: 'e1',
                        email: 'expert1@example.com',
                        password: '',
                        roles: [UserRole.EXPERT],
                        status: UserStatus.ACTIVE,
                        createdAt: '2023-12-01T10:00:00.000Z',
                        updatedAt: '2023-12-01T10:00:00.000Z',
                    },
                    expertId: 'e1',
                    assignedBy: undefined,
                    assignedById: undefined,
                    createdAt: '2023-12-01T10:00:00.000Z',
                    updatedAt: '2023-12-01T10:00:00.000Z',
                },
                {
                    id: '2',
                    status: ExpertiseStatus.PENDING,
                    generalFeedback: '',
                    recommendations: '',
                    conclusion: '',
                    relevanceScore: 0,
                    contentQualityScore: 0,
                    methodologyScore: 0,
                    practicalValueScore: 0,
                    innovationScore: 0,
                    totalScore: 0,
                    reviewedAt: undefined,
                    expertComments: '',
                    isRecommendedForApproval: false,
                    program: {
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
                    programId: 'p2',
                    expert: {
                        id: 'e2',
                        email: 'expert2@example.com',
                        password: '',
                        roles: [UserRole.EXPERT],
                        status: UserStatus.ACTIVE,
                        createdAt: '2023-12-01T10:00:00.000Z',
                        updatedAt: '2023-12-01T10:00:00.000Z',
                    },
                    expertId: 'e2',
                    assignedBy: undefined,
                    assignedById: undefined,
                    createdAt: '2023-12-01T10:00:00.000Z',
                    updatedAt: '2023-12-01T10:00:00.000Z',
                },
                {
                    id: '3',
                    status: ExpertiseStatus.IN_PROGRESS,
                    generalFeedback: '',
                    recommendations: '',
                    conclusion: '',
                    relevanceScore: 0,
                    contentQualityScore: 0,
                    methodologyScore: 0,
                    practicalValueScore: 0,
                    innovationScore: 0,
                    totalScore: 0,
                    reviewedAt: undefined,
                    expertComments: '',
                    isRecommendedForApproval: false,
                    program: {
                        id: 'p3',
                        title: 'Программа 3',
                        description: 'Описание программы 3',
                        status: ProgramStatus.DRAFT,
                        programCode: 'CODE-3',
                        duration: 24,
                        targetAudience: 'Слушатели',
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
                            id: 'a3',
                            email: 'author3@example.com',
                            password: '',
                            roles: [UserRole.AUTHOR],
                            status: UserStatus.ACTIVE,
                            createdAt: '2023-12-01T10:00:00.000Z',
                            updatedAt: '2023-12-01T10:00:00.000Z',
                        },
                        authorId: 'a3',
                        approvedBy: undefined,
                        approvedById: undefined,
                        expertises: [],
                        createdAt: '2023-12-01T10:00:00.000Z',
                        updatedAt: '2023-12-01T10:00:00.000Z',
                    },
                    programId: 'p3',
                    expert: {
                        id: 'e3',
                        email: 'expert3@example.com',
                        password: '',
                        roles: [UserRole.EXPERT],
                        status: UserStatus.ACTIVE,
                        createdAt: '2023-12-01T10:00:00.000Z',
                        updatedAt: '2023-12-01T10:00:00.000Z',
                    },
                    expertId: 'e3',
                    assignedBy: undefined,
                    assignedById: undefined,
                    createdAt: '2023-12-01T10:00:00.000Z',
                    updatedAt: '2023-12-01T10:00:00.000Z',
                },
            ] satisfies Expertise[],
            total: 3,
            page: 1,
            limit: 10,
        }),
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
