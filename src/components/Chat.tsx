"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Content, Part } from '@google/generative-ai';
import { getResponse } from '@/utils/get_response';
import Markdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'


/* marked.setOptions({
  breaks: true, // Para permitir saltos de línea con una sola línea nueva
  gfm: true, // Para habilitar GitHub Flavored Markdown (opcional)
  
}); */

type Message = {
  id: string;
  role: 'user' | 'model';
  parts: Part[];
};

type ChatT = {
    chatId:string;
    api:string;
}

export const Chat = ({chatId, api}:ChatT) => {
  const chatName = 'chat-'+chatId
  const initialMessage: Message[] = [];
  const [messages, setMessages] = useState<Message[]>(initialMessage);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem(chatName);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }else{
        localStorage.setItem(chatName, JSON.stringify(initialMessage));
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length != 0){
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);


  const handleSendMessage = async () => {
    if (input.trim()) {

      const userMessage: Message = {
        id: chatId,
        role: 'user',
        parts: [{text:input}],
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput('');

      try {
        const conversationHistory: Content[] = messages.map(({ id, ...rest }) => rest);
        const assistantResponse = await getResponse(input, conversationHistory, api);
        const modelMessage: Message = { id: chatId, role: 'model', parts: [{text:assistantResponse}] };

        setMessages([...updatedMessages, modelMessage]);

        if (typeof window !== 'undefined') {
          localStorage.setItem(chatName, JSON.stringify([...messages, userMessage,modelMessage]));
        }

      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleResetConversation = () => {

    const confirmed = window.confirm("¿Estás seguro de que quieres reiniciar la conversación?");
    if (confirmed) {
      // Lógica para reiniciar la conversación
      setMessages(initialMessage);
      if (typeof window !== 'undefined') {
        localStorage.setItem(chatName, JSON.stringify(initialMessage));
      }
    }
    
  };

  let md = `<img src="/flexion-compuesta-recta/Flexion Compuesta Recta-2019_page2_img1.png" alt="Imagen"></img>`

  return (
    <div className="flex flex-col h-[600px] lg:h-[500px] w-full min-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-2 `}>
            <div className={`p-2 rounded-t-lg max-w-[70%] text-wrap ${message.role === 'user' ? 'bg-blue-500 text-white rounded-bl-lg': 'bg-gray-200 text-black rounded-br-lg'}`}>
                <Markdown 
                remarkPlugins={[remarkGfm,remarkMath]}
                rehypePlugins={[rehypeRaw]}>
                  {message.parts[0].text}
                </Markdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex p-4 border-t border-gray-200">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
          onClick={handleSendMessage}
        >
          Enviar
        </button>
      </div>
      <button
        className="m-4 p-2 bg-red-500 text-white rounded-lg"
        onClick={handleResetConversation}
      >
        Reiniciar Conversación
      </button>
    </div>
  );
};
