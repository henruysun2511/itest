"use client";

import { QuestionType } from '@/types/enum';
import { Card, Checkbox, Image, Input, Radio, Tag } from 'antd';

const RenderMediaList = ({ mediaList }: { mediaList?: any[] }) => {
  if (!mediaList || mediaList.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4 mt-3 mb-4">
      {mediaList.map((m, idx) => (
        <div key={idx} className="max-w-full">
          {m.resourceType === 'image' && (
            <Image
              src={m.url}
              alt="question-media"
              className="rounded-xl border border-gray-100 shadow-sm"
              style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
            />
          )}
          {(m.resourceType === 'audio' || m.resourceType === 'video' || m.resourceType === 'raw') && (
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 w-full min-w-[300px]">
              <audio controls src={m.url} className="w-full h-10">
                Trình duyệt không hỗ trợ.
              </audio>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export function StudentQuestion({ question, value, onChange }: any) {
  const { questionType, questionText, options, questionIndex, groupInstruction, groupMedia, media } = question;
  const type = questionType?.toUpperCase();

  const renderOptions = () => {
    // Style chung cho các option khi được chọn (Sử dụng --color-primary)
    const activeClass = "border-[var(--color-primary)] bg-[rgba(44,44,112,0.05)] shadow-sm";
    const inactiveClass = "border-gray-100 bg-white hover:border-[var(--color-accent)]";

    switch (type) {
      case 'SINGLE_CHOICE':
      case 'TRUE_FALSE':
        return (
          <Radio.Group onChange={(e) => onChange(e.target.value)} value={value} className="w-full">
            <div className="flex flex-col gap-3">
              {options?.map((opt: any) => (
                <Radio 
                  key={opt.label} 
                  value={opt.label} 
                  className={`m-0 p-4 rounded-xl border-2 transition-all w-full flex items-center ${
                    value === opt.label ? activeClass : inactiveClass
                  }`}
                >
                  <span className="font-bold mr-2 text-[var(--color-primary)]">{opt.label}.</span> {opt.text}
                </Radio>
              ))}
            </div>
          </Radio.Group>
        );

      case 'MULTIPLE_CHOICE':
        return (
          <Checkbox.Group onChange={(vals) => onChange(vals)} value={value || []} className="w-full">
            <div className="flex flex-col gap-3">
              {options?.map((opt: any) => (
                <Checkbox 
                  key={opt.label} 
                  value={opt.label} 
                  className={`m-0 p-4 rounded-xl border-2 transition-all w-full flex items-center ${
                    value?.includes(opt.label) ? activeClass : inactiveClass
                  }`}
                >
                  <span className="font-bold mr-2 text-[var(--color-primary)]">{opt.label}.</span> {opt.text}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        );

      case QuestionType.FILL_IN_THE_BLANK:
        return (
          <Input 
            placeholder="Gõ câu trả lời ngắn tại đây..." 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 rounded-xl border-2 border-gray-100 focus:border-[var(--color-primary)] max-w-md"
          />
        );

      case 'ESSAY':
        return (
          <Input.TextArea 
            rows={6} 
            placeholder="Viết bài làm chi tiết..." 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-xl border-2 border-gray-100 focus:border-[var(--color-primary)] p-4"
          />
        );

      default:
        return <Tag color="error">Loại câu hỏi {type} đang được cập nhật</Tag>;
    }
  };

  return (
    <Card 
      className="mb-8 rounded-3xl border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden"
      bodyStyle={{ padding: '28px' }}
    >
      {groupInstruction && (
        <div className="mb-6 p-6 bg-[rgba(230,169,67,0.1)] border-l-4 border-[var(--color-accent)] rounded-r-2xl">
          <Tag color="orange" className="mb-3 font-bold uppercase border-none">Thông tin nhóm câu hỏi</Tag>
          <div className="text-slate-700 leading-relaxed text-base italic mb-4" dangerouslySetInnerHTML={{ __html: groupInstruction }} />
          <RenderMediaList mediaList={groupMedia} />
        </div>
      )}

      <div className="flex gap-5">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center font-black shadow-lg shadow-[rgba(44,44,112,0.2)]">
            {questionIndex}
          </div>
        </div>

        <div className="flex-grow">
          <div 
            className="text-[17px] font-semibold text-[var(--color-text-primary)] mb-4 leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: questionText }} 
          />
          <RenderMediaList mediaList={media} />
          <div className="mt-6">
            {renderOptions()}
          </div>
        </div>
      </div>
    </Card>
  );
}