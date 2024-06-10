import { useChat } from '@/context/ChatContext';
import Link from 'next/link';
import React from 'react';

type Chat = {
  id: string;
  name: string;
  image: string;
};

type ChatListProps = {
  chats: Chat[];
};

export const ChatList = ({ chats }: ChatListProps) => {
  

  return (
    <div className="flex flex-col items-center p-5">
      {chats.map(chat => (
        <Link
          href={'/chats/'+chat.id} 
          key={chat.id} 
          className="flex items-center p-4 mb-4 w-full max-w-md bg-white rounded-lg shadow-md cursor-pointer transition-colors duration-300 hover:bg-gray-100"
        >
          <img 
            src={chat.image} 
            alt={chat.name} 
            className="w-12 h-12 rounded-full mr-4"
          />
          <span className="text-lg font-semibold">{chat.name}</span>
        </Link>
      ))}
    </div>
  );
};

