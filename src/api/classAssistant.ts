import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI, GenerationConfig, Part, Content } from "@google/generative-ai";
import { getClassAssistantContext } from '@/utils/get_context';


export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  console.log('Holawas')
  if (req.method === 'POST') {
    const { question, conversationHistory }: {question:string, conversationHistory: Content[]} = req.body;
    const MODEL = "gemini-1.5-flash"
    const CONTEXT = getClassAssistantContext()
    const INSTRUCTION = `
    ### INSTRUCTION ###
    You are a helpful assistant who will help the students with their questions about the information in the context.

    Always end the message telling the user the document name and the pages where he can find more information in that document.

    ### CONTEXT ###

    DOCUMENTS: ${CONTEXT}
    `

    try {
      const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""; // Usa variables de entorno
      const genAI = new GoogleGenerativeAI(API_KEY);
      const llm = genAI.getGenerativeModel({ model: MODEL, systemInstruction: INSTRUCTION});
      const chat = llm.startChat({history:conversationHistory, generationConfig:{temperature:0.2}})

      const result = await chat.sendMessage(question)
      const response = result.response.text()

      res.status(200).json({ response });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
