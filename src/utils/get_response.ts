import { Content } from "@google/generative-ai";

function insertarImagenEnTexto(texto:string) {
    const patronImagen = /\[([^\[\]]+\.(?:png|jpg|jpeg|gif))\]/g;

    return texto.replace(patronImagen, (match, rutaImagen) => {
        return `<img src="/${rutaImagen}" alt="Imagen" className='h-48 w-auto object-contain'>`;
    });
}

export async function getResponse(question: string, conversationHistory: Content[], api: string, onChunk: (chunk: string) => void) {
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question, conversationHistory })
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
}
