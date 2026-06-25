export enum StaleAndCacheTime {
    STALE_TIME = 30 * 60 * 1000,
    CACHE_TIME = 40 * 60 * 1000,
}

export const MODAL_STYLING = {
    '& .MuiDialog-container': {
        background: 'rgba(0, 0, 0, 0.50)',
    },
    '& .MuiPaper-root': {
        borderRadius: '12px',
        minWidth: '348px',
    },
};

export const LARGE_MODAL_STYLING = {
    '& .MuiDialog-container': {
        background: 'rgba(0, 0, 0, 0.50)',
    },
    '& .MuiPaper-root': {
        borderRadius: '12px',
        minWidth: '1048px',
    },
};

export const ZERO_DATA = 0;

export const EIGHT_MIN_LENGTH = 8;

export const TEN_MIN_LENGTH = 10;

export const SIX_MAX_LENGTH = 6;

export const ELEVEN_MAX_LENGTH = 11;

export const THIRTY_MAX_LENGTH = 30;

export const THREE_HUNDRED_MAX_LENGTH = 300;

export const DEBOUNCE_SEARCH_TIME = 1500;

export const LOADING_TIME_DURATION = 2000;

export const FIFTY_MAX_LENGTH = 50;

export const SIXTY_MAX_LENGTH = 60;

export const HUNDRED_MAX_LENGTH = 100;

export const ONE_FIFTY_MAX_LENGTH = 150;

export const THREE_MIN_LENGTH = 3;

export const FOUR_MIN_LENGTH = 4;

export const TWO_MIN_LENGTH = 2;

export enum StatusNumber {
    ACTIVE = 1,
    INACTIVE = 0,
}

export enum StatusNumberString {
    ACTIVE = '1',
    INACTIVE = '0',
}

export const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`;

export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other',
}

export const STATIC_GENDER = [
    { id: 1, name: Gender.Male },
    { id: 2, name: Gender.Female },
    { id: 3, name: Gender.Other },
];

export const generateNextDates = (days: number = 15): string[] => {
    const today = new Date();

    return Array.from({ length: days + 1 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() + i);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    });
};

export const formatDWithStringMonth = (date: string) =>
    new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

export const generateLeadCode = (
    createdAt: string,
    leadId: number | string,
    digits = 3,
): string => {
    const year = new Date(createdAt).getFullYear();

    return `ST-${year}-${String(leadId).padStart(digits, '0')}`;
};
