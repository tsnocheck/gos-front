import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import type { User } from '@/types';
import { useNavigate } from 'react-router-dom';

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
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      // const { sessionKey } = await authService.getId();
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.clear();
      navigate('/login');
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authService.resetPassword,
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authService.forgotPassword,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};
