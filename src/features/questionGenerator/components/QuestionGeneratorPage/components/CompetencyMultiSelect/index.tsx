'use client';

import { ChangeEvent, useMemo, useRef, useState } from 'react';

import cx from 'classnames';

import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input/Input';
import Text from '@/components/ui/Text';

import useClickOutside from '@/hooks/useClickOutside';

import { QuestionOptionItem } from '@/types/questionGenerator';
import { FontType } from '@/types/typographyCommon';

import styles from './styles.module.scss';

interface CompetencyMultiSelectProps {
    label: string;
    placeholder: string;
    options: QuestionOptionItem[];
    value: string[];
    onChange: (value: string[]) => void;
    disable?: boolean;
}

const CompetencyMultiSelect = ({
    label,
    placeholder,
    options,
    value,
    onChange,
    disable = false,
}: CompetencyMultiSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useClickOutside(wrapperRef, () => setIsOpen(false));

    const filteredOptions = useMemo(() => {
        const normalizedSearch = searchValue.trim().toLowerCase();

        return normalizedSearch
            ? options.filter((option) => option.name.toLowerCase().includes(normalizedSearch))
            : options;
    }, [options, searchValue]);

    const isAllSelected = options.length > 0 && value.length === options.length;
    const displayValue = value.length ? `${value.length} selected` : placeholder;

    const handleToggleOption = (optionId: string) => {
        onChange(
            value.includes(optionId)
                ? value.filter((selectedId) => selectedId !== optionId)
                : [...value, optionId],
        );
    };

    const handleToggleAll = () => {
        onChange(isAllSelected ? [] : options.map((option) => option.id));
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <Text font={[FontType.text_sm_medium, FontType.text_sm_medium]} color='gray-500'>
                {label}
            </Text>
            <button
                type='button'
                className={cx(
                    styles.trigger,
                    isOpen && styles.triggerOpen,
                    disable && styles.triggerDisabled,
                )}
                onClick={() => { if (!disable) setIsOpen((previous) => !previous); }}
                aria-haspopup='listbox'
                aria-expanded={isOpen}
                disabled={disable}
            >
                <span>{displayValue}</span>
                <span aria-hidden='true'>⌄</span>
            </button>

            {isOpen ? (
                <div className={styles.menu}>
                    <Input
                        id='competencySearch'
                        name='competencySearch'
                        type='search'
                        value={searchValue}
                        placeholder='Search competency'
                        onChange={handleSearchChange}
                    />
                    <div className={styles.optionRow}>
                        <Checkbox
                            isChecked={isAllSelected}
                            label='Select All'
                            onChange={handleToggleAll}
                            labelFont={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                        />
                    </div>
                    <div className={styles.optionList} role='listbox' aria-label={label}>
                        {filteredOptions.map((option) => (
                            <div className={styles.optionRow} key={option.id}>
                                <Checkbox
                                    isChecked={value.includes(option.id)}
                                    label={option.name}
                                    onChange={() => handleToggleOption(option.id)}
                                    labelFont={[FontType.text_sm_medium, FontType.text_sm_medium]}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default CompetencyMultiSelect;
