import { ExamData } from "@/types/object";
import EditablePart from "./part-editor";

interface Props {
  value: ExamData;
  onChange: (data: ExamData) => void;
  answersState: Record<number, any>;
  setAnswersState: any;
}

export default function EditableExamBuilder({
  value,
  onChange,
  answersState,
  setAnswersState,
}: Props) {
  const updatePart = (index: number, newPart: any) => {
    const newParts = [...value.parts];
    newParts[index] = newPart;
    onChange({ ...value, parts: newParts });
  };

  return (
    <div>
      {value.parts.map((part, i) => (
        <EditablePart
          key={part.id}
          part={part}
          partIndex={i}
          onChange={(p) => updatePart(i, p)}
          answersState={answersState}
          setAnswersState={setAnswersState}
        />
      ))}
    </div>
  );
}