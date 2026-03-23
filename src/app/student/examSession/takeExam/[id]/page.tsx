"use client";

import { useExamSSE } from '@/hooks/useExamSSE';
import { EXAM_ATTEMPT_KEY, useMyExamAttempt } from '@/queries/useExamAttemptQuery';
import { useExamDetail } from '@/queries/useExamQuery';
import { EXAM_SESSION_QUERY_KEY, useExamSessionDetail } from '@/queries/useExamSessionQuery';
import { ExamSessionStatus } from '@/shares/constants/status.enum';
import { QuestionType } from '@/shares/constants/type.enum';
import { useExamStore } from '@/stores/useExamStore';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Card, Col, Result, Row, Spin, Statistic, Tabs, message } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import ExamMonitor from '../(components)/exam-monitor';
import { ProgressButton } from '../(components)/renderProgressButton';
import { StudentQuestion } from '../(components)/student-question';
import { useExamAutoSave } from '../(hooks)/useExamAutoSave';
import { useExamFullscreen } from '../(hooks)/useExamFullscreen';
import { useExamSecurity } from '../(hooks)/useExamSecurity';
import { useExamSubmit } from '../(hooks)/useExamSubmit';
import { useExamTimer } from '../(hooks)/useExamTimer';



export default function TakeExamPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params);
    const examSessionId = resolvedParams.id;
    const router = useRouter();
    const searchParams = useSearchParams();
    const examId = searchParams.get("examId");
    const examAttemptId = searchParams.get("examAttemptId");

    // Lấy data từ Zustand Store (Dữ liệu đã có từ trang Join)
    const storeExamData = useExamStore((state) => state.examData);

    // Xử lý realtime
    const { latestEvent, isConnected } = useExamSSE(examSessionId);
    const queryClient = useQueryClient();
    const { data: myAttemptRes } = useMyExamAttempt(examSessionId);

    // 1. Fetch Data Fallback (Chỉ dùng khi store trống - ví dụ user reload trang)
    const { data: examDetailRes, isLoading: isExamLoading } = useExamDetail(
        !storeExamData ? (examId as string) : ""
    );
    console.log(examDetailRes);
    const { data: examSessionRes, isLoading: isExamSessionLoading } = useExamSessionDetail(examSessionId);

    const isAttemptPaused = examSessionRes?.data?.status === 'PAUSE' || myAttemptRes?.data?.status === 'PAUSE';

    // Xác định nguồn dữ liệu cuối cùng để render
    const finalExamData = useMemo(() => {
        // Ưu tiên store, nếu không có thì lấy từ API response
        return storeExamData || examDetailRes?.data;
    }, [storeExamData, examDetailRes?.data]);

    // 2. State quản lý câu trả lời
    const setExamData = useExamStore((state) => state.setExamData);
    useEffect(() => {
        if (!storeExamData && examDetailRes?.data) {
            setExamData(examDetailRes.data);
        }
    }, [examDetailRes?.data, storeExamData, setExamData]);

    // Redirect if finished
    useEffect(() => {
        if (examSessionRes?.data?.status === ExamSessionStatus.FINISHED) {
            message.info("Ca thi đã kết thúc!");
            router.push('/student');
        }
    }, [examSessionRes?.data?.status, router]);

    const [userAnswers, setUserAnswers] = useState<{ questionId: string; answer: any }[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`exam_progress_${examSessionId}`);
            return saved ? JSON.parse(saved).answers : [];
        }
        return [];
    });

    const handleAnswerChange = (questionId: string, value: any) => {
        setUserAnswers((prev) => {
            const newAnswers = [...prev];
            const index = newAnswers.findIndex((a) => a.questionId === questionId);

            if (index > -1) {
                // Gán trực tiếp value (nếu là trắc nghiệm là "A", tự luận là {content, file_metadata})
                newAnswers[index].answer = value;
            } else {
                newAnswers.push({ questionId, answer: value });
            }

            // Lưu vào localStorage để khi F5 không bị mất
            localStorage.setItem(
                `exam_progress_${examSessionId}`,
                JSON.stringify({ answers: newAnswers })
            );
            return newAnswers;
        });
    };

    // Logic xử lý toàn màn hình đã chuyển sang useExamFullscreen ở bên dưới

    // 3. Logic xử lý Tab và Câu hỏi (Dựa trên cấu trúc state bạn cung cấp)
    const actualParts = useMemo(() => {
        return finalExamData?.parts || finalExamData?.examDetail?.parts || [];
    }, [finalExamData]);

    const { tabItems, allQuestions } = useMemo(() => {
        // Lưu ý: Object của bạn có cấu trúc: examDetail: { parts: [...] }
        if (actualParts.length === 0) return { tabItems: [], allQuestions: [] };

        const fullQuestionsList: any[] = [];
        const allEssayQuestions: any[] = [];

        const processedTabs = actualParts.map((part: any, pIdx: number) => {
            // Lấy questions trực tiếp từ part theo cấu trúc JSON bạn gửi
            const questionsInPart = part.questions || [];

            fullQuestionsList.push(...questionsInPart);

            const nonEssay = questionsInPart.filter((q: any) => q.questionType !== QuestionType.ESSAY);
            const essays = questionsInPart.filter((q: any) => q.questionType === QuestionType.ESSAY);
            allEssayQuestions.push(...essays);

            return {
                key: `part-${part.partId || pIdx}`,
                label: `PHẦN ${part.partIndex || pIdx + 1}`,
                children: (
                    <div className="max-h-[75vh] overflow-y-auto pr-4 custom-scrollbar py-4">
                        {part.content && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-800 italic">
                                {part.content}
                            </div>
                        )}
                        {nonEssay.map((q: any) => (
                            <StudentQuestion
                                key={q.questionId}
                                question={q}
                                value={userAnswers.find(a => a.questionId === q.questionId)?.answer}
                                onChange={(val: any) => handleAnswerChange(q.questionId, val)}
                            />
                        ))}
                    </div>
                )
            };
        });

        // Thêm Tab tự luận nếu có
        if (allEssayQuestions.length > 0) {
            processedTabs.push({
                key: `essay-tab`,
                label: `TỰ LUẬN (${allEssayQuestions.length})`,
                children: (
                    <div className="max-h-[75vh] overflow-y-auto pr-4 custom-scrollbar py-4">
                        {allEssayQuestions.map((q: any) => (
                            <StudentQuestion
                                key={q.questionId}
                                question={q}
                                value={userAnswers.find(a => a.questionId === q.questionId)?.answer}
                                onChange={(val: any) => handleAnswerChange(q.questionId, val)}
                            />
                        ))}
                    </div>
                )
            });
        }

        return {
            tabItems: processedTabs,
            allQuestions: fullQuestionsList.sort((a, b) => a.questionNumber - b.questionNumber)
        };
    }, [finalExamData, userAnswers]);


    // 4. Các Logic Background: Auto-Save, Camera Capture, Giám sát
    useExamAutoSave(examSessionId, examAttemptId, userAnswers);

    const { handleViolationDetected } = useExamSecurity(
        examAttemptId,
        examSessionRes?.data?.isCameraRequired
    );

    useExamFullscreen(handleViolationDetected);

    const [isCameraActive, setIsCameraActive] = useState(true);

    // 5. Submit & Timer
    const { handleSubmit, isSubmitting } = useExamSubmit(
        examSessionId,
        userAnswers,
        setIsCameraActive
    );

    const duration = finalExamData?.duration || examSessionRes?.data?.duration;
    const consumedTime = myAttemptRes?.data?.consumedTime || 0;
    const endTime = useExamTimer(examSessionId, duration, consumedTime);


    // (Logic chống vi phạm và nhận diện khuôn mặt đã chuyển sang useExamSecurity hook)

    // 6. Realtime Event Handlers
    useEffect(() => {
        if (!latestEvent) return;

        switch (latestEvent.type) {
            case 'SESSION_STATUS_CHANGED':
                if (latestEvent.data?.status === 'PAUSE') {
                    message.warning('Ca thi đã bị tạm dừng bởi giám thị!');
                } else if (latestEvent.data?.status === 'IN_PROGRESS') {
                    message.success('Ca thi đã được tiếp tục!');
                } else if (latestEvent.data?.status === 'FINISHED') {
                    message.info('Ca thi đã kết thúc. Hệ thống đang tự động thu bài...');
                    handleSubmit(true);
                }
                queryClient.invalidateQueries({ queryKey: EXAM_SESSION_QUERY_KEY });
                break;
            case 'ATTEMPT_PAUSED':
                // Check if the event applies to current student using examAttemptId or studentId if available
                if (latestEvent.data?.studentId === storeExamData?.studentId || latestEvent.data?.examAttemptId === examAttemptId) {
                    message.warning('Bài thi của bạn đã bị tạm dừng!');
                    queryClient.invalidateQueries({ queryKey: EXAM_ATTEMPT_KEY });
                }
                break;
            case 'ATTEMPT_RESUMED':
                if (latestEvent.data?.studentId === storeExamData?.studentId || latestEvent.data?.examAttemptId === examAttemptId) {
                    message.success('Bài thi của bạn đã được tiếp tục!');
                    queryClient.invalidateQueries({ queryKey: EXAM_ATTEMPT_KEY });
                }
                break;
            case 'TIME_WARNING':
                message.warning(`Cảnh báo: Chỉ còn ${latestEvent.data?.remainingMinutes} phút!`);
                break;
            case 'STUDENT_VIOLATION':
                if (latestEvent.data?.studentId === storeExamData?.studentId) {
                    message.error('Hệ thống ghi nhận vi phạm của bạn! Bạn có thể bị đình chỉ thi.');
                }
                break;
            default:
                break;
        }
    }, [latestEvent, storeExamData?.studentId, examAttemptId]);




    if (isExamSessionLoading || (isExamLoading && !storeExamData)) {
        return <Spin fullscreen tip="Đang chuẩn bị đề thi..." />;
    }

    if (!finalExamData) return <Result status="error" title="Không tìm thấy đề thi" />;

    return (
        <div className="bg-[var(--color-bg-main)] p-6">
            {/* Màn hình khóa khi bị Pause */}
            {isAttemptPaused && (
                <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center backdrop-blur-md">
                    <Result
                        status="warning"
                        title={<span className="text-white text-4xl font-black">BÀI THI ĐANG TẠM DỪNG</span>}
                        subTitle={<span className="text-gray-300 text-xl">Giám thị đã tạm dừng bài thi của bạn. Vui lòng chờ cho đến khi được tiếp tục.</span>}
                    />
                </div>
            )}

            <div className="max-w-[1600px] mx-auto">
                {isCameraActive && examSessionRes?.data.isCameraRequired && examAttemptId && (
                    <ExamMonitor
                        examAttemptId={examAttemptId}
                        onViolation={handleViolationDetected}
                    />
                )}
                <Row gutter={24}>
                    <Col span={17}>
                        <div className="mb-6">
                            <h1 className="text-2xl font-black text-[var(--color-primary)] uppercase">
                                {finalExamData?.examDetail?.title || "BÀI THI"}
                            </h1>
                        </div>
                        <Card className="shadow-xl rounded-3xl border-none bg-white">
                            <Tabs items={tabItems} type="card" className="custom-tabs" />
                        </Card>
                    </Col>

                    <Col span={7}>
                        <div className="sticky top-6 flex flex-col gap-6">
                            <Card className="rounded-3xl border-none shadow-lg bg-[var(--color-navy-deep)] text-white">
                                <p className="text-[var(--color-accent)] text-xs font-bold text-center uppercase">Thời gian còn lại</p>
                                <Statistic.Countdown
                                    value={endTime}
                                    format="HH:mm:ss"
                                    valueStyle={{ color: '#fff', fontWeight: '900', fontSize: '42px', textAlign: 'center' }}
                                    onFinish={() => handleSubmit(true)}
                                />
                            </Card>

                            <Card
                                className="rounded-3xl border-none shadow-lg"
                                title={<span className="font-bold uppercase text-sm">Tiến độ làm bài</span>}
                            >
                                <Tabs
                                    size="small"
                                    items={[
                                        // Sử dụng actualParts thay vì finalExamData?.examDetail?.parts
                                        ...(actualParts || []).map((part: any, index: number) => ({
                                            key: `progress-part-${index}`,
                                            label: `P.${part.partIndex || index + 1}`,
                                            children: (
                                                <div className="grid grid-cols-4 gap-2 max-h-[250px] overflow-y-auto py-2 px-1">
                                                    {part.questions
                                                        ?.filter((q: any) => q.questionType !== QuestionType.ESSAY)
                                                        .map((q: any) => (
                                                            <ProgressButton
                                                                key={q.questionId}
                                                                question={q}
                                                                userAnswer={userAnswers.find(a => a.questionId === q.questionId)}
                                                                size="lg"
                                                            />
                                                        ))}
                                                </div>
                                            )
                                        })),
                                        // Chỉ render tab Tự luận nếu thực sự có câu hỏi tự luận
                                        ...(allQuestions.some(q => q.questionType === QuestionType.ESSAY) ? [{
                                            key: 'essay-progress',
                                            label: 'T.LUẬN',
                                            children: (
                                                <div className="grid grid-cols-4 gap-2 max-h-[250px] overflow-y-auto py-2 px-1">
                                                    {allQuestions
                                                        .filter((q: any) => q.questionType === QuestionType.ESSAY)
                                                        .map((q: any) => (
                                                            <ProgressButton
                                                                key={q.questionId}
                                                                question={q}
                                                                userAnswer={userAnswers.find(a => a.questionId === q.questionId)}
                                                                size="lg"
                                                            />
                                                        ))}
                                                </div>
                                            )
                                        }] : [])
                                    ]}
                                />
                                <div className="mt-6 space-y-3">
                                    <div className="flex justify-between text-xs font-medium text-slate-500 px-1">
                                        <span>Đã làm: {userAnswers.length}</span>
                                        <span>Tổng: {allQuestions.length}</span>
                                    </div>
                                    <Button
                                        type="primary"
                                        block
                                        size="large"
                                        loading={isSubmitting}
                                        onClick={() => handleSubmit(false)}
                                        className="h-12 rounded-xl font-bold bg-[var(--color-primary)] border-none"
                                    >
                                        NỘP BÀI THI
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}