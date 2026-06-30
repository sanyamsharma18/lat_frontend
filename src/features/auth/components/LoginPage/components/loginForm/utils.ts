import { API_ROUTES } from '@/config/apiRoutes';
import callApi from '@/lib/clientApi';


import { HTTP_METHOD } from '@/types/common';

import { ApiResponse } from '@/types/api';
import { ErrorMessagesType, SignInFormKeys, SignInFormType } from '@/types/signInFormType';

interface LoginUserDetail {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    mobileNo?: string;
    roleName?: string;
    email?: string;
    role?: {
        name?: string;
    };
}


interface LoginResponsePayload {
    accessToken?: string;
    message?: string;
    user?: LoginUserDetail;
}

interface LoginApiResponse extends ApiResponse<LoginResponsePayload> {}

interface CheckSignInValuesArgs {
    formValues: SignInFormType;
    errorMessages: ErrorMessagesType;
}

export const ERROR_MESSAGES = {
    passwordPattern: 'Please enter your password',
};

interface ValidationRule {
    required: boolean;
    errorMessage: string;
    regex?: RegExp;
}

export const VALIDATION_RULES: Partial<Record<SignInFormKeys, ValidationRule>> = {
    [SignInFormKeys.PASSWORD]: {
        required: true,
        errorMessage: ERROR_MESSAGES.passwordPattern,
    },
};

export const setErrorMsgOnValidationFailed = (
    key: SignInFormKeys,
    message: string,
    isInputValid: boolean,
    setErrorMessages: React.Dispatch<React.SetStateAction<ErrorMessagesType>>,
) => {
    setErrorMessages((prevMessages: ErrorMessagesType) => ({
        ...prevMessages,
        [key]: isInputValid ? '' : message,
    }));
};

export const validateInput = (
    key: SignInFormKeys,
    value: string,
    setErrorMessages: React.Dispatch<React.SetStateAction<ErrorMessagesType>>,
) => {
    const rule = VALIDATION_RULES[key];

    let isInputValid = true;

    if (
        (rule && 'required' in rule && rule.required && !value) ||
        (rule && 'regex' in rule && rule.regex && !rule.regex.test(value as string))
    ) {
        isInputValid = false;
    }

    setErrorMsgOnValidationFailed(
        key,
        rule ? rule.errorMessage : '',
        isInputValid,
        setErrorMessages,
    );

    return isInputValid;
};

export const checkAllValueValidOrNot = (args: CheckSignInValuesArgs) => {
    const { formValues, errorMessages } = args;

    const isAllFieldsFilled = Object.keys(formValues).every(
        (key) => formValues[key as SignInFormKeys].trim() !== '',
    );

    const areAllErrorsFalse = Object.values(errorMessages).every((message) => message === '');

    return isAllFieldsFilled && areAllErrorsFalse;
};

export const loginApiCall = async (body: SignInFormType) => {
    const response = await callApi<LoginApiResponse>({
        url: API_ROUTES.login,
        method: HTTP_METHOD.POST,
        body: {
            username: body[SignInFormKeys.NAME],
            password: body[SignInFormKeys.PASSWORD],
        },
    });

    return response;
};
