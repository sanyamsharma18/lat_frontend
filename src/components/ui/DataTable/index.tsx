'use client';

import cx from 'classnames';
import { ReactNode } from 'react';

import Text from '@/components/ui/Text';

import { FontType } from '@/types/typographyCommon';

import styles from './styles.module.scss';


export interface DataTableColumn<T> {
    id: string;
    header: string;
    cell: (row: T) => ReactNode;
    className?: string;
}


interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];
    getRowKey: (row: T) => string;
    emptyText?: string;
    renderMobileCard?: (row: T) => ReactNode;
}

const DataTable = <T,>({
    columns,
    data,
    getRowKey,
    emptyText = 'No records found',
    renderMobileCard,
}: DataTableProps<T>) => (
    <div className={styles.tableShell}>
        <div className={styles.desktopTable}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th className={column.className} key={column.id}>
                                <Text
                                    color='slate-500'
                                    font={[FontType.text_xs_medium, FontType.text_xs_medium]}
                                >
                                    {column.header}
                                </Text>
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row) => (
                        <tr key={getRowKey(row)}>
                            {columns.map((column) => (
                                <td className={column.className} key={column.id}>
                                    {column.cell(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className={styles.mobileCards}>
            {data.map((row) => (
                <article className={styles.mobileCard} key={getRowKey(row)}>
                    {renderMobileCard?.(row)}
                </article>
            ))}
        </div>

        {!data.length && (
            <div className={cx(styles.emptyState, renderMobileCard && styles.emptyWithCards)}>
                <Text color='gray-500' font={[FontType.text_sm_medium, FontType.text_sm_medium]}>
                    {emptyText}
                </Text>
            </div>
        )}
    </div>
);

export default DataTable;
