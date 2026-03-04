import { QuestionGroup } from "@/types/object";
import { Card, Input } from "antd";

interface Props {
  group: QuestionGroup;
  onChange: (g: QuestionGroup) => void;
}

export default function GroupEditor({
  group,
  onChange,
}: Props) {
  return (
    <Card
      size="small"
      title={`Group: ${group.questionIndices.join(", ")}`}
      style={{ marginBottom: 12 }}
    >
      <Input.TextArea
        value={group.groupInstruction}
        onChange={(e) =>
          onChange({
            ...group,
            groupInstruction: e.target.value,
          })
        }
      />
    </Card>
  );
}