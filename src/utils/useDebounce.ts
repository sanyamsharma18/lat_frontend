import { useEffect, useState } from 'react';

/**
 * Debounces a changing value by a given delay.
 * @param value The value to debounce.
 * @param delay Delay in ms (default: 300ms).
 * @returns Debounced value.
 */
function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer); // Clear timer on change or unmount
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
