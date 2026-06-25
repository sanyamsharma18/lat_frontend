import { API_ROUTES } from '@/config/apiRoutes';
import callApi from '@/lib/clientApi';


import { EIGHT_MIN_LENGTH, TEN_MIN_LENGTH } from '@/constants/appConstants';

import { HTTP_METHOD } from '@/types/common';

import { ApiResponse } from '@/types/api';
import { ErrorMessagesType, SignInFormKeys, SignInFormType } from '@/types/signInFormType';

import { EMAIL_OR_PHONE_REGEX, PASSWORD_PATTERN } from '@/utils/regex';


interface LoginUserDetail {
    fullName?: string;
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
    passwordPattern: 'Password length should be 8 to 30 digits',
    namePattern: 'Please enter a valid email address or phone number',
};

export const VALIDATION_RULES = {
    [SignInFormKeys.PASSWORD]: {
        length: EIGHT_MIN_LENGTH,
        required: true,
        regex: PASSWORD_PATTERN,
        errorMessage: ERROR_MESSAGES.passwordPattern,
    },
    [SignInFormKeys.NAME]: {
        length: TEN_MIN_LENGTH,
        required: true,
        regex: EMAIL_OR_PHONE_REGEX,
        errorMessage: ERROR_MESSAGES.namePattern,
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
