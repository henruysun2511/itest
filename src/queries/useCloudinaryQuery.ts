import { CloudinaryService } from "@/services/cloudinary.service";
import { DeleteFileCloudinaryBody } from "@/types/body";
import { useMutation } from "@tanstack/react-query";

export const CLOUDINARY_QUERY_KEY = ["cloudinary"];

export const useUploadFileCloudinary = () => {
    return useMutation({
        mutationFn: (file: File) => CloudinaryService.uploadFileCloudinary(file),
    });
};

export const useDeleteFileCloudinary = () => {
    return useMutation({
        mutationFn: (payload: DeleteFileCloudinaryBody) =>
            CloudinaryService.deleteFileCloudinary(payload),
    });
};
