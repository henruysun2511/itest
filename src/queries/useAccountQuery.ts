import { AccountService } from "@/services/account.service";
import { AccountStatus } from "@/shares/constants/status.enum";
import { ApiResponse, ChangePasswordBody, UpdateStudentPasswordBody } from "@/shares/types/body";
import { Account } from "@/shares/types/object";
import { AccountParam } from "@/shares/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const ACCOUNT_QUERY_KEY = ["accounts"];

// Hook lấy danh sách
export const useAccountList = (params: AccountParam) => {
    return useQuery<ApiResponse<Account[]>>({
        queryKey: [...ACCOUNT_QUERY_KEY, params],
        queryFn: async () => {
            const res = await AccountService.getList(params);
            return res.data;
        },
    });
};

export const useCreateAccountBulk = () => {
    const qc = useQueryClient(); //
    return useMutation({
        mutationFn: AccountService.createBulk, //
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY }); //
        },
    });
};

// Hook tạo tài khoản
export const useCreateAccount = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: AccountService.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
        },
    });
};

// Hook xóa tài khoản
export const useDeleteAccount = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: AccountService.delete,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
        },
    });
};

// Hook đổi trạng thái (Change Status)
export const useChangeAccountStatus = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: AccountStatus }) => 
            AccountService.changeStatus(id, status),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
        },
    });
};

// Hook cập nhật mật khẩu
export const useUpdateAccountPassword = () => {
    return useMutation({
        mutationFn: AccountService.updatePassword,
    });
};


export const useChangePassword = () => {
    return useMutation({
        mutationFn: (payload: ChangePasswordBody) => 
            AccountService.changePassword(payload),
    });
};

export const useUpdateStudentPassword = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ 
            examSessionId, 
            payload 
        }: { 
            examSessionId: string; 
            payload: UpdateStudentPasswordBody 
        }) => AccountService.updateStudentPassword(examSessionId, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
        },
    });
};