import {UserStatus} from "../types";
import {
    useArchiveUser,
    useChangeUserStatus,
    useCreateUser,
    useDeleteUser,
    useUnarchiveUser,
    useUpdateUser
} from "../queries/admin.ts";
import type {AdminUpdateUserData} from "../services/adminService.ts";

export const useAdmin = () => {
    const changeUserStatusMutation = useChangeUserStatus()
    const deleteUserMutation = useDeleteUser()
    const createUserMutation = useCreateUser()
    const updateUserMutation = useUpdateUser();
    const archiveUserMutation = useArchiveUser();
    const unarchiveUserMutation = useUnarchiveUser();

    return {
        activateUser: (userId: string) => changeUserStatusMutation.mutateAsync({ userId, status: UserStatus.ACTIVE }),
        deactivateUser: (userId: string) => changeUserStatusMutation.mutateAsync({ userId, status: UserStatus.INACTIVE }),
        createUser: createUserMutation.mutateAsync,
        deleteUser: deleteUserMutation.mutateAsync,
        archiveUser: archiveUserMutation.mutateAsync,
        unarchiveUser: unarchiveUserMutation.mutateAsync,
        updateUser: (userId: string, data: Omit<AdminUpdateUserData, 'userId'>) => updateUserMutation.mutateAsync({ userId, ...data }),
        deleteUserMutation,
        createUserMutation,
        updateUserMutation,
        archiveUserMutation,
        unarchiveUserMutation
    }
}