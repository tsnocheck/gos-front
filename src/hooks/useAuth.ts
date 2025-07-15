import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { authService } from '../services/authService';

// Автоматически логинимся под админом при загрузке
const AUTO_LOGIN_CREDENTIALS = {
  email: 'admin@goszalupa.ru',
  password: 'admin123456'
};

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authService.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 1,
  });
};

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
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(() => {
    return !!localStorage.getItem('accessToken');
  });
  const userQuery = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  // Автоматически логинимся админом при загрузке приложения
  useEffect(() => {
    if (!autoLoginAttempted && !localStorage.getItem('accessToken') && !loginMutation.isPending) {
      console.log('Attempting auto-login...');
      setAutoLoginAttempted(true);
      loginMutation.mutate(AUTO_LOGIN_CREDENTIALS);
    }
  }, [autoLoginAttempted, loginMutation.isPending]);
  // useEffect(() => {
  //   console.log('useAuth effect triggered:', {
  //     autoLoginAttempted,
  //     userData: !!userQuery.data,
  //     isLoading: userQuery.isLoading,
  //     isPending: loginMutation.isPending,
  //     hasToken: !!localStorage.getItem('accessToken')
  //   });
    
  //   // Если нет токена и не пытались логиниться - пытаемся
  //   if (!autoLoginAttempted && !localStorage.getItem('accessToken') && !loginMutation.isPending) {
  //     console.log('Attempting auto-login...');
  //     setAutoLoginAttempted(true);
  //     loginMutation.mutate(AUTO_LOGIN_CREDENTIALS);
  //   }
  // }, [autoLoginAttempted, loginMutation.isPending]);

  const login = async (credentials: any) => {
    return loginMutation.mutateAsync(credentials);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading || (!autoLoginAttempted && !userQuery.data),
    isAuthenticated: !!userQuery.data,
    login,
    logout,
    loginMutation,
    logoutMutation,
  };
};
