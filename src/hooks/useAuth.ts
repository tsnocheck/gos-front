import {useCurrentUser, useLogin, useLogout} from "../queries/auth.ts";

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
