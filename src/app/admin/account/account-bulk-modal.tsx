import { useToast } from "@/hooks/useToast";
import { useCreateAccountBulk } from "@/queries/useAccountQuery";
import { useRoleList } from "@/queries/useRoleQuery";
import { BulkAccountBody, BulkAccountItem } from "@/types/body";
import { handleError } from "@/utils/error";
import { InboxOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Modal, Select, Space, Spin, Table, Typography, Upload } from "antd";
import { useState } from "react";
import * as XLSX from "xlsx";

const { Dragger } = Upload;
const { Text, Title } = Typography;

export function AccountBulkModal({ open, onCancel }: { open: boolean; onCancel: () => void }) {
    const [dataPreview, setDataPreview] = useState<BulkAccountItem[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>("STUDENT");
    const [isParsing, setIsParsing] = useState(false);

    const { mutate, isPending } = useCreateAccountBulk();
    const { data: roleData, isLoading: isLoadingRoles } = useRoleList();
    const toast = useToast();

    const parseFile = (file: File) => {
        setIsParsing(true);
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(e.target?.result, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

                const formattedData: BulkAccountItem[] = jsonData.map((item) => ({
                    username: String(item.username || item["Tên đăng nhập"] || "").trim(),
                    password: String(item.password || item["Mật khẩu"] || "123456").trim(),
                    code: String(item.code || item["Mã số"] || "").trim(),
                }));

                setDataPreview(formattedData.filter((item) => item.username));
            } catch {
                toast.error("Không thể đọc file Excel. Vui lòng kiểm tra lại định dạng.");
            } finally {
                setIsParsing(false);
            }
        };

        reader.onerror = () => {
            setIsParsing(false);
            toast.error("Lỗi khi đọc file.");
        };
        reader.readAsBinaryString(file);
    };

    const handleFileChange = (info: any) => {
        const file = (info.file.originFileObj ?? info.file) as File;
        if (!file || !(file instanceof File)) return;

        parseFile(file);
    };

    const handleBeforeUpload = (file: File) => {
        parseFile(file);
        return false; 
    };

    const handleBulkCreate = () => {
        if (dataPreview.length === 0) return toast.error("Vui lòng chọn file hợp lệ");
        if (!selectedRole) return toast.error("Vui lòng chọn vai trò cho danh sách này");

        const payload: BulkAccountBody = {
            roleName: selectedRole,
            accounts: dataPreview,
        };

        mutate(payload, {
            onSuccess: () => {
                toast.success(`Đã thêm thành công ${dataPreview.length} tài khoản vào hệ thống`);
                setDataPreview([]);
                onCancel();
            },
            onError: (err: any) => handleError(err, toast, "Lỗi khi thêm hàng loạt"),
        });
    };

    const resetModal = () => {
        setDataPreview([]);
        onCancel();
    };

    return (
        <Modal
            open={open}
            title={<Title level={4}>Thêm tài khoản hàng loạt</Title>}
            onCancel={resetModal}
            width={800}
            footer={[
                <Button key="back" onClick={resetModal}>Hủy bỏ</Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isPending}
                    onClick={handleBulkCreate}
                    disabled={dataPreview.length === 0 || isParsing}
                    className="bg-green"
                >
                    Xác nhận thêm {dataPreview.length > 0 ? `(${dataPreview.length} tài khoản)` : ""}
                </Button>,
            ]}
        >
            <Space direction="vertical" className="w-full" size="middle">
                <Alert
                    message="Hướng dẫn sử dụng"
                    description={
                        <ul className="list-disc ml-4">
                            <li>Chọn <b>Vai trò</b> áp dụng chung cho tất cả tài khoản trong file.</li>
                            <li>File Excel chỉ cần 3 cột: <b>username</b>, <b>password</b>, <b>code</b>.</li>
                            <li>Dòng không có <i>username</i> sẽ bị bỏ qua.</li>
                            <li>Nếu để trống mật khẩu, hệ thống mặc định là <Text strong>123456</Text>.</li>
                        </ul>
                    }
                    type="info"
                    showIcon
                    icon={<InfoCircleOutlined />}
                />

                <div className="flex items-center gap-4 p-4 border rounded-md bg-gray-50">
                    <Text strong>Áp dụng vai trò cho danh sách:</Text>
                    <Select
                        style={{ width: 200 }}
                        placeholder="Chọn vai trò"
                        loading={isLoadingRoles}
                        value={selectedRole}
                        onChange={(val) => setSelectedRole(val)}
                        options={roleData?.data?.map((r: any) => ({ label: r.roleName, value: r.roleName }))}
                    />
                </div>

                <Dragger
                    accept=".xlsx, .xls"
                    multiple={false}
                    beforeUpload={handleBeforeUpload}
                    showUploadList={false}
                    disabled={isParsing}
                >
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Nhấp hoặc kéo tệp Excel vào đây để tải lên</p>
                    <p className="ant-upload-hint">Hỗ trợ định dạng .xls, .xlsx</p>
                </Dragger>

                <Spin spinning={isParsing} tip="Đang xử lý dữ liệu file...">
                    {dataPreview.length > 0 && (
                        <div>
                            <div className="flex justify-between mb-2 items-center">
                                <Text strong>Xem trước dữ liệu (5 dòng đầu):</Text>
                                <Button type="link" danger size="small" onClick={() => setDataPreview([])}>Xóa file</Button>
                            </div>
                            <Table
                                dataSource={dataPreview.slice(0, 5)}
                                pagination={false}
                                size="small"
                                bordered
                                rowKey={(record, index) => record.username + index}
                                columns={[
                                    { title: "Tên đăng nhập", dataIndex: "username" },
                                    { title: "Mật khẩu", dataIndex: "password" },
                                    { title: "Mã (Code)", dataIndex: "code" },
                                ]}
                                footer={() => dataPreview.length > 5 ? `... và ${dataPreview.length - 5} dòng khác.` : null}
                            />
                        </div>
                    )}
                </Spin>
            </Space>
        </Modal>
    );
}