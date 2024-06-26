import { Content } from "@google/generative-ai";

function insertarImagenEnTexto(texto:string) {
    const patronImagen = /\[([^\[\]]+\.(?:png|jpg|jpeg|gif))\]/g;

    return texto.replace(patronImagen, (match, rutaImagen) => {
        return `<img src="/${rutaImagen}" alt="Imagen" className='h-48 w-auto object-contain'>`;
    });
}

async function obtenerEndpointYToken() {
    try {
        const response = await fetch('/api/token'); // Ruta de la API interna en Next.js
        if (!response.ok) {
            throw new Error('Failed to fetch token');
        }
        const { token, endpoint } = await response.json();
        console.log(token,endpoint)
        return {token, endpoint}
    } catch (error) {
        throw new Error('Failed to fetch token');
    }
}

// Función principal para obtener la respuesta del servidor
export async function getResponse(id: string, question: string, conversationHistory: Content[], onChunk: (chunk: string) => void) {
    try {
        const { token, endpoint } = await obtenerEndpointYToken();

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ id, question, conversationHistory }),
        });

        if (response.ok && response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let content = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                content += decoder.decode(value, { stream: true });
                onChunk(insertarImagenEnTexto(content));
            }

            return content;
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        throw new Error('Error en la solicitud al servidor');
    }
}