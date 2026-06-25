import { JSX } from 'react';

export type TagType = keyof Pick<
    JSX.IntrinsicElements,
    'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label'
>;

/**
 * Image src type
 */
export interface NextImageObjectSrc {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
}

export type NextImageSrc = NextImageObjectSrc | string;

export enum FontType {
    // ===== DISPLAY 2XL =====
    'display_Desktop_2xl_regular' = 'display_Desktop_2xl_regular',
    'display_Desktop_2xl_medium' = 'display_Desktop_2xl_medium',
    'display_Desktop_2xl_semibold' = 'display_Desktop_2xl_semibold',
    'display_Desktop_2xl_bold' = 'display_Desktop_2xl_bold',

    // ===== DISPLAY XL =====
    'display_Desktop_xl_regular' = 'display_Desktop_xl_regular',
    'display_Desktop_xl_medium' = 'display_Desktop_xl_medium',
    'display_Desktop_xl_semibold' = 'display_Desktop_xl_semibold',
    'display_Desktop_xl_bold' = 'display_Desktop_xl_bold',

    // ===== DISPLAY XLG =====
    'display_Desktop_xlg_regular' = 'display_Desktop_xlg_regular',
    'display_Desktop_xlg_medium' = 'display_Desktop_xlg_medium',
    'display_Desktop_xlg_semibold' = 'display_Desktop_xlg_semibold',
    'display_Desktop_xlg_bold' = 'display_Desktop_xlg_bold',

    // ===== DISPLAY LG =====
    'display_Desktop_lg_regular' = 'display_Desktop_lg_regular',
    'display_Desktop_lg_medium' = 'display_Desktop_lg_medium',
    'display_Desktop_lg_semibold' = 'display_Desktop_lg_semibold',
    'display_Desktop_lg_bold' = 'display_Desktop_lg_bold',

    // ===== DISPLAY MD =====
    'display_Desktop_xmd_regular' = 'display_Desktop_xmd_regular',
    'display_Desktop_xmd_medium' = 'display_Desktop_xmd_medium',
    'display_Desktop_xmd_semibold' = 'display_Desktop_xmd_semibold',
    'display_Desktop_xmd_bold' = 'display_Desktop_xmd_bold',

    // ===== DISPLAY MD =====
    'display_Desktop_md_regular' = 'display_Desktop_md_regular',
    'display_Desktop_md_medium' = 'display_Desktop_md_medium',
    'display_Desktop_md_semibold' = 'display_Desktop_md_semibold',
    'display_Desktop_md_bold' = 'display_Desktop_md_bold',

    // ===== DISPLAY SM =====
    'display_Desktop_sm_regular' = 'display_Desktop_sm_regular',
    'display_Desktop_sm_medium' = 'display_Desktop_sm_medium',
    'display_Desktop_sm_semibold' = 'display_Desktop_sm_semibold',
    'display_Desktop_sm_bold' = 'display_Desktop_sm_bold',

    // ===== TEXT XXL =====
    'text_xxl_regular' = 'text_xxl_regular',
    'text_xxl_medium' = 'text_xxl_medium',
    'text_xxl_semibold' = 'text_xxl_semibold',
    'text_xxl_bold' = 'text_xxl_bold',

    // ===== TEXT XL =====
    'text_xl_regular' = 'text_xl_regular',
    'text_xl_medium' = 'text_xl_medium',
    'text_xl_semibold' = 'text_xl_semibold',
    'text_xl_bold' = 'text_xl_bold',

    // ===== TEXT LG =====
    'text_lg_regular' = 'text_lg_regular',
    'text_lg_medium' = 'text_lg_medium',
    'text_lg_semibold' = 'text_lg_semibold',
    'text_lg_bold' = 'text_lg_bold',

    // ===== TEXT MD =====
    'text_md_regular' = 'text_md_regular',
    'text_md_medium' = 'text_md_medium',
    'text_md_semibold' = 'text_md_semibold',
    'text_md_bold' = 'text_md_bold',

    // ===== TEXT SM =====
    'text_sm_regular' = 'text_sm_regular',
    'text_sm_medium' = 'text_sm_medium',
    'text_sm_semibold' = 'text_sm_semibold',
    'text_sm_bold' = 'text_sm_bold',

    // ===== TEXT XS =====
    'text_xs_regular' = 'text_xs_regular',
    'text_xs_medium' = 'text_xs_medium',
    'text_xs_semibold' = 'text_xs_semibold',
    'text_xs_bold' = 'text_xs_bold',

    // ===== TEXT XXS =====
    'text_xxs_regular' = 'text_xxs_regular',
    'text_xxs_medium' = 'text_xxs_medium',
    'text_xxs_semibold' = 'text_xxs_semibold',
    'text_xxs_bold' = 'text_xxs_bold',
    text_sm = 'text_sm',
}

export type ColorVariant =
    // ===== BASE =====
    | 'white'
    | 'black'

    // ===== TEXT =====
    | 'text-light'

    // ===== GRAY =====
    | 'grey-50'
    | 'gray-100'
    | 'gray-150'
    | 'gray-200'
    | 'gray-500'

    // ===== SLATE =====
    | 'slate-400'
    | 'slate-500'
    | 'slate-600'

    // ===== AMBER =====
    | 'amber-50'
    | 'amber-500'
    | 'amber-700'

    // ===== ORANGE =====
    | 'orange-50'
    | 'orange-200'
    | 'orange-500'
    | 'orange-600'
    | 'orange-700'
    | 'orange-800'

    // ===== YELLOW =====
    | 'yellow-50'
    | 'yellow-300'
    | 'yellow-400'
    | 'solar-yellow'

    // ===== NAVY =====
    | 'navy-900'
    | 'primary-navy'

    // ===== BLUE =====
    | 'blue-50'
    | 'blue-200'
    | 'blue-600'
    | 'blue-900'

    // ===== GREEN =====
    | 'green-50'
    | 'green-400'
    | 'green-600'
    | 'green-700'

    // ===== RED =====
    | 'red-0'
    | 'red-100'
    | 'red-200'
    | 'red-300'
    | 'red-400'
    | 'red-500'
    | 'red-600'
    | 'red-700'
    | 'red-800'
    | 'red-900'

    // ===== CYAN =====
    | 'cyan-50'
    | 'cyan-200'
    | 'cyan-600'
    | 'cyan-700'

    // ===== LIME =====
    | 'lime-50'
    | 'lime-200'

    // ===== TEAL =====
    | 'teal-50'
    | 'teal-200'
    | 'teal-700'

    // ===== PURPLE =====
    | 'purple-50'
    | 'purple-200'
    | 'purple-700'
    | 'burnt-orange';

/**
 * Button Variant
 */
export enum ButtonVariant {
    SOLID = 'solid',
    OUTLINED = 'outline',
    NORMAL = 'normal',
    DISABLE = 'disable',
    PAGINATION = 'pagination',
    DISABLE_PAGINATION = 'disablePagination',
    REPORT_DOWNLOAD_BUTTON = 'reportDownloadButton',
    WARN = 'warn',
}
