import { Modal, Descriptions, Spin, Divider, Typography, Tag, Table } from "antd";
import { useResultDetail } from "@/queries/useResultQuery";

const { Title, Text } = Typography;

interface Props {
    open: boolean;
    onClose: () => void;
    resultId?: string;
}

export function ResultDetailModal({ open, onClose, resultId }: Props) {
    const { data, isLoading } = useResultDetail(resultId || "", open);
    const detail = data?.data;

    return (
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>Chi tiết kết quả thi</Title>}
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            <Spin spinning={isLoading}>
                {detail ? (
                    <div className="flex flex-col gap-4">
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Mã sinh viên">{detail.studentCode}</Descriptions.Item>
                            <Descriptions.Item label="Họ và tên">{detail.fullName}</Descriptions.Item>
                            <Descriptions.Item label="Ca thi">{detail.examSessionCode}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={detail.status === "NOT_GRADED" ? "orange" : "green"}>{detail.status || "Không xác định"}</Tag>
                            </Descriptions.Item>
                        </Descriptions>

                        {detail.scoreDetail && (
                            <>
                                {detail.scoreDetail.parts && detail.scoreDetail.parts.length > 0 && (
                                    <>
                                        <Title level={5} style={{ marginTop: 16, marginBottom: 12 }}>Chi tiết từng phần thi (Part)</Title>
                                        <Table
                                            rowKey="partIndex"
                                            dataSource={detail.scoreDetail.parts}
                                            columns={[
                                                { title: "Phần thi", dataIndex: "partIndex", render: (val) => `Part ${val}` },
                                                { title: "Tổng số câu", dataIndex: "totalQuestions", align: "center" },
                                                { title: "Số câu đúng", dataIndex: "correct", align: "center" },
                                                { title: "Điểm phần thi", dataIndex: "score", align: "center", render: (val) => <Text strong>{val}</Text> }
                                            ]}
                                            pagination={false}
                                            size="small"
                                            bordered
                                        />
                                    </>
                                )}

                                <Title level={5} style={{ marginTop: 16, marginBottom: 12 }}>Thông tin điểm tổng quát</Title>
                                <Descriptions bordered column={3} size="small" layout="vertical">
                                    <Descriptions.Item label="Tổng câu hỏi">{detail.scoreDetail.totalQuestions}</Descriptions.Item>
                                    <Descriptions.Item label="Số câu đúng">{detail.scoreDetail.totalCorrect}</Descriptions.Item>
                                    <Descriptions.Item label="Tổng điểm quy đổi">
                                        <Text strong className={detail.scoreDetail.totalScore < 5 ? "text-red-500" : ""}>
                                            {detail.scoreDetail.totalScore}
                                        </Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Điểm gốc">{detail.scoreDetail.maxScore}</Descriptions.Item>
                                    <Descriptions.Item label="Tỉ lệ đúng">{detail.scoreDetail.percent}%</Descriptions.Item>
                                </Descriptions>
                            </>
                        )}
                        {!detail.scoreDetail && (
                            <div className="text-center py-4 text-gray-500">
                                Chưa có dữ liệu điểm chi tiết
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-10 text-center">Không tìm thấy thông tin chi tiết</div>
                )}
            </Spin>
        </Modal>
    );
}
