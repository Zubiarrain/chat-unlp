import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { getHormigonArmadoContext } from '@/utils/get_context';

async function getMCResponse(question: string, conversationHistory: Content[]) {
    const MODEL = "gemini-1.5-pro"
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
    
    ------
    Here's a sample document for you to use:
    ${JSON.stringify(CONTEXT)}

    ------
    Here are a few examples of multiple choice:
    IA: ¿Cuál de las siguientes opciones NO es una hipótesis de cálculo empleada para determinar la resistencia de una sección sometida a Flexión Compuesta Recta según el CIRSOC 201-05?

    A. El acero presenta un comportamiento elasto-plástico perfecto. 
    B. La resistencia a tracción del hormigón se considera nula. 
    C. El hormigón comprimido rompe siempre con una deformación igual a 0.003. 
    D. La tensión en el hormigón comprimido se distribuye de forma triangular.

    User: D

    IA: ¡Correcto! La respuesta correcta es D. La hipótesis del CIRSOC 201-05 establece que la tensión en el hormigón comprimido se distribuye de forma rectangular, trapezoidal, parabólica o de cualquier otra forma que dé origen a una predicción de la resistencia que coincida en forma sustancial con los resultados de ensayos.

    ¿Listo para la siguiente pregunta?

    ------
    Please start by generating the first question in Spanish based on the document.
    `
  
    try {
      const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""; // Usa variables de entorno
      const genAI = new GoogleGenerativeAI(API_KEY);
      const llm = genAI.getGenerativeModel({ model: MODEL, systemInstruction: INSTRUCTION});
      const chat = llm.startChat({history:conversationHistory, generationConfig:{temperature:0.2}})
  
      const result = await chat.sendMessage(question)
      const response = result.response.text()
      console.log(response)
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
