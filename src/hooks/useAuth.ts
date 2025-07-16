import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';

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
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authService.getUser,
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 1,
  })
}


export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
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
  
  return useMutation({
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

// Главный хук для аутентификации с автоматическим логином админа
export const useAuth = () => {
  const userQuery = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const login = async (credentials: any) => {
    return loginMutation.mutateAsync(credentials);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading || (!userQuery.data),
    isAuthenticated: !!userQuery.data,
    login,
    logout,
    loginMutation,
    logoutMutation,
  };
};
