import { FIFTY_MAX_LENGTH, THIRTY_MAX_LENGTH } from '@/constants/appConstants';

import { ForgotInFormKeys, SignInFormKeys } from '@/types/signInFormType';

export const LOGIN_PAGE_DATA = {
    appName: 'LAT Portal',

    title: 'Welcome back',

    subtitle: 'Sign in to continue to Assessment Journey',

    userName: {
        label: 'Email or Student ID',
        name: 'phoneNumber',
        type: 'text',
        placeholder: 'Enter your Email / Student ID',
        autoComplete: 'username',
        ariaLabel: 'Email or StudentId',
    },

    password: {
        label: 'Password',
        name: 'password',
        type: 'password',
        placeholder: 'Enter your password',
        autoComplete: 'current-password',
        ariaLabel: 'Password',
    },

    forgotPasswordButton: {
        label: 'Forgot Password?',
        ariaLabel: 'Forgot Password',
    },

    signInButton: {
        label: 'Sign In',
        ariaLabel: 'Sign In',
    },

    form: {
        ariaLabel: 'Login Form',
    },

    copyright: '© 2026 LAT Portal (Rupantar). All rights reserved',

    logo: {
        alt: 'lat Logo',
    },
};

export const INITIAL_STATE = {
    [SignInFormKeys.NAME]: '',
    [SignInFormKeys.PASSWORD]: '',
};

export const FORGOT_INITIAL_STATE = {
    [ForgotInFormKeys.FORGOT_PASSWORD]: '',
};

export const MAX_LENGTHS = {
    [SignInFormKeys.NAME]: FIFTY_MAX_LENGTH,
    [SignInFormKeys.PASSWORD]: THIRTY_MAX_LENGTH,
};
