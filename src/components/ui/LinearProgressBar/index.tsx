import React, { memo } from 'react';

import cx from 'classnames';

import styles from './styles.module.scss';

interface LinearProgressBarProps {
    progress: number;
    classname?: string;
}

const LinearProgressBar = (props: LinearProgressBarProps) => {
    const { progress, classname } = props;

    return (
        <div className={styles['progress-container']}>
            <div className={styles['progress-bar']}>
                <div
                    className={cx(classname, styles['progress-fill'])}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default memo(LinearProgressBar);
