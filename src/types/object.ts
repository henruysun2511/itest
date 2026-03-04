import { AccountStatus } from "./enum";

interface Account {
    accountId: string;
    googleId: string | null;
    username: string;
    password: string;
    type: string;
    email: string | null;
    status: AccountStatus;
    roleId: string;
    roleName?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}
export type { Account };

interface Role {
    roleId: string;
    roleName: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}
export type { Role };

<<<<<<< HEAD
interface UploadExamPdf {
    objectKey: string;
    signedUrl: string;
}
export type { UploadExamPdf };

interface UploadCloudinary {
    public_id: string;
    url: string;
}
export type { UploadCloudinary };




// export type MediaType = "image" | "audio" | "video";

// export interface MediaPlaceholder {
//   mediaType: MediaType;
//   description: string;
// }

// export type QuestionType =
//   | "multiple_choice"
//   | "true_false"
//   | "fill_in_blank"
//   | "essay"
//   | "mixed";

// export interface Option {
//   label: string;
//   text: string;
// }

// export interface Question {
//   questionIndex: number;
//   questionText: string;
//   questionType: Exclude<QuestionType, "mixed">;
//   options: Option[] | null;
//   mediaPlaceholders: MediaPlaceholder[] | null;
// }

// export interface QuestionGroup {
//   groupInstruction: string;
//   questionIndices: number[];
//   mediaPlaceholders: MediaPlaceholder[] | null;
// }

// export interface Part {
//   partIndex: number;
//   partTitle: string;
//   partDescription: string | null;
//   questionType: QuestionType;
//   mediaPlaceholders: MediaPlaceholder[];
//   questionGroups: QuestionGroup[];
//   questions: Question[];
// }

// export interface ExamData {
//   hasParts: boolean;
//   parts: Part[];
// }

export interface MediaItem {
  mediaType: "image" | "audio" | "video";
  publicId: string;
  url: string;
}

export interface Question {
  id: string;
  questionIndex: number;
  questionText: string;
  options?: { label: string; content: string }[];
  media?: MediaItem[];
}

export interface QuestionGroup {
  id: string;
  groupInstruction: string;
  questionIndices: number[];
  media?: MediaItem[];
}

export interface Part {
  id: string;
  title?: string;
  questions: Question[];
  groups: QuestionGroup[];
  media?: MediaItem[];
}

export interface ExamData {
  parts: Part[];
}


=======
interface ExamSet {
    examSetId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export type { ExamSet };
>>>>>>> ac962f8d4a77c77e7d1e21ecf9ac1659198a2776
