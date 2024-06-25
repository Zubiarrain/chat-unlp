// Importa los tipos necesarios desde Next.js
import { NextResponse } from 'next/server';

// Manejador de la ruta API
export async function GET(req: Request) {
    if (req.method === 'GET') {
        const token = process.env.CHAT_UNLP_TOKEN;
        const endpoint = process.env.IDO_EP;

        if (!token) {
            return NextResponse.json({ error: 'Token not found' });
            
        }

        return NextResponse.json({ token, endpoint });
    } else {
        return NextResponse.json({error: `Method ${req.method} not allowed`});
    }
}
