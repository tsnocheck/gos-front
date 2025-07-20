import {UserStatus} from "../types";
import {
    useArchiveUser,
    useChangeUserStatus,
    useCreateUser,
    useDeleteUser,
    useUnarchiveUser,
    useUpdateUser,
    useApproveUser,
    useChangeUserRole,
    useSendInvitation,
    useHideUser,
    useBulkApproveUsers,
    useBulkChangeStatus,
    useBulkChangeRole,
} from "../queries/admin.ts";
import type {AdminUpdateUserData} from "../services/adminService.ts";

export const useAdmin = () => {
    const changeUserStatusMutation = useChangeUserStatus();
    const deleteUserMutation = useDeleteUser();
    const createUserMutation = useCreateUser();
    const updateUserMutation = useUpdateUser();
    const archiveUserMutation = useArchiveUser();
    const unarchiveUserMutation = useUnarchiveUser();
    const approveUserMutation = useApproveUser();
    const changeUserRoleMutation = useChangeUserRole();
    const sendInvitationMutation = useSendInvitation();
    const hideUserMutation = useHideUser();
    const bulkApproveUsersMutation = useBulkApproveUsers();
    const bulkChangeStatusMutation = useBulkChangeStatus();
    const bulkChangeRoleMutation = useBulkChangeRole();

    return {
        activateUser: (userId: string) => changeUserStatusMutation.mutateAsync({ userId, status: UserStatus.ACTIVE }),
        deactivateUser: (userId: string) => changeUserStatusMutation.mutateAsync({ userId, status: UserStatus.INACTIVE }),
        createUser: createUserMutation.mutateAsync,
        deleteUser: deleteUserMutation.mutateAsync,
        archiveUser: archiveUserMutation.mutateAsync,
        unarchiveUser: unarchiveUserMutation.mutateAsync,
        updateUser: (userId: string, data: Omit<AdminUpdateUserData, 'userId'>) => updateUserMutation.mutateAsync({ userId, ...data }),
        approveUser: approveUserMutation.mutateAsync,
        changeUserRole: changeUserRoleMutation.mutateAsync,
        sendInvitation: sendInvitationMutation.mutateAsync,
        hideUser: hideUserMutation.mutateAsync,
        bulkApproveUsers: bulkApproveUsersMutation.mutateAsync,
        bulkChangeStatus: bulkChangeStatusMutation.mutateAsync,
        bulkChangeRole: bulkChangeRoleMutation.mutateAsync,

        deleteUserMutation,
        createUserMutation,
        updateUserMutation,
        archiveUserMutation,
        unarchiveUserMutation,
        approveUserMutation,
        changeUserRoleMutation,
        sendInvitationMutation,
        hideUserMutation,
        bulkApproveUsersMutation,
        bulkChangeStatusMutation,
        bulkChangeRoleMutation
    }
}