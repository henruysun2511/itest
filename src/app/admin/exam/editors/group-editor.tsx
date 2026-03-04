import { useDeleteFileCloudinary } from "@/queries/useCloudinaryQuery";
import { QuestionGroup } from "@/types/object";
import { PaperClipOutlined, TagsOutlined } from "@ant-design/icons";
import { Input, Tag, message } from "antd";
import MediaUploader from "./media-uploader";

interface Props {
    group: QuestionGroup;
    onChange: (g: QuestionGroup) => void;
    uploadHook: any; 
}

export default function GroupEditor({ group, onChange, uploadHook }: Props) {
    const deleteMedia = useDeleteFileCloudinary();

    const handleRemoveMedia = async (mediaItem: any) => {
        try {
            await deleteMedia.mutateAsync({
                publicId: mediaItem.publicId,
                resourceType: mediaItem.resourceType,
            });
            const updatedMedia = group.media?.filter((m) => m.publicId !== mediaItem.publicId);
            onChange({ ...group, media: updatedMedia });
            message.success("Xóa media nhóm thành công");
        } catch (error) {
            message.error("Lỗi khi xóa file");
        }
    };

    return (
        <div className="bg-white border-2 border-orange-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-orange-600 font-bold uppercase text-xs tracking-wider">
                <TagsOutlined /> 
                <span>Nhóm câu: {group.questionIndices?.join(", ")}</span>
            </div>

            <Input.TextArea
                placeholder="Hướng dẫn hoặc văn bản đọc hiểu cho nhóm câu hỏi này..."
                value={group.groupInstruction}
                onChange={(e) => onChange({ ...group, groupInstruction: e.target.value })}
                className="rounded-lg border-slate-200 mb-4"
                autoSize={{ minRows: 3 }}
            />

            <div className="flex flex-col gap-3 pt-3 border-t border-orange-50">
                <div className="flex flex-wrap gap-2">
                    {group.media?.map((m) => (
                        <Tag
                            key={m.publicId}
                            closable
                            onClose={(e) => {
                                e.preventDefault();
                                handleRemoveMedia(m);
                            }}
                            className="flex items-center gap-1 px-3 py-1 rounded-full border-orange-200 bg-orange-50 text-orange-700 font-medium"
                        >
                            <PaperClipOutlined /> {m.resourceType === 'image' ? 'Ảnh' : 'Audio'}: {m.publicId.slice(-8)}
                        </Tag>
                    ))}
                </div>

                <div className="max-w-xs">
                    <MediaUploader
                        uploadMutation={uploadHook}
                        onUploadSuccess={(newMedia) =>
                            onChange({
                                ...group,
                                media: [...(group.media || []), newMedia],
                            })
                        }
                    />
                </div>
            </div>
        </div>
    );
}