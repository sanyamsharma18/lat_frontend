'use client';

import { Input, Text, Toaster } from '@/components/index';

import { ButtonVariant, FontType } from '@/types/typographyCommon';

import EyeOpenIcon from '@/assets/svg/open-eye.svg';
import EyeCloseIcon from '@/assets/svg/close-eye.svg';

import Button from '@/components/ui/Button';

import { SignInFormKeys } from '@/types/signInFormType';

import { useLoginForm } from '@/features/auth/hooks/useLoginForm';

import { LOGIN_PAGE_DATA as loginData } from './constant';

import styles from './styles.module.scss';

const LoginForm = () => {
    const {
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
    } = useLoginForm();

    return (
        <div className={styles['main-container']}>
            <div className={styles['title-container']}>
                <Text font={[FontType.text_lg_semibold, FontType.text_lg_semibold]} color='black'>
                    {loginData.appName}
                </Text>
            </div>

            <div className={styles['heading-text']}>
                <Text
                    font={[
                        FontType.display_Desktop_md_semibold,
                        FontType.display_Desktop_md_semibold,
                    ]}
                    color='black'
                >
                    {loginData.title}
                </Text>

                <Text font={[FontType.text_md_regular, FontType.text_md_regular]} color='gray-500'>
                    {loginData.subtitle}
                </Text>
            </div>

            <form
                className={styles.form}
                onSubmit={handleSubmit}
                noValidate
                aria-label={loginData.form.ariaLabel}
            >
                <Input
                    id={SignInFormKeys.NAME}
                    label={loginData.userName.label}
                    name={SignInFormKeys.NAME}
                    type='text'
                    placeholder={loginData.userName.placeholder}
                    ref={userNameRef}
                    value={formValues[SignInFormKeys.NAME]}
                    error={!!errorMessages[SignInFormKeys.NAME]}
                    helperText={errorMessages[SignInFormKeys.NAME] || ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    inputBaseClass={styles.inputShell}
                    internalInputBaseClass={styles.inputControl}
                    aria-required='true'
                    aria-invalid={!!errorMessages[SignInFormKeys.NAME]}
                    aria-describedby={`${SignInFormKeys.NAME}-error`}
                    autoComplete='username'
                />

                <div className={styles.passwordGroup}>
                    <Input
                        id={SignInFormKeys.PASSWORD}
                        label={loginData.password.label}
                        name={SignInFormKeys.PASSWORD}
                        type={showPassword ? 'text' : 'password'}
                        placeholder={loginData.password.label}
                        ref={passwordRef}
                        value={formValues[SignInFormKeys.PASSWORD]}
                        error={!!errorMessages[SignInFormKeys.PASSWORD]}
                        helperText={errorMessages[SignInFormKeys.PASSWORD] || ''}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        inputBaseClass={styles.inputShell}
                        internalInputBaseClass={styles.inputControl}
                        aria-required='true'
                        aria-invalid={!!errorMessages[SignInFormKeys.PASSWORD]}
                        aria-describedby={`${SignInFormKeys.PASSWORD}-error`}
                        autoComplete='current-password'
                        EndAdornment={showPassword ? EyeOpenIcon : EyeCloseIcon}
                        onClickEnd={handleShowPassword}
                    />

                    <button
                        type='button'
                        className={styles.forgotButton}
                        aria-label={loginData.forgotPasswordButton.ariaLabel}
                    >
                        <Text
                            font={[FontType.text_sm_medium, FontType.text_sm_medium]}
                            color='orange-700'
                        >
                            {loginData.forgotPasswordButton.label}
                        </Text>
                    </button>
                </div>

                <Button
                    label={loginData.signInButton.label}
                    type='submit'
                    variant={ButtonVariant.SOLID}
                    color='white'
                    font={[FontType.text_md_semibold, FontType.text_md_semibold]}
                    className={styles.submitButton}
                    disabled={loading || !isFormValid}
                    loader={loading}
                    aria-label={loginData.signInButton.ariaLabel}
                />
            </form>

            <div className={styles['established-line']}>
                <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='slate-500'>
                    {loginData.copyright}
                </Text>
            </div>
            <Toaster />
        </div>
    );
};

export default LoginForm;
