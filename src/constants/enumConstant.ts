export enum KeyboardEvent {
    ENTER = 'Enter',
    BACKSPACE = 'Backspace',
    SPACE = 'Space',
    KEYDOWN = 'keydown',
    SHIFT = 'Shift',
    TAB = 'Tab',
}

export const TOASTER_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
} as const;

export type ToasterStatus = (typeof TOASTER_STATUS)[keyof typeof TOASTER_STATUS];

