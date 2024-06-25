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
      {/* <h1 className="text-sm lg:text-xl font-bold mt-1 mb-1">{currentChat.materia + ' - ' + currentChat.type}</h1>
      <div className='flex flex-col justify-start w-full min-w-md max-w-4xl pl-4'>
        <p className='m-0 text-sm'>* Tiende a alucinar cuando la conversación se vuelve extensa.</p>
        <p className='m-0 text-sm'>* Puede mostrar imágenes incorrectas.</p>
      </div> */}
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
