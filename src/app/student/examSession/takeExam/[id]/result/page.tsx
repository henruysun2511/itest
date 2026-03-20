"use client";
import { useExamStore } from '@/stores/useExamStore';
import { Card, Col, Progress, Result, Row, Statistic } from 'antd';

export default function ExamResultPage() {
    const examResult = useExamStore((state) => state.examResult);

    if (!examResult) {
        return <Result status="404" title="Không tìm thấy kết quả bài thi" />;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Card className="rounded-3xl shadow-xl border-none text-center">
                <h2 className="text-2xl font-bold mb-6">KẾT QUẢ BÀI THI</h2>
                
                <div className="flex justify-center mb-8">
                    <Progress 
                        type="circle" 
                        percent={examResult.percent} 
                        strokeColor="#2c2c70"
                        format={() => `${examResult.totalScore}/${examResult.maxScore}`}
                    />
                </div>

                <Row gutter={16}>
                    <Col span={8}>
                        <Statistic title="Số câu đúng" value={examResult.totalCorrect} suffix={`/ ${examResult.totalQuestions}`} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="Điểm số" value={examResult.totalScore} precision={2} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="Tỉ lệ" value={examResult.percent} suffix="%" />
                    </Col>
                </Row>
            </Card>
        </div>
    );
}