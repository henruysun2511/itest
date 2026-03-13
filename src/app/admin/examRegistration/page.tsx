"use client";
import { useRegistrationList } from "@/queries/useExamRegistrationQuery";
import { ExamRegistrationParam } from "@/types/param";
import { ArrowLeftOutlined, FileExcelOutlined } from "@ant-design/icons";
import { Button, Card, Space, Typography } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { RegistrationBulkModal } from "./examRegistration-bulk-modal";
import { RegistrationFilter } from "./examRegistration-filter";
import RegistrationTable from "./examRegistration-table";

const { Text } = Typography;

export default function RegistrationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Lấy tất cả thông tin từ URL
    const sessionId = searchParams.get("examSessionId") || "";
    const sessionCode = searchParams.get("code") || "";
    const room = searchParams.get("room") || "";

    const [openBulk, setOpenBulk] = useState(false);
    const [params, setParams] = useState<ExamRegistrationParam>({ page: 1, limit: 10 });

    const { data, isLoading } = useRegistrationList(sessionId, params);

    return (
        <Space direction="vertical" className="w-full" size="large">
            <Card size="small" className="border-l-4 border-l-blue-600 shadow-sm">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()} />
                        <div className="flex flex-col">
                            <Text type="secondary" className="text-xs uppercase font-medium">Đang quản lý thí sinh</Text>
                            <Text strong className="text-lg text-blue-700">
                                Ca thi: {sessionCode} {room ? `- Phòng: ${room}` : ""}
                            </Text>
                        </div>
                    </div>
                    <Button 
                        type="primary" 
                        icon={<FileExcelOutlined />} 
                        onClick={() => setOpenBulk(true)}
                    >
                        Đăng ký từ Excel
                    </Button>
                </div>
            </Card>

            <RegistrationFilter
                params={params}
                onSearch={(val) => setParams(p => ({ ...p, search: val, page: 1 }))}
                onFilterChange={(k, v) => setParams(p => ({ ...p, [k]: v, page: 1 }))}
            />

            <RegistrationTable
                data={data?.data ?? []}
                loading={isLoading}
                sessionId={sessionId}
                pagination={{
                    current: params.page,
                    pageSize: params.limit,
                    total: data?.meta?.total,
                    onChange: (page: number, pageSize: number) =>
                        setParams((p) => ({ ...p, page, limit: pageSize })),
                }}
            />

            {/* Truyền cả Code và Room vào Modal để hiển thị luôn */}
            <RegistrationBulkModal
                open={openBulk}
                onCancel={() => setOpenBulk(false)}
                sessionId={sessionId}
                sessionInfo={{ code: sessionCode, room: room }}
            />
        </Space>
    );
}