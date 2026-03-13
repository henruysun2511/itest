import { useDeleteFileCloudinary } from "@/queries/useCloudinaryQuery";
import { Part } from "@/types/object";
import { BookOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import GroupEditor from "./group-editor";
import { renderMediaContent } from "./media-render";
import MediaUploader from "./media-uploader";
import QuestionEditor from "./question-editor";

interface Props {
    part: Part;
    partIndex: number;
    updatePart: (index: number, updatedPart: Part) => void;
    answersState: any;
    setAnswersState: any;
    uploadHook: any;
    onDelete: any;
    hasEssay: any
}

export default function PartEditor({
    part,
    partIndex,
    updatePart,
    answersState,
    setAnswersState,
    uploadHook,
    onDelete,
    hasEssay
}: Props) {
    const deleteMedia = useDeleteFileCloudinary();

    const updateGroup = (gIndex: number, updatedGroup: any) => {
        const newGroups = [...(part.questionGroups || [])];
        newGroups[gIndex] = updatedGroup;
        updatePart(partIndex, { ...part, questionGroups: newGroups });
    };

    const handleRemoveMediaForPart = async (mediaItem: any) => {
        try {
            await deleteMedia.mutateAsync({
                publicId: mediaItem.publicId,
                resourceType: mediaItem.resourceType,
            });
            const updatedMedia = part.media?.filter(m => m.publicId !== mediaItem.publicId);
            updatePart(partIndex, { ...part, media: updatedMedia });
            message.success("Xóa file media của Part thành công");
        } catch (error) {
            message.error("Lỗi khi xóa file trên Cloudinary");
        }
    };

    return (
        <div className="mb-10 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden border-t-4 border-t-[var(--color-navy-main)]">
            <div className="p-6">
                {/* Header: Title & Delete */}
                <div className="flex justify-between items-start gap-4 mb-6">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 text-[var(--color-navy-deep)] font-bold text-xl uppercase tracking-tight">
                            <BookOutlined className="text-[var(--color-accent)]" />
                            Phần số {partIndex + 1}
                        </div>
                        <Input
                            className="text-lg font-semibold border-none bg-slate-50 hover:bg-slate-100 focus:bg-white transition-all rounded-lg px-4 py-2"
                            value={part.partTitle}
                            onChange={(e) => updatePart(partIndex, { ...part, partTitle: e.target.value })}
                            placeholder="Tiêu đề phần (vd: Listening Section 1)"
                        />
                    </div>
                    <Button
                        danger
                        type="text"
                        style={{ color: "white" }}
                        icon={<DeleteOutlined />}
                        onClick={onDelete}
                        className="hover:bg-red-50"
                    >
                        Xóa Part
                    </Button>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-2 ml-1">
                        <InfoCircleOutlined /> <span>Hướng dẫn làm bài</span>
                    </div>
                    <Input.TextArea
                        className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                        value={part.partDescription ?? ""}
                        onChange={(e) => updatePart(partIndex, { ...part, partDescription: e.target.value })}
                        placeholder="Mô tả hướng dẫn cho thí sinh..."
                        autoSize={{ minRows: 2 }}
                    />
                </div>

                {/* Part Media */}
                <div className="p-4 bg-[var(--color-bg-main)] rounded-xl border border-dashed border-slate-300 mb-8">
                    <div className="mb-3 font-medium text-[var(--color-navy-main)]">Media của Part (Audio/Hình ảnh chung)</div>
                    <MediaUploader
                        uploadMutation={uploadHook}
                        onUploadSuccess={(newMedia) =>
                            updatePart(partIndex, {
                                ...part,
                                media: [...(part.media || []), newMedia],
                            })
                        }
                    />
                    <div className="mt-4 flex flex-wrap gap-3">
                        {part.media?.map((m) =>
                            renderMediaContent(m, () => handleRemoveMediaForPart(m))
                        )}
                    </div>
                </div>

                {/* Groups Section */}
                {part.questionGroups.length > 0 && (
                    <div className="space-y-4 mb-8">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Nhóm câu hỏi</h4>
                        {part.questionGroups.map((group, gIndex) => (
                            <GroupEditor
                                key={gIndex}
                                group={group}
                                uploadHook={uploadHook}
                                onChange={(updated) => updateGroup(gIndex, updated)}
                            />
                        ))}
                    </div>
                )}

                {/* Questions Section */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <QuestionEditor
                        part={part}
                        partIndex={partIndex}
                        updatePart={updatePart}
                        answersState={answersState}
                        setAnswersState={setAnswersState}
                        uploadHook={uploadHook}
                        hasEssay={hasEssay}
                    />
                </div>
            </div>
        </div>
    );
}