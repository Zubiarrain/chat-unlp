import React, { createContext, useState, useContext, ReactNode } from 'react';

type Chat = {
  id: string;
  materia: string;
  type: string;
  image:string;
  api:string;
};

type ChatContextType = {
  chats: Chat[];
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats] = useState<Chat[]>([
    {id:'1', materia:'Hormigón Armado', type:'Conversación',image:'/HAI.png', api:'/api/hormigon-armado/conversation'},
    {id:'2', materia:'Hormigón Armado',type:'Multiple Choice', image:'/HAI.png', api:'/api/hormigon-armado/multiple-choice'},
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
