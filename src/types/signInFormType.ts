export enum SignInFormKeys {
    NAME = 'userName',
    PASSWORD = 'password',
}


export interface SignInFormType {
    [SignInFormKeys.NAME]: string;
    [SignInFormKeys.PASSWORD]: string;
}


export interface ErrorMessagesType {
    [SignInFormKeys.NAME]?: string;
    [SignInFormKeys.PASSWORD]?: string;
}

export enum ForgotInFormKeys {
    FORGOT_PASSWORD = 'userName',
}


export interface ForgotInFormType {
    [ForgotInFormKeys.FORGOT_PASSWORD]: string;
}


export interface ForgotErrorMessageType {
    [ForgotInFormKeys.FORGOT_PASSWORD]?: string;
}
