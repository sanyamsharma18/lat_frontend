/**
 * @file Button component.
 */
import React, { memo, ReactNode } from 'react';

import cx from 'classnames';

import { ButtonVariant, ColorVariant, FontType } from '@/types/typographyCommon';

import Text from '@/components/ui/Text';

import styles from './styles.module.scss';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    /**
     * Label for the button.
     */
    label: string;
    /**
     * Variant for the button.
     * @default 'solid';
     */
    variant: ButtonVariant;
    /**
     * Variant for the button.
     * @FontType (First Index) - Text size For mobile;
     * @FontType (Second Index) - Text size for Desktop;
     */
    font?: [FontType, FontType];
    /**
     * Color of Label
     */
    color: ColorVariant;
    /**
     * size is used for button size.
     * @default 'medium';
     */
    size?: 'large' | 'medium' | 'small' | 'x-small';
    /**
     * className is used for the additional css styles
     */
    className?: string;
    /**
     * Disabled is used for the disable the button.
     * @default 'false';
     */
    disabled?: boolean;
    /**
     * Loader is used for showing inprogress state at the time of network call.
     * @default 'false';
     */
    loader?: boolean;
    /**
     * EndIcon is used for the showing icon after the label.
     */
    EndIcon?: ReactNode;
    /*
     * StartIcon is used for the showing icon in the starting.
     */
    StartIcon?: ReactNode;

    /*
     * fontClassName is used to giving font specific styling.
     */
    fontClassName?: string;

    /*
     * id is used to giving specific id for using in ref.
     */
    id?: string;
}

const Button = (props: ButtonProps) => {
    const {
        type,
        className,
        disabled = false,
        variant,
        label,
        loader,
        EndIcon,
        StartIcon,
        size = 'medium',
        color,
        font = [FontType.text_md_medium, FontType.text_md_medium],
        onClick,
        fontClassName,
        id,
        ...restProps
    } = props;

    const buttonClass = cx(styles[variant], className, styles[size]);

    return (
        <button
            className={buttonClass}
            // eslint-disable-next-line react/button-has-type
            type={type}
            onClick={onClick}
            id={id}
            disabled={disabled || loader}
            {...restProps}
        >
            {StartIcon && StartIcon}
            <Text className={fontClassName} font={font} color={disabled ? 'white' : color}>
                {loader ? (
                    <Text
                        className={fontClassName}
                        font={font}
                        color={disabled ? 'orange-600' : color}
                    >
                        Loading....
                    </Text>
                ) : (
                    <Text font={font} color={color}>
                        {label}
                    </Text>
                )}
            </Text>
            {EndIcon && EndIcon}
        </button>
    );
};

/**
 * This component provides a way to render button with various styling option include.
 * @example
 * <Button type='button' label='Submit' variant='size' />
 */

export default memo(Button);
