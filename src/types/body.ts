import { ExamSessionStatus } from "@/constants/status.enum";
import { GenderType } from "@/constants/type.enum";
import { AccountStatus } from "./enum";
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
  studentId: string;
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
