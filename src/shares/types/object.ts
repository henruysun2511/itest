import { AccountStatus, ExamSessionStatus } from "@/shares/constants/status.enum";
import { ExamRegistrationStatusType, FraudType, GenderType, QuestionType } from "@/shares/constants/type.enum";

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



export type MediaType = "image" | "audio" | "video";

export interface MediaPlaceholder {
  mediaType: MediaType;
  description: string;
  url: string;
  publicId: string;
}

export interface Option {
  label: string;
  text: string;
}

export interface Question {
  questionIndex: number;
  questionText: string;
  questionType: string;
  options: Option[] | null;
  mediaPlaceholders: MediaPlaceholder[] | null;
}

export interface QuestionGroup {
  groupInstruction: string;
  questionIndices: number[];
  mediaPlaceholders: MediaPlaceholder[] | null;
}

export interface Part {
  partIndex: number;
  partTitle: string;
  partDescription: string | null;
  extraDescription?: string;
  questionType?: string;
  mediaPlaceholders: MediaPlaceholder[];
  questionGroups: QuestionGroup[];
  questions: Question[];
}

export interface ExamData {
  hasParts: boolean;
  parts: Part[];
}

export interface ExamSessionHandling {
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

export interface Result {
  resultId: string;
  examSessionId: string;
  examSessionCode: string;
  studentId: string;
  studentCode: string;
  fullName: string;
  status: string;
  totalScore?: number;
}

export interface ScorePart {
  score: number;
  correct: number;
  partIndex: number;
  totalQuestions: number;
}

export interface ScoreDetail {
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

export interface ResultDetail extends Result {
  scoreDetail?: ScoreDetail;
}

export interface EssayAnswerItem {
  questionType: string;
  questionId: string;
  partId: string;
  content: string;
  answerText: string;
  fileUrls: string[];
}

export interface EssayResult {
  resultGradingId: string;
  currentScore: number;
  answers: EssayAnswerItem[];
}


