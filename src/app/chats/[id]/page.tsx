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
    if (chat) setLoading(false)
    if (chat && chat != currentChat) {
      setCurrentChat(chat);
    }
  }, [id]);

  if (loading || !currentChat) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center ">
      <div className="flex flex-1 w-full min-w-md min-h-[calc(100vh-3rem)]">
        <Chat 
        chatId={currentChat.id}
        chatName={currentChat.materia + ' - ' + currentChat.type}
        />
      </div>
    </div>
  );
};

export default ChatPage;
