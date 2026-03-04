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

export interface UserJwtDecode {
    accountId: string;
    roleId: string;
    sub?: string;
    isPremium?: boolean;
    exp?: number;
    iat?: number;
    jti?: string;
}

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
}
export type { ExamBody };

