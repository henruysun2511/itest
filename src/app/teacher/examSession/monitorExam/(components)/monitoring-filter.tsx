import { ExamAttemptParam } from "@/types/param";
import { FRAUD_OPTIONS, STATUS_OPTIONS } from "@/utils/mappingLabel";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, Select, Space } from "antd";

interface MonitoringFilterProps {
    params: ExamAttemptParam;
    setParams: (params: ExamAttemptParam) => void;
}

export default function MonitoringFilter({ params, setParams }: MonitoringFilterProps) {
    const handleReset = () => {
        setParams({
            search: "",
            status: undefined,
            fraudLevel: undefined,
            page: 1 
        });
    };

    return (
        <Card className="mb-6 rounded-xl" bodyStyle={{ padding: '16px' }}>
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <Space wrap size="middle" className="w-full lg:w-auto">
                    {/* Ô tìm kiếm */}
                    <Input
                        placeholder="Tìm tên, mã sinh viên..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        className="w-64 rounded-lg"
                        allowClear
                        value={params.search}
                        onChange={(e) => setParams({ ...params, search: e.target.value })}
                    />

                    {/* Lọc Trạng thái */}
                    <Select
                        placeholder="Trạng thái"
                        className="w-48"
                        options={STATUS_OPTIONS}
                        value={params.status}
                        onChange={(val) => setParams({ ...params, status: val })}
                    />

                    {/* Lọc Mức độ vi phạm */}
                    <Select
                        placeholder="Mức độ vi phạm"
                        className="w-48"
                        options={FRAUD_OPTIONS}
                        value={params.fraudLevel}
                        onChange={(val) => setParams({ ...params, fraudLevel: val })}
                    />

                    <Button 
                        icon={<ReloadOutlined />} 
                        onClick={handleReset}
                        className="rounded-lg flex items-center"
                    >
                        Hủy lọc
                    </Button>
                </Space>
            </div>
        </Card>
    );
}