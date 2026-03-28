import { useDeleteFileCloudinary } from "@/queries/useCloudinaryQuery";
import { MediaPlaceholder, Part } from "@/shares/types/object";
import { BookOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import GroupEditor from "./group-editor";
import { renderMediaContent } from "./media-render";
import MediaUploader from "./media-uploader";
import QuestionEditor from "./question-editor";
import { PlusOutlined } from "@ant-design/icons";

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

    const handleRemoveMediaForPart = async (mIndex: number, placeholder: MediaPlaceholder) => {
        try {
            if (placeholder.publicId) {
                await deleteMedia.mutateAsync({
                    publicId: placeholder.publicId,
                    resourceType: placeholder.mediaType === 'audio' ? 'video' : 'image',
                });
            }
            const updated = part.mediaPlaceholders?.filter((_, i) => i !== mIndex);
            updatePart(partIndex, { ...part, mediaPlaceholders: updated });
            message.success("Xóa thành công");
        } catch (error) {
            message.error("Lỗi xóa file");
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
                    <div className="flex flex-wrap gap-3 mb-4">
                        {part.mediaPlaceholders?.filter(p => p.url).map((p, mIndex) =>
                            renderMediaContent(p, () => handleRemoveMediaForPart(mIndex, p))
                        )}
                    </div>

                    <MediaUploader
                        uploadMutation={uploadHook}
                        onUploadSuccess={(mediaData) => {
                            const newP: MediaPlaceholder = {
                                mediaType: mediaData.resourceType === 'video' ? 'audio' : 'image',
                                description: "Part media",
                                url: mediaData.url,
                                publicId: mediaData.publicId
                            };
                            updatePart(partIndex, {
                                ...part,
                                mediaPlaceholders: [...(part.mediaPlaceholders || []), newP]
                            });
                        }}
                    />
                </div>


                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center mb-2 ml-1">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest m-0">Nhóm câu hỏi</h4>
                        <Button 
                            type="dashed" 
                            size="small" 
                            icon={<PlusOutlined />} 
                            onClick={() => {
                                updatePart(partIndex, {
                                    ...part,
                                    questionGroups: [...(part.questionGroups || []), { groupInstruction: "", questionIndices: [], mediaPlaceholders: null }]
                                })
                            }}
                        >
                            Thêm nhóm
                        </Button>
                    </div>
                    {part.questionGroups?.map((group, gIndex) => {
                        const allOtherUsedIndices = part.questionGroups
                            .filter((_, i) => i !== gIndex)
                            .flatMap(g => g.questionIndices || []);
                            
                        return (
                            <GroupEditor
                                key={gIndex}
                                group={group}
                                allOtherUsedIndices={allOtherUsedIndices}
                                uploadHook={uploadHook}
                                onChange={(updated) => updateGroup(gIndex, updated)}
                                onDelete={() => {
                                    const newGroups = part.questionGroups.filter((_, i) => i !== gIndex);
                                    updatePart(partIndex, { ...part, questionGroups: newGroups });
                                }}
                            />
                        );
                    })}
                </div>

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