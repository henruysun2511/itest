"use client";

import { useHeartbeat, useReportFraud, useSaveDraft } from '@/queries/useExamAttemptQuery';
import { useExamDetail } from '@/queries/useExamQuery';
import { useExamSessionDetail } from '@/queries/useExamSessionQuery';
import { FraudType } from '@/types/enum';
import { Button, Card, Col, message, Result, Row, Spin, Statistic, Tabs, Tag } from 'antd';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import ExamMonitor from '../(questionRender)/exam-monitor';
import { StudentQuestion } from '../(questionRender)/student-question';

export default function TakeExamPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params);
    const examSessionId = resolvedParams.id;
    const searchParams = useSearchParams();
    const examId = searchParams.get("examId");

    // 1. Fetch Data
    const { data: examDetailRes, isLoading: isExamLoading, error: examError } = useExamDetail(examId as string);

    const { data: examSessionRes, isLoading: isExamSessionLoading } = useExamSessionDetail(examSessionId);
    console.log(examSessionRes)

    // Lấy dữ liệu từ cấu trúc parsedJson 
    const examData = examDetailRes?.data?.parsedJson;
    console.log(examData)
    // Giả định API Join/Detail trả về ID của lượt thi để gọi Draft/Heartbeat
    const examAttemptId = examDetailRes?.data?.examAttemptId || "";

    // 2. State quản lý câu trả lời
    const [userAnswers, setUserAnswers] = useState<any[]>([]);

    // Khởi tạo từ LocalStorage
    useEffect(() => {
        const localData = localStorage.getItem(`exam_progress_${examSessionId}`);
        if (localData) {
            setUserAnswers(JSON.parse(localData).answers);
        }
    }, [examSessionId]);

    // 3. Logic xử lý thay đổi đáp án
    const handleAnswerChange = (questionId: string, value: any) => {
        setUserAnswers(prev => {
            const newAnswers = [...prev];
            const index = newAnswers.findIndex(a => a.questionId === questionId);
            if (index > -1) newAnswers[index].answer = value;
            else newAnswers.push({ questionId, answer: value });

            localStorage.setItem(`exam_progress_${examSessionId}`, JSON.stringify({ answers: newAnswers }));
            return newAnswers;
        });
    };

    // 4. Auto-save & Heartbeat
    const { mutate: saveDraft } = useSaveDraft();
    const { mutate: heartbeat } = useHeartbeat();

    useEffect(() => {
        if (!examAttemptId || userAnswers.length === 0) return;
        const timer = setInterval(() => {
            saveDraft({ examAttemptId, data: { answers: userAnswers } });
        }, 10000);
        return () => clearInterval(timer);
    }, [userAnswers, examAttemptId]);

    useEffect(() => {
        if (!examAttemptId) return;
        const timer = setInterval(() => {
            heartbeat(examAttemptId);
        }, 30000);
        return () => clearInterval(timer);
    }, [examAttemptId]);


    //Xử lý vi phạm
    const { mutate: reportFraud } = useReportFraud();

    // useEffect(() => {
    //     const handleVisibilityChange = () => {
    //         if (document.visibilityState === 'hidden') {
    //             // Trường hợp chuyển Tab
    //             reportFraud({
    //                 examAttemptId,
    //                 data: {
    //                     examAttemptId,
    //                     fraudType: FraudType.TAB_SWITCHING,
    //                     occurredAt: new Date().toISOString(),
    //                 }
    //             });
    //             message.warning("Cảnh báo: Bạn vừa rời khỏi trang thi!");
    //         }
    //     };

    //     const handleWindowBlur = () => {
    //         reportFraud({
    //             examAttemptId,
    //             data: {
    //                 examAttemptId,
    //                 fraudType: FraudType.WINDOW_BLUR,
    //                 occurredAt: new Date().toISOString(),
    //             }
    //         });
    //         message.warning("Cảnh báo: Không được rời khỏi cửa sổ làm bài!");
    //     };

    //     // Đăng ký sự kiện
    //     document.addEventListener('visibilitychange', handleVisibilityChange);
    //     window.addEventListener('blur', handleWindowBlur);

    //     return () => {
    //         // Hủy đăng ký khi thoát trang
    //         document.removeEventListener('visibilitychange', handleVisibilityChange);
    //         window.removeEventListener('blur', handleWindowBlur);
    //     };
    // }, [examAttemptId]);

    // useEffect(() => {
    //     const handleOffline = () => {
    //         reportFraud({
    //             examAttemptId,
    //             data: {
    //                 examAttemptId,
    //                 fraudType: FraudType.NETWORK_DISRUPTION,
    //                 occurredAt: new Date().toISOString(),
    //             }
    //         });
    //     };

    //     window.addEventListener('offline', handleOffline);
    //     return () => window.removeEventListener('offline', handleOffline);
    // }, [examAttemptId]);

    const handleViolationDetected = (type: FraudType, faceData?: string) => {
        if (!examAttemptId) return;

        reportFraud({
            examAttemptId,
            data: {
                examAttemptId,
                fraudType: type,
                occurredAt: new Date().toISOString(),
                face: faceData // Ảnh bằng chứng dạng base64
            }
        });
    };



    const { tabItems, allQuestions } = useMemo(() => {
        const actualParts = examData?.parts || [];
        if (actualParts.length === 0) return { tabItems: [], allQuestions: [] };

        const fullQuestionsList: any[] = [];
        const allEssayQuestions: any[] = []; // Chứa toàn bộ câu tự luận của cả đề

        // 1. Duyệt qua từng Part để lấy dữ liệu phẳng (Flatten)
        const processedParts = actualParts.map((part: any) => {
            const questionsInPart = (part.questionGroups || []).flatMap((group: any) => {
                return (group.questions || []).map((q: any, qIdx: number) => ({
                    ...q,
                    groupInstruction: qIdx === 0 ? group.groupInstruction : null,
                    groupMedia: qIdx === 0 ? group.media : null,
                }));
            });

            const combined = [...(part.questions || []), ...questionsInPart].sort(
                (a, b) => a.questionIndex - b.questionIndex
            );

            // Lưu vào danh sách tổng để render bảng số câu hỏi bên phải
            fullQuestionsList.push(...combined);

            // Tách câu hỏi tự luận ra
            const nonEssay = combined.filter(q => q.questionType !== "essay");
            const essays = combined.filter(q => q.questionType === "essay");

            allEssayQuestions.push(...essays);

            return {
                ...part,
                nonEssayQuestions: nonEssay
            };
        });

        // 2. Tạo các Tab cho từng Part (Chỉ hiển thị câu hỏi không phải tự luận)
        const partTabs = processedParts.map((part, pIdx) => ({
            key: `part-${pIdx}`,
            label: part.partTitle || `PHẦN ${pIdx + 1}`,
            children: (
                <div className="max-h-[75vh] overflow-y-auto pr-4 custom-scrollbar py-4">
                    {part.partDescription && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-800 italic">
                            <div dangerouslySetInnerHTML={{ __html: part.partDescription }} />
                        </div>
                    )}
                    {part.nonEssayQuestions.length > 0 ? (
                        part.nonEssayQuestions.map((q: any) => (
                            <StudentQuestion
                                key={q.questionIndex}
                                question={q}
                                value={userAnswers.find(a => a.questionId === q.questionIndex.toString())?.answer}
                                onChange={(val: any) => handleAnswerChange(q.questionIndex.toString(), val)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-400 italic">
                            Phần này không có câu hỏi trắc nghiệm.
                        </div>
                    )}
                </div>
            )
        }));

        // 3. Tạo Tab Tự luận riêng (Gom từ tất cả các Part)
        if (allEssayQuestions.length > 0) {
            partTabs.push({
                key: `essay-tab`,
                label: `TỰ LUẬN (${allEssayQuestions.length})`,
                children: (
                    <div className="max-h-[75vh] overflow-y-auto pr-4 custom-scrollbar py-4">
                        <div className="mb-6 p-4 bg-orange-50 rounded-2xl border border-orange-100 text-orange-800 font-medium">
                            Phần này tập hợp các câu hỏi tự luận của toàn bộ bài thi.
                        </div>
                        {allEssayQuestions.sort((a, b) => a.questionIndex - b.questionIndex).map((q: any) => (
                            <StudentQuestion
                                key={q.questionIndex}
                                question={q}
                                value={userAnswers.find(a => a.questionId === q.questionIndex.toString())?.answer}
                                onChange={(val: any) => handleAnswerChange(q.questionIndex.toString(), val)}
                            />
                        ))}
                    </div>
                )
            });
        }

        return {
            tabItems: partTabs,
            allQuestions: fullQuestionsList.sort((a, b) => a.questionIndex - b.questionIndex)
        };
    }, [examData, userAnswers]);

    if (isExamLoading || isExamSessionLoading) return <Spin fullscreen tip="Đang tải đề thi..." />;
    if (examError || !examData) return <Result status="error" title="Lỗi tải đề" subTitle="Không tìm thấy cấu trúc đề thi." />;

    return (
        <div className="bg-[var(--color-bg-main)] p-6">
            <div className="max-w-[1600px] mx-auto">
                {examSessionRes?.data.isCameraRequired && examAttemptId && (
                    <ExamMonitor
                        examAttemptId={examAttemptId}
                        onViolation={handleViolationDetected}
                    />
                )}

               <Row gutter={24}>
                    <Col span={17}>
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-black text-[var(--color-primary)] mb-1 uppercase tracking-tight">
                                    {examSessionRes?.data.examSessionCode || "Bài thi đang diễn ra"}
                                </h1>
                                <div className="flex gap-4 items-center text-slate-500">
                                    <span className="flex items-center gap-1 font-medium">
                                        <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse"></span>
                                        Đang làm bài
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Card className="shadow-xl rounded-3xl  border-none overflow-hidden bg-white">
                            <Tabs
                                items={tabItems}
                                type="card"
                                className="student-exam-tabs custom-tabs"
                            />
                        </Card>
                    </Col>

                    <Col span={7}>
                        <div className="sticky top-6 flex flex-col gap-6">
                            {/* Card Thời gian - Sử dụng Navy Deep từ globals.css */}
                            <Card className="rounded-3xl border-none shadow-lg bg-[var(--color-navy-deep)] text-white overflow-hidden relative">
                                <div className="relative z-10 p-2">
                                    <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-wider mb-2 text-center opacity-90">Thời gian còn lại</p>
                                    <Statistic.Countdown
                                        value={Date.now() + (examSessionRes?.data?.duration || 60) * 60 * 1000}
                                        format="HH:mm:ss"
                                        valueStyle={{ color: '#fff', fontWeight: '900', fontSize: '42px', textAlign: 'center', fontFamily: 'monospace' }}
                                        onFinish={() => message.error("Hết giờ làm bài!")}
                                    />
                                </div>
                                <div className="absolute -right-4 -bottom-4 opacity-10 text-[var(--color-accent)]">
                                    <svg width="120" height="120" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm1 8h4v2h-6V7h2v5z"></path></svg>
                                </div>
                            </Card>

                            <Card
                                className="rounded-3xl border-none shadow-lg"
                                title={
                                    <div className="flex justify-between items-center py-2">
                                        <span className="font-bold text-[var(--color-primary)]">TIẾN ĐỘ</span>
                                        <Tag color="blue" className="rounded-full px-3 border-none bg-[var(--color-primary)] text-white">
                                            {userAnswers.length}/{allQuestions.length}
                                        </Tag>
                                    </div>
                                }
                            >
                                <div className="grid grid-cols-6 gap-3 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {allQuestions.map((q) => {
                                        const isAnswered = userAnswers.some(a => a.questionId === q.questionIndex.toString() && a.answer);
                                        return (
                                            <button
                                                key={q.questionIndex}
                                                className={`
                                                    aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all
                                                    ${isAnswered
                                                        ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[rgba(44,44,112,0.2)]'
                                                        : 'bg-slate-50 text-slate-400 border border-slate-200 hover:border-[var(--color-accent)]'}
                                                `}
                                            >
                                                {q.questionIndex}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <Button
                                        type="primary"
                                        block
                                        size="large"
                                        className="h-14 rounded-2xl font-bold bg-[var(--color-primary)] hover:bg-[var(--color-navy-main)] border-none shadow-lg shadow-[rgba(44,44,112,0.1)]"
                                    >
                                        NỘP BÀI THI
                                    </Button>
                                    <p className="text-center text-[var(--color-text-secondary)] text-xs italic">Tự động lưu sau 10 giây</p>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}