"use client";

import { useHeartbeat, useReportFraud, useSaveDraft, useSubmitExam, useVerifyFaceAttempt } from '@/queries/useExamAttemptQuery';
import { useExamDetail } from '@/queries/useExamQuery';
import { useExamSessionDetail } from '@/queries/useExamSessionQuery';
import { FraudType, QuestionType } from '@/shares/constants/type.enum';
import { useExamStore } from '@/stores/useExamStore';
import { Button, Card, Col, message, Modal, Result, Row, Spin, Statistic, Tabs } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ExamMonitor from '../(components)/exam-monitor';
import { StudentQuestion } from '../(components)/student-question';

export default function TakeExamPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = React.use(params);
    const examSessionId = resolvedParams.id;
    const searchParams = useSearchParams();
    const examId = searchParams.get("examId");
    const examAttemptId = searchParams.get("examAttemptId");

    // Lấy data từ Zustand Store (Dữ liệu đã có từ trang Join)
    const storeExamData = useExamStore((state) => state.examData);

    // 1. Fetch Data Fallback (Chỉ dùng khi store trống - ví dụ user reload trang)
    const { data: examDetailRes, isLoading: isExamLoading } = useExamDetail(
        !storeExamData ? (examId as string) : ""
    );
    const { data: examSessionRes, isLoading: isExamSessionLoading } = useExamSessionDetail(examSessionId);

    // Xác định nguồn dữ liệu cuối cùng để render
    const finalExamData = useMemo(() => {
        return storeExamData || examDetailRes?.data;
    }, [storeExamData, examDetailRes]);

    // 2. State quản lý câu trả lời
    const [userAnswers, setUserAnswers] = useState<any[]>([]);

    useEffect(() => {
        const localData = localStorage.getItem(`exam_progress_${examSessionId}`);
        if (localData) {
            setUserAnswers(JSON.parse(localData).answers);
        }
    }, [examSessionId]);

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

    // 3. Logic xử lý Tab và Câu hỏi (Dựa trên cấu trúc state bạn cung cấp)
    const { tabItems, allQuestions } = useMemo(() => {
        // Lưu ý: Object của bạn có cấu trúc: examDetail: { parts: [...] }
        const actualParts = finalExamData?.examDetail?.parts || [];
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

    // 4. Auto-save & Heartbeat
    const { mutate: saveDraft } = useSaveDraft();
    const { mutate: heartbeat } = useHeartbeat();

    const lastSavedAnswersRef = useRef<string>("");
    const currentUserAnswersRef = useRef(userAnswers);

    // Cập nhật ref mỗi khi userAnswers thay đổi
    useEffect(() => {
        currentUserAnswersRef.current = userAnswers;
    }, [userAnswers]);

    useEffect(() => {
        if (!examAttemptId) return;

        const timer = setInterval(() => {
            const currentAnswers = currentUserAnswersRef.current;

            // Chuyển sang string để so sánh nhanh xem có thay đổi so với lần lưu trước không
            const answersString = JSON.stringify(currentAnswers);

            // CHỈ gọi API nếu: 
            // - Có câu trả lời (length > 0)
            // - VÀ dữ liệu khác với lần đã lưu gần nhất
            if (currentAnswers.length > 0 && answersString !== lastSavedAnswersRef.current) {
                saveDraft({
                    examSessionId: examSessionId,
                    changes: currentAnswers
                }, {
                    onSuccess: () => {
                        // Cập nhật mốc dữ liệu đã lưu thành công
                        lastSavedAnswersRef.current = answersString;
                    }
                });
            }
        }, 10000); // Luôn chạy mỗi 10s cố định

        return () => clearInterval(timer);
    }, [examAttemptId]); //

    useEffect(() => {
        if (examAttemptId) {
            const timer = setInterval(() => heartbeat(examAttemptId), 30000);
            return () => clearInterval(timer);
        }
    }, [examAttemptId]);

    // 5. Submit & Timer
    const { mutate: submitExam, isPending: isSubmitting } = useSubmitExam();

    const handleSubmit = () => {
        console.log(userAnswers);
        Modal.confirm({
            title: 'Xác nhận nộp bài?',
            content: 'Bạn có chắc chắn muốn nộp bài thi không?',
            onOk: () => {
                submitExam({
                    examSessionId,
                    data: { answers: userAnswers }
                }, {
                    onSuccess: (res) => {
                        message.success("Nộp bài thành công!");
                        console.log(res)
                        // localStorage.removeItem(`exam_endtime_${examSessionId}`);
                        // localStorage.removeItem(`exam_progress_${examSessionId}`);
                        // router.replace(`/student/examSession/history`);
                    }
                });
            }
        });
    };

    const endTime = useMemo(() => {
        const storageKey = `exam_endtime_${examSessionId}`;
        const saved = localStorage.getItem(storageKey);
        if (saved) return parseInt(saved, 10);

        const duration = finalExamData?.duration || examSessionRes?.data?.duration;
        if (duration) {
            const time = Date.now() + duration * 60 * 1000;
            localStorage.setItem(storageKey, time.toString());
            return time;
        }
        return Date.now();
    }, [examSessionId, finalExamData, examSessionRes]);


    //vi phạm
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




    if (isExamSessionLoading || (isExamLoading && !storeExamData)) {
        return <Spin fullscreen tip="Đang chuẩn bị đề thi..." />;
    }

    if (!finalExamData) return <Result status="error" title="Không tìm thấy đề thi" />;

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
                                    onFinish={handleSubmit}
                                />
                            </Card>

                            <Card
                                className="rounded-3xl border-none shadow-lg"
                                title={<span className="font-bold">TIẾN ĐỘ ({userAnswers.length}/{allQuestions.length})</span>}
                            >
                                <div className="grid grid-cols-6 gap-3 max-h-[400px] overflow-y-auto">
                                    {allQuestions.map((q) => {
                                        const userAnswer = userAnswers.find(a => a.questionId === q.questionId);
                                        const isAnswered = userAnswer && (
                                            Array.isArray(userAnswer.answer)
                                                ? userAnswer.answer.length > 0
                                                : !!userAnswer.answer
                                        );
                                        return (
                                            <button
                                                key={q.questionId}
                                                className={`aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all
                                                    ${isAnswered ? 'bg-[var(--color-primary)] text-white' : 'bg-slate-50 text-slate-400 border'}`}
                                            >
                                                {q.questionNumber}
                                            </button>
                                        );
                                    })}
                                </div>
                                <Button
                                    type="primary"
                                    block
                                    size="large"
                                    loading={isSubmitting}
                                    onClick={handleSubmit}
                                    className="mt-6 h-14 rounded-2xl font-bold bg-[var(--color-primary)]"
                                >
                                    NỘP BÀI THI
                                </Button>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}