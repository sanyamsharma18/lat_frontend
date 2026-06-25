export const DROPDOWN_SEARCH_INPUT_PLACEHOLDER = 'Search...';

export function getOptionLabel<T extends object>(item: T, selectValue: keyof T): string {
    const value = item?.[selectValue];
    if (value === null || value === undefined) return '';
    return String(value);
}

