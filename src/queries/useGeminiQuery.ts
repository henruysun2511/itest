import { GeminiService } from "@/services/gemini.service";
import { ParseExamBody } from "@/types/body";
import { useMutation } from "@tanstack/react-query";

export const GEMINI_QUERY_KEY = ["gemini"];

export const useParseExam = () => {
    return useMutation({
        mutationFn: (payload: ParseExamBody) =>
            GeminiService.parseExam(payload),
    });
};