export enum AccountStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}


export const AccountType = {
  GOOGLE: 'GOOGLE',
  LOCAL: 'LOCAL'
} as const

export type AccountType = (typeof AccountType)[keyof typeof AccountType]