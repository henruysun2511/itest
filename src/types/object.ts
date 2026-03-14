import { ExamSessionStatus } from "@/constants/status.enum";
import { ExamRegistrationStatusType, GenderType } from "@/constants/type.enum";
import { AccountStatus } from "./enum";

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
}
export type { ExamSession };

interface ExamPdf {
  pdfUrl: string;
}
export type { ExamPdf };

interface Exam {
  examCode: string;
  title: string;
  objectKey: string;
  parsedJson?: ExamData;
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
  account?: {
    profile?: {
      fullName: string | null;
    };
  };
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






export type MediaType = "image" | "audio" | "video";

export interface MediaPlaceholder {
  mediaType: MediaType;
  description: string;
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
  media?: any[]; // Dùng để lưu file thực tế sau khi upload
}

export interface QuestionGroup {
  groupInstruction: string;
  questionIndices: number[];
  mediaPlaceholders: MediaPlaceholder[] | null;
  media?: any[];
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
  media?: any[];
}

export interface ExamData {
  hasParts: boolean;
  parts: Part[];
}

