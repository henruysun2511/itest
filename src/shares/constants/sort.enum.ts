export enum SortOrder {
  DESC = 'desc',
  ASC = 'asc'
}
export const BaseSortBy = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt'
} as const;

export type BaseSortBy = (typeof BaseSortBy)[keyof typeof BaseSortBy];

export const ExamSetSortBy = {
  ...BaseSortBy
} as const;

export type ExamSetSortBy = (typeof ExamSetSortBy)[keyof typeof ExamSetSortBy];

export const ExamSessionSortBy = {
  DATE: 'date'
} as const;

export type ExamSessionSortBy = (typeof ExamSessionSortBy)[keyof typeof ExamSessionSortBy];

export const ExamSortBy = {
  ...BaseSortBy,
  TITLE: 'title'
} as const;
export type ExamSortBy = (typeof ExamSortBy)[keyof typeof ExamSortBy];

export const CourseSortBy = {
  NAME: 'name'
} as const;

export type CourseSortBy = (typeof CourseSortBy)[keyof typeof CourseSortBy];

