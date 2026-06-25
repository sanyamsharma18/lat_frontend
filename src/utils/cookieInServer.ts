'use server';

import { cookies } from 'next/headers';

import { CLIENT_USER_DETAIL, JWT_TOKEN, USER_MENU_LIST, USER_DETAIL } from './cookieManager';

export const getCookie = async (name: string) => {
    const cookieStore = cookies();

    const cookieValue = (await cookieStore).get(name);

    const { value } = cookieValue || {};

    return value || null;
};

export const getUserDetails = async () => {
    const cookieStore = cookies();

    const cookieValue = (await cookieStore).get(USER_DETAIL);

    const { value } = cookieValue || {};

    return value || null;
};

export const getUserMenu = async () => {
    const cookieStore = cookies();

    const cookieValue = (await cookieStore).get(USER_MENU_LIST);

    const { value } = cookieValue || {};

    return value || null;
};

export const clearServerSideCookies = async () => {
    const cookieStore = cookies();

    const allCookies = await cookieStore;

    allCookies.delete(JWT_TOKEN);
    allCookies.delete(USER_DETAIL);
    allCookies.delete(USER_MENU_LIST);
    allCookies.delete(CLIENT_USER_DETAIL);
};
