import { ApiResponse, ParseExamBody } from "@/shares/types/body";
import { ExamData } from "@/shares/types/object";
import http from "@/shares/utils/http";


const prefix = "gemini";

export const GeminiService = {
    // POST /gemini/parse-exam
    parseExam(payload: ParseExamBody) {
        return http.post<ApiResponse<ExamData>>(
            `/${prefix}/parse-exam`,
            payload
        );
    },
};