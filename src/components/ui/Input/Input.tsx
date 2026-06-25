'use client';

import React, { forwardRef, memo, useId } from 'react';

import cx from 'classnames';

import { FontType } from '@/types/typographyCommon';

import ShimmerUiContainer from '@/components/ui/ShimmerUiContainer';
import Text from '@/components/ui/Text';

import styles from './styles.module.scss';


interface AdornmentProps {
    className?: string;
    onClick?: () => void;
}


interface CommonProps {
    /**
     * Accessible label
     */
    label?: string;

    /**
     * Helper or error text
     */
    helperText?: React.ReactNode;

    /**
     * Error state
     */
    error?: boolean;

    /**
     * Loading state
     */
    loading?: boolean;

    /**
     * Disable field
     */
    disabled?: boolean;

    /**
     * Legacy disable prop
     */
    disable?: boolean;

    /**
     * Wrapper class
     */
    className?: string;

    /**
     * Root wrapper class
     */
    inputBaseClass?: string;

    /**
     * Native field class
     */
    internalInputBaseClass?: string;

    /**
     * Shimmer class
     */
    shimmerClassName?: string;

    /**
     * Start adornment
     */
    StartAdornment?: React.ComponentType<AdornmentProps>;

    /**
     * End adornment
     */
    EndAdornment?: React.ComponentType<AdornmentProps>;

    /**
     * Start adornment click
     */
    onClickStart?: () => void;

    /**
     * End adornment click
     */
    onClickEnd?: () => void;

    /**
     * End adornment class
     */
    endAdornmentClassname?: string;
}

interface InputFieldProps
    extends CommonProps,
        Omit<React.InputHTMLAttributes<HTMLInputElement>, 'disabled' | 'onChange'> {
    rows?: number;
    multiline?: false;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface TextareaFieldProps
    extends CommonProps,
        Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'disabled' | 'onChange'> {
    multiline: true;
    rows?: number;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export type InputProps = InputFieldProps | TextareaFieldProps;

const InputBase = (
    props: InputProps,
    ref: React.ForwardedRef<HTMLInputElement | HTMLTextAreaElement>,
) => {
    const generatedId = useId();

    const {
        id = generatedId,
        label,
        helperText,
        error = false,
        loading = false,
        disabled = false,
        disable = false,
        className,
        inputBaseClass,
        internalInputBaseClass,
        shimmerClassName,
        StartAdornment,
        EndAdornment,
        onClickStart,
        onClickEnd,
        endAdornmentClassname,
        required,
        rows,
        multiline,
        ...nativeProps
    } = props;

    const isDisabled = disabled || disable;

    const helperTextId = helperText ? `${id}-helper-text` : undefined;

    const renderStartAdornment = StartAdornment ? (
        <button
            type='button'
            className={styles['adornment-button']}
            onClick={onClickStart}
            disabled={isDisabled || !onClickStart}
            aria-label='Start input action'
        >
            <StartAdornment className={styles.adornment} />
        </button>
    ) : null;

    const renderEndAdornment = EndAdornment ? (
        <button
            type='button'
            className={styles['adornment-button']}
            onClick={onClickEnd}
            disabled={isDisabled || !onClickEnd}
            aria-label='End input action'
        >
            <EndAdornment className={cx(styles.adornment, endAdornmentClassname)} />
        </button>
    ) : null;

    return (
        <div className={cx(styles.wrapper, inputBaseClass)}>
            {label && (
                <label htmlFor={id} className={styles.label}>
                    <span>{label}</span>

                    {required && (
                        <span className={styles.required} aria-hidden='true'>
                            *
                        </span>
                    )}
                </label>
            )}

            {loading ? (
                <ShimmerUiContainer className={cx(styles.shimmer, shimmerClassName)} />
            ) : (
                <div
                    className={cx(
                        styles['container-wrapper'],
                        className,
                        isDisabled && styles.disabled,
                    )}
                    data-error={error}
                >
                    {renderStartAdornment}

                    {multiline ? (
                        <textarea
                            {...(nativeProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                            id={id}
                            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
                            rows={rows ?? 4}
                            disabled={isDisabled}
                            aria-invalid={error || undefined}
                            aria-describedby={helperTextId}
                            className={cx(
                                styles['input-container'],
                                styles.textarea,
                                internalInputBaseClass,
                            )}
                        />
                    ) : (
                        <input
                            {...(nativeProps as React.InputHTMLAttributes<HTMLInputElement>)}
                            id={id}
                            ref={ref as React.ForwardedRef<HTMLInputElement>}
                            disabled={isDisabled}
                            aria-invalid={error || undefined}
                            aria-describedby={helperTextId}
                            className={cx(styles['input-container'], internalInputBaseClass)}
                        />
                    )}

                    {renderEndAdornment}
                </div>
            )}

            {helperText && (
                <div id={helperTextId} className={styles['helper-text']} aria-live='polite'>
                    <Text
                        font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                        color={error ? 'red-500' : 'orange-600'}
                    >
                        {helperText}
                    </Text>
                </div>
            )}
        </div>
    );
};

const ForwardedInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(InputBase);

ForwardedInput.displayName = 'Input';

const Input = memo(ForwardedInput);

Input.displayName = 'Memo(Input)';

export default Input;
