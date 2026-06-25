import { ReactNode } from 'react';

import cx from 'classnames';

import Text from '@/components/ui/Text';

import { FontType } from '@/types/typographyCommon';

import styles from './styles.module.scss';

export type DashboardTone = 'blue' | 'cyan' | 'green' | 'orange' | 'purple' | 'yellow';

export interface DashboardStat {
    id: string;
    title: string;
    value: string | number;
    tone: DashboardTone;
    description?: string;
    icon?: ReactNode;
    active?: boolean;
}

export interface DashboardProgressItem {
    id: string;
    label: string;
    value: number;
    tone: DashboardTone;
}

export interface DashboardActionGroup {
    id: string;
    title: string;
    count: number;
    tone: DashboardTone;
    items: {
        id: string;
        name: string;
        leadId: string;
    }[];
}

export interface DashboardAmount {
    id: string;
    label: string;
    value: string;
    tone: DashboardTone;
}

interface DashboardProgressListProps {
    title: string;
    summary: string;
    items: DashboardProgressItem[];
}

interface DashboardAmountStripProps {
    title: string;
    amounts: DashboardAmount[];
}

interface DashboardActionListProps {
    title: string;
    totalLabel: string;
    groups: DashboardActionGroup[];
}

export const DashboardStatCard = ({
    id,
    title,
    value,
    tone,
    description,
    icon,
    active,
}: DashboardStat) => (
    <article className={cx(styles.statCard, active && styles.activeStat)} data-dashboard-card={id}>
        <div className={styles.statHeader}>
            <Text color='gray-500' font={[FontType.text_xs_regular, FontType.text_xs_regular]}>
                {title}
            </Text>
            <span className={cx(styles.statIcon, styles[tone])} aria-hidden='true'>
                {icon}
            </span>
        </div>

        <Text
            tagType='strong'
            color='black'
            font={[FontType.text_xxl_semibold, FontType.text_xxl_semibold]}
        >
            {value}
        </Text>

        {description ? (
            <Text color='gray-500' font={[FontType.text_xs_regular, FontType.text_xs_regular]}>
                {description}
            </Text>
        ) : null}
    </article>
);

export const DashboardProgressList = ({ title, summary, items }: DashboardProgressListProps) => {
    const maxValue = Math.max(...items.map((item) => item.value), 1);

    return (
        <section className={styles.panel}>
            <div className={styles.panelHeader}>
                <Text color='black' font={[FontType.text_sm_medium, FontType.text_sm_medium]}>
                    {title}
                </Text>
                <Text color='gray-500' font={[FontType.text_xs_regular, FontType.text_xs_regular]}>
                    {summary}
                </Text>
            </div>

            <div className={styles.progressList}>
                {items.map((item) => (
                    <div className={styles.progressRow} key={item.id}>
                        <Text
                            className={styles.progressLabel}
                            color='gray-500'
                            font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                        >
                            {item.label}
                        </Text>

                        <div className={styles.progressTrack}>
                            <span
                                className={cx(styles.progressFill, styles[`fill-${item.tone}`])}
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            >
                                <Text
                                    color='white'
                                    font={[FontType.text_xs_semibold, FontType.text_xs_semibold]}
                                >
                                    {item.value}
                                </Text>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export const DashboardAmountStrip = ({ title, amounts }: DashboardAmountStripProps) => (
    <section className={styles.amountSection}>
        <Text color='black' font={[FontType.text_xs_medium, FontType.text_xs_medium]}>
            {title}
        </Text>

        <div className={styles.amountGrid}>
            {amounts.map((amount) => (
                <div className={styles.amountItem} key={amount.id}>
                    <Text
                        tagType='strong'
                        className={cx(styles.amountValue, styles[amount.tone])}
                        font={[FontType.text_sm_bold, FontType.text_sm_bold]}
                    >
                        {amount.value}
                    </Text>
                    <Text
                        color='gray-500'
                        font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                    >
                        {amount.label}
                    </Text>
                </div>
            ))}
        </div>
    </section>
);

export const DashboardActionList = ({ title, totalLabel, groups }: DashboardActionListProps) => (
    <aside className={styles.actionPanel}>
        <div className={styles.panelHeader}>
            <Text color='black' font={[FontType.text_sm_medium, FontType.text_sm_medium]}>
                {title}
            </Text>
            <Text
                tagType='span'
                color='red-600'
                font={[FontType.text_xs_medium, FontType.text_xs_medium]}
                className={styles.badge}
            >
                {totalLabel}
            </Text>
        </div>

        <div className={styles.actionGroups}>
            {groups.map((group) => (
                <div className={styles.actionGroup} key={group.id}>
                    <Text
                        className={cx(styles.groupTitle, styles[group.tone])}
                        font={[FontType.text_xs_medium, FontType.text_xs_medium]}
                    >
                        {group.title} ({group.count})
                    </Text>

                    <div className={styles.actionCards}>
                        {group.items.map((item) => (
                            <button
                                className={cx(styles.actionCard, styles[`${group.tone}Surface`])}
                                key={item.id}
                                type='button'
                            >
                                <span>
                                    <Text
                                        tagType='strong'
                                        color='black'
                                        font={[
                                            FontType.text_xs_semibold,
                                            FontType.text_xs_semibold,
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                    <Text
                                        tagType='span'
                                        color='gray-500'
                                        font={[
                                            FontType.text_xxs_regular,
                                            FontType.text_xxs_regular,
                                        ]}
                                    >
                                        {item.leadId}
                                    </Text>
                                </span>
                                <span className={styles.arrow} aria-hidden='true'>
                                    &gt;
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </aside>
);
