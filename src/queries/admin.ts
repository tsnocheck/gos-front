// Query keys
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {adminService, type GetUsersParams} from "../services/adminService.ts";

export const adminKeys = {
    all: ['admin'] as const,
    lists: () => [...adminKeys.all, 'list'] as const,
    list: (params: GetUsersParams) => [...adminKeys.lists(), params] as const,
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