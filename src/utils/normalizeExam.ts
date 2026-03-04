import { ExamData, Part, Question, QuestionGroup } from "@/types/object";

export const normalizeExamData = (raw: any): ExamData => {
  if (!raw) return { hasParts: false, parts: [] };

  return {
    hasParts: !!raw.hasParts,
    parts: (raw.parts || []).map((part: any, pIdx: number): Part => ({
      partIndex: part.partIndex || pIdx + 1,
      partTitle: part.partTitle || part.title || "",
      partDescription: part.partDescription || part.description || part.instruction || "",
      questionType: part.questionType || "mixed",
      mediaPlaceholders: part.mediaPlaceholders || [],
      // Đảm bảo questionGroups luôn là mảng
      questionGroups: (part.questionGroups || []).map((g: any): QuestionGroup => ({
        groupInstruction: g.groupInstruction || "",
        questionIndices: g.questionIndices || [],
        mediaPlaceholders: g.mediaPlaceholders || []
      })),
      // Chuẩn hóa danh sách câu hỏi
      questions: (part.questions || []).map((q: any, qIdx: number): Question => ({
        questionIndex: q.questionIndex || qIdx + 1,
        questionText: q.questionText || "",
        questionType: q.questionType || "multiple_choice",
        mediaPlaceholders: q.mediaPlaceholders || [],
        // Chuyển đổi options từ AI sang định dạng Object {label, text}
        options: Array.isArray(q.options)
          ? q.options.map((opt: any, oIdx: number) => {
            if (typeof opt === 'string') {
              return { label: String.fromCharCode(65 + oIdx), text: opt };
            }
            return {
              label: opt.label || String.fromCharCode(65 + oIdx),
              text: opt.text || ""
            };
          })
          : null
      }))
    }))
  };
};