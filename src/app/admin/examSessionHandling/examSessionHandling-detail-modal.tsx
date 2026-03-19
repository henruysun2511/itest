import { ExamSessionHandling } from "@/types/object";
import { Descriptions, Modal, Tag } from "antd";
import { handlingTypeMap } from "./examSessionHandling-table";

interface Props {
    open: boolean;
    onClose: () => void;
    data: ExamSessionHandling | null;
}

export default function ExamHandlingDetailModal({ open, onClose, data }: Props) {
    if (!data) return null;

    return (
        <Modal
            title="Chi tiết xử lý vi phạm"
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <Descriptions bordered column={1} size="small" className="mt-4">
                <Descriptions.Item label="Mã ca thi">
                    <span className="font-medium text-blue-600">{data.examSessionCode}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Mã sinh viên">
                    {data.studentCode}
                </Descriptions.Item>
                {data.fullName && (
                    <Descriptions.Item label="Tên sinh viên">
                        {data.fullName}
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="Người xử lý">
                    {data.teacherName}
                </Descriptions.Item>
                <Descriptions.Item label="Loại vi phạm">
                    {(() => {
                        const typeVal = data.type?.toUpperCase();
                        const mapped = handlingTypeMap[typeVal];
                        return (
                            <Tag 
                                color={mapped?.color || "red"} 
                                style={{ margin: 0, fontSize: '14px', padding: '2px 0px' }}
                            >
                                {mapped?.label || data.type || "Không xác định"}
                            </Tag>
                        );
                    })()}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian xử lý">
                    {data.createdAt ? new Date(data.createdAt).toLocaleString("vi-VN") : ""}
                </Descriptions.Item>
                <Descriptions.Item label="Lý do">
                    <div className="whitespace-pre-wrap">{data.reason}</div>
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
}
