import { ExamSessionSortBy, SortOrder } from "@/shares/constants/sort.enum";
import { ExamSessionStatus } from "@/shares/constants/status.enum";
import { ExamSessionParam } from "@/shares/types/param";
import { SearchOutlined } from "@ant-design/icons";
import { DatePicker, Input, Select, Space, Typography } from "antd";

const { Text } = Typography;

interface Props {
    onSearch: (value: string) => void;
    onFilterChange: (key: keyof ExamSessionParam, value: any) => void;
    params: ExamSessionParam;
}

export function ExamSessionFilter({ onSearch, onFilterChange, params }: Props) {
    return (
        <div className="flex flex-wrap justify-between items-center gap-4">
            <Space size="middle" className="flex-wrap">
                <Input.Search
                    placeholder="Tìm mã ca thi..."
                    allowClear
                    size="large"
                    enterButton={<SearchOutlined />}
                    style={{ width: 300 }}
                    onSearch={onSearch}
                />

                <div className="flex items-center gap-2">
                    <Text strong>Ngày thi:</Text>
                    <DatePicker
                        placeholder="Chọn ngày"
                        onChange={(date) => onFilterChange("date", date ? date.format("YYYY-MM-DD") : undefined)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Text strong>Trạng thái:</Text>
                    <Select
                        placeholder="Tất cả"
                        allowClear
                        style={{ width: 160 }}
                        value={params.status}
                        onChange={(val) => onFilterChange("status", val)}
                        options={[
                            { value: ExamSessionStatus.NOT_STARTED, label: "Chưa bắt đầu" },
                            { value: ExamSessionStatus.IN_PROGRESS, label: "Đang diễn ra" },
                            { value: ExamSessionStatus.PAUSE, label: "Tạm dừng" },
                            { value: ExamSessionStatus.FINISHED, label: "Đã kết thúc" },
                        ]}
                    />
                </div>
            </Space>

            <Space size="middle">
                <div className="flex items-center gap-2">
                    <Text strong>Sắp xếp:</Text>
                    <Select
                        style={{ width: 150 }}
                        value={params.sortBy}
                        onChange={(val) => onFilterChange("sortBy", val)}
                        options={[
                            { value: ExamSessionSortBy.DATE, label: "Ngày thi" },
                        ]}
                    />
                </div>
                <Select
                    style={{ width: 120 }}
                    value={params.sortOrder}
                    onChange={(val) => onFilterChange("sortOrder", val)}
                    options={[
                        { value: SortOrder.ASC, label: "Tăng dần" },
                        { value: SortOrder.DESC, label: "Giảm dần" },
                    ]}
                />
            </Space>
        </div>
    );
}