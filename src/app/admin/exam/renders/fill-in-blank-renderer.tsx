import { Input } from "antd";

interface Props {
  text: string;
}

export default function FillInBlankRenderer({ text }: Props) {
  const parts = text.split(/(\[BLANK_\d+\])/g);

  return (
    <div>
      {parts.map((part, index) => {
        if (/\[BLANK_\d+\]/.test(part)) {
          return (
            <Input
              key={index}
              style={{ width: 120, margin: "0 6px" }}
            />
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
}