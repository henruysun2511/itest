import { useExamSessionList } from "@/queries/useExamSessionQuery";
import { FraudParam } from "@/types/param";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Select, Space, Typography } from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

interface FraudFilterProps {
    onSearch: (value: string) => void;
    onFilterChange: (key: keyof FraudParam, value: any) => void;
    params: FraudParam;
}

export function FraudFilter({ onSearch, onFilterChange, params }: FraudFilterProps) {
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

    const handleExamSessionSearch = (value: string) => {
        setExamSessionSearchTerm(value);
    };

    return (
        <div className="flex flex-wrap items-center gap-4 mb-6">
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
                        onSearch={handleExamSessionSearch}
                        filterOption={false}
                        style={{ width: 200 }}
                        loading={isLoadingExamSessions}
                        value={params.examSessionId}
                        onChange={(val) => onFilterChange("examSessionId", val)}
                        options={examSessions?.data?.map((session: any) => ({
                            label: session.examSessionCode,
                            value: session.examSessionId
                        }))}
                    />
                </div>
            </Space>
        </div>
    );
}
