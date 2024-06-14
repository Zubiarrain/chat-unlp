import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { getHormigonArmadoContextYAML } from '@/utils/get_context';

async function getConversationResponse(question: string, conversationHistory: Content[]) {
    const MODEL = "gemini-1.5-pro-latest"
    const CONTEXT = await getHormigonArmadoContextYAML()
    const INSTRUCTION = `
    ### INSTRUCTION ###
    You are a helpful assistant who assists students with their questions about the documents.

    To answer their questions, follow these steps:

    1. Read each document's content.
    2. Identify important information related to the user's question.
    3. Respond clearly and concisely using Markdown to provide an informative answer in Spanish.
    4. Whenever necessary it calls a figure related to the response as follows: [figure_path]
    5. Always end the message by mentioning the document name and the pages where the user can find more information.

    You must read these documents to answer the user's questions:
    ${CONTEXT}`

    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""; // Usa variables de entorno
    const genAI = new GoogleGenerativeAI(API_KEY);
    const llm = genAI.getGenerativeModel({ model: MODEL, systemInstruction: INSTRUCTION });
    const retryCount = 10

    for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
            const stream = new ReadableStream({
            async start(controller) {
                try {
                    // Aquí se inicia el proceso de la conversación
                    const chat = llm.startChat({ history: conversationHistory, generationConfig: { temperature: 0.2 } });
                    const result = await chat.sendMessageStream(question);

                    const keepAlive = setInterval(() => {
                        controller.enqueue("");
                    }, 3000);  // Enviar un espacio en blanco cada 3 segundos para mantener la conexión activa

                    for await (const chunk of result.stream) {
                        controller.enqueue(chunk.text());
                    }

                    clearInterval(keepAlive);
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
            cancel() {
                console.log('Stream cancelled');
            }
        });
            return stream;
        } catch (error: any) {
            if (error.message.includes("429 Too Many Requests") && attempt < retryCount) {
                console.log(`Attempt ${attempt} failed. Retrying in 5 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 5000)); // Espera 2 segundos antes de reintentar
            } else {
                console.log(error);
                return "Ocurrió un error, no se pudo procesar tu consulta";
            }
        }
    }
}


export async function POST(req: Request) {
    if (req.method === 'POST') {
        const { question, conversationHistory } = await req.json();

        try {
            const stream = await getConversationResponse(question, conversationHistory);
            return new Response(stream, {
                headers: { 'Content-Type': 'text/plain' }
            });
        } catch (error) {
            console.error("Error:", error);
            return NextResponse.json({ error: 'Error al procesar la solicitud' });
        }
    } else {
        return NextResponse.json({ error: 'Método no permitido' });
    }
}