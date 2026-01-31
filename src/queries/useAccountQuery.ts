import { AccountService } from "@/services/account.service";
import { ApiResponse } from "@/types/body";
import { AccountStatus } from "@/types/enum";
import { Account } from "@/types/object";
import { AccountParam } from "@/types/param";
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