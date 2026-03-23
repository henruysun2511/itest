import { SortOrder } from "@/shares/constants/sort.enum";
import { ResultGradingStatus } from "@/shares/constants/status.enum";
import { ResultGradingParam } from "@/shares/types/param";
import { Input, Select, Space } from "antd";

const { Search } = Input;
const { Option } = Select;

interface Props {
  params: ResultGradingParam;
  onSearch: (val: string) => void;
  onFilterChange: (key: keyof ResultGradingParam, value: any) => void;
}

export default function ResultGradingFilter({ params, onSearch, onFilterChange }: Props) {
  return (
    <Space size="middle" wrap className="mb-4">
      <Search
        placeholder="Tìm tên hoặc mã sinh viên"
        allowClear
        onSearch={onSearch}
        style={{ width: 250 }}
      />
      <Input
        placeholder="Mã ca thi"
        allowClear
        onChange={(e) => {
            if (!e.target.value) onFilterChange('examSessionCode', undefined);
        }}
        onPressEnter={(e) => onFilterChange('examSessionCode', e.currentTarget.value)}
        style={{ width: 180 }}
      />
      <Select
        placeholder="Trạng thái"
        allowClear
        style={{ width: 150 }}
        onChange={(val) => onFilterChange('status', val)}
      >
        <Option value={ResultGradingStatus.ASSIGNED}>Đã phân công</Option>
        <Option value={ResultGradingStatus.GRADING}>Đang chấm</Option>
        <Option value={ResultGradingStatus.COMPLETED}>Hoàn thành</Option>
      </Select>
      <Select
        placeholder="Sắp xếp"
        allowClear
        style={{ width: 150 }}
        onChange={(val) => onFilterChange('sortOrder', val)}
      >
        <Option value={SortOrder.ASC}>Tăng dần</Option>
        <Option value={SortOrder.DESC}>Giảm dần</Option>
      </Select>
    </Space>
  );
}
