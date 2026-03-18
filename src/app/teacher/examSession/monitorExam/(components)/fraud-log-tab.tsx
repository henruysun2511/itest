import { SortOrder } from "@/constants/sort.enum";
import { useFraudDetailList } from "@/queries/useFraudDetailQuery";
import { FraudDetail } from "@/types/object";
import { getFraudTypeBadge } from "@/utils/mappingLabel";
import { AlertOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Empty, Pagination, Row, Spin, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const { Text } = Typography;

export default function FraudLogTab({ examSessionId }: { examSessionId: string }) {
    // 1. Quản lý state phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12); // Card nên dùng bội số của 4 (3, 4, 6, 12)

    // 2. Gọi API với params phân trang
    const { data, isLoading } = useFraudDetailList({
        examSessionId,
        page: currentPage,
        limit: pageSize,
        sortOrder: SortOrder.DESC
    });

    const logs = data?.data || [];
    const total = data?.meta?.total || 0;

    // 3. Hàm xử lý khi đổi trang hoặc đổi số lượng bản ghi/trang
    const handlePageChange = (page: number, size: number) => {
        setCurrentPage(page);
        setPageSize(size);
        // Scroll lên đầu tab khi đổi trang cho UX tốt hơn
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) return <div className="p-10 text-center"><Spin tip="Đang tải dữ liệu..." /></div>;
    
    if (logs.length === 0) return <Empty description="Chưa có ghi nhận vi phạm nào" className="py-10" />;

    return (
        <div className="py-4">
            {/* Danh sách Cards */}
            <Row gutter={[16, 16]}>
                {logs.map((log: FraudDetail) => {
                    const badge = getFraudTypeBadge(log.fraudType);
                    return (
                        <Col xs={24} sm={12} md={8} lg={6} key={log.fraudDetailId}>
                            <Card
                                hoverable
                                size="small"
                                className="rounded-xl shadow-sm transition-all duration-300 hover:shadow-md h-full"
                                style={{ borderLeft: `4px solid ${badge.color}` }}
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <Tag
                                            style={{
                                                color: badge.color,
                                                backgroundColor: badge.bgColor,
                                                borderColor: badge.borderColor,
                                                borderRadius: '6px',
                                                fontWeight: 500
                                            }}
                                            icon={<AlertOutlined />}
                                            className="m-0"
                                        >
                                            {badge.label}
                                        </Tag>

                                        <Text className="text-[10px] text-slate-400 font-medium">
                                            {dayjs(log.occurredAt).format('HH:mm:ss')}
                                        </Text>
                                        <Text className="text-[11px] text-slate-400">
                                            {dayjs(log.occurredAt).format('DD/MM/YYYY')}
                                        </Text>
                                    </div>

                                    <div className="mt-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                                <UserOutlined className="text-slate-500 text-[10px]" />
                                            </div>
                                            <Text strong className="text-sm text-slate-700">{log.fullName}</Text>
                                        </div>
                                        <Text className="text-[11px] text-slate-500 block ml-8">
                                            MSSV: <span className="font-mono ">{log.studentCode}</span>
                                        </Text>
                                    </div>

                                   
                                </div>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {/* 4. Thanh phân trang */}
            <div className="mt-8 flex justify-end">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    onChange={handlePageChange}
                    showSizeChanger
                    pageSizeOptions={['12', '24', '48', '96']}
                    showTotal={(total) => `Tổng cộng ${total} lỗi vi phạm`}
                    size="small"
                />
            </div>
        </div>
    );
}