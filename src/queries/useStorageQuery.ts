import { StorageService } from "@/services/storage.service";
import { DeleteFilePdfBody, GetSignedUrlBody } from "@/types/body";
import { useMutation } from "@tanstack/react-query";

export const STORAGE_QUERY_KEY = ["storage"];

export const useUploadExamPdf = () => {
    return useMutation({
        mutationFn: (file: File) => StorageService.uploadExamPdf(file),
    });
};

export const useDeleteExamPdf = () => {
    return useMutation({
        mutationFn: (payload: DeleteFilePdfBody) =>
            StorageService.deleteExamPdf(payload),
    });
};

export const useGetSignedUrl = () => {
    return useMutation({
        mutationFn: (payload: GetSignedUrlBody) =>
            StorageService.getSignedUrl(payload),
    });
};

