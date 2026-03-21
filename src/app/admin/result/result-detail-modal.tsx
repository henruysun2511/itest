import { useResultDetail } from "@/queries/useResultQuery";
import { getResultStatusBadge } from "@/shares/utils/mappingLabel";
import { BookOutlined, CheckCircleFilled, TrophyOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Modal, Progress, Row, Spin, Statistic, Tag, Typography } from "antd";

const { Title, Text } = Typography;

interface Props {
    open: boolean;
    onClose: () => void;
    resultId?: string;
}

export function ResultDetailModal({ open, onClose, resultId }: Props) {
    const { data, isLoading } = useResultDetail(resultId || "", open);
    const detail = data?.data;
    const scoreDetail = detail?.scoreDetail;

    const statusCfg = getResultStatusBadge(detail?.status || "");

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 py-2">
                    <TrophyOutlined className="text-gold-500" />
                    <Title level={4} style={{ margin: 0 }}>Báo cáo kết quả chi tiết</Title>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={900}
            centered
            bodyStyle={{ padding: '0 24px 24px 24px', backgroundColor: '#f8fafc' }}
        >
            <Spin spinning={isLoading}>
                {detail ? (
                    <div className="flex flex-col gap-6 pt-4">
                        {/* Thông tin cơ bản */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap justify-between items-center gap-4">
                            <div className="flex gap-6">
                                <div className="flex flex-col">
                                    <Text type="secondary" className="text-[10px] uppercase font-bold tracking-wider">Sinh viên</Text>
                                    <Text strong className="text-blue-900"><UserOutlined /> {detail.fullName} ({detail.studentCode})</Text>
                                </div>
                                <div className="flex flex-col">
                                    <Text type="secondary" className="text-[10px] uppercase font-bold tracking-wider">Ca thi</Text>
                                    <Text strong><BookOutlined /> {detail.examSessionCode}</Text>
                                </div>
                            </div>
                            <Tag color={statusCfg.color} className="rounded-full border-none font-black px-4 py-1 uppercase">{statusCfg.label}</Tag>
                        </div>

                        {scoreDetail ? (
                            <Row gutter={[20, 20]}>
                                {/* Tổng điểm bên trái */}
                                <Col xs={24} md={9}>
                                    <Card className="rounded-3xl border-none shadow-md text-center py-6 h-full flex flex-col justify-center">
                                        <Title level={5} className="text-slate-400 uppercase tracking-widest mb-6">Kết quả quy đổi</Title>
                                        <div className="mb-6">
                                            <Progress 
                                                type="circle" 
                                                percent={scoreDetail.percent} 
                                                strokeColor={{ '0%': '#4f46e5', '100%': '#2c2c70' }}
                                                strokeWidth={10}
                                                size={160}
                                                format={() => (
                                                    <div className="flex flex-col">
                                                        <span className="text-3xl font-black text-blue-900">{scoreDetail.totalScore}</span>
                                                        <span className="text-[10px] text-slate-400 font-bold border-t pt-1">MAX {scoreDetail.maxScore}</span>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                        <div className="px-6 py-2 bg-slate-50 rounded-2xl inline-block mx-auto">
                                            <Text className="font-black text-blue-800 italic">
                                                {scoreDetail.percent >= 80 ? 'XUẤT SẮC' : scoreDetail.percent >= 50 ? 'ĐẠT' : 'CHƯA ĐẠT'}
                                            </Text>
                                        </div>
                                    </Card>
                                </Col>

                                {/* Thống kê bên phải */}
                                <Col xs={24} md={15}>
                                    <div className="flex flex-col gap-4 h-full">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Card className="rounded-2xl border-none shadow-sm">
                                                <Statistic 
                                                    title={<span className="font-bold text-slate-400 uppercase text-[10px]">Câu đúng</span>}
                                                    value={scoreDetail.totalCorrect}
                                                    suffix={`/ ${scoreDetail.totalQuestions}`}
                                                    valueStyle={{ color: '#059669', fontWeight: 900 }}
                                                    prefix={<CheckCircleFilled className="opacity-20" />}
                                                />
                                            </Card>
                                            <Card className="rounded-2xl border-none shadow-sm">
                                                <Statistic 
                                                    title={<span className="font-bold text-slate-400 uppercase text-[10px]">Tỉ lệ chính xác</span>}
                                                    value={scoreDetail.percent}
                                                    suffix="%"
                                                    valueStyle={{ color: '#2c2c70', fontWeight: 900 }}
                                                />
                                            </Card>
                                        </div>

                                        <Card 
                                            className="rounded-2xl border-none shadow-sm flex-grow" 
                                            title={<span className="font-bold uppercase text-xs">Chi tiết từng phần (Parts)</span>}
                                            bodyStyle={{ padding: '12px 24px' }}
                                        >
                                            <div className="max-h-[220px] overflow-y-auto pr-2 space-y-3">
                                                {scoreDetail.parts?.map((part: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-blue-800 text-xs">
                                                                {part.partIndex}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-700 text-sm">Phần {part.partIndex}</div>
                                                                <div className="text-[10px] text-slate-400">{part.correct}/{part.totalQuestions} câu đúng</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-black text-blue-900">{part.score}đ</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    </div>
                                </Col>
                            </Row>
                        ) : (
                            <Card className="text-center py-10 rounded-3xl border-dashed border-2">
                                <Text type="secondary">Chưa có dữ liệu chấm điểm chi tiết cho ca thi này.</Text>
                            </Card>
                        )}
                    </div>
                ) : (
                    <div className="py-20 text-center text-slate-400">Không tìm thấy dữ liệu kết quả</div>
                )}
            </Spin>
        </Modal>
    );
}