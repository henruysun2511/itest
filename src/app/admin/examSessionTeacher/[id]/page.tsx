"use client";
import { useExamTeacherList } from "@/queries/useExamSessionTeacherQuery";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Space, Typography } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ExamSessionTeacherCreateModal } from "../examTeacher-create-modal";
import ExamSessionTeacherTable from "../examTeacher-table";

const { Text } = Typography;

export default function ExamSessionTeacherPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const sessionId = searchParams.get("examSessionId") || "";
    const sessionCode = searchParams.get("code") || "";
    const room = searchParams.get("room") || "";

    const [openAdd, setOpenAdd] = useState(false);

    const { data, isLoading } = useExamTeacherList(sessionId);

    return (
        <Space direction="vertical" className="w-full" size="large">
            <Card size="small" className="border-l-4 border-l-blue-600 shadow-sm">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()} />
                        <div className="flex flex-col">
                            <Text type="secondary" className="text-xs uppercase font-medium">Đang quản lý giám thị</Text>
                            <Text strong className="text-lg text-blue-700">
                                Ca thi: {sessionCode} {room ? `- Phòng: ${room}` : ""}
                            </Text>
                        </div>
                    </div>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={() => setOpenAdd(true)}
                    >
                        Thêm mới
                    </Button>
                </div>
            </Card>

            <ExamSessionTeacherTable
                data={data?.data ?? []}
                loading={isLoading}
                sessionId={sessionId}
            />

            <ExamSessionTeacherCreateModal
                open={openAdd}
                onCancel={() => setOpenAdd(false)}
                sessionId={sessionId}
            />
        </Space>
    );
}
