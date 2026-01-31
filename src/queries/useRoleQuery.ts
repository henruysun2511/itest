import { RoleService } from "@/services/role.service";
import { useQuery } from "@tanstack/react-query";

export const ROLE_QUERY_KEY = ["roles"];

export const useRoleList = () => {
    return useQuery({
        queryKey: ROLE_QUERY_KEY,
        queryFn: async () => {
            const res = await RoleService.getList();
            return res.data; 
        },
        staleTime: 10 * 60 * 1000,
    });
};