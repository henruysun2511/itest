
import { ApiResponse, DeleteFilePdfBody, GetSignedUrlBody } from "@/shares/types/body";
import { UploadExamPdf } from "@/shares/types/object";
import http from "@/shares/utils/http";


const prefix = "storage";

export const StorageService = {
    // POST /storage/exam-pdf
    uploadExamPdf(file: File) {
        const formData = new FormData();
        formData.append("file", file);

        return http.post<ApiResponse<UploadExamPdf>>(
            `/${prefix}/exam-pdf-exams`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },

    uploadStudentAnswerFile(file: File) {
        const formData = new FormData();
        formData.append("file", file);

        return http.post<ApiResponse<UploadExamPdf>>(
            `/${prefix}/exam-pdf-exams`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },

    // DELETE /storage/exam-pdf
    deleteExamPdf(payload: DeleteFilePdfBody) {
        return http.delete<ApiResponse<null>>(
            `/${prefix}/exam-pdf`,
            { data: payload }
        );
    },

    // POST /storage/signed-url
    getSignedUrl(payload: GetSignedUrlBody) {
        return http.post<ApiResponse<{ signedUrl: string }>>(
            `/${prefix}/signed-url`,
            payload
        );
    },
};