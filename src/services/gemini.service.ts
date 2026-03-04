import { ApiResponse, ParseExamBody } from "@/types/body";
import { ParseExam } from "@/types/object";
import http from "@/utils/http";


const prefix = "gemini";

export const GeminiService = {
    // POST /gemini/parse-exam
    parseExam(payload: ParseExamBody) {
        return http.post<ApiResponse<ParseExam>>(
            `/${prefix}/parse-exam`,
            payload
        );
    },
};