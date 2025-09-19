import { useCurrentUser, useLogin, useLogout } from '../queries/auth.ts';
import { UserRole } from '@/types';

export const useAuth = () => {
  const userQuery = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const getToken = () => {
    return localStorage.getItem('accessToken') ?? '';
  };

  const checkPermission = (roles: UserRole[]) => {
    return roles.some((role) => userQuery.data?.roles.includes(role));
  };

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isAuthenticated: !!userQuery.data?.id,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    loginMutation,
    logoutMutation,
    checkPermission,
    getToken,
  };
};
