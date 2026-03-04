import { Question } from "@/types/object";
import { Input, Radio } from "antd";
import FillInBlankRenderer from "./fill-in-blank-renderer";
import MediaRenderer from "./media-renderer";
import RichTextRenderer from "./richtext-renderer";


interface Props {
  question: Question;
}

export default function QuestionRenderer({ question }: Props) {
  const renderByType = () => {
    switch (question.questionType) {
      case "multiple_choice":
      case "true_false":
        return (
          <Radio.Group>
            {question.options?.map((opt) => (
              <Radio key={opt.label} value={opt.label}>
                {opt.label}. {opt.text}
              </Radio>
            ))}
          </Radio.Group>
        );

      case "fill_in_blank":
        return <FillInBlankRenderer text={question.questionText} />;

      case "essay":
        return <Input.TextArea rows={5} />;

      default:
        return <Input />;
    }
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontWeight: 600 }}>
        Question {question.questionIndex}
      </div>

      {question.questionType !== "fill_in_blank" && (
        <RichTextRenderer content={question.questionText} />
      )}

      <MediaRenderer media={question.mediaPlaceholders} />

      {renderByType()}
    </div>
  );
}