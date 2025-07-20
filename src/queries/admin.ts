// Query keys
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {adminService, type GetUsersParams} from "../services/adminService.ts";
import type { UserRole, UserStatus } from "../types";

export const adminKeys = {
    all: ['admin'] as const,
    lists: () => [...adminKeys.all, 'list'] as const,
    list: (params: GetUsersParams) => [...adminKeys.lists(), params] as const,
    pending: () => [...adminKeys.all, 'pending'] as const,
    byRole: (role: UserRole) => [...adminKeys.all, 'role', role] as const,
    byStatus: (status: UserStatus) => [...adminKeys.all, 'status', status] as const,
    stats: () => [...adminKeys.all, 'stats'] as const,
};

export const useUsers = (params?: GetUsersParams) => {
    return useQuery({
        queryKey: adminKeys.list(params || {}),
        queryFn: () => adminService.getUsers(params),
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 2 * 60 * 1000,
    })
}

export const useChangeUserStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminService.changeUserStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() })
        }
    });
}

export const useArchiveUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminService.archiveUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() })
        }
    });
}

export const useUnarchiveUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminService.unarchiveUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() })
        }
    });
}

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminService.createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() })
        }
    });
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminService.updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() })
        }
    });
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminService.deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() })
        }
    });
}

// Получение пользователей на модерации
export const usePendingUsers = () => {
    return useQuery({
        queryKey: adminKeys.pending(),
        queryFn: adminService.getPendingUsers,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 2 * 60 * 1000,
    });
};

// Получение пользователей по роли
export const useUsersByRole = (role: UserRole) => {
    return useQuery({
        queryKey: adminKeys.byRole(role),
        queryFn: () => adminService.getUsersByRole(role),
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 2 * 60 * 1000,
    });
};

// Получение пользователей по статусу
export const useUsersByStatus = (status: UserStatus) => {
    return useQuery({
        queryKey: adminKeys.byStatus(status),
        queryFn: () => adminService.getUsersByStatus(status),
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 2 * 60 * 1000,
    });
};

// Подтверждение пользователя
export const useApproveUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.approveUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
        },
    });
};

// Смена ролей пользователя
export const useChangeUserRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.changeUserRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
        },
    });
};

// Отправка приглашения пользователю
export const useSendInvitation = () => {
    return useMutation({
        mutationFn: adminService.sendInvitation,
    });
};

// Скрытие пользователя
export const useHideUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.hideUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
        },
    });
};

// Массовое подтверждение пользователей
export const useBulkApproveUsers = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.bulkApproveUsers,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
        },
    });
};

// Массовая смена статуса пользователей
export const useBulkChangeStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { userIds: string[]; status: UserStatus }) => adminService.bulkChangeStatus(data.userIds, data.status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
        },
    });
};

// Массовая смена ролей пользователей
export const useBulkChangeRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { userIds: string[]; roles: UserRole[] }) => adminService.bulkChangeRole(data.userIds, data.roles),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
        },
    });
};

// Получение статистики пользователей
export const useUserStats = () => {
    return useQuery({
        queryKey: adminKeys.stats(),
        queryFn: adminService.getUserStats,
        staleTime: 2 * 60 * 1000,
    });
};