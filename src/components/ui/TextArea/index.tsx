import React, { forwardRef, memo } from 'react';
import cx from 'classnames';

import { FontType } from '@/types/typographyCommon';
import { Text } from '@/components/index';

import ShimmerUiContainer from '../ShimmerUiContainer';
import styles from './styles.module.scss';

interface TextareaProps extends React.ComponentPropsWithoutRef<'textarea'> {
    value: string;
    name: string;
    label?: string;
    helperText?: string | React.ReactElement;
    className?: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onClickStart?: () => void;
    onClickEnd?: () => void;
    placeholder?: string;
    error?: boolean;
    disable?: boolean;
    loading?: boolean;
    shimmerClassName?: string;
    inputBaseClass?: string;
    internalInputBaseClass?: string;
    rows?: number;
    endAdornmentClassname?: string;
}

const TextareaBase = (
    props: TextareaProps,
    ref: React.ForwardedRef<HTMLTextAreaElement>,
) => {
    const {
        label,
        helperText,
        onChange,
        className,
        value,
        name,
        placeholder = 'Type here...',
        error = false,
        disable = false,
        loading = false,
        shimmerClassName,
        inputBaseClass,
        internalInputBaseClass,
        rows = 4,
        ...restProps
    } = props;

    return (
        <div className={cx(styles.wrapper, inputBaseClass)}>
            {loading ? (
                <ShimmerUiContainer className={shimmerClassName} />
            ) : (
                <div
                    className={cx(
                        styles['container-wrapper'],
                        disable && styles.disabled,
                        className,
                    )}
                    data-display={error}
                >
                    <textarea
                        aria-label={label}
                        aria-describedby={helperText ? 'helper-text' : undefined}
                        ref={ref}
                        value={value}
                        name={name}
                        onChange={onChange}
                        placeholder={placeholder}
                        disabled={disable}
                        rows={rows}
                        className={cx(
                            styles['textarea-container'],
                            internalInputBaseClass,
                        )}
                        {...restProps}
                    />
                </div>
            )}

            {helperText && (
                <div className={styles['helper-text']}>
                    <Text
                        font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                        color={error ? 'red-500' : 'black'}
                    >
                        {helperText}
                    </Text>
                </div>
            )}
        </div>
    );
};

export const Textarea = forwardRef(TextareaBase);
export default memo(Textarea);
