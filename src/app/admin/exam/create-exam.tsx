"use client";

import { useCreateExam } from "@/queries/useExamQuery";
import { useParseExam } from "@/queries/useGeminiQuery";
import { useDeleteExamPdf, useUploadExamPdf } from "@/queries/useStorageQuery";
import { ExamData } from "@/types/object";
import { normalizeExamData } from "@/utils/normalizeExam";
import { UploadOutlined } from "@ant-design/icons";
import {
    Button,
    Card,
    Form,
    Input,
    message,
    Spin,
    Typography,
    Upload
} from "antd";
import { useState } from "react";
import EditableExamBuilder from "./editors/exam-editor";
// import { useExamSetList } from "@/hooks/useExamSet";

const { Title, Text } = Typography;


export default function CreateExam() {
    const [form] = Form.useForm();

    const [objectKey, setObjectKey] = useState<string | null>(null);
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [examState, setExamState] = useState<ExamData | null>(null);
    const [answersState, setAnswersState] = useState<
        Record<number, { correctAnswer: string[]; points: number }>
    >({});

    // const { data: examSetData } = useExamSetList({});
    const { mutateAsync: uploadPdf } = useUploadExamPdf();
    const { mutateAsync: deletePdf } = useDeleteExamPdf();
    const { mutateAsync: parseExam, isPending: isParsing } = useParseExam();
    const { mutateAsync: createExam, isPending: isSaving } = useCreateExam();



    // Upload PDF
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

    // Parse Exam
    const handleParse = async (values: any) => {
        if (!signedUrl) {
            message.warning("Vui lòng upload file trước");
            return;
        }

        try {
            setExamState(null);
            const res = await parseExam({ signedUrl });
            const normalized = normalizeExamData(res.data.data);
            localStorage.setItem("sampleData1", normalized);
            setExamState(normalized);
            setAnswersState({});
            message.success("Phân tích đề thành công");
        } catch {
            message.error("Phân tích đề thất bại");
        }
    };


    // Validate before save
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

    // Build Payload
    const buildPayload = () => {
        const values = form.getFieldsValue();

        return {
            title: values.title,
            examCode: values.examCode,
            examSetId: values.examSetId,
            objectKey,
            parsedJson: {
                parts: examState?.parts,
            },
            answers: Object.entries(answersState).map(
                ([questionNumber, value]) => ({
                    questionNumber: Number(questionNumber),
                    correctAnswer: value.correctAnswer,
                    points: value.points || 0,
                })
            ),
        };
    };


    // Save Exam
    const handleSave = async () => {
        if (!validateBeforeSave()) return;

        try {
            const payload = buildPayload();
            await createExam(payload);

            message.success("Tạo đề thi thành công");

            // Reset
            form.resetFields();
            setExamState(null);
            setAnswersState({});
            setObjectKey(null);
            setSignedUrl(null);
        } catch {
            message.error("Tạo đề thất bại");
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Card>
                <Title level={3}>Tạo đề thi</Title>

                <Form form={form} layout="vertical" onFinish={handleParse}>
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: "Nhập tiêu đề" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mã đề"
                        name="examCode"
                        rules={[{ required: true, message: "Nhập mã đề" }]}
                    >
                        <Input />
                    </Form.Item>

                    {/* <Form.Item
                        label="Bộ đề"
                        name="examSetId"
                        rules={[{ required: true, message: "Chọn bộ đề" }]}
                    >
                        <Select placeholder="Chọn bộ đề">
                            {examSetData?.data?.map((set: any) => (
                                <Select.Option key={set.id} value={set.id}>
                                    {set.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item> */}

                    <Form.Item label="File đề thi (PDF)" required>
                        <Upload
                            beforeUpload={handleUpload}
                            maxCount={1}
                            accept="application/pdf"
                        >
                            <Button icon={<UploadOutlined />}>
                                Chọn file PDF
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isParsing}
                        >
                            Phân tích đề
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {/* ================= Preview ================= */}
            <Card style={{ marginTop: 24 }}>
                <Title level={4}>Chỉnh sửa đề</Title>

                {isParsing && (
                    <div style={{ textAlign: "center", padding: 40 }}>
                        <Spin size="large" />
                        <div style={{ marginTop: 16 }}>
                            Đang phân tích đề bằng AI...
                        </div>
                    </div>
                )}

                {!isParsing && examState && (
                    <>
                        <EditableExamBuilder
                            value={examState}
                            onChange={setExamState}
                            answersState={answersState}
                            setAnswersState={setAnswersState}
                        />

                        <div style={{ marginTop: 24, textAlign: "right" }}>
                            <Button
                                type="primary"
                                loading={isSaving}
                                onClick={handleSave}
                            >
                                Lưu đề thi
                            </Button>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}