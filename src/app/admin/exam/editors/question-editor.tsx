import { Question } from "@/types/object";
import { Button, Card, Input, Select } from "antd";

const QUESTION_TYPES = [
  "multiple_choice",
  "true_false",
  "fill_in_blank",
  "essay",
];

interface Props {
  question: Question;
  onChange: (q: Question) => void;
}

export default function QuestionEditor({
  question,
  onChange,
}: Props) {
  const updateField = <K extends keyof Question>(
    key: K,
    value: Question[K]
  ) => {
    onChange({ ...question, [key]: value });
  };

  const updateOption = (
    index: number,
    key: "label" | "text",
    value: string
  ) => {
    if (!question.options) return;

    const newOptions = [...question.options];
    newOptions[index] = {
      ...newOptions[index],
      [key]: value,
    };

    updateField("options", newOptions);
  };

  const addOption = () => {
    const newOptions = question.options
      ? [...question.options]
      : [];

    newOptions.push({
      label: String.fromCharCode(65 + newOptions.length),
      text: "",
    });

    updateField("options", newOptions);
  };

  return (
    <Card
      size="small"
      title={`Câu ${question.questionIndex}`}
      style={{ marginBottom: 16 }}
    >
      {/* QUESTION TEXT */}
      <Input.TextArea
        value={question.questionText}
        onChange={(e) =>
          updateField("questionText", e.target.value)
        }
        style={{ marginBottom: 8 }}
      />

      {/* QUESTION TYPE */}
      <Select
        value={question.questionType}
        onChange={(v) =>
          updateField("questionType", v)
        }
        options={QUESTION_TYPES.map((t) => ({
          label: t,
          value: t,
        }))}
        style={{ width: 250, marginBottom: 12 }}
      />

      {/* OPTIONS */}
      {question.options?.map((opt, i) => (
        <div
          key={i}
          style={{ display: "flex", gap: 8, marginBottom: 8 }}
        >
          <Input
            value={opt.label}
            onChange={(e) =>
              updateOption(i, "label", e.target.value)
            }
            style={{ width: 80 }}
          />

          <Input
            value={opt.text}
            onChange={(e) =>
              updateOption(i, "text", e.target.value)
            }
          />
        </div>
      ))}

      {question.questionType === "multiple_choice" && (
        <Button onClick={addOption}>
          Thêm option
        </Button>
      )}
    </Card>
  );
}