import { ApiResponse, ParseExamBody } from "@/types/body";
import { ExamData } from "@/types/object";
import http from "@/utils/http";


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