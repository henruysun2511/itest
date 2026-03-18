import { useDeleteFileCloudinary } from "@/queries/useCloudinaryQuery";
import { MediaPlaceholder, QuestionGroup } from "@/types/object";
import { TagsOutlined } from "@ant-design/icons";
import { Input, message } from "antd";
import { renderMediaContent } from "./media-render";
import MediaUploader from "./media-uploader";

interface Props {
    group: QuestionGroup;
    onChange: (g: QuestionGroup) => void;
    uploadHook: any;
}

export default function GroupEditor({ group, onChange, uploadHook }: Props) {
    const deleteMedia = useDeleteFileCloudinary();

    const handleRemoveMedia = async (mIndex: number, placeholder: MediaPlaceholder) => {
        try {
            if (placeholder.publicId) {
                await deleteMedia.mutateAsync({
                    publicId: placeholder.publicId,
                    resourceType: placeholder.mediaType === 'audio' ? 'video' : 'image',
                });
            }
            const updated = group.mediaPlaceholders?.filter((_, i) => i !== mIndex);
            onChange({ ...group, mediaPlaceholders: updated || [] });
            message.success("Xóa thành công");
        } catch (error) {
            console.error(error);
            message.error("Lỗi xóa file");
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
                <div className="flex flex-wrap gap-3">
                    {group.mediaPlaceholders?.map((p, pIndex) => 
                        renderMediaContent(p, () => handleRemoveMedia(pIndex, p))
                    )}
                </div>

                <MediaUploader
                    uploadMutation={uploadHook}
                    onUploadSuccess={(newMedia) => {
                        const newP: MediaPlaceholder = {
                            mediaType: newMedia.resourceType === 'video' ? 'audio' : 'image',
                            description: "Group file",
                            url: newMedia.url,
                            publicId: newMedia.publicId
                        };
                        onChange({
                            ...group,
                            mediaPlaceholders: [...(group.mediaPlaceholders || []), newP]
                        });
                    }}
                />
            </div>
        </div>
    );
}