"use client";

import { FormEvent, useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const form = useRef<HTMLFormElement | null>(null);

  const sendEmail = async (data: { user_email: string; user_message: string }) => {
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_SERVICE_ID || "",
        process.env.NEXT_PUBLIC_TEMPLATE_ID || "",
        data,
        process.env.NEXT_PUBLIC_PUBLIC_KEY || ""
      );
      setSuccess(true);
    } catch {
      setError(true);
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setSuccess(false);

    const formData = {
      user_email: form.current?.user_email.value,
      user_message: form.current?.user_message.value,
    };

    try {
      await sendEmail(formData);
      form.current?.reset();
    } catch {
      setError(true);
    }
  };

  return (

    <div className="h-full py-3 min-h-[calc(100vh-6rem)] lg:h-[calc(100vh-6rem)] flex justify-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48">
      {/* FORM CONTAINER */}
      <form
        onSubmit={handleFormSubmit}
        ref={form}
        className="lg:h-full lg:w-1/2 bg-gradient-to-b from-gray-100 to-violet-100  rounded-xl text-lg flex flex-col gap-6 justify-center p-14"
      >
        <span>Hola Nahuel,</span>
        <textarea
          rows={6}
          className="bg-transparent border-b-2 border-b-black outline-none resize-none"
          name="user_message"
        />
        <span>Mi mail es:</span>
        <input
          name="user_email"
          type="text"
          className="bg-transparent border-b-2 border-b-black outline-none"
        />
        <span>Saludos</span>
        <button className="bg-blue-400 rounded font-semibold text-gray-100 p-4">
          Enviar
        </button>
        {success && (
          <span className="text-green-600 font-semibold">
            Tu mensaje se ha enviado!
          </span>
        )}
        {error && (
          <span className="text-red-600 font-semibold">
            Algo salió mal!
          </span>
        )}
      </form>
    </div>
  );
}
