import { SortOrder } from "@/constants/sort.enum";
import { GenderType } from "@/constants/type.enum";
import { StudentParam } from "@/types/param";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Select, Space, Typography } from "antd";

const { Text } = Typography;

interface StudentFilterProps {
    onSearch: (value: string) => void;
    onFilterChange: (key: keyof StudentParam, value: any) => void;
    params: StudentParam;
}

export function StudentFilter({ onSearch, onFilterChange, params }: StudentFilterProps) {
    return (
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <Space size="middle" className="flex-wrap">
                <Input.Search
                    placeholder="Tìm kiếm mã hoặc tên sinh viên..."
                    allowClear
                    size="large"
                    enterButton={<SearchOutlined />}
                    style={{ width: 350 }}
                    defaultValue={params.search}
                    onSearch={onSearch} 
                />

                <div className="flex items-center gap-2">
                    <Text strong>Giới tính:</Text>
                    <Select
                        placeholder="Tất cả"
                        allowClear
                        style={{ width: 140 }}
                        value={params.gender}
                        onChange={(val) => onFilterChange("gender", val)}
                        options={[
                            { value: GenderType.MALE, label: "Nam" },
                            { value: GenderType.FEMALE, label: "Nữ" },
                        ]}
                    />
                </div>
            </Space>

            <Space size="middle">
                <div className="flex items-center gap-2">
                    <Text strong>Sắp xếp:</Text>
                    <Select
                        style={{ width: 120 }}
                        value={params.sortOrder}
                        onChange={(val) => onFilterChange("sortOrder", val)}
                        options={[
                            { value: SortOrder.ASC, label: "Tăng dần" },
                            { value: SortOrder.DESC, label: "Giảm dần" },
                        ]}
                    />
                </div>
            </Space>
        </div>
    );
}