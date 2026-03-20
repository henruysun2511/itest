"use client";

import { useHeartbeat, useReportFraud, useSaveDraft, useSubmitExam, useVerifyFaceAttempt } from '@/queries/useExamAttemptQuery';
import { useExamDetail } from '@/queries/useExamQuery';
import { useExamSessionDetail } from '@/queries/useExamSessionQuery';
import { FraudType, QuestionType } from '@/shares/constants/type.enum';
import { DraftAnswer, SaveDraftBody } from '@/shares/types/body';
import { Button, Card, Col, message, Modal, Result, Row, Spin, Statistic, Tabs, Tag } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import ExamMonitor from '../(components)/exam-monitor';
import { RenderMediaList } from '../(components)/media-render';
import { StudentQuestion } from '../(components)/student-question';

export default function TakeExamPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = React.use(params);
    const examSessionId = resolvedParams.id;
    const searchParams = useSearchParams();
    const examId = searchParams.get("examId");
    const examAttemptId = searchParams.get("examAttemptId");

    // 1. Fetch Data
    const { data: examDetailRes, isLoading: isExamLoading, error: examError } = useExamDetail(examId as string);
    const { data: examSessionRes, isLoading: isExamSessionLoading } = useExamSessionDetail(examSessionId);
    // Lấy dữ liệu từ cấu trúc parsedJson 
    const examData = examDetailRes?.data?.parsedJson;
    console.log(examData)
    // Giả định API Join/Detail trả về ID của lượt thi để gọi Draft/Heartbeat


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
        if (!examAttemptId || Object.keys(userAnswers).length === 0) return;
        const timer = setInterval(() => {
            const payload: SaveDraftBody = {
                examSessionId: examSessionId,
                changes: Object.entries(userAnswers).map(([qId, val]) => ({
                    questionId: qId,
                    answer: val
                }))
            };
            saveDraft(payload);
        }, 10000);
        return () => clearInterval(timer);
    }, [userAnswers, examAttemptId, examSessionId]);

    useEffect(() => {
        if (!examAttemptId) return;
        const timer = setInterval(() => {
            heartbeat(examAttemptId);
        }, 30000);
        return () => clearInterval(timer);
    }, [examAttemptId]);


    //Xử lý vi phạm
    const { mutate: reportFraud } = useReportFraud();

    useEffect(() => {
        // Hàm helper để gửi báo cáo vi phạm nhanh
        const sendFraudReport = (type: FraudType, warningMsg: string) => {
            if (!examAttemptId) return;

            reportFraud({
                examAttemptId,
                data: { fraudType: type } // Chỉ truyền fraudType theo yêu cầu
            });

            if (warningMsg) {
                message.warning(warningMsg);
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                sendFraudReport(FraudType.TAB_SWITCHING, "Cảnh báo: Bạn vừa rời khỏi trang thi!");
            }
        };

        const handleWindowBlur = () => {
            sendFraudReport(FraudType.WINDOW_BLUR, "Cảnh báo: Không được rời khỏi cửa sổ làm bài!");
        };

        const handleOffline = () => {
            sendFraudReport(FraudType.NETWORK_DISRUPTION, "Cảnh báo: Kết nối mạng bị gián đoạn!");
        };

        // Đăng ký tất cả các sự kiện giám sát
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleWindowBlur);
        window.addEventListener('offline', handleOffline);

        return () => {
            // Hủy đăng ký tất cả
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('offline', handleOffline);
        };
    }, [examAttemptId, reportFraud]); // Thêm các dependency cần thiết

    // Hàm dùng cho các component con (ví dụ: phát hiện khuôn mặt từ ExamMonitor)
    const handleViolationDetected = (type: FraudType) => {
        if (!examAttemptId) return;

        reportFraud({
            examAttemptId,
            data: { fraudType: type }
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
            const nonEssay = combined.filter(q => q.questionType !== QuestionType.ESSAY);
            const essays = combined.filter(q => q.questionType === QuestionType.ESSAY);

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
                    {part.mediaPlaceholders && (
                        <div className="mb-6 p-4 rounded-2xl">
                            <RenderMediaList mediaList={part.mediaPlaceholders} />
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


    const { mutate: verifyFace } = useVerifyFaceAttempt();
    // Hiệu ứng chụp ảnh mỗi 3 phút
    useEffect(() => {
        // Chỉ chạy nếu ca thi yêu cầu camera và đã có lượt thi (examAttemptId)
        if (!examAttemptId || !examSessionRes?.data.isCameraRequired) return;

        const VERIFY_INTERVAL = 3 * 60 * 1000; // 3 phút

        const handleAutoCapture = () => {
            // Tìm video đang hiển thị từ ExamMonitor
            const video = document.querySelector('video');
            const canvas = document.createElement('canvas');

            if (video && video.readyState === 4) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    // Lật ảnh (Mirror) cho giống thực tế
                    ctx.translate(canvas.width, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Chuyển canvas sang Blob -> File
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const faceFile = new File(
                                [blob],
                                `verify_${examAttemptId}_${Date.now()}.jpg`,
                                { type: "image/jpeg" }
                            );

                            // Gửi ảnh về server
                            verifyFace({
                                examAttemptId,
                                face: faceFile,
                                occurredAt: new Date()
                            }, {
                                onError: () => {
                                    // Cảnh báo nhẹ nhàng nếu gửi lỗi hoặc không nhận diện được
                                    message.warning("Hệ thống giám sát không thể xác thực khuôn mặt, vui lòng điều chỉnh lại vị trí ngồi!");
                                }
                            });
                        }
                    }, "image/jpeg", 0.7); // Nén 70% để giảm tải server
                }
            }
        };

        // Chạy lần đầu sau 1 phút để ổn định, sau đó lặp lại mỗi 3 phút
        const firstShot = setTimeout(handleAutoCapture, 60000);
        const interval = setInterval(handleAutoCapture, VERIFY_INTERVAL);

        return () => {
            clearTimeout(firstShot);
            clearInterval(interval);
        };
    }, [examAttemptId, examSessionRes, verifyFace]);

    const { mutate: submitExam, isPending: isSubmitting } = useSubmitExam();

    // 2. Hàm xử lý khi nhấn nút Nộp bài
    const handleSubmit = () => {
        // Thu thập danh sách câu trả lời từ state draftAnswers của bạn
        const answers: DraftAnswer[] = userAnswers.map((item) => ({
            questionId: item.questionId,
            answer: item.answer
        }));

        console.log(answers)
        Modal.confirm({
            title: 'Xác nhận nộp bài?',
            content: 'Bạn có chắc chắn muốn kết thúc bài thi và nộp các câu trả lời này không?',
            okText: 'Nộp bài',
            cancelText: 'Hủy',
            onOk: () => {
                submitExam({
                    examSessionId,
                    data: { answers }
                }, {
                    onSuccess: (res) => {
                        message.success("Nộp bài thi thành công!");
                        console.log(res);
                        localStorage.removeItem(`exam_endtime_${examSessionId}`);
                        localStorage.removeItem(`exam_progress_${examSessionId}`);
                        // router.replace(`/student/examSession/result/${examSessionId}?examAttemptId=${examAttemptId}`);
                    },
                    onError: (err: any) => {
                        message.error(err?.response?.data?.message || "Lỗi khi nộp bài thi");
                    }
                });
            }
        });
    };

    // Thêm logic tính toán thời gian kết thúc vào trong TakeExamPage
    const endTime = useMemo(() => {
        const storageKey = `exam_endtime_${examSessionId}`;
        const savedEndTime = localStorage.getItem(storageKey);

        if (savedEndTime) {
            return parseInt(savedEndTime, 10);
        }

        // Nếu chưa có (lần đầu vào thi), tính toán dựa trên duration từ API
        // duration thường là phút, đổi sang miliseconds
        if (examSessionRes?.data?.duration) {
            const newEndTime = Date.now() + examSessionRes.data.duration * 60 * 1000;
            localStorage.setItem(storageKey, newEndTime.toString());
            return newEndTime;
        }

        return Date.now(); // Default fallback
    }, [examSessionId, examSessionRes]);

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
                                        value={endTime}
                                        format="HH:mm:ss"
                                        valueStyle={{ color: '#fff', fontWeight: '900', fontSize: '42px', textAlign: 'center', fontFamily: 'monospace' }}
                                        onFinish={() => {
                                            message.warning("Đã hết giờ làm bài! Hệ thống đang tự động nộp...");
                                            handleSubmit();
                                        }}
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
                                        // Tìm câu trả lời tương ứng
                                        const userAnswer = userAnswers.find(a => a.questionId === q.questionIndex.toString());

                                        // Kiểm tra câu trả lời có "thực sự" tồn tại không
                                        const isAnswered = userAnswer && (
                                            // Nếu là mảng (Multiple Choice), phải có ít nhất 1 phần tử
                                            (Array.isArray(userAnswer.answer) && userAnswer.answer.length > 0) ||
                                            // Nếu là chuỗi hoặc số, không được rỗng/null/undefined
                                            (typeof userAnswer.answer !== 'object' && userAnswer.answer !== "" && userAnswer.answer != null)
                                        );

                                        return (
                                            <button
                                                key={q.questionIndex}
                                                className={`aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all
                                                  ${isAnswered
                                                        ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[rgba(44,44,112,0.2)]'
                                                        : 'bg-slate-50 text-slate-400 border border-slate-200 hover:border-[var(--color-accent)]'}`}
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
                                        loading={isSubmitting} // Hiển thị loading khi đang gọi API
                                        onClick={handleSubmit} // Gắn hàm xử lý nộp bài
                                        className="h-14 rounded-2xl font-bold bg-[var(--color-primary)] hover:bg-[var(--color-navy-main)] border-none shadow-lg shadow-[rgba(44,44,112,0.1)]"
                                    >
                                        NỘP BÀI THI
                                    </Button>
                                    <p className="text-center text-[var(--color-text-secondary)] text-xs italic">
                                        Tự động lưu sau 10 giây
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}