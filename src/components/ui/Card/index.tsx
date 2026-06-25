import React from 'react';

import cx from 'classnames';

import styles from './styles.module.scss';


interface CardProps<T extends React.ElementType> {
    as?: T;
    className?: string;
    hoverable?: boolean;
}

type Props<T extends React.ElementType> = React.PropsWithChildren<CardProps<T>> &
    Omit<React.ComponentPropsWithoutRef<T>, keyof CardProps<T>>;

const Card = <T extends React.ElementType = 'article'>({
    as,
    children,
    className,
    hoverable = true,
    ...restProps
}: Props<T>) => {
    const Component = as || 'article';

    return (
        <Component className={cx(styles.card, hoverable && styles.hoverable, className)} {...restProps}>
            {children}
        </Component>
    );
};

export default Card;
