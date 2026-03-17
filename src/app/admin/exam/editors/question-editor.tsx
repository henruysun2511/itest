import { useDeleteFileCloudinary } from "@/queries/useCloudinaryQuery";
import { QuestionType } from "@/types/enum"; // Đảm bảo bạn đã export enum này
import { Part, Question } from "@/types/object";
import {
    DeleteOutlined,
    FileTextOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
    SettingOutlined
} from "@ant-design/icons";
import { Button, Input, message, Select, Space, Tag } from "antd";
import { renderMediaContent } from "./media-render";
import MediaUploader from "./media-uploader";

interface Props {
    part: Part;
    partIndex: number;
    updatePart: (index: number, updatedPart: Part) => void;
    answersState: any;
    setAnswersState: any;
    uploadHook: any;
    hasEssay?: boolean;
}

export default function QuestionEditor({
    part,
    partIndex,
    updatePart,
    answersState,
    setAnswersState,
    uploadHook,
}: Props) {
    const reindex = (questions: any[]) =>
        questions.map((q, i) => ({ ...q, questionIndex: i + 1 }));

    const deleteMedia = useDeleteFileCloudinary();

    // Hàm cập nhật câu hỏi
    const updateQuestion = (index: number, updated: any) => {
        const newQuestions = [...part.questions];
        newQuestions[index] = updated;
        updatePart(partIndex, { ...part, questions: newQuestions });
    };

    // Hàm thêm câu hỏi mới
    const addQuestion = (index: number, type: string) => {
        const newQuestion: Question = {
            questionIndex: index + 1,
            questionText: "Nội dung câu hỏi mới...",
            questionType: type.toUpperCase(), // Luôn lưu in hoa
            options: type === 'essay' ? null : [
                { label: "A", text: "Lựa chọn 1" },
                { label: "B", text: "Lựa chọn 2" }
            ],
            mediaPlaceholders: [],
            media: []
        };
        const newQuestions = [...part.questions, newQuestion];
        updatePart(partIndex, { ...part, questions: reindex(newQuestions) });
    };

    const handleRemoveMedia = async (qIndex: number, mIndex: number, mediaItem: any) => {
        try {
            await deleteMedia.mutateAsync({
                publicId: mediaItem.publicId,
                resourceType: mediaItem.resourceType,
            });
            const q = part.questions[qIndex];
            const updatedMedia = q.media?.filter((_, i) => i !== mIndex);
            updateQuestion(qIndex, { ...q, media: updatedMedia });
            message.success("Xóa media thành công");
        } catch (error) {
            message.error("Lỗi khi xóa file");
        }
    };

    return (
        <div className="space-y-6">
            {part.questions.map((q, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative group">
                    <div className="flex justify-between items-start mb-4">
                        <Space className="flex-wrap">
                            <Tag color="blue" className="rounded-lg font-bold px-3 py-1">
                                CÂU {q.questionIndex}
                            </Tag>
                            
                            {/* Thẻ Select để đổi loại câu hỏi */}
                            <Select
                                value={q.questionType?.toUpperCase()} // Hiển thị in hoa
                                onChange={(value) => updateQuestion(index, { ...q, questionType: value })}
                                className="w-48"
                                size="small"
                                suffixIcon={<SettingOutlined />}
                                options={[
                                    { value: QuestionType.SINGLE_CHOICE, label: 'Trắc nghiệm 1 đáp án' },
                                    { value: QuestionType.MULTIPLE_CHOICE, label: 'Trắc nghiệm nhiều đáp án' },
                                    { value: QuestionType.TRUE_FALSE, label: 'Đúng / Sai' },
                                    { value: QuestionType.FILL_IN_THE_BLANK, label: 'Điền vào chỗ trống' },
                                    { value: QuestionType.ESSAY, label: 'Tự luận' },
                                ]}
                            />
                        </Space>

                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                const newQuestions = part.questions.filter((_, i) => i !== index);
                                updatePart(partIndex, { ...part, questions: reindex(newQuestions) });
                            }}
                        />
                    </div>

                    {/* Question Text Editor */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase">
                            <QuestionCircleOutlined /> Nội dung câu hỏi
                        </div>
                        <Input.TextArea
                            value={q.questionText}
                            onChange={(e) => updateQuestion(index, { ...q, questionText: e.target.value })}
                            placeholder="Nhập nội dung câu hỏi..."
                            autoSize={{ minRows: 2 }}
                            className="rounded-lg border-slate-200"
                        />
                    </div>

                    {/* Options (Chỉ hiện nếu không phải Essay) */}
                    {q.questionType?.toUpperCase() !== 'ESSAY' && q.options && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            {q.options.map((opt, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <Tag className="m-0 w-8 text-center font-bold bg-white">{opt.label}</Tag>
                                    <Input
                                        value={opt.text}
                                        onChange={(e) => {
                                            const newOptions = [...(q.options || [])];
                                            newOptions[optIndex].text = e.target.value;
                                            updateQuestion(index, { ...q, options: newOptions });
                                        }}
                                        variant="borderless"
                                        className="p-0"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Media Section */}
                    <div className="pt-4 border-t border-slate-50 flex flex-col gap-3">
                        <div className="flex flex-wrap gap-2">
                            {q.media?.map((m, mIndex) =>
                                renderMediaContent(m, () => handleRemoveMedia(index, mIndex, m))
                            )}
                        </div>
                        <div className="max-w-[150px]">
                            <MediaUploader
                                uploadMutation={uploadHook}
                                onUploadSuccess={(mediaData) =>
                                    updateQuestion(index, {
                                        ...q,
                                        media: [...(q.media || []), mediaData],
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
            ))}

            {/* Bottom Actions */}
            <div className="flex gap-4">
                <Button 
                    type="dashed" 
                    block 
                    size="large"
                    icon={<PlusOutlined />}
                    className="h-16 rounded-xl border-2 border-dashed flex-1"
                    onClick={() => addQuestion(part.questions.length, QuestionType.SINGLE_CHOICE)}
                >
                    Thêm câu hỏi Trắc nghiệm
                </Button>
                <Button 
                    type="dashed" 
                    block 
                    size="large"
                    icon={<FileTextOutlined />}
                    className="h-16 rounded-xl border-2 border-dashed flex-1 border-orange-200 text-orange-600 hover:text-orange-700 hover:border-orange-400"
                    onClick={() => addQuestion(part.questions.length, QuestionType.ESSAY)}
                >
                    Thêm câu hỏi Tự luận
                </Button>
            </div>
        </div>
    );
}