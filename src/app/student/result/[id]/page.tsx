"use client";

import { useResultDetail } from "@/queries/useResultQuery";
import {
    ArrowLeftOutlined,
    CheckCircleFilled,
    LoadingOutlined,
    TrophyOutlined
} from '@ant-design/icons';
import {
    Result as AntResult,
    Button,
    Card,
    Col,
    Progress,
    Row,
    Spin,
    Statistic,
    Tag,
    Typography
} from 'antd';
import { useParams, useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function StudentExamResultDetailPage() {
    const router = useRouter();
    const params = useParams();
    const resultId = params.id as string;

    // Lấy dữ liệu chi tiết từ API
    const { data, isLoading, isError } = useResultDetail(resultId);
    
    const resultData = data?.data;
    const scoreDetail = resultData?.scoreDetail;

    // Trạng thái đang tải
    if (isLoading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                <Text className="mt-4 text-slate-500 font-medium">Đang tải kết quả bài thi...</Text>
            </div>
        );
    }

    // Trạng thái lỗi hoặc không tìm thấy dữ liệu
    if (isError || !resultData || !scoreDetail) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
                <AntResult 
                    status="404" 
                    title="Không tìm thấy kết quả" 
                    subTitle="Dữ liệu kết quả không tồn tại hoặc bạn không có quyền truy cập bài thi này."
                    extra={
                        <Button type="primary" onClick={() => router.back()}>
                            Quay lại trang trước
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Header & Điều hướng */}
                <div className="flex items-center justify-between">
                    <Button 
                        icon={<ArrowLeftOutlined />} 
                        type="text" 
                        onClick={() => router.back()}
                        className="flex items-center font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                        Quay lại
                    </Button>
                    <Tag color="gold" icon={<TrophyOutlined />} className="px-4 py-1 rounded-full font-bold uppercase border-none shadow-sm m-0">
                        Chi tiết bài thi: {resultData.examSessionCode}
                    </Tag>
                </div>

                <Row gutter={[24, 24]}>
                    {/* Cột Trái: Tổng quan điểm số */}
                    <Col xs={24} lg={8}>
                        <Card className="rounded-3xl shadow-xl border-none text-center h-full flex flex-col justify-center py-8">
                            <Title level={4} className="text-slate-400 uppercase tracking-widest !mb-8">Tổng điểm của bạn</Title>
                            <div className="relative inline-flex mb-8 justify-center">
                                <Progress 
                                    type="circle" 
                                    percent={scoreDetail.percent} 
                                    strokeColor={{ '0%': '#4f46e5', '100%': '#2c2c70' }}
                                    strokeWidth={10}
                                    size={200}
                                    format={() => (
                                        <div className="flex flex-col">
                                            <span className="text-4xl font-black text-indigo-900">
                                                {scoreDetail.totalScore}
                                            </span>
                                            <span className="text-xs text-slate-400 font-bold border-t border-slate-100 mt-1 pt-1">
                                                QUY ĐỔI (HỆ 10)
                                            </span>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="px-6 py-3 bg-slate-50 rounded-2xl mx-auto border border-slate-100">
                                <Text strong className="text-slate-500 uppercase text-[10px]">Xếp loại: </Text>
                                <Text className="font-black text-indigo-700 ml-1">
                                    {scoreDetail.percent >= 80 ? 'XUẤT SẮC' : scoreDetail.percent >= 50 ? 'ĐẠT' : 'CHƯA ĐẠT'}
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
                                    value={scoreDetail.totalCorrect}
                                    suffix={`/ ${scoreDetail.totalQuestions}`}
                                    valueStyle={{ color: '#059669', fontWeight: 900, fontSize: '32px' }}
                                    prefix={<CheckCircleFilled className="mr-2 opacity-20" />}
                                />
                                <Progress 
                                    percent={(scoreDetail.totalCorrect / scoreDetail.totalQuestions) * 100} 
                                    showInfo={false} 
                                    strokeColor="#059669" 
                                    size="small" 
                                    className="mt-4" 
                                />
                            </Card>

                            {/* Card Điểm gốc */}
                            <Card className="rounded-3xl border-none shadow-md overflow-hidden">
                                <Statistic 
                                    title={<span className="font-bold text-slate-400 uppercase text-xs">Điểm gốc bài thi</span>}
                                    value={scoreDetail.maxScore}
                                    valueStyle={{ color: '#2c2c70', fontWeight: 900, fontSize: '32px' }}
                                />
                                <Text type="secondary" className="text-[10px] uppercase font-bold">Điểm số thực tế đạt được</Text>
                            </Card>

                            {/* Danh sách các Part từ API thực tế */}
                            <Card 
                                className="rounded-3xl border-none shadow-md md:col-span-2" 
                                title={<span className="font-bold uppercase text-sm tracking-tight">Kết quả chi tiết theo phần</span>}
                            >
                                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                    {scoreDetail.parts?.map((part: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-indigo-600 border border-slate-100">
                                                    {part.partIndex || index + 1}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-700">Phần {part.partIndex || index + 1}</div>
                                                    <div className="text-xs text-slate-400 font-medium">
                                                        <span className="text-emerald-600">{part.correct}</span>/{part.totalQuestions} câu đúng
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-black text-indigo-900 text-lg">{part.score}</div>
                                                <Text type="secondary" className="text-[9px] font-bold uppercase tracking-tighter">ĐIỂM SỐ</Text>
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
                        className="rounded-full px-12 h-14 font-bold border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
                        onClick={() => router.push('/student/profile')} // Hoặc route lịch sử của bạn
                    >
                        QUAY LẠI LỊCH SỬ THI
                    </Button>
                </div>
            </div>
        </div>
    );
}