import { useExamSessionList } from "@/queries/useExamSessionQuery";
import { ResultParam } from "@/shares/types/param";
import { SearchOutlined } from "@ant-design/icons";
import { Input, InputNumber, Select, Space, Typography } from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

interface ResultFilterProps {
    onSearch: (value: string) => void;
    // Sửa kiểu dữ liệu ở đây để khớp với Page
    onFilterChange: <K extends keyof ResultParam>(key: K, value: ResultParam[K]) => void;
    params: ResultParam;
}

export function ResultFilter({ onSearch, onFilterChange, params }: ResultFilterProps) {
    const [examSessionSearchTerm, setExamSessionSearchTerm] = useState("");
    const [debouncedExamSessionCode, setDebouncedExamSessionCode] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedExamSessionCode(examSessionSearchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [examSessionSearchTerm]);

    const { data: examSessions, isLoading: isLoadingExamSessions } = useExamSessionList({
        page: 1,
        limit: 100,
        ...(debouncedExamSessionCode ? { examSessionCode: debouncedExamSessionCode } : {})
    });

    return (
        <div className="flex flex-wrap items-center gap-4">
            <Space size="middle" className="flex-wrap">
                <Input.Search
                    placeholder="Tìm kiếm mã sinh viên..."
                    allowClear
                    size="large"
                    enterButton={<SearchOutlined />}
                    style={{ width: 350 }}
                    defaultValue={params.studentCode}
                    onSearch={onSearch}
                />

                <div className="flex items-center gap-2">
                    <Text strong>Ca thi:</Text>
                    <Select
                        placeholder="Tất cả ca thi"
                        allowClear
                        showSearch
                        onSearch={(val) => setExamSessionSearchTerm(val)}
                        filterOption={false}
                        style={{ width: 220 }}
                        loading={isLoadingExamSessions}
                        value={params.examSessionId}
                        onChange={(val) => onFilterChange("examSessionId", val)}
                        options={examSessions?.data?.map((session: any) => ({
                            label: session.examSessionCode,
                            value: session.examSessionId
                        }))}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Text strong>Khoảng điểm:</Text>
                    <InputNumber
                        placeholder="Từ"
                        min={0}
                        max={10}
                        step={0.1}
                        value={params.minTotalScore}
                        // Sửa ở đây: Nếu val là null, chuyển nó thành undefined
                        onChange={(val) => onFilterChange("minTotalScore", val ?? undefined)}
                        style={{ width: 80 }}
                    />
                    <Text>-</Text>
                    <InputNumber
                        placeholder="Đến"
                        min={0}
                        max={10}
                        step={0.1}
                        value={params.maxTotalScore}
                        // Sửa ở đây: Tương tự cho maxTotalScore
                        onChange={(val) => onFilterChange("maxTotalScore", val ?? undefined)}
                        style={{ width: 80 }}
                    />
                </div>
            </Space>
        </div>
    );
}