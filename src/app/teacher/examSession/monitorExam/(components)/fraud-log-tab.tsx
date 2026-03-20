"use client";
import { useDebounce } from "@/hooks/useDebounce"; // Giả định bạn có hook debounce hoặc dùng setTimeout
import { useFraudDetailList } from "@/queries/useFraudDetailQuery";
import { SortOrder } from "@/shares/constants/sort.enum";
import { FraudDetail } from "@/shares/types/object";
import { getFraudTypeBadge } from "@/shares/utils/mappingLabel";
import { AlertOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Empty, Input, Pagination, Row, Spin, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const { Text } = Typography;

export default function FraudLogTab({ examSessionId }: { examSessionId: string }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [searchText, setSearchText] = useState("");
    
    // Sử dụng debounce để tránh gọi API liên tục khi đang gõ
    const debouncedSearch = useDebounce(searchText, 500);

    // 2. Gọi API với params phân trang và search theo studentCode
    const { data, isLoading } = useFraudDetailList({
        examSessionId,
        page: currentPage,
        limit: pageSize,
        sortOrder: SortOrder.DESC,
        studentCode: debouncedSearch || undefined // Chỉ gửi khi có giá trị
    });

    const logs = data?.data || [];
    const total = data?.meta?.total || 0;

    const handlePageChange = (page: number, size: number) => {
        setCurrentPage(page);
        setPageSize(size);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm mới
    };

    return (
        <div className="py-4">
            {/* Header với Ô tìm kiếm */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col">
                    <Text strong className="text-lg">Nhật ký vi phạm</Text>
                    <Text type="secondary" className="text-xs">Theo dõi các hành vi bất thường trong ca thi</Text>
                </div>
                
                <Input
                    placeholder="Tìm kiếm theo MSSV..."
                    prefix={<SearchOutlined className="text-slate-400" />}
                    allowClear
                    onChange={handleSearch}
                    value={searchText}
                    className="max-w-xs rounded-lg h-10 shadow-sm"
                />
            </div>

            {isLoading ? (
                <div className="p-20 text-center"><Spin tip="Đang truy xuất dữ liệu..." /></div>
            ) : logs.length === 0 ? (
                <Empty 
                    description={searchText ? `Không tìm thấy MSSV: ${searchText}` : "Chưa có ghi nhận vi phạm nào"} 
                    className="py-20 bg-white rounded-xl border border-dashed" 
                />
            ) : (
                <>
                    <Row gutter={[16, 16]}>
                        {logs.map((log: FraudDetail) => {
                            const badge = getFraudTypeBadge(log.fraudType);
                            return (
                                <Col xs={24} sm={12} md={8} lg={6} key={log.fraudDetailId}>
                                    <Card
                                        hoverable
                                        size="small"
                                        className="rounded-xl shadow-sm transition-all duration-300 hover:shadow-md h-full overflow-hidden"
                                        style={{ borderLeft: `4px solid ${badge.color}` }}
                                    >
                                        <div className="flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                <Tag
                                                    style={{
                                                        color: badge.color,
                                                        backgroundColor: badge.bgColor,
                                                        borderColor: badge.borderColor,
                                                        borderRadius: '6px',
                                                        fontWeight: 600,
                                                        fontSize: '10px'
                                                    }}
                                                    icon={<AlertOutlined />}
                                                    className="m-0 uppercase"
                                                >
                                                    {badge.label}
                                                </Tag>
                                                <div className="text-right">
                                                    <div className="text-[10px] text-slate-500 font-bold">
                                                        {dayjs(log.occurredAt).format('HH:mm:ss')}
                                                    </div>
                                                    <div className="text-[9px] text-slate-400">
                                                        {dayjs(log.occurredAt).format('DD/MM/YYYY')}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                                                    <UserOutlined className="text-slate-400" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <Text strong className="text-[13px] text-slate-700 block truncate">{log.fullName}</Text>
                                                    <Text className="text-[11px] text-blue-600 font-mono block">
                                                        {log.studentCode}
                                                    </Text>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>

                    <div className="mt-8 flex justify-end">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={total}
                            onChange={handlePageChange}
                            showSizeChanger
                            pageSizeOptions={['12', '24', '48']}
                            showTotal={(total) => (
                                <span>Tổng cộng <b className="text-red-500">{total}</b> lỗi vi phạm</span>
                            )}
                            size="small"
                        />
                    </div>
                </>
            )}
        </div>
    );
}