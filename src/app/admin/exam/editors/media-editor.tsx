import { useDeleteFileCloudinary, useUploadFileCloudinary } from "@/queries/useCloudinaryQuery";
import { MediaItem } from "@/types/object";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Image, Upload } from "antd";

interface Props {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
}

export default function MediaManager({
    media,
    onChange,
}: Props) {
    const { mutateAsync: upload } =
        useUploadFileCloudinary();
    const { mutateAsync: deleteFile } =
        useDeleteFileCloudinary();

    const handleUpload = async (file: File) => {
        const res = await upload(file);

        const uploaded = res.data.data; 

        const newItem = {
            mediaType: file.type.includes("image")
                ? "image"
                : file.type.includes("audio")
                    ? "audio"
                    : "video",
            publicId: uploaded.public_id,
            url: uploaded.url,
        };

        onChange([...media, newItem]);
        return false;
    };

    const handleDelete = async (item: any) => {
        await deleteFile({
            publicId: item.publicId,
            resourceType: item.mediaType,
        });

        onChange(media.filter((m: any) => m.publicId !== item.publicId));
    };

    return (
        <div style={{ marginTop: 12 }}>
            {media.map((m: any) => (
                <div key={m.publicId}>
                    {m.mediaType === "image" && (
                        <Image src={m.url} width={100} />
                    )}
                    <Button
                        danger
                        size="small"
                        onClick={() => handleDelete(m)}
                    >
                        Xoá
                    </Button>
                </div>
            ))}

            <Upload
                beforeUpload={handleUpload}
                showUploadList={false}
            >
                <Button icon={<UploadOutlined />}>
                    Thêm media
                </Button>
            </Upload>
        </div>
    );
}