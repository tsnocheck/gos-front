import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {authService} from "../services/authService";
import type { AuthResponse } from '../types/auth';
import type { User } from '../types/user';

// Query keys
export const authKeys = {
    all: ['auth'] as const,
    id: () => [...authKeys.all, 'id'] as const,
    user: () => [...authKeys.id(), 'user'] as const,
};

export const useId = () => {
    return useQuery({
        queryKey: authKeys.id(),
        queryFn: authService.getId,
        staleTime: 5 * 60 * 1000, // 5 минут
        retry: 1,
    });
};

export const useCurrentUser = () => {
    return useQuery<User>({
        queryKey: authKeys.user(),
        queryFn: authService.getUser,
        staleTime: 5 * 60 * 1000, // 5 минут
        retry: 1,
    })
}

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation<AuthResponse>({
        mutationFn: authService.login,
        onSuccess: (data) => {
            localStorage.setItem('accessToken', data.accessToken);
            queryClient.setQueryData(authKeys.user(), data.user);
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation<AuthResponse>({
        mutationFn: authService.register,
        onSuccess: (data) => {
            localStorage.setItem('accessToken', data.accessToken);
            queryClient.setQueryData(authKeys.user(), data.user);
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            localStorage.removeItem('accessToken');
            queryClient.setQueryData(authKeys.user(), null);
            queryClient.clear();
        },
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: authService.resetPassword,
    });
};

export const useSetPassword = () => {
    return useMutation({
        mutationFn: ({ token, password }: { token: string; password: string }) =>
            authService.setPassword(token, password),
    });
};