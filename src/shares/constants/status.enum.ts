export enum ExamSessionStatus  {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSE = 'PAUSE',
  FINISHED = 'FINISHED'
} 

export enum ResultStatus {
  NOT_GRADED = 'NOT_GRADED',
  PUBLISHED = 'PUBLISHED'
} 

export enum AccountStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}


export enum ExamAttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSE = 'PAUSE',
  COMPLETED = 'COMPLETED',
  DISCONNECTED ='DISCONNECTED'
} 

export enum GradingStatus {
  ASSIGNED = 'ASSIGNED',
  GRADING ='GRADING',
  COMPLETED = 'COMPLETED'
} 
