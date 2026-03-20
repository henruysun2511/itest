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
import { ProgressButton } from '../(components)/renderProgressButton';
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
    console.log(examDetailRes);
    const { data: examSessionRes, isLoading: isExamSessionLoading } = useExamSessionDetail(examSessionId);

    // Xác định nguồn dữ liệu cuối cùng để render
    const finalExamData = useMemo(() => {
        // Ưu tiên store, nếu không có thì lấy từ API response
        return storeExamData || examDetailRes?.data;
    }, [storeExamData, examDetailRes?.data]);
    // 2. State quản lý câu trả lời
    // const [userAnswers, setUserAnswers] = useState<any[]>([]);
    const setExamData = useExamStore((state) => state.setExamData);
    useEffect(() => {
        if (!storeExamData && examDetailRes?.data) {
            setExamData(examDetailRes.data);
        }
    }, [examDetailRes?.data, storeExamData, setExamData]);

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

    const handleEnableFullScreen = () => {
        const elem = document.documentElement; // Lấy toàn bộ trang web

        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch((err) => {
                console.error(`Không thể bật toàn màn hình: ${err.message}`);
            });
        }
    };

    useEffect(() => {
        // Nếu chưa ở chế độ toàn màn hình, hiện Modal bắt buộc
        Modal.warning({
            title: 'Yêu cầu chế độ toàn màn hình',
            content: 'Để đảm bảo tính công bằng, bài thi yêu cầu chế độ toàn màn hình. Vui lòng nhấn xác nhận để bắt đầu.',
            okText: 'Xác nhận & Vào thi',
            onOk: () => {
                handleEnableFullScreen();
            },
        });

        // Theo dõi nếu người dùng cố tình thoát Fullscreen (nhấn Esc)
        const handleExit = () => {
            if (!document.fullscreenElement) {
                message.error("Cảnh báo: Bạn đã thoát chế độ toàn màn hình! Hành động này sẽ được ghi nhận.");
                handleViolationDetected(FraudType.WINDOW_BLUR);
            }
        };

        document.addEventListener('fullscreenchange', handleExit);
        return () => document.removeEventListener('fullscreenchange', handleExit);
    }, []);

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


    // 4. Auto-save & Heartbeat
    const { mutate: saveDraft } = useSaveDraft();

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
    }, [examAttemptId]);

    const { mutate: sendHeartbeat } = useHeartbeat();

    useEffect(() => {
        // 1. Xử lý khi mất kết nối mạng (Offline)
        const handleOffline = () => {
            console.log("Mất kết nối mạng, gửi heartbeat cuối...");
            sendHeartbeat(examAttemptId as string);
        };

        // 2. Xử lý khi đóng tab, tắt trình duyệt hoặc chuyển ứng dụng
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                // Sử dụng sendBeacon hoặc mutate để báo cáo trạng thái cuối
                // Lưu ý: Chrome ưu tiên sendBeacon khi đóng tab
                sendHeartbeat(examAttemptId as string);
            }
        };

        // 3. Xử lý sự kiện trước khi unload (F5, Close Tab)
        const handleBeforeUnload = () => {
            sendHeartbeat(examAttemptId as string);
        };

        window.addEventListener('offline', handleOffline);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('offline', handleOffline);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [examAttemptId, sendHeartbeat]);

    // 5. Submit & Timer
    const { mutate: submitExam, isPending: isSubmitting } = useSubmitExam();
    const setExamResult = useExamStore((state) => state.setExamResult);
    const handleSubmit = () => {
        Modal.confirm({
            title: 'Xác nhận nộp bài?',
            content: 'Bạn có chắc chắn muốn nộp bài thi không?',
            onOk: () => {
                const formattedAnswers = userAnswers.map((ans) => {
                    // Kiểm tra nếu là câu tự luận (value là object có content)
                    const isEssay = typeof ans.answer === 'object' && ans.answer !== null;

                    if (isEssay) {
                        return {
                            questionId: ans.questionId,
                            answer: ans.answer.content || "", // Nội dung văn bản
                            file_urls: ans.answer.file_metadata?.map((m: any) => m.signedUrl) || [] // Mảng URL phẳng
                        };
                    }

                    // Trắc nghiệm giữ nguyên
                    return {
                        questionId: ans.questionId,
                        answer: ans.answer || ""
                    };
                });

                const payload = {
                    examAttemptId,
                    answers: formattedAnswers
                };

                console.log("Dữ liệu chuẩn gửi đi:", payload);

                submitExam({
                    examSessionId,
                    data: { answers: formattedAnswers }
                }, {
                    onSuccess: (res) => {
                        message.success("Nộp bài thành công!");
                        console.log(res.data.data)
                        const resultData = res.data?.data;
                        if (resultData) {
                            setExamResult(resultData);
                        }
                        localStorage.removeItem(`exam_endtime_${examSessionId}`);
                        localStorage.removeItem(`exam_progress_${examSessionId}`);
                        router.replace(`/student/examSession/takeExam/${examSessionId}/result`);
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
                                        onClick={handleSubmit}
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