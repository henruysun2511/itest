import { AccountStatus, ExamSessionStatus } from "@/shares/constants/status.enum";
import { FraudType, GenderType, ProctoringHandleType } from "@/shares/constants/type.enum";
import { Pagination } from "./param";

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: Pagination;
}

export type { ApiResponse };


interface UserJwtDecode {
  sub: string;
  roleName: string;
  iat: number;
  exp: number;
}
export type { UserJwtDecode };

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
export type { LoginResponse };

interface ChangePasswordBody {
  oldPassword?: string;
  password: string;
  passwordConfirm: string;
}

interface UpdateStudentPasswordBody {
  studentAccountId: string;
  password: string;
  passwordConfirm: string;
}

interface LoginBody {
  username: string;
  password: string;
};
export type { LoginBody };

interface ChangeAccountStatusBody {
  status: AccountStatus;
}
export type { ChangeAccountStatusBody };

interface DeleteFilePdfBody {
  filePath: string;
}
export type { DeleteFilePdfBody };

interface GetSignedUrlBody {
  filePath: string;
  bucket: string;
  expiresIn?: number;
}
export type { GetSignedUrlBody };

interface ParseExamBody {
  signedUrl: string;
}
export type { ParseExamBody };

interface DeleteFileCloudinaryBody {
  publicId: string;
  resourceType: string; //audio/image/video
}
export type { DeleteFileCloudinaryBody };

interface ExamBody {
  title: string;
  objectKey: string;
  parsedJson: any;
  examSetId: string;
  examCode: string;
  answers: Array<{
    questionNumber: number;
    correctAnswer: string[];
    points: number;
  }>;
  hasEssay?: boolean;
}
export type { ExamBody };

interface CreateExamSessionBody {
  examSessionCode: string;
  examSetId: string;
  date: string;
  room: string;
  duration: number;
  isCameraRequired: boolean;
}
export type { CreateExamSessionBody };

interface ChangeExamSessionStatusBody {
  status: ExamSessionStatus;
}
export type { ChangeExamSessionStatusBody };

interface LockStateBody {
  isLocked: boolean;
}
export type { LockStateBody };

interface SetPauseStateBody {
  isPaused: boolean;
}
export type { SetPauseStateBody };

interface BulkAccountItem {
  username: string;
  password?: string;
  code: string;
}
export type { BulkAccountItem };

interface BulkAccountBody {
  roleName: string;
  accounts: BulkAccountItem[];
}
export type { BulkAccountBody };

interface CreateExamRegistrationBody {
  studentCode: string;
  dateOfBirth: string;
  fullName: string;
  candidateNumber: string;
}
export type { CreateExamRegistrationBody };

interface AccessStateBody {
  isAccessGranted: boolean;
}
export type { AccessStateBody };

interface CreateExamSessionTeacherBody {
  examSessionId: string;
  teacherIds: string[];
}
export type { CreateExamSessionTeacherBody };

interface UpdateProfileBody {
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  avatar?: string;
  gender?: GenderType;
}
export type { UpdateProfileBody };

interface SaveAnswersBody {
  studentId: string;
  studentCode: string;
}

interface PauseAttemptBody {
  isPaused: boolean;
}

interface ForceSubmitBody {
  studentIds: string[];
  studentCodes: string[];
}

interface DraftAnswer {
  questionId: string;
  answer: string | string[];
}

interface SaveDraftBody {
  examSessionId: string;
  changes: DraftAnswer[];
}

interface SubmitExamBody {
  answers: DraftAnswer[];
}

interface RetakePermissionBody {
  studentId: string;
  studentCode: string;
  examSessionId: string;
}

interface ReportFraudBody {
  fraudType: FraudType;
}

interface CreateProctoringHandleBody {
  studentId: string;
  examSessionId: string;
  reason: string;
  type: ProctoringHandleType;
}

interface StudentAccessStateBody {
  isAccessGranted: boolean;
  studentCode: string;
}

interface VerifyFaceBody {
  face: File;
  examAttemptId: string;
  occurredAt: Date;
}
interface AssignGradersBody {
  examSessionCode: string;
  teacherIds: string[];
  role: string;
}

interface EssayScoreDetailItemBody {
  questionId: string;
  score: number;
  comment?: string;
}

interface GradeEssayBody {
  resultGradingId: string;
  scoreDetail: EssayScoreDetailItemBody[];
  totalScore: number;
  comment?: string;
}

export type {
  AssignGradersBody, ChangePasswordBody, CreateProctoringHandleBody, DraftAnswer, EssayScoreDetailItemBody, ForceSubmitBody, GradeEssayBody, PauseAttemptBody, ReportFraudBody, RetakePermissionBody,
  SaveAnswersBody, SaveDraftBody, StudentAccessStateBody, SubmitExamBody, UpdateStudentPasswordBody, VerifyFaceBody
};

