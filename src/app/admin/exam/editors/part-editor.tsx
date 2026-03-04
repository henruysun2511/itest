import { Card, Divider, Input, Select } from "antd";

import { Part } from "@/types/object";
import GroupEditor from "./group-editor";
import QuestionEditor from "./question-editor";

const QUESTION_TYPES = [
  "multiple_choice",
  "true_false",
  "fill_in_blank",
  "essay",
  "mixed",
];

interface Props {
  part: Part;
  onChange: (part: Part) => void;
}

export default function PartEditor({ part, onChange }: Props) {
  const updateField = <K extends keyof Part>(
    key: K,
    value: Part[K]
  ) => {
    onChange({ ...part, [key]: value });
  };

  const updateQuestion = (index: number, newQ: any) => {
    const newQuestions = [...part.questions];
    newQuestions[index] = newQ;
    updateField("questions", newQuestions);
  };

  return (
    <Card style={{ marginBottom: 24 }}>
      {/* PART TITLE */}
      <Input
        value={part.partTitle}
        onChange={(e) =>
          updateField("partTitle", e.target.value)
        }
        placeholder="Part title"
        style={{ marginBottom: 8 }}
      />

      {/* PART DESCRIPTION */}
      <Input.TextArea
        value={part.partDescription || ""}
        onChange={(e) =>
          updateField("partDescription", e.target.value)
        }
        placeholder="Part description"
        style={{ marginBottom: 8 }}
      />

      {/* PART QUESTION TYPE */}
      <Select
        value={part.questionType}
        onChange={(v) => updateField("questionType", v)}
        options={QUESTION_TYPES.map((t) => ({
          label: t,
          value: t,
        }))}
        style={{ width: 250, marginBottom: 16 }}
      />

      <Divider />

      {part.questions.map((q, i) => (
        <QuestionEditor
          key={q.questionIndex}
          question={q}
          onChange={(newQ) =>
            updateQuestion(i, newQ)
          }
        />
      ))}

      <Divider />

      {part.questionGroups.map((g, i) => (
        <GroupEditor
          key={i}
          group={g}
          onChange={(newG) => {
            const groups = [...part.questionGroups];
            groups[i] = newG;
            updateField("questionGroups", groups);
          }}
        />
      ))}
    </Card>
  );
}