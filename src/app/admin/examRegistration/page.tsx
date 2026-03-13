"use client";
import { useRegistrationList } from "@/queries/useExamRegistrationQuery";
import { useExamSessionList } from "@/queries/useExamSessionQuery";
import { ExamRegistrationParam } from "@/types/param";
import { ArrowLeftOutlined, FileExcelOutlined } from "@ant-design/icons";
import { Button, Card, Space, Typography } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RegistrationBulkModal } from "./examRegistration-bulk-modal";
import { RegistrationFilter } from "./examRegistration-filter";
import RegistrationTable from "./examRegistration-table";

const { Title, Text } = Typography;

export default function RegistrationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const urlSessionId = searchParams.get("examSessionId");

    const [selectedSessionId, setSelectedSessionId] = useState<string>(urlSessionId || "");
    const [openBulk, setOpenBulk] = useState(false);
    const [params, setParams] = useState<ExamRegistrationParam>({ page: 1, limit: 10 });

    const { data: sessions } = useExamSessionList({ page: 1, limit: 100 });
    const { data, isLoading } = useRegistrationList(selectedSessionId, params);

    useEffect(() => {
        if (!urlSessionId && sessions?.data?.length && !selectedSessionId) {
            setSelectedSessionId(sessions.data[0].id);
        }
    }, [sessions, urlSessionId, selectedSessionId]);

    const currentSession = sessions?.data?.find(s => s.id === selectedSessionId);

    return (
        <Space direction="vertical" className="w-full" size="large">
            {/* Header Area */}
            <div className="flex justify-between items-end">
                <div>
                    <Button 
                        type="link" 
                        icon={<ArrowLeftOutlined />} 
                        onClick={() => router.back()}
                        className="p-0 mb-2"
                    >
                        Quay lại danh sách ca thi
                    </Button>
                </div>
                <Button
                    type="primary"
                    size="large"
                    icon={<FileExcelOutlined />}
                    onClick={() => setOpenBulk(true)}
                    disabled={!selectedSessionId}
                >
                    Đăng ký từ Excel
                </Button>
            </div>

            {/* Session Info Bar */}
            <Card size="small" className="bg-blue-50 border-blue-100">
                <div className="flex flex-col">
                    <Text type="secondary" className="text-xs uppercase font-medium">Ca thi đang xử lý</Text>
                    <Text strong className="text-lg text-blue-700">
                        {currentSession ? `${currentSession.examSessionCode} - Phòng: ${currentSession.room}` : "Vui lòng chọn ca thi"}
                    </Text>
                </div>
            </Card>

            <RegistrationFilter
                selectedSessionId={selectedSessionId}
                onSessionChange={setSelectedSessionId}
                params={params}
                onSearch={(val) => setParams(p => ({ ...p, search: val, page: 1 }))}
                onFilterChange={(k, v) => setParams(p => ({ ...p, [k]: v, page: 1 }))}
            />

            <RegistrationTable
                data={data?.data ?? []}
                loading={isLoading}
                sessionId={selectedSessionId}
                pagination={{
                    current: params.page,
                    pageSize: params.limit,
                    total: data?.meta?.total,
                    onChange: (page: number, pageSize: number) =>
                        setParams((p) => ({ ...p, page, limit: pageSize })),
                }}
            />

            <RegistrationBulkModal
                open={openBulk}
                onCancel={() => setOpenBulk(false)}
                sessionId={selectedSessionId}
            />
        </Space>
    );
}