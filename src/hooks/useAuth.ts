import {useCurrentUser, useLogin, useLogout} from "../queries/auth.ts";
import {UserRole} from "../types";

export const useAuth = () => {
  const userQuery = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const checkPermission = (roles: UserRole[]) => {
    for (const role of roles) {
      if (userQuery.data?.roles.includes(role)) return true;
    }
    return false;
  }

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isAuthenticated: !!userQuery.data?.id,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    loginMutation,
    logoutMutation,
    checkPermission
  };
};
