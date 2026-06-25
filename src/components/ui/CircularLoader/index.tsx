import React, { memo } from 'react';

import styles from './styles.module.scss';

interface CircularLoaderProps {
    className?: string;
    color?: string;
}

const CircularLoader = (props: CircularLoaderProps) => {
    const { className, color } = props;
    return <div className={`${styles.loader} ${className}`} style={{ borderTopColor: color }} />;
};

export default memo(CircularLoader);
