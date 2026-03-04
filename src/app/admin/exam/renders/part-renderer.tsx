import { Part } from "@/types/object";
import { Card, Divider, Typography } from "antd";
import MediaRenderer from "./media-renderer";
import QuestionGroupRenderer from "./question-group-renderer";
import QuestionRenderer from "./question-renderer";
import RichTextRenderer from "./richtext-renderer";


const { Title, Paragraph } = Typography;

interface Props {
  part: Part;
}

export default function PartRenderer({ part }: Props) {
  const groupMap = new Map<number, any>();

  part.questionGroups.forEach((group) => {
    group.questionIndices.forEach((index) => {
      groupMap.set(index, group);
    });
  });

  return (
    <Card style={{ marginBottom: 32 }}>
      <h3>
        Part {part.partIndex}: {part.partTitle}
      </h3>

      {part.partDescription && (
        <RichTextRenderer content={part.partDescription} />
      )}

      <MediaRenderer media={part.mediaPlaceholders} />

      <Divider />

      {part.questions.map((q) => {
        const group = groupMap.get(q.questionIndex);

        return (
          <div key={q.questionIndex}>
            {group && <QuestionGroupRenderer group={group} />}
            <QuestionRenderer question={q} />
          </div>
        );
      })}
    </Card>
  );
}