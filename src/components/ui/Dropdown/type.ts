import React from 'react';

interface DropdownIconProps {
    className?: string;
    onClick?: () => void;
}

export interface DropdownProps<T> {
    /**
     * options props for showing option.
     */
    options: T[];
    /**
     * value.
     */
    value: T | T[] | null | string;
    /**
     * selectValue props which we want to show as label.
     */
    selectValue: keyof T;
    /**
     * loading props for showing loader.
     */
    loading?: boolean;
    /**
     * multipleSelection for dropdown can select multipleSelection value or not.
     * @default false;
     */
    multipleSelection?: boolean;
    /**
     * The label work as a placeholder.
     */
    label?: string;
    /**
     * noOptionstext for if no options are available then showing it's text.
     */
    noOptionText?: React.ReactNode;

    searchStartIcon?: React.ComponentType<DropdownIconProps>;

    searchEndIcon?: React.ComponentType<DropdownIconProps>;

    onChange?: (argument: T) => void;
    /**
     * searchFilter is used as a state for search input
     */
    searchFilter?: string;
    /**
     * handleSearch is onChange event for search input
     */
    handleSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /**
     *  additionalStyle is used for additional styling
     */
    additionalStyle?: string;
    /**
     * optionsClassName is styling for options
     */
    optionsClassName?: string;
    /**
     * isSearchable is used for showing search input.
     * @default 'false'
     */
    isSearchable?: boolean;
    /**
     * disable is used for disable the dropdown
     * @default 'false'
     */
    disable?: boolean;
    /**
     * Shimmer loader is used for the showing shimmer at the the time of loading in the case of when user get some details from the api.
     */
    shimmerLoader?: boolean;
    /**
     * className for the shimmer.
     */
    shimmerClassName?: string;
    /**
     * className for the DropDown.
     */
    className?: string;
    /**
     * className for the DropDown position and width.
     */
    widthClassName?: string;
    /**
     * For dropdownTitle
     */
    dropDownTitle?: string;
    /**
     * For option Height Modal
     */
    optionAreaHeight?: string;
}
