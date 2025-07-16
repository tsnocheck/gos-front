import {UserStatus} from "../types";
import {useChangeUserStatus, useCreateUser, useDeleteUser, useUpdateUser} from "../queries/admin.ts";
import type {AdminUpdateUserData} from "../services/adminService.ts";

export const useAdmin = () => {
    const changeUserStatusMutation = useChangeUserStatus()
    const deleteUserMutation = useDeleteUser()
    const createUserMutation = useCreateUser()
    const updateUserMutation = useUpdateUser();


    return {
        activateUser: (userId: string) => changeUserStatusMutation.mutateAsync({ userId, status: UserStatus.ACTIVE }),
        deactivateUser: (userId: string) => changeUserStatusMutation.mutateAsync({ userId, status: UserStatus.INACTIVE }),
        createUser: createUserMutation.mutateAsync,
        deleteUser: deleteUserMutation.mutateAsync,
        updateUser: (userId: string, data: Omit<AdminUpdateUserData, 'userId'>) => updateUserMutation.mutateAsync({ userId, ...data }),
        deleteUserMutation,
        createUserMutation,
        updateUserMutation,
    }
}