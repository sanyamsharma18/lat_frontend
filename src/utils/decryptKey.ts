import CryptoJS from 'crypto-js';

/**
 * @description This function returns the decrypted value of your provided encrypted string
 */
export function decryptKey(encryptedData: string) {
    try {
        const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

        const iv = CryptoJS.enc.Utf8.parse('0000000000000000'); // Must match the IV used during encryption

        if (!encryptedData) return '';
        if (!key) return '';

        const decrypted = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(key), {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return decrypted?.toString(CryptoJS.enc.Utf8);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        return 'N/A';
    }
}
