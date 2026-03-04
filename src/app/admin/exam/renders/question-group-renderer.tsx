import { QuestionGroup } from "@/types/object";
import MediaRenderer from "./media-renderer";
import RichTextRenderer from "./richtext-renderer";

interface Props {
  group: QuestionGroup;
}

export default function QuestionGroupRenderer({ group }: Props) {
  return (
    <div style={{ marginBottom: 16, padding: 12, background: "#fafafa" }}>
      <RichTextRenderer content={group.groupInstruction} />
      <MediaRenderer media={group.mediaPlaceholders} />
    </div>
  );
}