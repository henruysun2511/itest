import { useDeleteFileCloudinary } from "@/queries/useCloudinaryQuery";
import { DeleteFileCloudinaryBody } from "@/types/body";
import { Part, Question } from "@/types/object";
import { DeleteOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import { renderMediaContent } from "./media-render";
import MediaUploader from "./media-uploader";

interface Props {
    part: Part;
    partIndex: number;
    updatePart: (index: number, updatedPart: Part) => void;
    answersState: any;
    setAnswersState: any;
    uploadHook: any;
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

    const updateQuestion = (index: number, updated: any) => {
        const newQuestions = [...part.questions];
        newQuestions[index] = updated;
        updatePart(partIndex, { ...part, questions: newQuestions });
    };

    const handleRemoveMedia = async (qIndex: number, mediaItem: DeleteFileCloudinaryBody) => {
        try {
            await deleteMedia.mutateAsync({
                publicId: mediaItem.publicId,
                resourceType: mediaItem.resourceType,
            });

            const q = part.questions[qIndex];
            const newMedia = q.media?.filter(m => m.publicId !== mediaItem.publicId);
            updateQuestion(qIndex, { ...q, media: newMedia });

            message.success("Xóa file thành công");
        } catch (error) {
            message.error("Lỗi khi xóa file trên Cloudinary");
        }
    };

    const addQuestion = (position: number) => {
        const newQ: Question = {
            questionIndex: 0,
            questionText: "",
            questionType: "multiple_choice",
            options: [
                { label: "A", text: "" },
                { label: "B", text: "" },
                { label: "C", text: "" },
                { label: "D", text: "" },
            ],
            media: [],
            mediaPlaceholders: [],
        };

        let newQuestions = [...part.questions];
        newQuestions.splice(position, 0, newQ);
        newQuestions = reindex(newQuestions); 
        updatePart(partIndex, { ...part, questions: newQuestions });
    };

    const deleteQuestion = (index: number) => {
        let newQuestions = part.questions.filter((_, i) => i !== index);
        newQuestions = reindex(newQuestions);
        updatePart(partIndex, { ...part, questions: newQuestions });
    };

    return (
        <div className="space-y-6">
            {part.questions.map((q, index) => (
                <div 
                    key={`${partIndex}-${q.questionIndex}`} 
                    className="relative group bg-[var(--color-bg-card)] border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                    {/* Header: Chỉ số câu hỏi và Action Buttons */}
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-navy-main)] text-white font-bold text-sm">
                                {q.questionIndex}
                            </span>
                            <h3 className="text-lg font-semibold text-[var(--color-navy-deep)] m-0">
                                Câu hỏi {q.questionIndex}
                            </h3>
                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                                icon={<PlusOutlined />} 
                                size="small" 
                                className="flex items-center border-slate-300 text-slate-600"
                                onClick={() => addQuestion(index)}
                            >
                                Thêm phía trên
                            </Button>
                            <Button 
                                danger 
                                icon={<DeleteOutlined />} 
                                size="small" 
                                style={{color: "white"}}
                                className="flex items-cente"
                                onClick={() => deleteQuestion(index)}
                            >
                                Xóa
                            </Button>
                        </div>
                    </div>

                    {/* Câu hỏi Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">
                            Nội dung câu hỏi
                        </label>
                        <Input.TextArea
                            className="rounded-lg border-slate-200 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                            value={q.questionText}
                            onChange={(e) =>
                                updateQuestion(index, { ...q, questionText: e.target.value })
                            }
                            placeholder={`Ví dụ: What is the main idea of the passage?`}
                            autoSize={{ minRows: 2 }}
                        />
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {q.options?.map((opt, optIndex) => (
                            <div key={optIndex} className="flex items-center">
                                <Input
                                    addonBefore={<span className="font-bold text-[var(--color-navy-main)]">{opt.label}</span>}
                                    value={opt.text}
                                    className="custom-input-addon"
                                    onChange={(e) => {
                                        const newOptions = [...(q.options || [])];
                                        newOptions[optIndex] = { ...newOptions[optIndex], text: e.target.value };
                                        updateQuestion(index, { ...q, options: newOptions });
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Meta Info: Đáp án & Điểm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg mb-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Đáp án đúng</label>
                            <Input
                                placeholder="A, B"
                                value={answersState[q.questionIndex]?.correctAnswer?.join(",")}
                                className="rounded-md"
                                onChange={(e) =>
                                    setAnswersState({
                                        ...answersState,
                                        [q.questionIndex]: {
                                            ...answersState[q.questionIndex],
                                            correctAnswer: e.target.value.split(",").map(s => s.trim().toUpperCase()),
                                        },
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Điểm số</label>
                            <Input
                                type="number"
                                placeholder="0.0"
                                value={answersState[q.questionIndex]?.points}
                                className="rounded-md"
                                onChange={(e) =>
                                    setAnswersState({
                                        ...answersState,
                                        [q.questionIndex]: {
                                            ...answersState[q.questionIndex],
                                            points: Number(e.target.value),
                                        },
                                    })
                                }
                            />
                        </div>
                    </div>

                    {/* Media Section */}
                    <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                        <div className="flex items-center gap-2 mb-3 text-slate-500 italic text-sm">
                            <QuestionCircleOutlined /> Tài liệu đính kèm (Ảnh/Audio)
                        </div>
                        
                        <div className="flex flex-wrap gap-3 mb-3">
                            {q.media?.map((m) =>
                                renderMediaContent(m, () => handleRemoveMedia(index, m))
                            )}
                        </div>

                        <div className="max-w-xs">
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

            <Button 
                type="dashed" 
                block 
                size="large"
                icon={<PlusOutlined />}
                className="h-16 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all bg-white"
                onClick={() => addQuestion(part.questions.length)}
            >
                Thêm câu hỏi vào cuối Part {partIndex + 1}
            </Button>
        </div>
    );
}