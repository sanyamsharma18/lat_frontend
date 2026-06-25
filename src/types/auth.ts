export type UserStatus = 0 | 1;

export interface UserRoleDetail {
    readonly id: number;
    readonly createdAt: string;
    readonly updatedAt: string;
    name: string;
    status: UserStatus;
}

export interface LoginDetailType {
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    fullName: string;
    email: string;
    phone: string;
    isEmailSent: UserStatus;
    status: UserStatus;
    token: string | null;
    role: UserRoleDetail;
}

