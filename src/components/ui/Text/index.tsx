/**
 * @file Text Component
 */
import React, { JSX, memo } from 'react';

import cx from 'classnames';

import { ColorVariant, FontType } from '@/types/typographyCommon';

import styles from './styles.module.scss';


interface TextProps<T extends React.ElementType> {
    tagType?: T;
    font?: [FontType, FontType];
    className?: string;
    color?: ColorVariant;
    variant?: string;
    required?: boolean;
}

type Props<T extends React.ElementType> = React.PropsWithChildren<TextProps<T>> &
    React.ComponentPropsWithoutRef<T>;

const Text = <T extends React.ElementType = 'span'>(props: Props<T>) => {
    const {
        tagType: Element = 'span',
        children,
        font = [FontType.display_Desktop_lg_regular, FontType.display_Desktop_lg_regular],
        variant = '',
        className,
        color = 'black',
        required = false,
        ...restProps
    } = props;

    const Component = Element;

    const [mobileFont, desktopFont] = font;

    return (
        <Component
            className={cx(
                styles[`text__${mobileFont}`],
                styles[`text__desktop_${desktopFont}`],
                styles[`color--${color}`],
                variant || undefined,
                className,
            )}
            {...restProps}
        >
            {children}

            {required && (
                <Text
                    className={styles.required}
                    font={[FontType.text_md_medium, FontType.text_md_medium]}
                    color='red-500'
                >
                    *
                </Text>
            )}
        </Component>
    );
};

export default memo(Text) as <T extends React.ElementType = 'span'>(props: Props<T>) => JSX.Element;

/**
 * This component provides a way to render Text components with various styling options.
 * Font first index is used for mobile and second for the desktop
 * @example
 *    <Text font={[FontType.HEADING_BOLD_40, FontType.HEADING_BOLD_16]} color='red' tagType='h1'>
 *          Hello
 *     </Text>
 */
