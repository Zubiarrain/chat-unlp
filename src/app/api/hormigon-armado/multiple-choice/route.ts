import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { getHormigonArmadoContext } from '@/utils/get_context';

async function getMCResponse(question: string, conversationHistory: Content[]) {
    const MODEL = "gemini-1.5-flash"
    const CONTEXT = await getHormigonArmadoContext()
    const INSTRUCTION = `
    Act as a chatbot that generates complex multiple-choice questions from a given document. The bot will present one question at a time to the user, evaluate their response, provide feedback, and additional information. After that, the bot will proceed to the next question.
  
    Instructions:
    1. When the document is provided, read and understand its content.
    2. Generate complex multiple-choice questions based on the content. Each question should have four options (A, B, C, D).
    3. Present one question at a time to the user.
    4. When the user selects an option, evaluate the response:
        - If the answer is correct, respond with: "¡Correcto! [Provide additional information related to the answer]."
        - If the answer is incorrect, respond with: "Incorrecto. La respuesta correcta es [Correct Answer]. [Provide additional information related to the correct answer]."
    5. After providing the feedback, proceed to the next question until all questions are asked.
  
    Here's a sample document for you to use:
    ${JSON.stringify(CONTEXT)}
  
    Please start by generating the first question in Spanish based on the document.
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
      return "Ocurrió un error, no se pudo procesar tu consulta"
    }
  }


export async function POST(req: Request) {
    if (req.method === 'POST') {
        const { question, conversationHistory } = await req.json()

        try {
            const response = await getMCResponse(question, conversationHistory);
            return NextResponse.json({ response });
        } catch (error) {
            console.error("Error:", error); // Log detallado del error
            return NextResponse.json({ error:'Error al procesar la solicitud' });
        }
    } else {
        return NextResponse.json({ error:'Método no permitido' });
    }
}
