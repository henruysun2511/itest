import { useDeleteFileCloudinary } from "@/queries/useCloudinaryQuery";
import { MediaPlaceholder, QuestionGroup } from "@/shares/types/object";
import { DeleteOutlined, TagsOutlined } from "@ant-design/icons";
import { Button, Input, message, Popconfirm, Select } from "antd";
import { renderMediaContent } from "./media-render";
import MediaUploader from "./media-uploader";

interface Props {
    group: QuestionGroup;
    allOtherUsedIndices: number[];
    onChange: (g: QuestionGroup) => void;
    uploadHook: any;
    onDelete: () => void;
}

export default function GroupEditor({ group, allOtherUsedIndices, onChange, uploadHook, onDelete }: Props) {
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
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 w-full max-w-xl">
                    <div className="text-orange-600 font-bold uppercase text-xs tracking-wider flex items-center gap-2">
                        <TagsOutlined />
                        <span className="whitespace-nowrap">Nhóm câu:</span>
                    </div>
                    <Select
                        mode="tags"
                        className="flex-1"
                        placeholder="Nhập số câu (vd: 1, 2) rồi Enter"
                        value={group.questionIndices?.map(String) || []}
                        onChange={(val) => {
                            const newIndices = val.map(Number).filter(n => !isNaN(n)).sort((a,b) => a - b);
                            const conflicted = newIndices.filter(n => allOtherUsedIndices.includes(n));

                            if (conflicted.length > 0) {
                                message.error(`Câu ${conflicted.join(", ")} đã nằm trong nhóm khác!`);
                                const validIndices = newIndices.filter(n => !conflicted.includes(n));
                                onChange({ ...group, questionIndices: [...new Set(validIndices)] });
                            } else {
                                onChange({ ...group, questionIndices: [...new Set(newIndices)] });
                            }
                        }}
                    />
                </div>
                
                <Popconfirm
                    title="Xóa nhóm câu hỏi này?"
                    description="Bạn có chắc chắn muốn xóa nhóm này không?"
                    onConfirm={onDelete}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <Button danger type="text" icon={<DeleteOutlined />} size="small">
                        Xóa nhóm
                    </Button>
                </Popconfirm>
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