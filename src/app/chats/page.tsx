"use client"

import { useChat } from "@/context/ChatContext";
import Link from "next/link";

export default function ChatsPage() {
  const { chats, setCurrentChat } = useChat(); 
  
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-10 mb-5">Elije tu ayudante</h1>
      <div className="flex flex-col items-center p-5">
      {chats.map(chat => (
        <Link
          href={'/chats/'+chat.id} 
          key={chat.id} 
          className="flex items-center p-4 mb-4 w-full max-w-md bg-white rounded-lg shadow-md cursor-pointer transition-colors duration-300 hover:bg-gray-100"
        >
          <img 
            src={chat.image} 
            alt={chat.materia} 
            className="w-12 h-12 rounded-full mr-4"
          />
          <span className="text-lg font-semibold">{chat.materia + ' - ' + chat.type}</span>
        </Link>
      ))}
    </div>
    </div>

  );
}
