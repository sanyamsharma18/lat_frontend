'use client';

import cx from 'classnames';

import Text from '@/components/ui/Text';

import { FontType } from '@/types/typographyCommon';

import styles from './styles.module.scss';


export interface SegmentedFilterTab<TId extends string> {
    id: TId;
    label: string;
    count: number;
}


interface SegmentedFilterTabsProps<TId extends string> {
    tabs: SegmentedFilterTab<TId>[];
    activeTab: TId;
    ariaLabel: string;
    className?: string;
    onChange: (tabId: TId) => void;
}

const SegmentedFilterTabs = <TId extends string>({
    tabs,
    activeTab,
    ariaLabel,
    className,
    onChange,
}: SegmentedFilterTabsProps<TId>) => (
    <div className={cx(styles.tabs, className)} role='tablist' aria-label={ariaLabel}>
        {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
                <button
                    className={cx(styles.tabButton, isActive && styles.activeTab)}
                    key={tab.id}
                    type='button'
                    role='tab'
                    aria-selected={isActive}
                    onClick={() => onChange(tab.id)}
                >
                    <Text font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}>{tab.label}</Text>
                    <Text font={[FontType.text_sm_bold, FontType.text_sm_bold]} className={styles.tabCount}>
                        {tab.count}
                    </Text>
                </button>
            );
        })}
    </div>
);

export default SegmentedFilterTabs;
