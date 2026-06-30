'use client';

import {
    ChangeEvent,
    FormEvent,
    KeyboardEvent as ReactKeyboardEvent,
    RefObject,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useRouter } from 'next/navigation';

import { showToast } from '@/components/ui/Toaster/constant';

import { KeyboardEvent } from '@/constants/enumConstant';
import { ServerSideRoutes } from '@/constants/serverSideRoutes';

import { ErrorMessagesType, SignInFormKeys, SignInFormType } from '@/types/signInFormType';

import { setClientSideUserDetail } from '@/utils/cookieManager';

import { storeDataInServerSideCookies } from '@/utils/storeDataInServerSideCookies';

import {
    INITIAL_STATE as initialState,
    MAX_LENGTHS,
} from '../components/LoginPage/components/loginForm/constant';
import {
    checkAllValueValidOrNot,
    loginApiCall,
    validateInput,
} from '../components/LoginPage/components/loginForm/utils';

interface LoginInputRefs {
    [SignInFormKeys.NAME]: RefObject<HTMLInputElement | null>;
}

export const useLoginForm = () => {
    const [formValues, setFormValues] = useState<SignInFormType>(initialState);
    const [errorMessages, setErrorMessages] = useState<ErrorMessagesType>({});
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const userNameRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();

    const inputRefs: LoginInputRefs = {
        [SignInFormKeys.NAME]: passwordRef,
    };

    const updateFormValues = (key: SignInFormKeys, value: string) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [key]: value,
        }));
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const inputName = name as SignInFormKeys;

        if (!value) {
            setErrorMessages((prev) => ({
                ...prev,
                [name]: '',
            }));

            updateFormValues(inputName, value);

            return;
        }

        if (value.length <= MAX_LENGTHS[inputName]) {
            updateFormValues(inputName, value);

            if (inputName !== SignInFormKeys.PASSWORD) {
                validateInput(inputName, value, setErrorMessages);
            }
        }
    };

    const handleLogin = async () => {
        try {
            setLoading(true);

            const loginData = await loginApiCall(formValues);
            const { status, response, message } = loginData || {};

            if (!status) {
                throw new Error(message);
            }

            const { accessToken: token, message: Message, user: rawUser } = response || {};

            if (!token || !rawUser) {
                throw new Error('Invalid login response');
            }

            const userDetail = {
                ...rawUser,
                fullName: `${rawUser.firstName || ''} ${rawUser.lastName || ''}`.trim(),
                phone: rawUser.mobileNo,
                role: {
                    name: rawUser.roleName
                }
            };

            await Promise.all([
                storeDataInServerSideCookies(ServerSideRoutes.STORE_AUTH_TOKEN, { token }),
                storeDataInServerSideCookies(ServerSideRoutes.STORE_USER_DETAIL_ROUTE, {
                    userDetail,
                }),
            ]);
            setClientSideUserDetail(userDetail);

            showToast({
                type: 'success',
                message: Message ?? 'Login successfully',
            });

            // Add Redirection

            setTimeout(() => {
                const roleName = userDetail.role.name?.toLowerCase() || '';
                if (roleName === 'admin' || roleName === 'superadmin') {
                    router.replace('/admin/dashboard');
                } else if (roleName === 'teacher') {
                    router.replace('/teacher/dashboard');
                } else if (roleName === 'student') {
                    router.replace('/student/dashboard');
                } else if (roleName === 'reviewer') {
                    router.replace('/reviewer/dashboard');
                } else {
                    router.replace('/dashboard');
                }
            }, 2000);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);

            showToast({
                type: 'error',
                message: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const targetInput = event.target as HTMLInputElement;

        if (event.key === KeyboardEvent.ENTER) {
            const nextInputRef =
                targetInput.name === SignInFormKeys.NAME
                    ? inputRefs[SignInFormKeys.NAME]
                    : undefined;

            if (nextInputRef?.current) {
                nextInputRef.current.focus();
            } else if (isFormValid) {
                handleLogin();
            }
        }
    };

    const handleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isFormValid) {
            handleLogin();
        }
    };

    useEffect(() => {
        const isValid = checkAllValueValidOrNot({
            formValues,
            errorMessages,
        });

        setIsFormValid(isValid);
    }, [formValues, errorMessages]);

    useEffect(() => {
        userNameRef.current?.focus();
    }, []);

    return {
        errorMessages,
        formValues,
        handleChange,
        handleKeyDown,
        handleShowPassword,
        handleSubmit,
        isFormValid,
        loading,
        passwordRef,
        showPassword,
        userNameRef,
    };
};
