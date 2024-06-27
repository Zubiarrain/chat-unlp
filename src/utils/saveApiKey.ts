"use server"

import { cookies } from 'next/headers'
import CryptoJS from 'crypto-js';

export const saveApiKey = (apiKey:string) => {
    const cookiesApi = cookies()
    try {
        const secretKey = process.env.COOKIE_SECRET_KEY
        const encryptedApiKey = CryptoJS.AES.encrypt(apiKey, secretKey).toString();
        cookiesApi.set('apiKey', encryptedApiKey, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        });
        return 'Almacenado correctamente'
    } catch (error) {
        console.error("Error:", error);
        return 'Error al almacenar Api Key'
    }
}