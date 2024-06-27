import { cookies } from 'next/headers'
import { NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

export async function POST(req: Request) {
    if (req.method === 'POST') {
        const { apiKey } = await req.json();
        const cookiesApi = cookies()

        if (!apiKey) {
            return NextResponse.json({ error: 'API key is required' });
          }



        try {
            const secretKey = process.env.COOKIE_SECRET_KEY
            const encryptedApiKey = CryptoJS.AES.encrypt(apiKey, secretKey).toString();
            cookiesApi.set('apiKey', encryptedApiKey, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            });
            return NextResponse.json({ message: 'Almacenado correctamente' });
        } catch (error) {
            console.error("Error:", error);
            return NextResponse.json({ message: 'Error al almacenar Api Key' });
        }
    } else {
        return NextResponse.json({ error: 'Método no permitido' });
    }
}