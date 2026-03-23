"use client";

import { ArrowLeftOutlined, SaveOutlined, CheckCircleOutlined, AuditOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Form, Input, InputNumber, Row, Space, Typography, Tag, message } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function GradeEssayPage() {
    const params = useParams();
    const resultGradingId = params.id as string;
    const router = useRouter();

    // Mock data for the exam paper
    const mockData = {
        studentName: "Nguyễn Văn A",
        studentCode: "26A4041675",
        examSessionCode: "EXAM-2023-01",
        essayQuestions: [
            {
                id: "q1",
                questionContent: "Phân tích nguyên nhân dẫn đến khủng hoảng kinh tế toàn cầu năm 2008. Theo anh chị, đâu là nguyên nhân cốt lõi nhất?",
                maxScore: 4.0,
                studentAnswer: "Khủng hoảng 2008 bắt nguồn từ bong bóng bất động sản Mỹ. Sự cho vay dưới chuẩn không bị kiểm soát gắt gao làm cho các khoản nợ xấu tăng vọt. Các ngân hàng đầu tư sụp đổ dẫn đến chuỗi sụp đổ domino tài chính toàn cầu. Nguyên nhân cốt lõi nhất là sự tham lam của phố Wall nhưng lại được sự tiếp tay, buông lỏng quản lý của các cơ quan giám sát tài chính Hoa Kỳ tại thời điểm bấy giờ.",
                score: null,
                comment: ""
            },
            {
                id: "q2",
                questionContent: "Nêu và giải thích ngắn gọn các giải pháp mang tính chiến lược để khắc phục hậu quả của biến đổi khí hậu tại Đồng bằng sông Cửu Long.",
                maxScore: 3.5,
                studentAnswer: "Các giải pháp bao gồm: Xây dựng hệ thống đê điều kiên cố ngầm ven biển, chuyển đổi cơ cấu cây trồng sang các giống chịu mặn tốt như lúa lai, tái định cư các vùng ngập lụt nguy cơ cao, và giáo dục nâng cao nhận thức cộng đồng để hạn chế phá rừng ngập mặn.",
                score: null,
                comment: ""
            }
        ],
        objectiveScore: 2.5, // Điểm trắc nghiệm (nếu có) để tham khảo
        role: "GRADER_1",
    };

    const [generalComment, setGeneralComment] = useState("");
    const [scores, setScores] = useState<Record<string, number>>({});
    const [comments, setComments] = useState<Record<string, string>>({});

    const handleScoreChange = (qId: string, value: number | null) => {
        if (value !== null) {
            setScores(prev => ({ ...prev, [qId]: value }));
        }
    };

    const handleCommentChange = (qId: string, value: string) => {
        setComments(prev => ({ ...prev, [qId]: value }));
    };

    const totalEssayScore = mockData.essayQuestions.reduce((sum, q) => sum + (scores[q.id] || 0), 0);
    const finalScore = mockData.objectiveScore + totalEssayScore;

    const handleSubmit = () => {
        // Validate if all scores are filled
        const missing = mockData.essayQuestions.find(q => scores[q.id] === undefined);
        if (missing) {
            message.error("Vui lòng chấm điểm đầy đủ cho tất cả các câu hỏi tự luận!");
            return;
        }

        const payload = {
            resultGradingId,
            scoreDetail: mockData.essayQuestions.map(q => ({
                questionId: q.id,
                score: scores[q.id] || 0,
                comment: comments[q.id] || ""
            })),
            totalScore: totalEssayScore,
            comment: generalComment
        };

        console.log("Submitting payload:", payload);
        message.success("Chấm điểm thành công! Kết quả đã được ghi nhận.");
        setTimeout(() => router.push("/teacher/result-grading"), 1000);
    };

    return (
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto min-h-screen bg-[var(--color-bg-base)] font-inter">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <Space size="middle" className="flex items-center">
                    <Button 
                        icon={<ArrowLeftOutlined />} 
                        type="text" 
                        size="large" 
                        className="bg-white hover:bg-slate-100 rounded-xl shadow-sm border border-slate-200 transition-all flex items-center justify-center p-3"
                        onClick={() => router.push("/teacher/result-grading")} 
                    />
                    <div>
                        <Title level={3} className="!m-0 text-slate-800">Chấm thi tự luận</Title>
                        <Text className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1 block">ID P.CÔNG: {resultGradingId}</Text>
                    </div>
                </Space>
                <Tag color="purple" className="px-5 py-2 text-sm font-bold rounded-xl border-2 border-purple-200">
                    BẠN CHẤM VAI TRÒ: {mockData.role.replace('_', ' ')}
                </Tag>
            </div>

            <Row gutter={[24, 24]}>
                {/* Cột trái: Bài làm */}
                <Col xs={24} lg={16}>
                    <Card className="rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 mb-6 bg-white overflow-hidden relative" bodyStyle={{ padding: "32px 40px" }}>
                        <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                        <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-slate-100">
                            <Space direction="vertical" size={4}>
                                <Text className="text-2xl font-bold text-slate-800">{mockData.studentName}</Text>
                                <Space className="opacity-80">
                                    <Text className="font-medium text-slate-600">MSSV:</Text>
                                    <Tag className="rounded-md font-mono m-0 bg-slate-100 border-none px-3">{mockData.studentCode}</Tag>
                                </Space>
                            </Space>
                            <div className="text-right bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100/50 relative overflow-hidden group">
                                <Text type="secondary" className="block text-xs uppercase tracking-widest font-bold text-blue-400 mb-1">Cụm ca thi</Text>
                                <Text className="m-0 font-extrabold text-blue-700 text-lg tracking-tight">{mockData.examSessionCode}</Text>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all"></div>
                            </div>
                        </div>

                        {mockData.essayQuestions.map((q, index) => (
                            <div key={q.id} className="mb-14 last:mb-0 relative">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1 pr-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="bg-slate-800 text-white font-bold h-8 flex items-center justify-center px-4 rounded-lg text-sm">Câu {index + 1}</div>
                                            <div className="bg-[var(--color-navy-light)]/10 text-[var(--color-navy-main)] font-extrabold px-3 py-1 rounded-md text-sm border border-[var(--color-navy-main)]/20 shadow-sm">
                                                Max {q.maxScore}đ
                                            </div>
                                        </div>
                                        <Title level={5} className="!m-0 text-slate-800 leading-relaxed font-semibold">
                                            {q.questionContent}
                                        </Title>
                                    </div>
                                </div>
                                <div className="bg-[#fcfdfd] p-6 sm:p-8 rounded-2xl border border-slate-200 mt-5 relative">
                                    <div className="absolute -left-3 top-6 bottom-6 w-1 rounded-full bg-gradient-to-b from-blue-300 to-indigo-300"></div>
                                    <Paragraph className="text-lg leading-[1.8] text-slate-700 m-0 whitespace-pre-wrap font-medium">
                                        {q.studentAnswer}
                                    </Paragraph>
                                </div>
                                
                                <div className="mt-6 bg-slate-50 border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                                    <Row gutter={24} align="middle">
                                        <Col xs={24} sm={8} lg={6}>
                                            <Form.Item label={<Text className="font-bold text-slate-700 uppercase tracking-widest text-[11px]">Chấm điểm</Text>} required className="mb-0">
                                                <InputNumber 
                                                    min={0} 
                                                    max={q.maxScore} 
                                                    step={0.25}
                                                    size="large"
                                                    className="w-full text-lg font-bold shadow-sm rounded-xl border-blue-200"
                                                    placeholder="VD: 2.5"
                                                    value={scores[q.id]}
                                                    onChange={(val) => handleScoreChange(q.id, val)}
                                                    addonAfter={<span className="font-bold text-slate-500">/ {q.maxScore}</span>}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={16} lg={18}>
                                            <Form.Item label={<Text className="font-bold text-slate-700 uppercase tracking-widest text-[11px]">Lý do / nhận xét</Text>} className="mb-0">
                                                <Input 
                                                    placeholder="Lưu ý: Bạn trừ điểm đoạn nào nhớ note vào đây nhé..." 
                                                    size="large"
                                                    className="rounded-xl border-slate-300 hover:border-blue-400 focus:border-blue-500 bg-white"
                                                    value={comments[q.id]}
                                                    onChange={(e) => handleCommentChange(q.id, e.target.value)}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                                {index < mockData.essayQuestions.length - 1 && (
                                   <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mt-12 w-full"></div>
                                )}
                            </div>
                        ))}
                    </Card>
                </Col>

                {/* Cột phải: Tổng quan điểm */}
                <Col xs={24} lg={8}>
                    <div className="sticky top-8">
                        <Card className="rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 bg-white overflow-hidden" bodyStyle={{ padding: 0 }}>
                            <div className="bg-[var(--color-navy-deep)] p-6 text-white text-center rounded-b-3xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-accent)] rounded-full blur-[60px] opacity-30 -mr-10 -mt-10"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full blur-[50px] opacity-30 -ml-10 -mb-10"></div>
                                
                                <Title level={4} className="text-white/90 !m-0 font-medium uppercase tracking-widest text-sm mb-2 relative z-10 flex justify-center items-center gap-2">
                                    Tổng điểm bài thi
                                </Title>
                                <div className="text-6xl font-black mt-3 mb-2 tracking-tighter text-white drop-shadow-md relative z-10">
                                    {finalScore.toFixed(2)}
                                </div>
                            </div>
                            
                            <div className="p-8">
                                <div className="space-y-4 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
                                        <Text className="text-slate-500 font-medium text-sm">Điểm trắc nghiệm máy chấm</Text>
                                        <div className="bg-slate-200 px-3 py-1 rounded-md font-bold text-slate-700 shadow-inner">
                                            {mockData.objectiveScore.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Text className="text-slate-500 font-medium text-sm">Điểm tự luận bạn chấm</Text>
                                        <div className="bg-blue-100 px-3 py-1 rounded-md font-bold text-blue-700 shadow-sm border border-blue-200">
                                            +{totalEssayScore.toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                <Form layout="vertical">
                                    <Form.Item label={<Text strong className="text-slate-700 uppercase text-[11px] tracking-widest">Đánh giá chung toàn bài</Text>}>
                                        <TextArea 
                                            rows={5} 
                                            placeholder="Đừng quên để lại lời khen ngợi cho sinh viên nếu bài làm xuất sắc nha!" 
                                            className="rounded-2xl border border-slate-300 hover:border-[var(--color-navy-main)] focus:border-[var(--color-navy-main)] bg-white p-4 shadow-sm"
                                            value={generalComment}
                                            onChange={(e) => setGeneralComment(e.target.value)}
                                        />
                                    </Form.Item>

                                    <Button 
                                        type="primary" 
                                        size="large" 
                                        block 
                                        icon={<CheckCircleOutlined className="text-xl" />}
                                        className="h-16 rounded-2xl text-[17px] font-black tracking-wide bg-[var(--color-accent)] hover:bg-orange-500 hover:-translate-y-1 shadow-lg hover:shadow-orange-500/30 transition-all border-none mt-4 text-white uppercase"
                                        onClick={handleSubmit}
                                    >
                                        LƯU & XUẤT ĐIỂM
                                    </Button>
                                </Form>
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
