import CryptoJS from 'crypto-js';

/**
 * @description This function returns the encrypted value of your provided data
 */
export function encryptKey(data: string) {
    const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

    const iv = CryptoJS.enc.Utf8.parse('0000000000000000'); // 16 bytes IV for AES-256-CBC

    if (!data) return '';

    if (!key) return '';

    const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();
}
