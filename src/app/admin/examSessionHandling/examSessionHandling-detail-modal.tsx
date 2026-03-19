import { ExamSessionHandling } from "@/shares/types/object";
import { getHandlingTypeBadge } from "@/shares/utils/mappingLabel";
import { Descriptions, Modal, Tag } from "antd";
import dayjs from "dayjs";

interface Props {
    open: boolean;
    onClose: () => void;
    data: ExamSessionHandling | null;
}

export default function ExamHandlingDetailModal({ open, onClose, data }: Props) {
    if (!data) return null;

    const badge = getHandlingTypeBadge(data.type);

    return (
        <Modal
            title={<span className="text-lg font-bold">Chi tiết xử lý vi phạm</span>}
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
            centered
            className="rounded-xl overflow-hidden"
        >
            <Descriptions 
                bordered 
                column={1} 
                size="middle" 
                className="mt-4"
                labelStyle={{ width: '160px', fontWeight: 600, backgroundColor: '#fafafa' }}
            >
                <Descriptions.Item label="Mã ca thi">
                    <span className="font-bold text-blue-600">{data.examSessionCode}</span>
                </Descriptions.Item>
                
                <Descriptions.Item label="Mã sinh viên">
                    <span className="font-mono font-medium">{data.studentCode}</span>
                </Descriptions.Item>

                {data.fullName && (
                    <Descriptions.Item label="Tên sinh viên">
                        <span className="font-semibold text-slate-700">{data.fullName}</span>
                    </Descriptions.Item>
                )}

                <Descriptions.Item label="Giảng viên xử lý">
                    {data.teacherName}
                </Descriptions.Item>

                <Descriptions.Item label="Hình thức xử lý">
                    <Tag 
                        color={badge.color} 
                        style={{ 
                            margin: 0, 
                            fontSize: '13px', 
                            fontWeight: 600, 
                            padding: '2px 12px',
                            borderRadius: '6px'
                        }}
                    >
                        {badge.label}
                    </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Thời gian lập biên bản">
                    {data.createdAt ? dayjs(data.createdAt).format("HH:mm:ss - DD/MM/YYYY") : "---"}
                </Descriptions.Item>

                <Descriptions.Item label="Lý do chi tiết">
                    <div className="whitespace-pre-wrap text-slate-600 leading-relaxed italic">
                        "{data.reason}"
                    </div>
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
}