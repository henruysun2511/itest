import { RoleService } from "@/services/role.service";
import {  RoleParam } from "@/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const ROLE_QUERY_KEY = ["roles"];

export const useRoleList = () => {
  return useQuery({
    queryKey: [...ROLE_QUERY_KEY],
    queryFn: async () => {
      const res = await RoleService.getList();
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useRoleListPagination = (param: RoleParam) => {
  return useQuery({
    queryKey: [...ROLE_QUERY_KEY, param],
    queryFn: async () => {
      const res = await RoleService.getList();
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

// create role
export const useRoleCreate = () => {
  const qc = useQueryClient();
    return useMutation({
        mutationFn: RoleService.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ROLE_QUERY_KEY });
        },
    });
};

// delete role
export const useRoleDelete = () => {
  const qc = useQueryClient();
    return useMutation({
        mutationFn: RoleService.delete,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ROLE_QUERY_KEY });
        },
    });
};

// update role
export const useRoleUpdate = () => {
  const qc = useQueryClient();
    return useMutation({
        mutationFn: RoleService.update,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ROLE_QUERY_KEY });
        },
    });
};