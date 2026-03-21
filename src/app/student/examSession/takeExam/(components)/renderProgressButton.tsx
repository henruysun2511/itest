"use client";


interface ProgressButtonProps {
  question: any;
  userAnswer: any;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressButton({ question, userAnswer, size = 'md' }: ProgressButtonProps) {
  const isAnswered = userAnswer && (() => {
    const ans = userAnswer.answer;
    if (Array.isArray(ans)) return ans.length > 0;
    if (typeof ans === 'object' && ans !== null) {
      const hasContent = !!ans.content?.trim();
      const hasFiles = Array.isArray(ans.file_metadata) && ans.file_metadata.length > 0;
      return hasContent || hasFiles;
    }
    return !!ans;
  })();


  const sizeMap = {
    sm: 'w-7 h-7 text-[10px] rounded-lg',
    md: 'w-10 h-10 text-sm rounded-xl',
    lg: 'w-20 h-20 text-base rounded-2xl'
  };

  const sizeClass = sizeMap[size];

  const handleClick = () => {
    const element = document.getElementById(`question-${question.questionId}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${sizeClass} flex items-center justify-center font-bold transition-all border
        ${isAnswered
          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md'
          : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-[var(--color-accent)] hover:bg-white'
        }`}
    >
      {question.questionNumber}
    </button>
  );
}