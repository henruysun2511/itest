import { ExamSetSortBy, SortOrder } from "@/constants/sort.enum";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Select, Space, Typography } from "antd";

const { Text } = Typography;

interface ExamSetFilterProps {
    onSearch: (value: string) => void;
    onSortChange: (sortBy: ExamSetSortBy, sortOrder: SortOrder.ASC | SortOrder.DESC) => void;
    params: {
        search?: string;
        sortBy?: string;
        sortOrder?: string;
    };
}

export function ExamSetFilter({ onSearch, onSortChange, params }: ExamSetFilterProps) {
    return (
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            {/* Ô tìm kiếm */}
            <Input.Search
                placeholder="Tìm kiếm tên bộ đề..."
                allowClear
                size="large"
                enterButton={<SearchOutlined />}
                style={{ width: 400 }}
                defaultValue={params.search}
                onSearch={onSearch}
            />

            <Space size="middle">
                <div className="flex items-center gap-2">
                    <Text strong>Sắp xếp theo:</Text>
                    <Select
                        defaultValue={ExamSetSortBy.CREATED_AT}
                        style={{ width: 160 }}
                        onChange={(val) =>
                            onSortChange(
                                val as ExamSetSortBy,
                                (params.sortOrder as SortOrder.ASC | SortOrder.DESC) || SortOrder.DESC
                            )
                        }
                        options={[
                            { value: ExamSetSortBy.CREATED_AT, label: "Ngày tạo" },
                            { value: ExamSetSortBy.UPDATED_AT, label: "Ngày cập nhật" },
                        ]}
                    />
                </div>

                <Select
                    defaultValue="desc"
                    style={{ width: 100 }}
                    onChange={(val) =>
                        onSortChange(
                            (params.sortBy as ExamSetSortBy) || ExamSetSortBy.CREATED_AT,
                            val as SortOrder.ASC | SortOrder.DESC
                        )
                    }
                    options={[
                        { value: SortOrder.ASC, label: "Tăng dần" },
                        { value: SortOrder.DESC, label: "Giảm dần" },
                    ]}
                />
            </Space>
        </div>
    );
}