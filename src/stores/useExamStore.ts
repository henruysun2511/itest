import { create } from 'zustand';

// Thêm interface cho kết quả (dựa trên ảnh screenshot bạn gửi)
interface ExamResult {
  maxScore: number;
  totalScore: number;
  totalCorrect: number;
  totalQuestions: number;
  percent: number;
  parts: any[];
}

interface ExamState {
  examData: any;
  examResult: ExamResult | null; // Thêm dòng này
  setExamData: (data: any) => void;
  setExamResult: (result: ExamResult) => void; // Thêm hàm setter
}

export const useExamStore = create<ExamState>((set) => ({
  examData: null,
  examResult: null,
  setExamData: (data) => set({ examData: data }),
  setExamResult: (result) => set({ examResult: result }),
}));