/**
 * @file Radio component
 */
import React from 'react';
import cx from 'classnames';

import { ColorVariant, FontType } from '@/types/typographyCommon';

import { Text } from '@/components/index';

import styles from './styles.module.scss';

interface RadioProps extends React.ComponentPropsWithoutRef<'input'> {
    /**
     * label for the input
     */
    label?: string;
    /**
     * value is used for managing state.
     */
    value?: string | number;
    name?: string;
    /**
     * onChange is used for managing the state for input
     */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /**
     * className is used for the additional style
     */
    className?: string;

    font?: [FontType, FontType];

    checked: boolean;
    color?: ColorVariant;
}

const Radio = (props: RadioProps) => {
    const {
        label,
        onChange,
        value,
        className,
        font = [FontType.text_sm_medium, FontType.text_sm_medium],
        name,
        checked,
        color = 'gray-500',
        disabled = false,
    } = props;

    const inputId = `radio-${name}-${value}`;

    return (
        <div className={styles.wrapper}>
            <input
                type='radio'
                placeholder=''
                className={cx(styles.radio, className)}
                onChange={onChange}
                value={value}
                name={name}
                checked={checked}
                id={inputId}
                disabled={disabled}
            />
            <label htmlFor={inputId} aria-hidden style={{ cursor: 'pointer' }}>
                <Text tagType='span' color={color} font={font}>
                    {label}
                </Text>
            </label>
        </div>
    );
};

export default React.memo(Radio);
/**
 * This component provide render the radio button with various styling option.
 * @example
 * <Radio value={item.name} label={item.name} name={PersonalInformationPageKeys.Gender} onChange={handleRadioButtonChange}/>
 */
