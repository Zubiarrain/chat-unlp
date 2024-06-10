import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Content } from '@google/generative-ai';
import getClassAssistantResponse from '@/services/assistants/classAssistant';
import getQAResponse from '@/services/assistants/classQAAssistant';


type Chat = {
  id: string;
  name: string;
  image:string;
  getAssistantResponse: (question: string, conversationHistory: Content[]) => Promise<string>
};

type ChatContextType = {
  chats: Chat[];
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat) => void;
};


const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats] = useState<Chat[]>([
    {id:'1', name:'Q/A Hormigón Armado', image:'/HAI.png', getAssistantResponse:getClassAssistantResponse},
    {id:'2', name:'Multiple Choice Hormigón Armado', image:'/HAI.png', getAssistantResponse:getQAResponse},
    //{id:'3', name:'Q/A Materiales III', image:'/HAI.png', getAssistantResponse:getClassAssistantResponse}
    // Añade más chats según sea necesario
  ]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  return (
    <ChatContext.Provider value={{ chats, currentChat, setCurrentChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
