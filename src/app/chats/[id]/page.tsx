"use client"

import React, { useEffect, useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { usePathname } from 'next/navigation';
import { Chat } from '@/components/Chat';


const ChatPage: React.FC = () => {
  const pathName = usePathname()
  const { currentChat, setCurrentChat, chats } = useChat();
  const [loading, setLoading] = useState(true);

  const id = pathName.split('/').pop()

  useEffect(() => {
    const chat = chats.find((chat) => chat.id === id);
    if (chat && chat != currentChat) {
      setCurrentChat(chat);
      setLoading(false)
    }
  }, [id]);

  if (loading || !currentChat) {
    return <p>Loading...</p>;
  }
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-sm lg:text-xl font-bold mt-1 mb-1">{currentChat.name}</h1>
      <div className="flex flex-1 w-full min-w-md max-w-4xl p-4">
        <Chat chatId={currentChat.id} getAssistantResponse={currentChat.getAssistantResponse}/>
      </div>
    </div>
  );
};

export default ChatPage;
