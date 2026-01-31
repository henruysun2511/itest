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

