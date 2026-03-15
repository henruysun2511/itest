import { SettingService } from "@/services/setting.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const SETTING_QUERY_KEY = ["settings"];

export const useGetSettings = () => {
    return useQuery({
        queryKey: SETTING_QUERY_KEY,
        queryFn: async () => {
            const res = await SettingService.getSettings();
            return res.data;
        },
    });
};

export const useUpdateSettings = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: SettingService.updateSettings,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: SETTING_QUERY_KEY });
        },
    });
};