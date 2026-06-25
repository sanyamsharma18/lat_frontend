export const getCookieInClient = async (name: string) => {
    const authToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith(name))
        ?.split('=')[1];

    return authToken || null;
};
