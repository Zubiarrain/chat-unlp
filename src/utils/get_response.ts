import { Content } from "@google/generative-ai";

export async function getResponse(question: string, conversationHistory: Content[], api: string) {
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question, conversationHistory })
    });

    if (response.ok) {
        const data = await response.json();
        return data.response;
    } else {
        throw new Error('Error en la respuesta del servidor');
    }
}