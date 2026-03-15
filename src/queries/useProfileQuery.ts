import { ProfileService } from "@/services/profile.service";
import { UpdateProfileBody } from "@/types/body";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const PROFILE_QUERY_KEY = ["profile"];


export const useGetProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const res = await ProfileService.getProfile();
      return res.data;
    },
    staleTime: 10 * 60 * 1000, 
  });
};

// Hook cập nhật thông tin profile
export const useUpdateProfile = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateProfileBody) => ProfileService.updateProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });      
    },
  });
};