"use client";

import { ExamSessionSortBy, SortOrder } from "@/constants/sort.enum";
import { ExamSessionStatus } from "@/constants/status.enum";
import { useToast } from "@/hooks/useToast";
import { useExamSessionJoin, useMyExamSessions } from "@/queries/useExamSessionQuery";
import { ExamSessionParam } from "@/types/param";
import { handleError } from "@/utils/error";
import {
    BookOutlined,
    ClockCircleOutlined,
    InfoCircleOutlined,
    LoginOutlined,
    SearchOutlined,
    VideoCameraOutlined
} from '@ant-design/icons';
import { Badge, Button, Card, Col, Empty, Input, message, Pagination, Row, Select, Skeleton, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";
import { useState } from 'react';

const { Title, Text } = Typography;

export default function StudentExamHome() {
    const router = useRouter();
    const toast = useToast();
    const [params, setParams] = useState<ExamSessionParam>({
        page: 1,
        limit: 9,
        search: "",
        sortBy: ExamSessionSortBy.DATE,
        sortOrder: SortOrder.DESC
    });

    const { data, isLoading } = useMyExamSessions(params);

    const handlePageChange = (page: number, pageSize: number) => {
        setParams(prev => ({ ...prev, page, limit: pageSize }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    console.log(data)

    const getStatusConfig = (status: ExamSessionStatus) => {
        switch (status) {
            case ExamSessionStatus.IN_PROGRESS:
                return { color: '#16a34a', text: 'Đang diễn ra', label: 'Vào thi ngay' };
            case ExamSessionStatus.NOT_STARTED:
                return { color: '#e6a943', text: 'Sắp diễn ra', label: 'Chưa mở' };
            case ExamSessionStatus.FINISHED:
                return { color: '#6b7280', text: 'Đã đóng', label: 'Đã kết thúc' };
            default:
                return { color: '#6b7280', text: 'Không xác định', label: 'Liên hệ GV' };
        }
    };

    const handleSearch = (val: string) => {
        setParams(prev => ({ ...prev, search: val, page: 1 }));
    };

    const handleSortChange = (value: ExamSessionSortBy) => {
        setParams(prev => ({ ...prev, sortBy: value, page: 1 }));
    };

    const handleOrderChange = (value: SortOrder) => {
        setParams(prev => ({ ...prev, sortOrder: value, page: 1 }));
    };

    const { mutate: joinSession, isPending: isJoining } = useExamSessionJoin();

    const handleJoinSession = (session: any) => {
        if (session.isCameraRequired === true) {
            // Nếu yêu cầu camera -> Đi tới trang xác thực khuôn mặt
            router.push(`/student/examSession/verifyFace/${session.examSessionId}`);
        } else {
            // Nếu không yêu cầu -> Gọi API Join trước khi điều hướng
            joinSession(
                { id: session.examSessionId },
                {
                    onSuccess: (res) => {
                        message.success("Tham gia ca thi thành công!");
                        // Chuyển hướng sau khi API đã đăng ký tham gia thành công
                        const examData = res.data.data;
                        const examId = examData.randomExamId;
                        const examAttemptId = examData.examAttemptId;
                        console.log(res.data.data);

                        router.push(
                            `/student/examSession/takeExam/${session.examSessionId}?examId=${examId}&examAttemptId=${examAttemptId}`
                        );
                    },
                    onError: (error: any) => {
                        handleError(error, toast)
                    }
                }
            );
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-main)]">
            <div className="bg-[var(--color-navy-deep)] h-64 px-6 md:px-12 pt-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                        <div>
                            <Title level={2} className="!text-white !m-0">
                                Lịch thi của tôi
                            </Title>
                            <Text className="text-blue-200 opacity-70">
                                Tìm kiếm và quản lý các ca thi sắp tới
                            </Text>
                        </div>

                        {/* Nhóm bộ lọc */}
                        <div className="flex flex-wrap gap-3 w-full md:w-auto">
                            <Input
                                placeholder="Tìm theo mã, phòng..."
                                prefix={<SearchOutlined className="text-slate-400" />}
                                className="w-full md:w-64 h-11 rounded-xl shadow-lg border-none"
                                allowClear
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <Select
                                defaultValue={ExamSessionSortBy.DATE}
                                className="w-40 h-11"
                                onChange={handleSortChange}
                                options={[
                                    { value: ExamSessionSortBy.DATE, label: 'Sắp xếp: Ngày thi' },
                                ]}
                            />
                            <Select
                                defaultValue={SortOrder.DESC}
                                className="w-32 h-11"
                                onChange={handleOrderChange}
                                options={[
                                    { value: SortOrder.DESC, label: 'Giảm dần' },
                                    { value: SortOrder.ASC, label: 'Tăng dần' },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách Card ca thi */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-20 pb-20">
                {isLoading ? (
                    <Row gutter={[24, 24]}>
                        {[1, 2, 3].map(i => (
                            <Col xs={24} sm={12} lg={8} key={i}>
                                <Card className="rounded-2xl border-none h-64"><Skeleton active /></Card>
                            </Col>
                        ))}
                    </Row>
                ) : data?.data?.length ? (
                    <>
                        <Row gutter={[24, 24]}>
                            {data.data.map((session) => {
                                const config = getStatusConfig(session.status as ExamSessionStatus);
                                const isAvailable = session.status === ExamSessionStatus.IN_PROGRESS;

                                return (
                                    <Col xs={24} sm={12} lg={8} key={session.examSessionId}>
                                        <Badge.Ribbon text={config.text} color={config.color}>
                                            <Card
                                                hoverable
                                                className="rounded-2xl border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                                                bodyStyle={{ padding: '24px' }}
                                            >
                                                <div className="flex flex-col h-full">
                                                    <div className="mb-4">
                                                        <div className="bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center mb-3">
                                                            <BookOutlined className="text-2xl text-[var(--color-navy-main)]" />
                                                        </div>
                                                        <Title level={5} className="!m-0 line-clamp-1">
                                                            {session.examSessionCode}
                                                        </Title>
                                                        <Text className="text-xs text-[var(--color-accent)] font-bold uppercase tracking-widest">
                                                            Phòng: {session.room}
                                                        </Text>
                                                    </div>

                                                    <Space direction="vertical" className="w-full mb-6 text-slate-500">
                                                        <div className="flex items-center gap-3">
                                                            <ClockCircleOutlined className="text-[var(--color-accent)]" />
                                                            <span>{dayjs(session.date).format("HH:mm - DD/MM/YYYY")}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <InfoCircleOutlined className="text-blue-400" />
                                                            <span>Thời gian: <b>{session.duration} phút</b></span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <VideoCameraOutlined className={session.isCameraRequired ? "text-red-500" : "text-gray-400"} />
                                                            <span>Yêu cầu mở cam: </span>
                                                            {session.isCameraRequired ? (
                                                                <div className="color-red font-medium font-semibold">
                                                                    Bắt buộc Camera
                                                                </div>
                                                            ) : (
                                                                <div className="font-medium">
                                                                    Không yêu cầu
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Space>

                                                    <Button
                                                        type={isAvailable ? 'primary' : 'default'}
                                                        block
                                                        size="large"
                                                        icon={<LoginOutlined />}
                                                        disabled={!isAvailable || session.isLocked}
                                                        onClick={() => handleJoinSession(session)}
                                                        className={`rounded-xl font-bold h-12 flex items-center justify-center transition-all ${isAvailable
                                                            ? 'bg-[var(--color-navy-main)] hover:bg-[var(--color-navy-light)] border-none shadow-lg'
                                                            : 'bg-slate-100 text-slate-400'
                                                            }`}
                                                    >
                                                        {session.isLocked ? "Đã khóa" : config.label}
                                                    </Button>
                                                </div>
                                            </Card>
                                        </Badge.Ribbon>
                                    </Col>

                                );
                            })}
                        </Row>
                        <div className="mt-12 flex justify-center">
                            <Card className="rounded-2xl border-none inline-block px-6 py-2">
                                <Pagination
                                    current={params.page}
                                    pageSize={params.limit}
                                    total={data?.meta?.total || 0} // Giả định API trả về meta.total
                                    onChange={handlePageChange}
                                    showSizeChanger={false} // Ẩn chọn limit nếu không cần thiết
                                    className="custom-pagination"
                                />
                            </Card>
                        </div>
                    </>

                ) : (
                    <Card className="rounded-3xl border-none shadow-sm p-12 text-center">
                        <Empty description="Không tìm thấy ca thi nào phù hợp" />
                    </Card>
                )}
            </div>
        </div>
    );
}