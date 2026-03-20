import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ExamState {
  examData: any | null;
  setExamData: (data: any) => void;
  clearExamData: () => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set) => ({
      examData: null,
      setExamData: (data) => set({ examData: data }),
      clearExamData: () => set({ examData: null }),
    }),
    {
      name: 'current-exam-storage',
      storage: createJSONStorage(() => sessionStorage), 
    }
  )
);