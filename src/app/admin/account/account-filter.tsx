import { useRoleList } from "@/queries/useRoleQuery";
import { BaseSortBy, SortOrder } from "@/shares/constants/sort.enum";
import { AccountParam } from "@/shares/types/param";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Select, Space, Typography } from "antd";

const { Text } = Typography;

interface AccountFilterProps {
    onSearch: (value: string) => void;
    onFilterChange: (key: keyof AccountParam, value: any) => void;
    params: AccountParam;
}

export function AccountFilter({ onSearch, onFilterChange, params }: AccountFilterProps) {
    const { data: roleData, isLoading: isLoadingRoles } = useRoleList();

    return (
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <Space size="middle" className="flex-wrap">
                <Input.Search
                    placeholder="Tìm kiếm username hoặc email..."
                    allowClear
                    size="large"
                    enterButton={<SearchOutlined />}
                    style={{ width: 350 }}
                    defaultValue={params.search}
                    onSearch={onSearch}
                />

                <div className="flex items-center gap-2">
                    <Text strong>Vai trò:</Text>
                    <Select
                        placeholder="Tất cả vai trò"
                        allowClear
                        style={{ width: 160 }}
                        loading={isLoadingRoles}
                        value={params.roleName}
                        onChange={(val) => onFilterChange("roleName", val)}
                        options={roleData?.data?.map((role: any) => ({
                            label: role.roleName,
                            value: role.roleName
                        }))}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Text strong>Loại:</Text>
                    <Select
                        placeholder="Tất cả loại"
                        allowClear
                        style={{ width: 140 }}
                        value={params.type}
                        onChange={(val) => onFilterChange("type", val)}
                        options={[
                            { value: "LOCAL", label: "Local" },
                            { value: "GOOGLE", label: "Google" },
                        ]}
                    />
                </div>
            </Space>

            <Space size="middle">
                <div className="flex items-center gap-2">
                    <Text strong>Sắp xếp:</Text>
                    <Select
                        defaultValue={BaseSortBy.CREATED_AT}
                        style={{ width: 150 }}
                        value={params.sortBy}
                        onChange={(val) => onFilterChange("sortBy", val)}
                        options={[
                            { value: BaseSortBy.CREATED_AT, label: "Ngày tạo" },
                        ]}
                    />
                </div>

                <Select
                    defaultValue={SortOrder.DESC}
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