import { ExamData } from "@/types/object";

export function normalizeExamData(data: any): ExamData {
  const rawParts = Array.isArray(data?.parts) ? data.parts : [];

  const parts = rawParts.length
    ? rawParts.map((part: any, pIndex: number) => {
        const rawQuestions = Array.isArray(part?.questions)
          ? part.questions
          : [];

        const questions = rawQuestions.map(
          (q: any, qIndex: number) => ({
            questionIndex: qIndex + 1,
            questionText: q?.questionText ?? "",
            questionType: q?.questionType ?? "essay",
            options: Array.isArray(q?.options)
              ? q.options.map((opt: any, oIndex: number) => ({
                  label:
                    opt?.label ??
                    String.fromCharCode(65 + oIndex), // A, B, C...
                  content: opt?.content ?? "",
                }))
              : null,
            mediaPlaceholders: Array.isArray(
              q?.mediaPlaceholders
            )
              ? q.mediaPlaceholders
              : [],
          })
        );

        const rawGroups = Array.isArray(part?.questionGroups)
          ? part.questionGroups
          : [];

        const questionGroups = rawGroups.map((g: any) => ({
          groupInstruction: g?.groupInstruction ?? "",
          questionIndices: Array.isArray(g?.questionIndices)
            ? g.questionIndices.filter((i: number) =>
                questions.some(
                  (q) => q.questionIndex === i
                )
              )
            : [],
          mediaPlaceholders: Array.isArray(
            g?.mediaPlaceholders
          )
            ? g.mediaPlaceholders
            : [],
        }));

        return {
          partIndex: pIndex + 1,
          partTitle: part?.partTitle ?? `Part ${pIndex + 1}`,
          partDescription: part?.partDescription ?? null,
          questionType: part?.questionType ?? "mixed",
          mediaPlaceholders: Array.isArray(
            part?.mediaPlaceholders
          )
            ? part.mediaPlaceholders
            : [],
          questionGroups,
          questions,
        };
      })
    : [];

  return {
    hasParts: parts.length > 0,
    parts,
  };
}