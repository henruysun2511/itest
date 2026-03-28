import { useDeleteFileCloudinary } from "@/queries/useCloudinaryQuery";
import { QuestionType } from "@/shares/constants/type.enum";
import { MediaPlaceholder, Part, Question } from "@/shares/types/object";
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
            questionIndex: 0, // Sẽ được reindex ngay sau đó
            questionText: "Nội dung câu hỏi mới...",
            questionType: type.toUpperCase(),
            options: type === 'essay' ? null : [
                { label: "A", text: "Lựa chọn 1" },
                { label: "B", text: "Lựa chọn 2" },
                { label: "C", text: "Lựa chọn 3" },
                { label: "D", text: "Lựa chọn 4" }
            ],
            mediaPlaceholders: [],
        };

        const newQuestions = [...part.questions];
        // Chèn vào vị trí index (phía trên câu hiện tại)
        newQuestions.splice(index, 0, newQuestion);

        // Tự động dịch các questionIndices ở các group nếu cần
        const insertedIndex = index + 1; // Vị trí chèn (số thứ tự thực tế 1-based)
        const newGroups = (part.questionGroups || []).map(g => {
            const newIndices = g.questionIndices?.map(idx => idx >= insertedIndex ? idx + 1 : idx);
            return { ...g, questionIndices: newIndices || [] };
        });

        // Cập nhật lại Part với danh sách đã reindex (để số thứ tự CÂU 1, 2, 3... luôn đúng)
        updatePart(partIndex, { 
            ...part, 
            questions: reindex(newQuestions),
            questionGroups: newGroups 
        });
    };

    const removeQuestion = (index: number) => {
        const deletedQuestionIndex = part.questions[index].questionIndex;
        const newQuestions = part.questions.filter((_, i) => i !== index);
        
        // Tự động loại bỏ và dịch chuyển questionIndices trong các group
        const newGroups = (part.questionGroups || []).map(g => {
            const newIndices = g.questionIndices
                ?.filter(idx => idx !== deletedQuestionIndex)
                .map(idx => idx > deletedQuestionIndex ? idx - 1 : idx);
            return { ...g, questionIndices: newIndices || [] };
        });

        updatePart(partIndex, { 
            ...part, 
            questions: reindex(newQuestions),
            questionGroups: newGroups
        });
    };

    const handleRemoveMedia = async (qIndex: number, mIndex: number, placeholder: MediaPlaceholder) => {
        try {
            if (placeholder.publicId) {
                await deleteMedia.mutateAsync({
                    publicId: placeholder.publicId,
                    resourceType: placeholder.mediaType === 'audio' ? 'video' : 'image',
                });
            }
            const q = part.questions[qIndex];
            // Lọc bỏ placeholder dựa trên index
            const updatedPlaceholders = q.mediaPlaceholders?.filter((_, i) => i !== mIndex);
            updateQuestion(qIndex, { ...q, mediaPlaceholders: updatedPlaceholders });
            message.success("Xóa file thành công");
        } catch (error) {
            message.error("Lỗi khi xóa file");
        }
    };

    return (
        <div className="space-y-6">
            {part.questions.map((q, index) => {
                const currentAns = answersState[q.questionIndex] || { correctAnswer: [], points: 0 };
                const isMultiple = q.questionType.toUpperCase() === QuestionType.MULTIPLE_CHOICE;
                const isEssay = q.questionType.toUpperCase() === QuestionType.ESSAY;
                return (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative group">
                        <div className="flex justify-between items-start mb-4">
                            <Space className="flex-wrap">
                                <Tag color="blue" className="rounded-lg font-bold px-3 py-1">
                                    CÂU {q.questionIndex}
                                </Tag>

                                {/* Thẻ Select để đổi loại câu hỏi */}
                                <Select
                                    value={q.questionType?.toUpperCase()}
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

                            <div className="flex gap-2"> {/* Thêm div bọc để layout đẹp hơn */}
                                <Button
                                    icon={<PlusOutlined />}
                                    size="small"
                                    // Truyền index hiện tại vào để thêm vào ngay trên vị trí này
                                    onClick={() => addQuestion(index, QuestionType.SINGLE_CHOICE)}
                                    className="text-blue-500 border-blue-200"
                                >
                                    Thêm câu phía trên
                                </Button>

                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeQuestion(index)}
                                />
                            </div>
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
                        {q.questionType?.toUpperCase() !== QuestionType.ESSAY && q.options && (
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
                                {q.mediaPlaceholders?.map((m, mIndex) =>
                                    renderMediaContent(m, () => handleRemoveMedia(index, mIndex, m))
                                )}
                            </div>
                            <div className="max-w-[150px]">
                                <MediaUploader
                                    uploadMutation={uploadHook}
                                    onUploadSuccess={(mediaData) => {
                                        // Tạo object theo interface MediaPlaceholder
                                        const newPlaceholder: MediaPlaceholder = {
                                            mediaType: mediaData.resourceType === 'video' ? 'audio' : 'image',
                                            description: "Uploaded file",
                                            url: mediaData.url,
                                            publicId: mediaData.publicId
                                        };

                                        updateQuestion(index, {
                                            ...q,
                                            mediaPlaceholders: [...(q.mediaPlaceholders || []), newPlaceholder]
                                        });
                                    }}
                                />
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex flex-col md:flex-row items-end gap-4">

                                {/* Cột Nhập Đáp án */}
                                <div className="flex-1 w-full">
                                    <div className="text-[10px] font-bold text-blue-600 uppercase mb-1 ml-1">
                                        {isEssay ? "Gợi ý / Từ khóa đáp án" : "Đáp án đúng"}
                                    </div>

                                    {isEssay || q.questionType === QuestionType.FILL_IN_THE_BLANK ? (
                                        <Input
                                            placeholder="Nhập nội dung đáp án..."
                                            value={currentAns.correctAnswer?.join(", ")}
                                            onChange={(e) => setAnswersState({
                                                ...answersState,
                                                [q.questionIndex]: { ...currentAns, correctAnswer: [e.target.value] }
                                            })}
                                            className="rounded-md"
                                        />
                                    ) : (
                                        <Select
                                            mode={isMultiple ? "multiple" : undefined}
                                            placeholder={isMultiple ? "Chọn các đáp án đúng" : "Chọn một đáp án đúng"}
                                            className="w-full"
                                            value={isMultiple ? currentAns.correctAnswer : currentAns.correctAnswer?.[0]}
                                            onChange={(val) => {
                                                const finalVal = Array.isArray(val) ? val : [val];
                                                setAnswersState({
                                                    ...answersState,
                                                    [q.questionIndex]: { ...currentAns, correctAnswer: finalVal }
                                                });
                                            }}
                                            // Lấy options từ danh sách các lựa chọn của câu hỏi (A, B, C, D...)
                                            options={q.options?.map(opt => ({
                                                label: `${opt.label}. ${opt.text}`,
                                                value: opt.label
                                            }))}
                                        />
                                    )}
                                </div>

                                {/* Cột Nhập Điểm */}
                                <div className="w-full md:w-28">
                                    <div className="text-[10px] font-bold text-blue-600 uppercase mb-1 ml-1">Điểm</div>
                                    <Input
                                        type="number"
                                        min={0}
                                        step={0.25}
                                        placeholder="0.0"
                                        value={currentAns.points}
                                        onChange={(e) => setAnswersState({
                                            ...answersState,
                                            [q.questionIndex]: { ...currentAns, points: Number(e.target.value) }
                                        })}
                                        className="rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            )}

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