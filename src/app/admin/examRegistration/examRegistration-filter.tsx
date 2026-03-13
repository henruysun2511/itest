import { ExamRegistrationStatusType } from "@/constants/type.enum";
import { ExamRegistrationParam } from "@/types/param";
import { Input, Select } from "antd";

interface Props {
    onSearch: (value: string) => void;
    onFilterChange: (key: keyof ExamRegistrationParam, value: any) => void;
    params: ExamRegistrationParam;
}

export function RegistrationFilter({ onSearch, onFilterChange, params }: Props) {
    return (
        <div className="flex flex-wrap justify-start items-center gap-4 p-4">
            <Input.Search
                placeholder="Tìm mã SV hoặc họ tên thí sinh..."
                allowClear
                size="large"
                onSearch={onSearch}
                style={{ width: 350 }}
            />

            <Select
                placeholder="Trạng thái vào thi"
                allowClear
                size="large"
                style={{ width: 200 }}
                value={params.status}
                onChange={(val) => onFilterChange("status", val)}
                options={Object.values(ExamRegistrationStatusType).map(v => ({ label: v, value: v }))}
            />
        </div>
    );
}