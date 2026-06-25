/**
 * @file Checkbox Component
 */
import React from 'react';
import cx from 'classnames';

import Text from '@/components/ui/Text';

import { ColorVariant, FontType } from '@/types/typographyCommon';

import { KeyboardEvent } from '@/constants/enumConstant';

import CheckIcon from '@/assets/svg/check-mark.svg';

import styles from './styles.module.scss';


interface CheckboxType {
    /**
     * isChecked for checked the input box.
     */
    isChecked?: boolean;
    /**
     * onChange function for change the selection of checkbox.
     */
    onChange: (isChecked: boolean) => void | undefined;
    /**
     * label for the showing content.
     */
    label?: string | React.ReactElement;
    /**
     * className is for the additional styling.
     */
    className?: string;
    /**
     * this class is used for input height width
     */
    inputClassName?: string;

    /**
     * this class is used for tick icon position
     */
    checkIconClassName?: string;

    disabled?: boolean;

    labelFont?: [FontType, FontType];

    labelColor?: ColorVariant;
}

const Checkbox = (props: CheckboxType) => {
    const {
        isChecked,
        onChange,
        label,
        className,
        inputClassName,
        checkIconClassName,
        disabled = false,
        labelFont,
        labelColor,
    } = props;

    const handleKeyPress = (event: React.KeyboardEvent) => {
        event.stopPropagation();

        if (event.key === KeyboardEvent.ENTER || event.key === ' ') {
            event.preventDefault();

            onChange(!isChecked);
        }
    };

    const checkToggle = (event: React.MouseEvent | React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();

        if (event instanceof MouseEvent && event.target !== event.currentTarget) {
            return;
        }

        onChange(!isChecked);
    };

    return (
        <div
            className={cx(className, styles['primary-wrapper'])}
            role='button'
            tabIndex={0}
            onKeyDown={handleKeyPress}
            onClick={(e) => e.stopPropagation()}
        >
            <input
                className={cx(styles['checkbox-input'], inputClassName)}
                onChange={checkToggle}
                type='checkbox'
                checked={isChecked}
            />
            {isChecked && (
                <CheckIcon
                    className={cx(styles['check-icon'], disabled ? '' : checkIconClassName)}
                    onClick={checkToggle}
                />
            )}
            <Text
                tagType='span'
                font={labelFont}
                color={labelColor}
                onClick={checkToggle}
                aria-hidden
            >
                {label}
            </Text>
        </div>
    );
};

/**
 * This component provides a way to render checkBox components with various styling options.
 * @example
 *    <Checkbox label='hello' onChange={()=>setIsChecked(!checked)} isChecked={checked}/>
 */
export default React.memo(Checkbox);
