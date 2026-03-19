import { useExamSessionCreateMany } from "@/queries/useExamSessionQuery";
import { useExamSetList } from "@/queries/useExamSetQuery";
import { CreateExamSessionBody } from "@/shares/types/body";
import { InboxOutlined, InfoCircleOutlined } from "@ant-design/icons";
import {
    Alert,
    Button, Modal, Select, Space, Spin,
    Switch,
    Table, Typography,
    Upload,
    message
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import * as XLSX from "xlsx";

const { Dragger } = Upload;
const { Text, Title } = Typography;

export function ExamSessionBulkModal({ open, onCancel }: { open: boolean; onCancel: () => void }) {
    const [dataPreview, setDataPreview] = useState<any[]>([]);
    const [isParsing, setIsParsing] = useState(false);

    const { mutate, isPending } = useExamSessionCreateMany();
    const { data: examSetData, isLoading: isLoadingExamSets } = useExamSetList({ limit: 20 });

    const parseFile = (file: File) => {
        setIsParsing(true);
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(e.target?.result, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

                if (jsonData.length === 0) {
                    message.error("File Excel không có dữ liệu");
                    return;
                }

                const formattedData = jsonData.map((item: any, index: number) => ({
                    key: index,
                    examSessionCode: item.examSessionCode || "",
                    date: item.date || "",
                    room: item.room || "",
                    duration: Number(item.duration) || 60,
                    examSetId: undefined,
                    isCameraRequired: false,
                }));

                setDataPreview(formattedData);
                message.success(`Đã đọc ${formattedData.length} dòng từ file`);
            } catch (error) {
                message.error("Lỗi khi đọc file Excel. Vui lòng kiểm tra định dạng.");
            } finally {
                setIsParsing(false);
            }
        };
        reader.readAsBinaryString(file);
        return false;
    };

    const handleUpdateRow = (key: number, field: string, value: any) => {
        setDataPreview((prev) =>
            prev.map((row) => (row.key === key ? { ...row, [field]: value } : row))
        );
    };

    const handleSave = () => {
        const isMissingExamSet = dataPreview.some(item => !item.examSetId);
        if (isMissingExamSet) {
            return message.warning("Vui lòng chọn bộ đề cho tất cả các ca thi");
        }

        const payload: CreateExamSessionBody[] = dataPreview.map(({ key, ...rest }) => ({
            ...rest,
            date: new Date(rest.date).toISOString()
        }));

        mutate(payload, {
            onSuccess: () => {
                message.success("Tạo ca thi hàng loạt thành công");
                onCancel();
                setDataPreview([]);
            }
        });
    };

    const columns = [
        {
            title: "Mã ca",
            dataIndex: "examSessionCode",
            render: (text: string) => <Text strong className="text-blue-600">{text}</Text>
        },
        { title: "Phòng", dataIndex: "room" },
        {
            title: "Ngày",
            dataIndex: "date",
            render: (d: any) => {
                if (!d) return "-";
                return dayjs(d).format("DD/MM/YYYY");
            }
        },
        {
            title: "Bộ đề (Bắt buộc)",
            dataIndex: "examSetId",
            render: (val: string, record: any) => (
                <Select
                    placeholder="Chọn bộ đề"
                    style={{ width: "100%" }}
                    loading={isLoadingExamSets}
                    value={val}
                    onChange={(v) => handleUpdateRow(record.key, "examSetId", v)}
                    options={examSetData?.data.map((set: any) => ({
                        label: set.name,
                        value: set.examSetId
                    }))}
                />
            )
        },
        {
            title: "Camera",
            dataIndex: "isCameraRequired",
            align: 'center' as const,
            render: (val: boolean, record: any) => (
                <Switch
                    size="small"
                    checked={val}
                    onChange={(v) => handleUpdateRow(record.key, "isCameraRequired", v)}
                />
            )
        }
    ];

    return (
        <Modal
            title={<Title level={4}>Nhập ca thi hàng loạt</Title>}
            open={open}
            onCancel={onCancel}
            width={1000}
            footer={[
                <Button key="back" onClick={onCancel}>Hủy</Button>,
                <Button
                    key="submit"
                    type="primary"
                    disabled={dataPreview.length === 0}
                    loading={isPending}
                    onClick={handleSave}
                >
                    Xác nhận tạo {dataPreview.length} ca thi
                </Button>
            ]}
        >
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
                {/* Phần hướng dẫn giống account-bulk-modal */}
                <Alert
                    message="Hướng dẫn nhập liệu"
                    description={
                        <ul className="pl-4 list-disc">
                            <li>File Excel phải có các cột tiêu đề: <Text code>examSessionCode</Text>, <Text code>date</Text>, <Text code>room</Text>, <Text code>duration</Text>.</li>
                            <li>Định dạng ngày (<Text code>date</Text>): YYYY-MM-DD (Ví dụ: 2026-03-15).</li>
                            <li>Sau khi tải file, bạn <b>bắt buộc</b> phải chọn Bộ đề cho từng ca thi ở bảng bên dưới.</li>
                        </ul>
                    }
                    type="info"
                    showIcon
                    icon={<InfoCircleOutlined />}
                />

                <Dragger
                    beforeUpload={parseFile}
                    showUploadList={false}
                    accept=".xlsx,.xls"
                    disabled={isParsing}
                >
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Kéo thả file Excel vào đây hoặc nhấp để chọn</p>
                    <p className="ant-upload-hint">Hỗ trợ định dạng .xls, .xlsx</p>
                </Dragger>

                <Spin spinning={isParsing} tip="Đang xử lý dữ liệu...">
                    {dataPreview.length > 0 && (
                        <div>
                            <div className="flex justify-between mb-2 items-center">
                                <Text strong>Xem trước dữ liệu và bổ sung thông tin:</Text>
                                <Button type="link" danger size="small" onClick={() => setDataPreview([])}>Xóa tệp đã chọn</Button>
                            </div>
                            <Table
                                dataSource={dataPreview}
                                columns={columns}
                                pagination={{ pageSize: 5 }}
                                size="small"
                                bordered
                                footer={() => (
                                    <Text>
                                        * Tổng cộng {dataPreview.length} ca thi được tìm thấy.
                                    </Text>
                                )}
                            />
                        </div>
                    )}
                </Spin>
            </Space>
        </Modal>
    );
}