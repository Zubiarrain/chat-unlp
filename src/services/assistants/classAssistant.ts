"use server"
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { getClassAssistantContext } from '@/utils/get_context';

export default async function getClassAssistantResponse(question: string, conversationHistory: Content[]) {
    console.log('Pregunta a getClassAssistantResponse')
    const MODEL = "gemini-1.5-flash"
    const CONTEXT = await getClassAssistantContext()
    const INSTRUCTION = `
    ### INSTRUCTION ###
    You are a helpful assistant who will help the students with their questions about the information in the context.

    Answer in Spanish.

    Use Markdown to give a showy answer.

    Always end the message telling the user the document name and the pages where he can find more information in that document.

    ### CONTEXT ###

    DOCUMENTS: ${JSON.stringify(CONTEXT)}
    `

    try {
      const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""; // Usa variables de entorno
      const genAI = new GoogleGenerativeAI(API_KEY);
      const llm = genAI.getGenerativeModel({ model: MODEL, systemInstruction: INSTRUCTION});
      const chat = llm.startChat({history:conversationHistory, generationConfig:{temperature:0.2}})

      const result = await chat.sendMessage(question)
      const response = result.response.text()
      return response
    } catch (error) {
      console.log({ error: 'Error interno del servidor'+error });
      return "Ocurrió un error, no se pudo procesar tu consulta"
    }
}