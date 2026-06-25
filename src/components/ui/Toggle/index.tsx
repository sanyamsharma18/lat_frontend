import React from 'react';
import cx from 'classnames';

import { Text } from '@/components/index';

import styles from './styles.module.scss';


interface ToggleProps {
    isToggled: boolean;
    value: string;
    onToggle: (value: boolean, id: string) => void;
    className?: string;
}

const Toggle = (props: ToggleProps) => {
    const { isToggled, onToggle, className, value } = props;

    return (
        <Text tagType='label' className={cx(styles.switch, className)}>
            <input
                type='checkbox'
                checked={isToggled}
                value={value}
                onChange={(e) => onToggle(e.target.checked, e.target.value)}
            />
            <span className={cx(styles.slider, styles.round)} />
        </Text>
    );
};

export default React.memo(Toggle);
