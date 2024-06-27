"use client";

import { FormEvent, useEffect, useRef } from "react";
import { useState } from 'react';
import { saveApiKey } from "@/utils/saveApiKey";
import { getApiKey } from "@/utils/getApiKey";

export default function ApiKeyPage() {
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('');
  const [apiKeyExists, setApiKeyExists] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const checkApiKey = async () => {
      const apiKey = await getApiKey();
      setApiKeyExists(apiKey !== '');
    };

    checkApiKey();
  }, [apiKey]);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {state, message} = await saveApiKey(apiKey)
    console.log(state)
    if (state == 'success'){
      setApiKeyExists(true)
    }

    setMessage(message)
  };

  return (

    <div className="h-full py-3 min-h-[calc(100vh-6rem)] lg:h-[calc(100vh-6rem)] flex justify-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48">
      {/* FORM CONTAINER */}
      <form
        onSubmit={handleFormSubmit}
        className="lg:h-full lg:w-1/2 rounded-xl text-lg flex flex-col gap-6 justify-center p-14"
      >
        <div
        className={`font-semibold ${
          apiKeyExists != undefined
          ?apiKeyExists
            ? "text-green-600"
            : "text-red-600"
          :""
        }`}>
        {
          apiKeyExists != undefined
          ?apiKeyExists
            ? "Tu API KEY está guardada"
            : "Debes cargar una API KEY para usar los chats"
          :""
        }
        </div>
        
        <span>API KEY</span>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
          className="bg-transparent border-b-2 border-b-black outline-none"
        />
        {
          message &&
          <p>{message}</p>
        }
        <button 
        className="bg-blue-400 p-2 text-white text-xl font-medium hover:bg-blue-300"
        type="submit">Guardar</button>
      </form>
    </div>
  );
}
