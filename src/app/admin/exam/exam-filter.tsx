import { ExamSortBy, SortOrder } from "@/constants/sort.enum"; // Đảm bảo đúng enum cho Exam
import { useExamSetList } from "@/queries/useExamSetQuery";
import { ExamParam } from "@/types/param";
import { Input, Select, Space, Typography } from "antd";
import { useEffect } from "react";

const { Text } = Typography;

interface ExamFilterProps {
    onSearch: (value: string) => void;
    onExamSetChange: (id: string) => void;
    onSortChange: (sortBy: ExamSortBy, sortOrder: SortOrder) => void;
    params: ExamParam; 
}

export function ExamFilter({ onSearch, onSortChange, onExamSetChange, params }: ExamFilterProps) {
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
                <Input.Search
                    placeholder="Tìm kiếm mã đề, tiêu đề..."
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