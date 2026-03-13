import { ExamRegistrationStatusType } from "@/constants/type.enum";
import { useExamSessionList } from "@/queries/useExamSessionQuery";
import { ExamRegistrationParam } from "@/types/param";
import { Input, Select, Space, Typography } from "antd";

const { Text } = Typography;

interface Props {
    onSearch: (value: string) => void;
    onFilterChange: (key: keyof ExamRegistrationParam, value: any) => void;
    params: ExamRegistrationParam;
    selectedSessionId: string;
    onSessionChange: (id: string) => void;
}

export function RegistrationFilter({ onSearch, onFilterChange, params, selectedSessionId, onSessionChange }: Props) {
    const { data: sessions, isLoading: isLoadingSessions } = useExamSessionList({ page: 1, limit: 100 });

    return (
        <div className="flex flex-wrap justify-between items-center gap-4">
            <Space size="middle" className="flex-wrap">
                <div className="flex items-center gap-2">
                    <Text strong>Bộ lọc ca thi:</Text>
                    <Select
                        showSearch
                        optionFilterProp="label"
                        style={{ width: 280 }}
                        value={selectedSessionId || undefined}
                        onChange={onSessionChange}
                        loading={isLoadingSessions}
                        placeholder="Chọn ca thi để lọc"
                        options={sessions?.data?.map(s => ({
                            label: `${s.examSessionCode} (${s.room})`,
                            value: s.id
                        })) || []}
                    />
                </div>

                <Input.Search
                    placeholder="Mã SV hoặc họ tên..."
                    allowClear
                    onSearch={onSearch}
                    style={{ width: 250 }}
                />

                <Select
                    placeholder="Trạng thái vào thi"
                    allowClear
                    style={{ width: 180 }}
                    value={params.status}
                    onChange={(val) => onFilterChange("status", val)}
                    options={Object.values(ExamRegistrationStatusType).map(v => ({ label: v, value: v }))}
                />
            </Space>
        </div>
    );
}