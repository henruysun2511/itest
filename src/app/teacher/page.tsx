"use client";

import { useTeacherExamSessions } from '@/queries/useExamSessionQuery';
import { useMyTeacherCourses } from '@/queries/useTeacherCourse';
import { TeacherExamSessionParam } from '@/shares/types/param';
import { getStatusConfig } from '@/shares/utils/mappingLabel';
import {
    BookOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    DatabaseOutlined,
    RightOutlined,
    SearchOutlined,
    SolutionOutlined,
} from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Divider,
    Empty,
    Input,
    Pagination,
    Row,
    Spin,
    Tag,
    Typography
} from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const { Title, Text } = Typography;

export default function TeacherPage() {
    const router = useRouter();

    // 1. Quản lý State
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentMenu, setCurrentMenu] = useState('exam-management');

    // State riêng cho việc phân trang danh sách ca thi
    const [sessionParams, setSessionParams] = useState<TeacherExamSessionParam>({
        courseId: '',
        page: 1,
        limit: 5, // Bạn có thể chỉnh lên 10
    });

    // 2. Hook lấy danh sách môn học
    const { data: teacherCoursesRes, isLoading: isLoadingCourses } = useMyTeacherCourses();
    const teacherCourses = teacherCoursesRes?.data || [];

    // 3. Hook lấy danh sách ca thi (tự động fetch khi sessionParams thay đổi)
    const { data: examSessionsRes, isLoading: isLoadingSessions } = useTeacherExamSessions(sessionParams);

    // 4. Effect: Khi đổi môn học thì reset lại params của ca thi
    useEffect(() => {
        if (selectedCourse) {
            setSessionParams({
                courseId: selectedCourse,
                page: 1,
                limit: 5,
            });
        }
    }, [selectedCourse]);

    // 5. Filter môn học theo thanh tìm kiếm
    const filteredCourses = useMemo(() => {
        if (!teacherCourses) return [];
        return teacherCourses.filter(tc =>
            tc.course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tc.courseId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [teacherCourses, searchTerm]);

    return (
        <div className="min-h-screen bg-[#F0F2F5]">
            {/* Hero Header Section */}
            <div className="bg-gradient-to-r from-[var(--color-navy-deep)] to-[var(--color-navy-main)] h-48 px-12 pt-10">
                <div className="max-w-7xl mx-auto flex justify-between items-start">
                    <div>
                        <Title level={2} className="!text-white !m-0">
                            {currentMenu === 'exam-management' ? 'Quản lý lịch thi & Học phần' : 'Quản trị nội dung'}
                        </Title>
                        <Text className="text-blue-200 opacity-70">
                            Chào buổi sáng, bạn đang quản lý {teacherCourses?.length || 0} học phần.
                        </Text>
                    </div>
                    <Input
                        placeholder="Tìm nhanh học phần..."
                        prefix={<SearchOutlined className="text-slate-400" />}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-72 h-11 rounded-xl border-none shadow-lg text-black placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-12 -mt-16 pb-20">
                {currentMenu === 'exam-management' ? (
                    <Row gutter={32}>
                        {/* Cột trái: Danh sách môn học */}
                        <Col lg={selectedCourse ? 9 : 24} className="transition-all duration-500">
                            {isLoadingCourses ? (
                                <div className="text-center p-10"><Spin size="large" /></div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredCourses.map((tc) => (
                                        <Card
                                            key={tc.courseId}
                                            onClick={() => setSelectedCourse(tc.courseId)}
                                            className={`rounded-[24px] border-none shadow-sm cursor-pointer transition-all duration-300 hover:shadow-xl ${selectedCourse === tc.courseId
                                                ? 'bg-white ring-2 ring-blue-500 shadow-blue-100'
                                                : 'bg-white/80 backdrop-blur-md'
                                                }`}
                                            bodyStyle={{ padding: '20px' }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl transition-colors ${selectedCourse === tc.courseId ? 'bg-blue-600' : 'bg-slate-400'
                                                    }`}>
                                                    <BookOutlined />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Học phần</Text>
                                                    <Title level={5} className="!m-0 mt-1 truncate">{tc.course.name}</Title>
                                                </div>
                                                <RightOutlined className={`text-slate-300 transition-transform ${selectedCourse === tc.courseId ? 'rotate-90 text-blue-500' : ''}`} />
                                            </div>
                                        </Card>
                                    ))}
                                    {filteredCourses.length === 0 && <Empty description="Không tìm thấy môn học" />}
                                </div>
                            )}
                        </Col>

                        {/* Cột phải: Chi tiết ca thi */}
                        {selectedCourse && (
                            <Col lg={15} className="animate-in slide-in-from-right-8 duration-500">
                                <Card
                                    className="rounded-[32px] border-none shadow-2xl flex flex-col h-full"
                                    style={{ minHeight: '600px' }}
                                    bodyStyle={{
                                        padding: '32px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%'
                                    }}
                                >
                                    {/* Header của Card Chi tiết */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                        <div className="flex-1">
                                            <Tag color="blue" className="rounded-md border-none px-3 py-1 text-[10px] font-bold uppercase mb-2">
                                                Thông tin chi tiết
                                            </Tag>
                                            <Title level={3} className="!m-0 line-clamp-1">
                                                {teacherCourses?.find(tc => tc.courseId === selectedCourse)?.course.name}
                                            </Title>
                                        </div>

                                    </div>

                                    {/* Danh sách ca thi có Scroll */}
                                    <div className="flex-1 overflow-y-auto pr-2 mb-6" style={{ maxHeight: '500px' }}>
                                        {isLoadingSessions ? (
                                            <div className="text-center py-20"><Spin size="large" /></div>
                                        ) : (
                                            <div className="space-y-4">
                                                {examSessionsRes?.data?.map(session => {
                                                    const statusConfig = getStatusConfig(session.status);
                                                    return (
                                                        <div key={session.examSessionId}
                                                            onClick={() => router.push(`/teacher/examSession/monitorExam/${session.examSessionId}`)}
                                                            className="group p-5 rounded-[20px] bg-slate-50 border border-transparent hover:border-blue-200 hover:bg-white transition-all flex items-center justify-between">
                                                            <div className="flex items-center gap-5 overflow-hidden">
                                                                <div className="w-12 h-12 shrink-0 rounded-full bg-white flex items-center justify-center font-bold text-blue-900 shadow-sm group-hover:bg-blue-900 group-hover:text-white transition-all">
                                                                    {session.room.slice(-2)}
                                                                </div>
                                                                <div className="overflow-hidden">
                                                                    <div className="font-bold text-base text-slate-800 truncate">
                                                                        {session.examSessionCode} - Phòng {session.room}
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400 text-xs mt-1">
                                                                        <span className="flex items-center gap-1"><CalendarOutlined /> {new Date(session.date).toLocaleDateString('vi-VN')}</span>
                                                                        <span className="opacity-30">|</span>
                                                                        <span className="flex items-center gap-1"><ClockCircleOutlined /> {session.duration} phút</span>
                                                                        <span className="opacity-30">|</span>
                                                                        <Tag
                                                                            color={statusConfig.color}
                                                                            className="m-0 border-none text-[10px] px-2 font-black uppercase rounded-full shadow-sm"
                                                                        >
                                                                            {statusConfig.text}
                                                                        </Tag>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Button shape="circle" icon={<RightOutlined />} className="shrink-0 border-none bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-500 hover:text-white" />
                                                        </div>
                                                    )
                                                })}

                                                {(examSessionsRes?.data?.length === 0 || !examSessionsRes) && (
                                                    <Empty description="Chưa có ca thi nào được tạo" className="py-10" />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer: Phân trang và Lưu ý */}
                                    <div className="mt-auto">
                                        {!isLoadingSessions && (examSessionsRes?.meta?.total ?? 0) > 0 && (
                                            <div className="flex justify-center mb-6">
                                                <Pagination
                                                    current={sessionParams.page}
                                                    pageSize={sessionParams.limit}
                                                    total={examSessionsRes?.meta?.total}
                                                    onChange={(page) => setSessionParams(p => ({ ...p, page }))}
                                                    size="small"
                                                    showSizeChanger={false}
                                                />
                                            </div>
                                        )}

                                        <Divider dashed className="my-4" />
                                        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3">
                                            <SolutionOutlined className="text-amber-500 mt-1 shrink-0" />
                                            <Text className="text-amber-800 text-[11px] leading-relaxed italic">
                                                <b>Lưu ý:</b> Giảng viên chỉ có quyền kích hoạt đề thi khi trạng thái ca thi là <b>"Sắp diễn ra"</b>. Vui lòng kiểm tra lại danh sách thí sinh trước giờ bắt đầu.
                                            </Text>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        )}
                    </Row>
                ) : (
                    <Card className="rounded-[32px] border-none shadow-sm flex flex-col items-center justify-center py-32">
                        <DatabaseOutlined className="text-4xl text-slate-200 mb-6" />
                        <Title level={4} className="!text-slate-300">Tính năng đang phát triển</Title>
                    </Card>
                )}
            </div>
        </div>
    );
}