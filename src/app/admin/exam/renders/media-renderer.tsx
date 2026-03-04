import { MediaPlaceholder } from "@/types/object";
import { Image } from "antd";

interface Props {
  media?: MediaPlaceholder[] | null;
}

export default function MediaRenderer({ media }: Props) {
  if (!media || media.length === 0) return null;

  return (
    <div style={{ marginBottom: 16 }}>
      {media.map((m, index) => {
        // TODO: map description → real URL
        const url = `/media/${encodeURIComponent(m.description)}`;

        if (m.mediaType === "image") {
          return (
            <Image
              key={index}
              src={url}
              alt={m.description}
              style={{ marginBottom: 8 }}
            />
          );
        }

        if (m.mediaType === "audio") {
          return <audio key={index} controls src={url} />;
        }

        if (m.mediaType === "video") {
          return <video key={index} controls src={url} width={400} />;
        }

        return null;
      })}
    </div>
  );
}