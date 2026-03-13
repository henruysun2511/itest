import { useToast } from "@/hooks/useToast";
import { useRegisterStudents } from "@/queries/useExamRegistrationQuery";
import { useExamSessionList } from "@/queries/useExamSessionQuery";
import { useFilterInvalidStudents } from "@/queries/useStudentQuery";
import { handleError } from "@/utils/error";
import { DeleteOutlined, InboxOutlined, InfoCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Modal, Space, Table, Tag, Typography, Upload } from "antd";
import { useState } from "react";
import * as XLSX from "xlsx";

const { Dragger } = Upload;
const { Text, Title } = Typography;

export function RegistrationBulkModal({ open, onCancel, sessionId }: { open: boolean; onCancel: () => void; sessionId: string }) {
    // State lưu dữ liệu hiển thị trên Table
    const [processedData, setProcessedData] = useState<any[]>([]);
    const toast = useToast();

    const { data: sessions } = useExamSessionList({ page: 1, limit: 100 });
    const currentSession = sessions?.data.find(s => s.id === sessionId);

    const filterMutation = useFilterInvalidStudents();
    const registerMutation = useRegisterStudents(sessionId);

    const handleFileUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const dataArray = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(dataArray, { type: "array" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

                if (jsonData.length === 0) return toast.error("File Excel không có dữ liệu");

                // Bước 1: Map dữ liệu thô từ Excel để render lên Table ngay
                const excelRows = jsonData.map((item: any, index) => ({
                    key: index,
                    studentCode: String(item["Mã SV"] || item["studentCode"] || "").trim(),
                    fullName: item["Họ tên"] || item["fullName"] || "",
                    candidateNumber: String(item["SBD"] || item["Số báo danh"] || item["candidateNumber"] || "").trim(),
                    studentId: null // Mặc định là null cho đến khi API check trả về
                })).filter(i => i.studentCode !== "");

                // Hiển thị dữ liệu thô ra table trước
                setProcessedData(excelRows);

                // Bước 2: Gọi API kiểm tra tài khoản
                const studentCodes = excelRows.map(i => i.studentCode);
                filterMutation.mutate(studentCodes, {
                    onSuccess: (res) => {
                        // res.data là danh sách các SV hợp lệ (có studentId)
                        const validatedStudents = res.data;

                        // Cập nhật lại processedData: Gộp studentId vào đúng hàng
                        const updatedData = excelRows.map(row => {
                            const match = validatedStudents.find((s: any) => s.studentCode === row.studentCode);
                            return {
                                ...row,
                                studentId: match ? match.studentId : null,
                                // Nếu API trả về fullName chuẩn hơn thì cập nhật luôn
                                fullName: match ? match.fullName : row.fullName 
                            };
                        });

                        setProcessedData(updatedData);
                        toast.success("Đã kiểm tra danh sách tài khoản");
                    },
                    onError: (err) => handleError(err, toast)
                });
            } catch (error) {
                toast.error("Lỗi đọc file Excel");
            }
        };
        reader.readAsArrayBuffer(file);
        return false;
    };

    const removeInvalid = () => {
        const onlyValid = processedData.filter(item => !!item.studentId);
        setProcessedData(onlyValid);
        toast.info("Đã xóa các dòng không hợp lệ");
    };

    const handleSave = () => {
        const payload = processedData
            .filter(item => !!item.studentId)
            .map(item => ({
                studentId: item.studentId,
                candidateNumber: item.candidateNumber || item.studentCode
            }));

        if (payload.length === 0) return toast.error("Không có sinh viên nào hợp lệ để đăng ký");

        registerMutation.mutate(payload, {
            onSuccess: () => {
                toast.success("Đăng ký thành công!");
                setProcessedData([]);
                onCancel();
            },
            onError: (err) => handleError(err, toast)
        });
    };

    return (
        <Modal
            title="Đăng ký thí sinh từ Excel"
            open={open}
            onCancel={onCancel}
            width={800}
            onOk={handleSave}
            confirmLoading={registerMutation.isPending}
            okText="Xác nhận đăng ký"
        >
            <Space direction="vertical" className="w-full" size="middle">
                {currentSession && (
                    <Alert
                        icon={<InfoCircleOutlined />}
                        showIcon
                        message={<Text>Ca thi: <Text strong>{currentSession.examSessionCode}</Text></Text>}
                        type="info"
                    />
                )}
                
                <Dragger beforeUpload={handleFileUpload} showUploadList={false}>
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Nhấp hoặc kéo file Excel vào đây</p>
                </Dragger>

                <Card size="small" className="bg-gray-50 border-dashed">
                    <Title level={5} style={{ fontSize: '14px', marginTop: 0 }}>
                        <QuestionCircleOutlined /> Hướng dẫn nhanh:
                    </Title>
                    <ul className="text-xs text-gray-600 pl-4 mb-0">
                        <li>Bước 1: Kéo thả file vào vùng tải lên bên dưới.</li>
                        <li>Bước 2: Kiểm tra trạng thái "Hợp lệ". Nếu hiện <Tag color="error" className="text-[10px]">Chưa có tài khoản</Tag>, vui lòng tạo tài khoản cho sinh viên đó trước.</li>
                        <li>Bước 3: Nhấn <b>Xác nhận đăng ký</b> (Hệ thống sẽ chỉ lưu các dòng hợp lệ).</li>
                    </ul>
                </Card>

                {processedData.length > 0 && (
                    <>
                        <div className="flex justify-between items-center">
                            <Text strong>Danh sách sinh viên ({processedData.length}):</Text>
                            <Button 
                                danger 
                                size="small" 
                                icon={<DeleteOutlined />}
                                onClick={removeInvalid}
                            >
                                Xóa SV chưa có tài khoản
                            </Button>
                        </div>
                        <Table
                            dataSource={processedData}
                            size="small"
                            rowKey="key"
                            pagination={{ pageSize: 5 }}
                            loading={filterMutation.isPending}
                            columns={[
                                { title: "Mã SV", dataIndex: "studentCode" },
                                { title: "Họ tên", dataIndex: "fullName" },
                                { title: "SBD", dataIndex: "candidateNumber" },
                                {
                                    title: "Trạng thái",
                                    dataIndex: "studentId",
                                    render: (id) => id 
                                        ? <Tag color="green">Hợp lệ</Tag> 
                                        : <Tag color="error">Chưa có tài khoản</Tag>
                                }
                            ]}
                        />
                    </>
                )}
            </Space>
        </Modal>
    );
}