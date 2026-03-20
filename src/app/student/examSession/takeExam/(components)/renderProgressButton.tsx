"use client";


interface ProgressButtonProps {
  question: any;
  userAnswer: any;
  size?: 'sm' | 'md' | 'lg'; // Thêm option lg nếu muốn to hẳn
}

export function ProgressButton({ question, userAnswer, size = 'md' }: ProgressButtonProps) {
  const isAnswered = userAnswer && (
    Array.isArray(userAnswer.answer)
      ? userAnswer.answer.length > 0
      : !!userAnswer.answer
  );

  // ĐIỀU CHỈNH TẠI ĐÂY:
  // sm: ~28px, md: ~40px (như ban đầu), lg: ~48px
  const sizeMap = {
    sm: 'w-7 h-7 text-[10px] rounded-lg',
    md: 'w-10 h-10 text-sm rounded-xl', // Đây là kích thước gần giống ban đầu nhất
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