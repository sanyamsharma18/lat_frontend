import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

import {
    CLIENT_USER_DETAIL,
    JWT_TOKEN,
    USER_DETAIL,
    USER_EMAIL,
    USER_MENU_LIST,
} from '@/constants/authSession';

export { CLIENT_USER_DETAIL, JWT_TOKEN, USER_DETAIL, USER_EMAIL, USER_MENU_LIST };

const ENCRYPTION_KEY = 'your-strong-key-32-chars';

const clearJwtToken = () => Cookies.remove(JWT_TOKEN);
const clearUserDetail = () => Cookies.remove(USER_DETAIL);
const clearClientUserDetail = () => Cookies.remove(CLIENT_USER_DETAIL);
const clearUserMenuList = () => Cookies.remove(USER_MENU_LIST);

const clearClientSideCookies = () => {
    Object.keys(Cookies.get()).forEach((cookieName) => {
        Cookies.remove(cookieName);
        Cookies.remove(cookieName, { path: '/' });
    });
};

const clearBrowserStorage = () => {
    window.localStorage.clear();
    window.sessionStorage.clear();
};

const clearAllCookies = () => {
    clearJwtToken();
    clearUserDetail();
    clearClientUserDetail();
    clearUserMenuList();
    clearClientSideCookies();
};

const clearClientSessionData = () => {
    clearAllCookies();
    clearBrowserStorage();
};

const setClientSideUserDetail = (contentValue: unknown) => {
    if (!contentValue) {
        return;
    }

    const encryptedToken = CryptoJS.AES.encrypt(
        JSON.stringify(contentValue),
        ENCRYPTION_KEY,
    ).toString();

    Cookies.set(CLIENT_USER_DETAIL, encryptedToken, {
        expires: 1,
        path: '/',
    });
};

const getClientUserDetails = () => {
    const encrypted = Cookies.get(CLIENT_USER_DETAIL);
    if (encrypted) {
        try {
            const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
            const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedValue);
        } catch {
            return null;
        }
    }
    return null;
};

export {
    clearAllCookies,
    clearBrowserStorage,
    clearClientSessionData,
    clearJwtToken,
    setClientSideUserDetail,
    getClientUserDetails,
};
