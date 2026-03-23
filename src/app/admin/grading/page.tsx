"use client";

import { useToast } from "@/hooks/useToast";
import { useExamSessionList } from "@/queries/useExamSessionQuery";
import { useAssignGraders } from "@/queries/useResultGradingQuery";
import { useTeacherList } from "@/queries/useTeacherQuery";
import { ExamSessionSortBy, SortOrder } from "@/shares/constants/sort.enum";
import { ExamSession, Teacher } from "@/shares/types/object";
import { handleError } from "@/shares/utils/error";
import { SaveOutlined } from "@ant-design/icons";
import { mapRoleToApi, roleOptions } from "./constants";
import { AssignFormValue } from "./types";
import { Button, Card, Form, Input, Select, Space, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";

const { Title, Text } = Typography;

export default function GradingPage() {
    const [form] = Form.useForm<AssignFormValue>();
    const toast = useToast();
    const { mutate, isPending } = useAssignGraders();
    const { data: teachersData, isLoading: loadingTeachers } = useTeacherList();
    const {
        data: examSessionsData,
        isLoading: loadingExamSessions,
        isError: isExamSessionsError,
    } = useExamSessionList({
        page: 1,
        limit: 100,
        sortBy: ExamSessionSortBy.DATE,
        sortOrder: SortOrder.DESC,
    });

    const teachers = useMemo(() => (teachersData?.data ?? []) as Teacher[], [teachersData]);
    const examSessions = useMemo(() => {
        const raw = examSessionsData as unknown;

        if (Array.isArray(raw)) {
            return raw as ExamSession[];
        }

        if (raw && typeof raw === "object" && Array.isArray((raw as any).data)) {
            return (raw as any).data as ExamSession[];
        }

        return [] as ExamSession[];
    }, [examSessionsData]);

    useEffect(() => {
        if (isExamSessionsError) {
            toast.error("Không thể tải được danh sách ca thi");
        }
    }, [isExamSessionsError, toast]);

    const teacherOptions = useMemo(
        () =>
            teachers.map((teacher) => ({
                value: teacher.teacherCode,
                label: `${teacher.teacherCode} - ${teacher.fullName}`,
            })),
        [teachers]
    );

    const examSessionOptions = useMemo(
        () =>
            examSessions.map((session) => ({
                value: session.examSessionCode,
                label: `${session.examSessionCode}${session.room ? ` - ${session.room}` : ""}`,
            })),
        [examSessions]
    );

    const findMatchedTeacher = (teacherCode: string) => {
        const normalizedCode = teacherCode.trim();
        return teachers.find(
            (teacher) => teacher.teacherCode.toLowerCase() === normalizedCode.toLowerCase()
        );
    };

    const resolveExamSession = (examSessionCode: string) => {
        return examSessions.find((session) => session.examSessionCode === examSessionCode);
    };

    const assignToServer = (
        values: AssignFormValue,
        onSuccess: () => void
    ) => {
        const matchedTeacher = findMatchedTeacher(values.teacherCode);
        if (!matchedTeacher) {
            toast.error("Không tìm thấy giảng viên theo mã đã nhập");
            return;
        }

        const session = resolveExamSession(values.examSessionCode);
        if (!session) {
            toast.error("Không tìm thấy ca thi đã chọn");
            return;
        }

        const mappedRole = mapRoleToApi(values.role);

        mutate(
            {
                examSessionCode: values.examSessionCode.trim(),
                teacherIds: [matchedTeacher.teacherId],
                role: mappedRole,
            },
            {
                onSuccess,
                onError: (error) => handleError(error, toast, "Phân công chấm điểm thất bại"),
            }
        );
    };

    const handleConfirmAssign = () => {
        form
            .validateFields()
            .then((values) => {
                assignToServer(values, () => {
                    toast.success("Xác nhận phân công thành công");
                    form.resetFields();
                });
            })
            .catch(() => undefined);
    };

    return (
        <Space direction="vertical" size="large" className="w-full">
            <Card size="small" className="border">
                <Title level={4} className="mb-1!">
                    Phân công chấm điểm tự luận
                </Title>
                <Text type="secondary">
                    Chọn ca thi, mã giảng viên và vai trò rồi xác nhận phân công.
                </Text>
            </Card>

            <Card>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="examSessionCode"
                        label="Ca thi"
                        rules={[{ required: true, message: "Vui lòng chọn ca thi" }]}
                    >
                        <Select
                            showSearch
                            allowClear
                            placeholder="Chọn ca thi"
                            loading={loadingExamSessions}
                            options={examSessionOptions}
                            optionFilterProp="label"
                            notFoundContent="Khong co du lieu ca thi"
                        />
                    </Form.Item>

                    <Form.Item
                        name="teacherCode"
                        label="Mã giảng viên"
                        rules={[{ required: true, message: "Vui lòng nhập mã giảng viên" }]}
                    >
                        <Select
                            showSearch
                            allowClear
                            placeholder="Nhập hoặc chọn mã giảng viên"
                            loading={loadingTeachers}
                            options={teacherOptions}
                            optionFilterProp="label"
                        />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="Vai trò chấm"
                        rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
                    >
                        <Select placeholder="Chọn vai trò" options={roleOptions} />
                    </Form.Item>

                    <Space wrap>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            loading={isPending}
                            onClick={handleConfirmAssign}
                        >
                            Xác nhận phân công
                        </Button>
                    </Space>
                </Form>
            </Card>
        </Space>
    );
}