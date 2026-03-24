import { AccountStatus, ExamSessionStatus, ResultGradingStatus } from "@/shares/constants/status.enum";
import { ExamRegistrationStatusType, FraudType, GenderType, QuestionType, ResultGradingRole } from "@/shares/constants/type.enum";

interface BaseObject {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Account extends BaseObject {
  accountId: string;
  googleId: string | null;
  username: string;
  password: string;
  type: string;
  email: string | null;
  status: AccountStatus;
  roleId: string;
  roleName?: string;
  code?: string;
}
export type { Account };

interface Role extends BaseObject {
  roleId: string;
  roleName: string;
  description: string;
}
export type { Role };

interface ExamSet extends BaseObject {
  examSetId: string;
  name: string;
  course?: { name: string };
}

export type { ExamSet };

interface UploadExamPdf {
  objectKey: string;
  signedUrl: string;
}
export type { UploadExamPdf };

interface UploadCloudinary {
  public_id: string;
  url: string;
  resource_type: string;
}
export type { UploadCloudinary };

interface ExamSession {
  id: string;
  examSessionId: string;
  examSessionCode: string;
  examSetId: string;
  date: string;
  room: string;
  courseId: string;
  duration: number;
  isCameraRequired: boolean;
  isLocked: boolean;
  isPaused: boolean;
  status: ExamSessionStatus;
  teacherIds?: string[];
  teacherNames?: string[];
}
export type { ExamSession };

interface ExamPdf {
  pdfUrl: string;
}
export type { ExamPdf };

interface QuestionDetail {
  questionId: string;
  questionNumber: string;
  questionType: QuestionType;
  content: string;
}
interface Exam {
  examCode: string;
  title: string;
  objectKey: string;
  parsedJson?: ExamData;
  questions: QuestionDetail[];
}

export type { Exam };

interface Student {
  studentId: string;
  studentCode: string;
  fullName: string;
  dateOfBirth: string | null;
  gender: GenderType;
}
export type { Student };

interface Teacher {
  teacherId: string;
  accountId: string;
  teacherCode: string;
  departmentId: string | null;
  fullName: string;
}
export type { Teacher };

interface ExamRegistration {
  registrationId: string;
  studentId: string;
  candidateNumber: string;
  status: ExamRegistrationStatusType;
  fullName: string | null;
  dateOfBirth: string | null;
  studentCode: string;
  isAccessGranted: boolean;
}
export type { ExamRegistration };

interface ExamSessionTeacher {
  examSessionTeacherId: string;
  examSessionId: string;
  teacherId: string;
  assignedAt: string;
  examSession: {
    examSessionCode: string;
    date: string;
    room: string;
  };
  teacher: {
    teacherId: string;
    teacherCode: string;
    account: {
      profile: {
        fullName: string | null;
      };
    };
  };
}
export type { ExamSessionTeacher };

interface Profile {
  profileId: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  avatar: string | null;
  gender: GenderType;
  account?: {
    student?: {
      studentCode: string;
    } | null;
    teacher?: {
      teacherCode: string;
    } | null;
  };
}
export type { Profile };

interface Setting {
  settingId: string | null;
  logo: string | null;
  backgroundImage: string | null;
  audioTest: string | null;
  logoUrl: string | null;
  backgroundImageUrl: string | null;
  audioTestUrl: string | null;
}
export type { Setting };

interface ExamAttempt {
  examAttemptId: string;
  studentId: string;
  examSessionId: string;
  examId: string;
  status: string;
  warningCount: number;
  ip: string;
  startTime: string;
  endTime: string;
  fraudLevel: string;
  lastResumedAt: string | null;
  consumedTime: number;
  candidateNumber: string;
  studentCode: string;
  fullName: string;
  cachedSubmission?: any;
}
export type { ExamAttempt };

interface Course {
  courseId: string;
  name: string;
}
export type { Course };

interface TeacherCourse {
  teacherId: string;
  courseId: string;
  course: {
    courseId: string;
    name: string;
    departmentId: string;
  };
}
export type { TeacherCourse };


interface FraudDetail {
  fraudDetailId: string;
  examAttemptId: string;
  examSessionId: string;
  examSessionCode: string;
  fraudType: FraudType;
  occurredAt: string;
  fullName: string;
  studentCode: string;
}
export type { FraudDetail };

interface ExamSessionHandling {
  examSessionHandlingId: string;
  reason: string;
  studentId: string;
  studentCode: string;
  fullName?: string;
  examSessionId: string;
  examSessionCode: string;
  teacherId: string;
  teacherName: string;
  createdAt: string;
  type: string;
}
export type { ExamSessionHandling };

interface Result {
  resultId: string;
  examSessionId: string;
  examSessionCode: string;
  studentId: string;
  studentCode: string;
  fullName: string;
  status: string;
  totalScore?: number;
}
export type { Result };

interface ScorePart {
  score: number;
  correct: number;
  partIndex: number;
  totalQuestions: number;
}
export type { ScorePart };

interface ScoreDetail {
  parts: ScorePart[];
  percent: number;
  maxScore: number;
  totalScore: number;
  totalCorrect: number;
  totalQuestions: number;
  scoreDetail?: {
    maxScore: number;
    totalScore: number;
    totalCorrect: number;
    totalQuestions: number;
    percent: number;
    parts: any[];
  };
}
export type { ScoreDetail };

interface ResultDetail extends Result {
  scoreDetail?: ScoreDetail;
}
export type { ResultDetail };

interface EssayAnswerItem {
  questionType: string;
  questionId: string;
  partId: string;
  content: string;
  answerText: string;
  fileUrls: string[];
}
export type { EssayAnswerItem };

interface EssayResult {
  resultGradingId: string;
  currentScore: number;
  answers: EssayAnswerItem[];
}
export type { EssayResult };


//Type cho câu hỏi
export type MediaType = "image" | "audio" | "video";

interface MediaPlaceholder {
  mediaType: MediaType;
  description: string;
  url: string;
  publicId: string;
}

interface Option {
  label: string;
  text: string;
}

interface Question {
  questionIndex: number;
  questionText: string;
  questionType: string;
  options: Option[] | null;
  mediaPlaceholders: MediaPlaceholder[] | null;
}

interface QuestionGroup {
  groupInstruction: string;
  questionIndices: number[];
  mediaPlaceholders: MediaPlaceholder[] | null;
}

interface Part {
  partIndex: number;
  partTitle: string;
  partDescription: string | null;
  extraDescription?: string;
  questionType?: string;
  mediaPlaceholders: MediaPlaceholder[];
  questionGroups: QuestionGroup[];
  questions: Question[];
}

interface ExamData {
  hasParts: boolean;
  parts: Part[];
}

export type { ExamData, MediaPlaceholder, Option, Part, Question, QuestionGroup };

interface ResultGrading {
  resultGradingId: string;
  role: ResultGradingRole;
  status: ResultGradingStatus;
  totalScore: number;
  studentCode: string;
  studentFullName: string;
  examSessionCode: string;
}

export type { ResultGrading };
