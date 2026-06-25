import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

const ENCRYPTION_KEY = 'your-strong-key-32-chars';

export const JWT_TOKEN = 'x_tok';
export const USER_DETAIL = 'x_det';
export const CLIENT_USER_DETAIL = 'c_x_det';
export const USER_MENU_LIST = 'x_m_li';

export const USER_EMAIL = 'x-m';

const clearJwtToken = () => Cookies.remove(JWT_TOKEN);
const clearUserDetail = () => Cookies.remove(USER_DETAIL);
const clearClientUserDetail = () => Cookies.remove(CLIENT_USER_DETAIL);

const clearAllCookies = () => {
    clearJwtToken();
    clearUserDetail();
    clearClientUserDetail();
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

export { clearAllCookies, clearJwtToken, setClientSideUserDetail, getClientUserDetails };
