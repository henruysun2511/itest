import { useToast } from "@/hooks/useToast";
import { useRegisterStudents } from "@/queries/useExamRegistrationQuery";
import { handleError } from "@/shares/utils/error";
import { DeleteOutlined, FileExcelOutlined, InboxOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Card, Modal, Space, Table, Tag, Typography, Upload } from "antd";
import { useState } from "react";
import * as XLSX from "xlsx";

const { Dragger } = Upload;
const { Text, Title } = Typography;

interface BulkModalProps {
    open: boolean;
    onCancel: () => void;
    sessionId: string;
    sessionInfo: { code: string; room: string };
}

export function RegistrationBulkModal({ open, onCancel, sessionId, sessionInfo }: BulkModalProps) {
    const [processedData, setProcessedData] = useState<any[]>([]);
    const toast = useToast();

    // Hook đăng ký thí sinh vào ca thi
    const registerMutation = useRegisterStudents(sessionId);

    const handleFileUpload = (file: File) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);

                const workbook = XLSX.read(data, {
                    type: "array",
                    cellDates: false
                });

                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const range = XLSX.utils.decode_range(sheet["!ref"] || "");

                const getCellValue = (row: number, col: number) => {
                    const cell = sheet[XLSX.utils.encode_cell({ r: row, c: col })];
                    if (!cell) return "";

                    if (cell.w !== undefined) return String(cell.w).trim();
                    if (cell.v !== undefined) return String(cell.v).trim();

                    return "";
                };

                const headers: string[] = [];

                for (let C = range.s.c; C <= range.e.c; C++) {
                    headers.push(getCellValue(range.s.r, C).toLowerCase());
                }

                const findCol = (names: string[]) =>
                    headers.findIndex((h) =>
                        names.some((name) => h.includes(name))
                    );

                const colStudentCode = findCol(["mã sv", "studentcode"]);
                const colFullName = findCol(["họ tên", "fullname"]);
                const colDOB = findCol(["ngày sinh", "dateofbirth"]);
                const colSBD = findCol(["sbd", "số báo danh"]);

                if (colStudentCode === -1) {
                    toast.error("Không tìm thấy cột Mã SV");
                    return;
                }

                const rows: any[] = [];
                const studentSet = new Set();
                const sbdSet = new Set();

                for (let R = range.s.r + 1; R <= range.e.r; R++) {

                    const studentCode = getCellValue(R, colStudentCode);
                    if (!studentCode) continue;

                    const fullName = colFullName >= 0
                        ? getCellValue(R, colFullName)
                        : "";

                    let dob = colDOB >= 0
                        ? getCellValue(R, colDOB)
                        : "";

                    const sbd = colSBD >= 0
                        ? getCellValue(R, colSBD)
                        : "";

                    let error = "";

                    if (!fullName) error = "Thiếu họ tên";

                    if (studentSet.has(studentCode))
                        error = "Trùng MSSV trong file";

                    if (sbd && sbdSet.has(sbd))
                        error = "Trùng SBD trong file";

                    studentSet.add(studentCode);
                    if (sbd) sbdSet.add(sbd);

                    if (dob && dob.includes("/")) {
                        const parts = dob.split("/");
                        if (parts.length === 3) {
                            dob = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
                        }
                    }

                    rows.push({
                        key: R,
                        studentCode,
                        fullName,
                        dateOfBirth: dob,
                        candidateNumber: sbd,
                        error
                    });
                }

                if (rows.length === 0) {
                    toast.error("File không có dữ liệu hợp lệ");
                    return;
                }

                setProcessedData(rows);

                const errorCount = rows.filter(r => r.error).length;

                if (errorCount > 0) {
                    toast.warning(`Có ${errorCount} dòng lỗi cần kiểm tra`);
                } else {
                    toast.success(`Đã tải ${rows.length} thí sinh`);
                }

            } catch (err) {
                console.error(err);
                toast.error("Lỗi đọc file Excel");
            }
        };

        reader.readAsArrayBuffer(file);

        return false;
    };

    const handleSave = () => {

        const validRows = processedData.filter(r => !r.error);

        if (validRows.length === 0) {
            toast.error("Không có dữ liệu hợp lệ để đăng ký");
            return;
        }

        const payload = validRows.map(item => ({
            studentCode: item.studentCode,
            fullName: item.fullName,
            dateOfBirth: item.dateOfBirth,
            candidateNumber: item.candidateNumber || item.studentCode
        }));

        registerMutation.mutate(payload, {
            onSuccess: () => {
                toast.success("Đăng ký thành công!");
                setProcessedData([]);
                onCancel();
            },
            onError: (err) => handleError(err, toast)
        });
    };

    const clearData = () => {
        setProcessedData([]);
        toast.info(" Đã xóa danh sách hiện tại");
    };

    return (
        <Modal
            title={<Space><FileExcelOutlined /> Đăng ký thí sinh hàng loạt</Space>}
            open={open}
            onCancel={onCancel}
            width={900}
            onOk={handleSave}
            confirmLoading={registerMutation.isPending}
            okText="Xác nhận đăng ký"
            destroyOnClose
        >
            <Space direction="vertical" className="w-full" size="middle">
                {/* Thông tin ca thi hiện tại */}
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                    <Text>Đang thêm thí sinh vào: </Text>
                    <Text strong className="text-blue-700">
                        {sessionInfo.code} {sessionInfo.room ? `- Phòng: ${sessionInfo.room}` : ""}
                    </Text>
                </div>

                <Card size="small" className="bg-gray-50 border-dashed">
                    <Title level={5} style={{ fontSize: '14px', marginTop: 0 }}>
                        <QuestionCircleOutlined /> Hướng dẫn:
                    </Title>
                    <ul className="text-xs text-gray-600 pl-4 mb-0">
                        <li>Cột trong file cần có: <b>Mã SV, Họ tên, Ngày sinh, SBD</b> (hoặc tên tiếng Anh tương ứng).</li>
                        <li>Hệ thống sẽ dựa trên <b>Mã SV</b> để ghi nhận thí sinh vào ca thi.</li>
                    </ul>
                </Card>

                <Dragger beforeUpload={handleFileUpload} showUploadList={false}>
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Nhấp hoặc kéo file Excel vào đây để bắt đầu</p>
                </Dragger>

                {processedData.length > 0 && (
                    <>
                        <div className="flex justify-between items-center">
                            <Text strong>Danh sách chờ đăng ký ({processedData.length}):</Text>
                            <Button
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={clearData}
                            >
                                Xóa toàn bộ
                            </Button>
                        </div>
                        <Table
                            dataSource={processedData}
                            size="small"
                            rowKey="key"
                            pagination={{ pageSize: 5 }}
                            columns={[
                                {
                                    title: "Mã SV",
                                    dataIndex: "studentCode",
                                    width: 120
                                },
                                {
                                    title: "Họ tên",
                                    dataIndex: "fullName"
                                },
                                {
                                    title: "Ngày sinh",
                                    dataIndex: "dateOfBirth",
                                    width: 120
                                },
                                {
                                    title: "SBD",
                                    dataIndex: "candidateNumber",
                                    width: 100,
                                    render: (v) => String(v)
                                },
                                {
                                    title: "Trạng thái",
                                    dataIndex: "error",
                                    width: 180,
                                    render: (v) =>
                                        v
                                            ? <Tag color="red">{v}</Tag>
                                            : <Tag color="green">Hợp lệ</Tag>
                                }
                            ]}
                        />
                    </>
                )}
            </Space>
        </Modal>
    );
}

// export function RegistrationBulkModal({ open, onCancel, sessionId, sessionInfo }: BulkModalProps) {
//     // State lưu dữ liệu hiển thị trên Table
//     const [processedData, setProcessedData] = useState<any[]>([]);
//     const toast = useToast();


//     const filterMutation = useFilterInvalidStudents();
//     const registerMutation = useRegisterStudents(sessionId);


//     const handleFileUpload = (file: File) => {
//         const reader = new FileReader();
//         reader.onload = async (e) => {
//             try {
//                 const dataArray = new Uint8Array(e.target?.result as ArrayBuffer);
//                 const workbook = XLSX.read(dataArray, { type: "array" });
//                 const sheet = workbook.Sheets[workbook.SheetNames[0]];
//                 const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

//                 if (jsonData.length === 0) return toast.error("File Excel không có dữ liệu");

//                 // Bước 1: Map dữ liệu thô từ Excel để render lên Table ngay
//                 const excelRows = jsonData.map((item: any, index) => ({
//                     key: index,
//                     studentCode: String(item["Mã SV"] || item["studentCode"] || "").trim(),
//                     fullName: item["Họ tên"] || item["fullName"] || "",
//                     candidateNumber: String(item["SBD"] || item["Số báo danh"] || item["candidateNumber"] || "").trim(),
//                     studentId: null // Mặc định là null cho đến khi API check trả về
//                 })).filter(i => i.studentCode !== "");

//                 // Hiển thị dữ liệu thô ra table trước
//                 setProcessedData(excelRows);

//                 // Bước 2: Gọi API kiểm tra tài khoản
//                 // Bước 2: Gọi API kiểm tra tài khoản
//                 const studentCodes = excelRows.map(i => i.studentCode);
//                 filterMutation.mutate(studentCodes, {
//                     onSuccess: (res) => {
//                         // Lưu ý: Kiểm tra kỹ cấu trúc res.data của bạn
//                         // Nếu res.data đã là mảng thì dùng res.data, nếu bọc trong .data nữa thì dùng res.data.data
//                         const validatedStudents = res.data?.data || res.data || [];

//                         // Cập nhật lại processedData: Gộp studentId vào đúng hàng
//                         const updatedData = excelRows.map(row => {
//                             const match = validatedStudents.find((s: any) => s.studentCode === row.studentCode);

//                             return {
//                                 ...row,
//                                 // Gán studentId nếu tìm thấy
//                                 studentId: match ? (match.studentId) : null,

//                                 // Logic FullName:
//                                 // 1. Nếu match và có fullName từ backend -> Lấy backend
//                                 // 2. Nếu không có từ backend -> Giữ nguyên row.fullName (từ Excel)
//                                 fullName: (match && match.fullName) ? match.fullName : row.fullName
//                             };
//                         });

//                         setProcessedData(updatedData);
//                         toast.success("Đã kiểm tra danh sách tài khoản");
//                     },
//                     onError: (err) => handleError(err, toast)
//                 });
//             } catch (error) {
//                 toast.error("Lỗi đọc file Excel");
//             }
//         };
//         reader.readAsArrayBuffer(file);
//         return false;
//     };

//     const removeInvalid = () => {
//         const onlyValid = processedData.filter(item => !!item.studentId);
//         setProcessedData(onlyValid);
//         toast.info("Đã xóa các dòng không hợp lệ");
//     };

//     const handleSave = () => {
//         const payload = processedData
//             .filter(item => !!item.studentId)
//             .map(item => ({
//                 studentId: item.studentId,
//                 candidateNumber: item.candidateNumber || item.studentCode
//             }));

//         if (payload.length === 0) return toast.error("Không có sinh viên nào hợp lệ để đăng ký");

//         registerMutation.mutate(payload, {
//             onSuccess: () => {
//                 toast.success("Đăng ký thành công!");
//                 setProcessedData([]);
//                 onCancel();
//             },
//             onError: (err) => handleError(err, toast)
//         });
//     };

//     return (
//         <Modal
//             title={<Space><FileExcelOutlined /> Đăng ký thí sinh hàng loạt</Space>}
//             open={open}
//             onCancel={onCancel}
//             width={850}
//             onOk={handleSave}
//             confirmLoading={registerMutation.isPending}
//             okText="Xác nhận đăng ký"
//             destroyOnClose
//         >
//             <Space direction="vertical" className="w-full" size="middle">
//                 {/* Hiển thị trực tiếp từ sessionInfo nhận được qua props */}
//                 <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
//                     <Text>Đang thêm thí sinh vào: </Text>
//                     <Text strong className="text-blue-700">
//                         {sessionInfo.code} {sessionInfo.room ? `- Phòng: ${sessionInfo.room}` : ""}
//                     </Text>
//                 </div>

//                 <Card size="small" className="bg-gray-50 border-dashed">
//                     <Title level={5} style={{ fontSize: '14px', marginTop: 0 }}>
//                         <QuestionCircleOutlined /> Hướng dẫn nhanh:
//                     </Title>
//                     <ul className="text-xs text-gray-600 pl-4 mb-0">
//                         <li>Bước 1: Kéo thả file vào vùng tải lên bên dưới.</li>
//                         <li>Bước 2: Kiểm tra trạng thái "Hợp lệ". Nếu hiện <Tag color="error" className="text-[10px]">Chưa có tài khoản</Tag>, vui lòng tạo tài khoản cho sinh viên đó trước.</li>
//                         <li>Bước 3: Nhấn <b>Xác nhận đăng ký</b> (Hệ thống sẽ chỉ lưu các dòng hợp lệ).</li>
//                     </ul>
//                 </Card>


//                 <Dragger beforeUpload={handleFileUpload} showUploadList={false}>
//                     <p className="ant-upload-drag-icon"><InboxOutlined /></p>
//                     <p className="ant-upload-text">Nhấp hoặc kéo file Excel vào đây</p>
//                 </Dragger>



//                 {processedData.length > 0 && (
//                     <>
//                         <div className="flex justify-between items-center">
//                             <Text strong>Danh sách sinh viên ({processedData.length}):</Text>
//                             <Button
//                                 danger
//                                 size="small"
//                                 icon={<DeleteOutlined />}
//                                 onClick={removeInvalid}
//                             >
//                                 Xóa SV chưa có tài khoản
//                             </Button>
//                         </div>
//                         <Table
//                             dataSource={processedData}
//                             size="small"
//                             rowKey="key"
//                             pagination={{ pageSize: 5 }}
//                             loading={filterMutation.isPending}
//                             columns={[
//                                 { title: "Mã SV", dataIndex: "studentCode" },
//                                 { title: "Họ tên", dataIndex: "fullName" },
//                                 { title: "SBD", dataIndex: "candidateNumber" },
//                                 {
//                                     title: "Trạng thái",
//                                     dataIndex: "studentId",
//                                     render: (id) => id
//                                         ? <Tag color="green">Hợp lệ</Tag>
//                                         : <Tag color="error">Chưa có tài khoản</Tag>
//                                 }
//                             ]}
//                         />
//                     </>
//                 )}
//             </Space>
//         </Modal>
//     );
// }