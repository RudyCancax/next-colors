"use client";

// src/app/game/page.tsx
import { useState, useEffect, useRef } from "react";

import ConfettiBackground from "@/components/ConfettiBackground";
import Confetti from "@/components/Confetti";
import Modal from "@/components/Modal";

type Level = "easy" | "medium" | "hard";

const levels: Record<Level, number> = {
  easy: 5,
  medium: 7,
  hard: 10,
};

const colors = ["#FF5733", "#33FF57", "#3357FF", "#F5FF33", "#FF33F6"];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const Bottle = ({ color }: { color: string }) => (
  <div
    className="w-32 h-64 bg-cover rounded-2xl"
    style={{
      backgroundImage: `url('/bottles/black.svg')`,
      backgroundColor: color,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  />
);

const playSound = (src: string, infinite = false) => {
  const audio = new Audio(src);
  audio.play();
  return audio; // Return the audio object for further control
};

export default function Game() {
  const [selectedLevel, setSelectedLevel] = useState<Level>("easy");
  const [colorSequence, setColorSequence] = useState<string[]>([]);
  const [gameDuration, setGameDuration] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const clockAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (timeLeft === 0 && isGameActive) {
      setIsGameActive(false);
      setShowConfetti(true); // Show confetti when time is up
      setModalMessage("FELICIDADES GANASTE"); // Set message for the modal
      setIsModalOpen(true); // Open the modal
      if (intervalId) clearInterval(intervalId);
      if (clockAudioRef.current) {
        clockAudioRef.current.pause(); // Stop clock sound
        clockAudioRef.current.currentTime = 0; // Reset playback position
      }
      playSound("/sounds/tada.mp3"); // Play win sound
    }
  }, [timeLeft, isGameActive, intervalId]);

  useEffect(() => {
    if (isGameActive && timeLeft !== null) {
      const id = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      setIntervalId(id);

      // Play clock sound
      if (clockAudioRef.current) {
        clockAudioRef.current.play(); // Resume playback if already exists
      } else {
        const audio = playSound("/sounds/clock2.mp3", true);
        clockAudioRef.current = audio; // Store the audio reference
      }

      return () => {
        clearInterval(id);
        if (clockAudioRef.current) {
          clockAudioRef.current.pause(); // Stop clock sound
          clockAudioRef.current.currentTime = 0; // Reset playback position
        }
      };
    }
  }, [isGameActive, timeLeft]);

  const generateColorSequence = () => {
    const newSequence = Array.from(
      { length: levels[selectedLevel] },
      getRandomColor
    );
    setColorSequence(newSequence);
  };

  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel(event.target.value as Level);
  };

  const handleGenerateDuration = () => {
    setGameDuration(levels[selectedLevel] * 6);
    setTimeLeft(levels[selectedLevel] * 6);
  };

  const handleStartGame = () => {
    handleGenerateDuration();
    setIsGameActive(true);
    setShowConfetti(false); // Hide confetti at the start of the game
    if (clockAudioRef.current) {
      clockAudioRef.current.play(); // Resume playback if audio already exists
    }
  };

  const handleStopGame = () => {
    if (intervalId) clearInterval(intervalId);
    setIsGameActive(false);
    setTimeLeft(null);
    setModalMessage("PERDISTE"); // Set message for the modal
    setIsModalOpen(true); // Open the modal
    if (clockAudioRef.current) {
      clockAudioRef.current.pause(); // Stop clock sound
      clockAudioRef.current.currentTime = 0; // Reset playback position
    }
    playSound("/sounds/risa.mp3"); // Play lose sound
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowConfetti(false); // Optionally hide confetti or redirect
  };

  return (
    <div className="relative min-h-screen bg-[#000a1d] overflow-hidden">
      <ConfettiBackground />
      {showConfetti && <Confetti />}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          message={modalMessage}
          onClose={closeModal}
        />
      )}

      <button
        onClick={() => (window.location.href = "/")}
        className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
      >
        Regresar al Home
      </button>

      <div className="flex flex-col items-center mt-8 space-y-4">
        {/* Selector de Nivel de Dificultad */}
        <div className="flex flex-col items-center">
          <label htmlFor="level" className="text-white text-lg mb-2">
            Selecciona el Nivel:
          </label>
          <select
            id="level"
            value={selectedLevel}
            onChange={handleLevelChange}
            className="bg-gray-800 text-white border border-gray-600 rounded-lg p-2"
          >
            <option value="easy">Fácil</option>
            <option value="medium">Medio</option>
            <option value="hard">Difícil</option>
          </select>
        </div>

        {/* Botones del Juego */}
        <div className="flex space-x-4">
          <button
            onClick={generateColorSequence}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg"
          >
            Mezclar Colores
          </button>
          <button
            onClick={handleGenerateDuration}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg"
          >
            Generar Duración
          </button>
          <button
            onClick={handleStartGame}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg"
          >
            Iniciar Juego
          </button>
        </div>
      </div>

      {/* Mostrar Cuadros con Colores */}
      <div className="flex space-x-4 justify-center mt-8">
        {colorSequence.map((color, index) => (
          <Bottle key={index} color={color} />
        ))}
      </div>

      {/* Botón para Detener el Juego */}
      {isGameActive && (
        <button
          onClick={handleStopGame}
          className="absolute bottom-4 left-4 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg"
        >
          Detener Juego
        </button>
      )}

      {/* Mostrar Tiempo Restante */}
      {timeLeft !== null && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-full h-1/2 text-white text-6xl">
          Tiempo Restante:
          <br />
          <span className="text-[150px]">{timeLeft}s</span>
        </div>
      )}
    </div>
  );
}
