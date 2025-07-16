import {useCurrentUser, useLogin, useLogout} from "../queries/auth.ts";

export const useAuth = () => {
  const userQuery = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading || (!userQuery.data),
    isAuthenticated: !!userQuery.data,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    loginMutation,
    logoutMutation,
  };
};
