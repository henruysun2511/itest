"use client";

import { useUploadFileCloudinary } from "@/queries/useCloudinaryQuery";
import { useCreateExam } from "@/queries/useExamQuery";
import { useExamSetList } from "@/queries/useExamSetQuery";
import { useParseExam } from "@/queries/useGeminiQuery";
import { useDeleteExamPdf, useUploadExamPdf } from "@/queries/useStorageQuery";
import { ExamBody } from "@/types/body";
import { ExamData } from "@/types/object";
import { normalizeExamData } from "@/utils/normalizeExam";
import {
    EditOutlined,
    FilePdfOutlined,
    RobotOutlined,
    SaveOutlined
} from "@ant-design/icons";
import {
    Button,
    Card,
    Form,
    Input,
    message,
    Select,
    Spin,
    Upload
} from "antd";
import { useEffect, useState } from "react";
import EditableExam from "./editors/exam-editor";


export default function CreateExam() {
    const [form] = Form.useForm();
    const [objectKey, setObjectKey] = useState<string | null>(null);
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [examState, setExamState] = useState<ExamData | null>(null);
    const [answersState, setAnswersState] = useState<
        Record<number, { correctAnswer: string[]; points: number }>
    >({});

    const { data: examSetData } = useExamSetList();
    const { mutateAsync: uploadPdf } = useUploadExamPdf();
    const { mutateAsync: deletePdf } = useDeleteExamPdf();
    const { mutateAsync: parseExam, isPending: isParsing } = useParseExam();
    const { mutateAsync: createExam, isPending: isSaving } = useCreateExam();

    const uploadMedia = useUploadFileCloudinary();

    const handleUpload = async (file: File) => {
        if (file.type !== "application/pdf") {
            message.error("Chỉ được upload file PDF");
            return Upload.LIST_IGNORE;
        }

        try {
            if (objectKey) {
                await deletePdf({ filePath: objectKey });
            }
            const res = await uploadPdf(file);
            const data = res.data.data;
            setObjectKey(data.objectKey);
            setSignedUrl(data.signedUrl);
            message.success("Upload thành công");
        } catch {
            message.error("Upload thất bại");
        }
        return false;
    };

    const handleParse = async (values: any) => {
        if (!signedUrl) {
            message.warning("Vui lòng upload file trước");
            return;
        }

        try {
            setExamState(null);
            const res = await parseExam({ signedUrl });
            const rawData = res.data.data;
            const normalized = normalizeExamData(rawData);
            setExamState(normalized);
            sessionStorage.setItem("sampleData1", JSON.stringify(normalized));
            setAnswersState({});
            message.success("AI đã phân tích xong nội dung");
        } catch (error) {
            message.error("Phân tích đề thất bại");
        }
    };

    const validateBeforeSave = () => {
        if (!examState) return false;
        for (const part of examState.parts) {
            for (const q of part.questions) {
                const ans = answersState[q.questionIndex];
                if (!ans || !ans.correctAnswer?.length) {
                    message.error(`Chưa nhập đáp án câu ${q.questionIndex}`);
                    return false;
                }
            }
        }
        return true;
    };

    const buildPayload = (objectKey: string): ExamBody => {
        const values = form.getFieldsValue();
        return {
            title: values.title,
            examCode: values.examCode,
            examSetId: values.examSetId,
            objectKey,
            parsedJson: { parts: examState?.parts || [] },
            answers: Object.entries(answersState).map(([questionNumber, value]: any) => ({
                questionNumber: Number(questionNumber),
                correctAnswer: value.correctAnswer,
                points: value.points || 0,
            })),
        };
    };

    const handleSave = async () => {
        if (!validateBeforeSave()) return;
        try {
            if (!objectKey) {
                message.error("Vui lòng upload file PDF trước");
                return;
            }
            const payload = buildPayload(objectKey);
            await createExam(payload);
            message.success("Tạo đề thi thành công");
            form.resetFields();
            setExamState(null);
            setAnswersState({});
            setObjectKey(null);
            setSignedUrl(null);
        } catch {
            message.error("Tạo đề thất bại");
        }
    };

    useEffect(() => {
        const saved = sessionStorage.getItem("sampleData1");
        if (saved) {
            try {
                setExamState(JSON.parse(saved));
            } catch (e) {
                console.error("Lỗi parse dữ liệu cũ", e);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-[var(--color-bg-main)] md:p-8">
            <div className="w-full space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border-l-8 border-[var(--color-accent)]">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-navy-deep)] m-0">Tạo đề thi mới</h1>
                        <p className="text-slate-500 mt-1">Upload PDF và để AI hỗ trợ bạn phân tích câu hỏi</p>
                    </div>
                    {examState && (
                        <Button
                            type="primary"
                            size="large"
                            icon={<SaveOutlined />}
                            loading={isSaving}
                            onClick={handleSave}
                            className="bg-[var(--color-navy-main)] hover:scale-105 transition-transform"
                        >
                            Lưu toàn bộ đề thi
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form & Config */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="rounded-2xl shadow-sm border-none overflow-hidden">
                            <div className="bg-[var(--color-navy-main)] p-4 -m-6 mb-6">
                                <h3 className="text-white m-0 flex items-center gap-2">
                                    <EditOutlined className="text-[var(--color-accent)]" />
                                    Thông tin cơ bản
                                </h3>
                            </div>

                            <Form form={form} layout="vertical" onFinish={handleParse} className="mt-4">
                                <Form.Item
                                    label={<span className="font-semibold">Tiêu đề đề thi</span>}
                                    name="title"
                                    rules={[{ required: true, message: "Nhập tiêu đề" }]}
                                >
                                    <Input placeholder="Ví dụ: Đề thi THPT Quốc Gia 2024" className="rounded-lg py-2" />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-semibold">Mã đề</span>}
                                    name="examCode"
                                    rules={[{ required: true, message: "Nhập mã đề" }]}
                                >
                                    <Input placeholder="Ví dụ: ENG-101" className="rounded-lg py-2" />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-semibold">Bộ đề thi</span>}
                                    name="examSetId"
                                    rules={[{ required: true, message: "Chọn bộ đề" }]}
                                >
                                    <Select placeholder="Chọn bộ đề" className="h-10">
                                        {examSetData?.data?.map((set: any) => (
                                            <Select.Option key={set.examSetId} value={set.examSetId}>
                                                {set.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 mb-6">
                                    <label className="block mb-2 font-semibold text-sm">File đề thi (PDF)</label>
                                    <Upload
                                        beforeUpload={handleUpload}
                                        maxCount={1}
                                        accept="application/pdf"
                                        className="w-full"
                                    >
                                        <Button icon={<FilePdfOutlined />} block className="rounded-lg h-12 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-orange-50">
                                            Chọn file PDF
                                        </Button>
                                    </Upload>
                                    {signedUrl && (
                                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                            ✓ Đã sẵn sàng để phân tích
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    size="large"
                                    loading={isParsing}
                                    icon={<RobotOutlined />}
                                    className="bg-[var(--color-navy-main)] h-12 rounded-xl text-lg"
                                >
                                    Phân tích bằng AI
                                </Button>
                            </Form>
                        </Card>
                    </div>

                    {/* Right Column: Editor Area */}
                    <div className="lg:col-span-2">
                        {isParsing ? (
                            <Card className="h-full flex items-center justify-center rounded-2xl border-none min-h-[400px]">
                                <div className="text-center">
                                    <Spin size="large" />
                                    <div className="mt-6 space-y-2">
                                        <p className="text-lg font-medium text-[var(--color-navy-main)]">Đang quét nội dung bằng AI...</p>
                                        <p className="text-slate-400">Quá trình này có thể mất 10-30 giây tùy độ dài đề thi</p>
                                    </div>
                                </div>
                            </Card>
                        ) : examState ? (
                            <div className="animate-in fade-in duration-700">
                                <div className="mb-4 flex items-center gap-2 px-2">
                                    <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-sm font-medium text-slate-500 italic">Chế độ chỉnh sửa đang bật</span>
                                </div>
                                <EditableExam
                                    value={examState}
                                    onChange={setExamState}
                                    answersState={answersState}
                                    setAnswersState={setAnswersState}
                                    uploadHook={uploadMedia}
                                />
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center min-h-[400px]">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <FilePdfOutlined className="text-3xl text-slate-300" />
                                </div>
                                <h3 className="text-slate-400 font-medium">Chưa có dữ liệu đề thi</h3>
                                <p className="text-slate-300 max-w-xs">Điền thông tin bên trái và upload PDF để bắt đầu chỉnh sửa nội dung</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Action Button for Mobile */}
            {examState && (
                <div className="fixed bottom-6 right-6 lg:hidden">
                    <Button
                        type="primary"
                        size="large"
                        shape="round"
                        icon={<SaveOutlined />}
                        loading={isSaving}
                        onClick={handleSave}
                        className="shadow-2xl h-14 px-8 bg-[var(--color-navy-main)]"
                    >
                        Lưu Đề
                    </Button>
                </div>
            )}
        </div>
    );
}