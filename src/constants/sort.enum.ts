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