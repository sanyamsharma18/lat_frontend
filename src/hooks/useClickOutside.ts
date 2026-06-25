'use client';

import { RefObject, useEffect } from 'react';

export default function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T | null>,
    onOutsideClick: () => void,
) {
    useEffect(() => {
        const handler = (event: MouseEvent | TouchEvent) => {
            const el = ref.current;
            if (!el) return;
            if (event.target instanceof Node && el.contains(event.target)) return;
            onOutsideClick();
        };

        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler);
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('touchstart', handler);
        };
    }, [ref, onOutsideClick]);
}

