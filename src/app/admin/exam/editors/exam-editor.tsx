import { ExamData, Part } from "@/types/object";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import PartEditor from "./part-editor";
interface Props {
  value: ExamData;
  onChange: (value: ExamData) => void;
  answersState: Record<number, { correctAnswer: string[]; points: number }>;
  setAnswersState: (state: any) => void;
  uploadHook: any;
  hasEssay: any;
}

export default function EditableExam({
  value,
  onChange,
  answersState,
  setAnswersState,
  uploadHook,
  hasEssay
}: Props) {
  const updatePart = (index: number, updatedPart: any) => {
    const newParts = [...value.parts];
    newParts[index] = updatedPart;
    onChange({ ...value, parts: newParts });
  };

  const addPart = () => {
    const newPart: Part = {
      partIndex: value.parts.length + 1,
      partTitle: `New Part ${value.parts.length + 1}`,
      partDescription: "",
      mediaPlaceholders: [],
      questionGroups: [],
      questions: [],
      media: [],
      questionType: "mixed",
    };

    onChange({
      ...value,
      parts: [...value.parts, newPart],
    });
  };

  const deletePart = (index: number) => {
    const newParts = value.parts.filter((_, i) => i !== index)
      .map((p, i) => ({ ...p, partIndex: i + 1 })); // Reindex lại partIndex
    onChange({ ...value, parts: newParts });
  };


  return (
    <>
      {value.parts.map((part, index) => (
        <PartEditor
          key={index}
          part={part}
          partIndex={index}
          updatePart={updatePart}
          answersState={answersState}
          setAnswersState={setAnswersState}
          uploadHook={uploadHook}
          onDelete={() => deletePart(index)}
          hasEssay={hasEssay}
        />
      ))}

      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={addPart}
        block
        style={{ height: '50px', marginBottom: '40px' }}
      >
        Thêm Part mới (Phần thi mới)
      </Button>
    </>
  );
}