// Query keys
import {useQuery} from "@tanstack/react-query";
import {adminService, type GetUsersParams} from "../services/adminService.ts";

export const adminKeys = {
    all: ['admin'] as const,
    list: (params?: GetUsersParams) => [...adminKeys.all, 'list', params] as const,
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