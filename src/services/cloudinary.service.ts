import { ApiResponse, DeleteFileCloudinaryBody } from "@/shares/types/body";
import { UploadCloudinary } from "@/shares/types/object";
import http from "@/shares/utils/http";


const prefix = "cloudinaries";

export const CloudinaryService = {
    uploadFileCloudinary(file: File) {
        const formData = new FormData();
        formData.append("file", file);

        return http.post<ApiResponse<UploadCloudinary>>(
            `/${prefix}/media`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },

    deleteFileCloudinary(payload: DeleteFileCloudinaryBody) {
        return http.delete<ApiResponse<null>>(
            `/${prefix}/media`,
            { data: payload }
        );
    },
};