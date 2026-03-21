"use client";
import { useExamStore } from '@/stores/useExamStore';
import { CheckCircleFilled, TrophyOutlined } from '@ant-design/icons';
import { Button, Card, Col, Progress, Result, Row, Statistic, Tag, Typography } from 'antd';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function ExamResultPage() {
    const examResult = useExamStore((state) => state.examResult);
    const router = useRouter();

    if (!examResult) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Result 
                    status="404" 
                    title="Không tìm thấy kết quả" 
                    subTitle="Vui lòng quay lại danh sách lịch sử thi."
                    extra={<Button type="primary" onClick={() => router.push('/student/examSession/history')}>Quay lại</Button>}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Header Điều hướng */}
                <div className="flex items-center justify-between">
                    <Tag color="gold" icon={<TrophyOutlined />} className="px-4 py-1 rounded-full font-bold uppercase border-none shadow-sm">
                        Hoàn thành bài thi
                    </Tag>
                </div>

                <Row gutter={[24, 24]}>
                    {/* Cột Trái: Tổng quan điểm số */}
                    <Col xs={24} lg={8}>
                        <Card className="rounded-3xl shadow-xl border-none text-center h-full flex flex-col justify-center py-8">
                            <Title level={4} className="text-slate-400 uppercase tracking-widest !mb-8">Tổng điểm của bạn</Title>
                            <div className="relative inline-flex mb-8">
                                <Progress 
                                    type="circle" 
                                    percent={examResult.percent} 
                                    strokeColor={{ '0%': '#4f46e5', '100%': '#2c2c70' }}
                                    strokeWidth={10}
                                    size={200}
                                    format={() => (
                                        <div className="flex flex-col">
                                            <span className="text-4xl font-black text-[var(--color-primary)]">
                                                {examResult.totalScore}
                                            </span>
                                            <span className="text-sm text-slate-400 font-bold border-t pt-1">
                                                TỐI ĐA {examResult.maxScore}
                                            </span>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="px-6 py-3 bg-slate-50 rounded-2xl mx-auto">
                                <Text strong className="text-slate-500 uppercase text-[10px]">Xếp loại: </Text>
                                <Text className="font-black text-[var(--color-primary)] ml-1">
                                    {examResult.percent >= 80 ? 'XUẤT SẮC' : examResult.percent >= 50 ? 'ĐẠT' : 'CHƯA ĐẠT'}
                                </Text>
                            </div>
                        </Card>
                    </Col>

                    {/* Cột Phải: Thống kê chi tiết */}
                    <Col xs={24} lg={16}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                            {/* Card Câu đúng */}
                            <Card className="rounded-3xl border-none shadow-md overflow-hidden">
                                <Statistic 
                                    title={<span className="font-bold text-slate-400 uppercase text-xs">Số câu trả lời đúng</span>}
                                    value={examResult.totalCorrect}
                                    suffix={`/ ${examResult.totalQuestions}`}
                                    valueStyle={{ color: '#059669', fontWeight: 900, fontSize: '32px' }}
                                    prefix={<CheckCircleFilled className="mr-2 opacity-20" />}
                                />
                                <Progress percent={(examResult.totalCorrect / examResult.totalQuestions) * 100} showInfo={false} strokeColor="#059669" size="small" className="mt-4" />
                            </Card>

                            {/* Card Tỉ lệ chính xác */}
                            <Card className="rounded-3xl border-none shadow-md overflow-hidden">
                                <Statistic 
                                    title={<span className="font-bold text-slate-400 uppercase text-xs">Tỉ lệ chính xác</span>}
                                    value={examResult.percent}
                                    suffix="%"
                                    valueStyle={{ color: '#2c2c70', fontWeight: 900, fontSize: '32px' }}
                                />
                                <Progress percent={examResult.percent} showInfo={false} strokeColor="#2c2c70" size="small" className="mt-4" />
                            </Card>

                            {/* Danh sách các Part từ API thực tế */}
                            <Card className="rounded-3xl border-none shadow-md md:col-span-2" title={<span className="font-bold uppercase text-sm">Chi tiết từng phần</span>}>
                                <div className="space-y-4">
                                    {examResult.parts?.map((part: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-[var(--color-primary)]">
                                                    {part.partIndex || index + 1}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-700">Phần {part.partIndex || index + 1}</div>
                                                    <div className="text-xs text-slate-400">{part.correct}/{part.totalQuestions} câu đúng</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-black text-[var(--color-primary)]">{part.score} điểm</div>
                                                <Text type="secondary" style={{fontSize: 10}}>SCORE</Text>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>

                {/* Footer action */}
                <div className="flex justify-center pt-6">
                    <Button 
                        size="large" 
                        className="rounded-full px-12 h-14 font-bold border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all"
                        onClick={() => router.push('/student/profile')}
                    >
                        XEM LẠI LỊCH SỬ THI
                    </Button>
                </div>
            </div>
        </div>
    );
}