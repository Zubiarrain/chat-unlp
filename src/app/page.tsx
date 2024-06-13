"use client"

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen max-h-[calc(100vh-6rem)] flex flex-col gap-2 lg:flex-row px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48">
    {/* IMAGE CONTAINER */}
    <div className="h-1/2 lg:h-full lg:w-2/6 relative">
      <Image 
      className="object-contain"
      src="/hero.png" 
      alt="hero image" 
      fill
      />
    </div>
    {/* TEXT CONTAINER */}
    <div className="lg:h-full lg:w-4/6 flex flex-col gap-8 items-start justify-center">
      {/* TITLE */}
      <h1 className="text-4xl md:text-5xl font-bold">Tu compañero de estudio.</h1>
      {/* DESCRIPTION */}
      <p className="md:text-xl">Bienvenidos a nuestra plataforma educativa donde los alumnos pueden interactuar con modelos de lenguaje avanzados para profundizar en sus materias.
      </p>
      <p className="italic">
      Facilitando el aprendizaje y promoviendo la curiosidad intelectual.
      </p>
      {/* BUTTONS */}
      <div className="w-full flex gap-4 mb-2">
        <Link href="/chats">
        <button className="p-4 rounded-lg ring-1 ring-black bg-black text-white">Explorar Chats</button>
        </Link>
        <Link href="/contact">
        <button className="p-4 rounded-lg ring-1 ring-black">Contacto</button>
        </Link>
      </div>
    </div>
    </div>

  );
}
