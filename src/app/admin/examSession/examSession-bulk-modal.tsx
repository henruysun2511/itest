import { ExamSessionStatus } from "@/constants/status.enum";
import { useExamSessionCreateMany } from "@/queries/useExamSessionQuery";
import { InboxOutlined } from "@ant-design/icons";
import { Modal, Table, Upload } from "antd";
import { useState } from "react";
import * as XLSX from "xlsx";

const { Dragger } = Upload;

export function ExamSessionBulkModal({ open, onCancel }: { open: boolean; onCancel: () => void }) {
    const [dataPreview, setDataPreview] = useState<any[]>([]);
    const { mutate, isPending } = useExamSessionCreateMany();

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const workbook = XLSX.read(e.target?.result, { type: "binary" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

            const formatted = jsonData.map(item => ({
                examSessionCode: String(item["Mã ca thi"] || item.examSessionCode || "").trim(),
                date: item["Ngày"] || item.date,
                startTime: item["Bắt đầu"] || item.startTime,
                endTime: item["Kết thúc"] || item.endTime,
                status: ExamSessionStatus.IN_PROGRESS 
            }));

            setDataPreview(formatted.filter(i => i.examSessionCode));
        };
        reader.readAsBinaryString(file);
    };

    const handleUpload = () => {
        mutate(dataPreview, {
            onSuccess: () => {
                setDataPreview([]);
                onCancel();
            }
        });
    };

    return (
        <Modal
            open={open}
            title="Import ca thi hàng loạt"
            onCancel={onCancel}
            width={700}
            onOk={handleUpload}
            confirmLoading={isPending}
            okButtonProps={{ disabled: dataPreview.length === 0 }}
        >
            <Dragger beforeUpload={(file) => { handleFile(file); return false; }} showUploadList={false}>
                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                <p>Kéo thả file Excel chứa danh sách ca thi</p>
            </Dragger>

            {dataPreview.length > 0 && (
                <Table
                    className="mt-4"
                    dataSource={dataPreview.slice(0, 5)}
                    columns={[
                        { title: 'Mã', dataIndex: 'examSessionCode' },
                        { title: 'Ngày', dataIndex: 'date' }
                    ]}
                    pagination={false}
                    size="small"
                />
            )}
        </Modal>
    );
}