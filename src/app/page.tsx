"use client";

import Image from "next/image";
// import Confetti from "../components/Confetti";
// import { useState } from "react";
import BubblesBackground from "@/components/BubblesBackground";
import ConfettiBackground from "@/components/ConfettiBackground";
import { useRouter } from "next/navigation";

export const runtime = "edge";

export default function Home() {
  // const [showConfetti, setShowConfetti] = useState(false);

  const router = useRouter(); // Inicializa useRouter

  const handleStartGame = () => {
    router.push("/game"); // Redirige a la pantalla de juego
  };

  return (
    <>
      <BubblesBackground />
      <ConfettiBackground />
      {/* Confetti Background */}
      {/* {showConfetti && <Confetti />} */}
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-blue-900 bg-opacity-50  overflow-hidden">
        {/* Logo */}
        <div className="animate-custom-bounce">
          <Image
            src="/cocode.png"
            alt="Logo del Juego"
            width={270}
            height={270}
            className="mb-8 rounded-3xl"
          />
        </div>

        {/* Título */}
        <h1 className="text-white text-5xl font-bold mb-10">Ordénalas</h1>

        {/* Animación de Botellas */}
        <div className="flex space-x-4 mb-10">
          <img
            src="/bottles/green.svg"
            alt="Botella Verde"
            className="w-32 h-64 animate-pulse"
          />
          <img
            src="/bottles/red.svg"
            alt="Botella Roja"
            className="w-32 h-64 animate-pulse delay-200"
          />
          <img
            src="/bottles/blue.svg"
            alt="Botella Azul"
            className="w-32 h-64 animate-pulse delay-400"
          />
        </div>

        {/* Botón de Juego Nuevo */}
        <button
          onClick={handleStartGame}
          className="w-80 h-20 bg-yellow-500 hover:bg-yellow-600 text-white text-3xl font-bold py-3 px-6 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          Juego Nuevo
        </button>

        {/* Test Button */}
        {/* <button
          onClick={() => setShowConfetti(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg mt-4"
        >
          Show Confetti
        </button> */}
      </div>
    </>
  );
}
