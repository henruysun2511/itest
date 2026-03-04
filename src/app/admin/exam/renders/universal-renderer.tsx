import { normalizeExamData } from "@/utils/normalizeExam";
import PartRenderer from "./part-renderer";

interface Props {
  data: any;
}

export default function UniversalExamRenderer({ data }: any) {
  const exam = normalizeExamData(data);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {exam.parts.map((part) => (
        <PartRenderer key={part.partIndex} part={part} />
      ))}
    </div>
  );
}