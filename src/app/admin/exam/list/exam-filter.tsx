import { useExamSetList } from "@/queries/useExamSetQuery";
import { ExamStatus } from "@/shares/constants/status.enum";
import { ExamSortBy, SortOrder } from "@/shares/constants/sort.enum"; // Đảm bảo đúng enum cho Exam
import { ExamParam } from "@/shares/types/param";
import { Input, Select, Space, Typography } from "antd";
import { useEffect } from "react";

const { Text } = Typography;

interface ExamFilterProps {
    onSearch: (value: string) => void;
    onExamSetChange: (id: string) => void;
    onStatusChange: (status: ExamStatus | undefined) => void;
    onSortChange: (sortBy: ExamSortBy, sortOrder: SortOrder) => void;
    params: ExamParam;
}

export function ExamFilter({ onSearch, onSortChange, onExamSetChange, onStatusChange, params }: ExamFilterProps) {
    const { data: examSetRes } = useExamSetList({ page: 1, limit: 100 });
    const examSets = examSetRes?.data || [];

    useEffect(() => {
        if (!params.examSetId && examSets.length > 0) {
            onExamSetChange(examSets[0].examSetId);
        }
    }, [examSets, params.examSetId, onExamSetChange]);

    return (
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <Space size="middle">
                <div className="flex items-center gap-2">
                    <Text strong>Bộ đề:</Text>
                    <Select
                        placeholder="Chọn bộ đề"
                        value={params.examSetId || undefined}
                        style={{ width: 250 }}
                        onChange={onExamSetChange}
                        options={examSets.map((item: any) => ({
                            value: item.examSetId,
                            label: item.name,
                        }))}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Text strong>Trạng thái:</Text>
                    <Select
                        placeholder="Chọn trạng thái"
                        value={params.status}
                        style={{ width: 150 }}
                        allowClear
                        onChange={(val) => onStatusChange(val)}
                        options={[
                            { value: ExamStatus.PENDING, label: "Đang chờ" },
                            { value: ExamStatus.ACCEPTED, label: "Đã duyệt" },
                            { value: ExamStatus.REJECTED, label: "Bị từ chối" },
                        ]}
                    />
                </div>
                <Input.Search
                    placeholder="Tìm kiếm đề thi..."
                    allowClear
                    size="large"
                    onSearch={onSearch}
                    style={{ width: 350 }}
                />
            </Space>

            <Space size="middle">
                <Text strong>Sắp xếp:</Text>
                <Select
                    value={params.sortBy}
                    style={{ width: 150 }}
                    onChange={(val) => onSortChange(val as ExamSortBy, params.sortOrder as SortOrder)}
                    options={[
                        { value: ExamSortBy.CREATED_AT, label: "Ngày tạo" },
                        { value: ExamSortBy.TITLE, label: "Tiêu đề" },
                    ]}
                />
                <Select
                    value={params.sortOrder}
                    style={{ width: 120 }}
                    onChange={(val) => onSortChange(params.sortBy as ExamSortBy, val as SortOrder)}
                    options={[
                        { value: SortOrder.ASC, label: "Tăng dần" },
                        { value: SortOrder.DESC, label: "Giảm dần" },
                    ]}
                />
            </Space>
        </div>
    );
}