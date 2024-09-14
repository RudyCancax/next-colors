"use client";

import { useState, useEffect, useRef } from "react";
import ConfettiBackground from "@/components/ConfettiBackground";
import Modal from "@/components/Modal";
import Bottles from "@/components/Bottles";

type Level = "easy" | "medium" | "hard";

const levels: Record<Level, number> = {
  easy: 5,
  medium: 7,
  hard: 10,
};

const colors = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#FFC0CB",
  "#00BFFF",
  "#0000FF",
  "#008000",
  "#FFFF00",
  "#6F4F28",
  "#FFA500",
];
const colorsNames = [
  "negro",
  "blanco",
  "rojo",
  "rosa",
  "celeste",
  "azul",
  "verde",
  "amarillo",
  "café",
  "naranja",
];

const getRandomColor = (usedColors: string[]) => {
  const availableColors = colors.filter((color) => !usedColors.includes(color));
  return availableColors[Math.floor(Math.random() * availableColors.length)];
};

const Bottle = ({ color }: { color: string; onClick?: () => void }) => (
  <div className="flex flex-col justify-center w-56">
    <div className="flex flex-col">
      <h1 className="translate-x-[230px] translate-y-[350px] text-white font-bold text-5xl ">
        {colorsNames[colors.indexOf(color)]}{" "}
      </h1>
      <div className="translate-x-[-100px]">
        <Bottles fill={color} />
      </div>
    </div>
  </div>
);

const Box = ({ onClick }: { onClick: () => void }) => (
  <div
    className="relative flex items-center justify-center w-24 h-56 bg-gray-300 rounded-lg cursor-pointer"
    onClick={onClick}
  >
    {/* Box styling here */}
    <div className="w-16 h-16 bg-gray-500 rounded-lg"></div>
  </div>
);

const playSound = (src: string) => {
  const audio = new Audio(src);
  audio.play();
  return audio; // Return the audio object for further control
};

export default function Game() {
  const [selectedLevel, setSelectedLevel] = useState<Level>("easy");
  const [colorSequence, setColorSequence] = useState<string[]>([]);
  const [showBoxes, setShowBoxes] = useState<boolean[]>([]);
  const [showBottles, setShowBottles] = useState<boolean[]>([]);
  const [gameDuration, setGameDuration] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const clockAudioRef = useRef<HTMLAudioElement | null>(null);
  const [multiplo, setMultiplo] = useState<number | "">(""); // New state variable for input
  const [verbotellas, setVerbotellas] = useState<number | "">(""); // New state variable for input
  const [canMixColors, setCanMixColors] = useState<boolean>(true);

  useEffect(() => {
    if (timeLeft === 0 && isGameActive) {
      setIsGameActive(false);
      setShowConfetti(true); // Show confetti when time is up
      setModalMessage("TIEMPO COMPLETADO"); // Set message for the modal
      setIsModalOpen(true); // Open the modal
      if (intervalId) clearInterval(intervalId);
      if (clockAudioRef.current) {
        clockAudioRef.current.pause(); // Stop clock sound
        clockAudioRef.current.currentTime = 0; // Reset playback position
      }
      playSound("/sounds/bells.mp3"); // Play win sound
    }
  }, [timeLeft, isGameActive, intervalId]);

  useEffect(() => {
    if (isGameActive && timeLeft !== null && !isPaused) {
      const id = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      setIntervalId(id);

      // Play clock sound
      if (clockAudioRef.current) {
        clockAudioRef.current.play(); // Resume playback if already exists
      } else {
        const audio = playSound("/sounds/clock2.mp3");
        clockAudioRef.current = audio; // Store the audio reference
      }

      return () => {
        clearInterval(id);
        if (clockAudioRef.current) {
          clockAudioRef.current.pause(); // Stop clock sound
          clockAudioRef.current.currentTime = 0; // Reset playback position
        }
      };
    } else if (isPaused) {
      clearInterval(intervalId!); // Clear interval if paused
    }
  }, [isGameActive, timeLeft, isPaused]);

  const generateColorSequence = () => {
    const usedColors: string[] = [];
    const newSequence = Array.from({ length: levels[selectedLevel] }, () => {
      const color = getRandomColor(usedColors);
      usedColors.push(color);
      return color;
    });
    setColorSequence(newSequence);
    setShowBoxes(Array(newSequence.length).fill(false)); // Initialize showBoxes state with false
    setShowBottles(Array(newSequence.length).fill(true)); // Initialize showBottles state with true
  };

  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel(event.target.value as Level);
  };

  const handleGenerateDuration = () => {
    const multiplier = typeof multiplo === "number" ? multiplo : 6; // Default to 6 if multiplo is not a number
    setGameDuration(levels[selectedLevel] * multiplier);
    setTimeLeft(levels[selectedLevel] * multiplier);
  };

  const handleStartGame = () => {
    generateColorSequence();
    setIsGameActive(false);
    setIsPaused(false);
    setShowConfetti(false); // Hide confetti at the start of the game

    // Show bottles for 3 seconds before showing boxes and starting the timer
    setShowBottles(Array(colorSequence.length).fill(true)); // Show bottles initially
    setShowBoxes(Array(colorSequence.length).fill(false)); // Hide boxes initially

    setTimeout(() => {
      setShowBottles(Array(colorSequence.length).fill(false)); // Hide bottles after 3 seconds
      setShowBoxes(Array(colorSequence.length).fill(true)); // Show boxes after 3 seconds
      setIsGameActive(true);
      setTimeLeft(gameDuration);
      handleGenerateDuration();
    }, Number(verbotellas) * 1000);
  };

  const handleStopGame = () => {
    if (intervalId) clearInterval(intervalId);
    setIsGameActive(false);
    setIsPaused(false);
    setTimeLeft(null);
    setCanMixColors(true); // Allow color mixing again
    setShowBottles(Array(colorSequence.length).fill(true)); // Show bottles initially
    setShowBoxes(Array(colorSequence.length).fill(false)); // Hide boxes initially
    if (clockAudioRef.current) {
      clockAudioRef.current.pause(); // Stop clock sound
      clockAudioRef.current.currentTime = 0; // Reset playback position
    }
  };

  const handlePauseGame = () => {
    setIsPaused(true);
  };

  const handleResumeGame = () => {
    setIsPaused(false);
  };

  const handleBoxClick = (index: number) => {
    // if (!isPaused) return;
    const updatedBoxes = [...showBoxes];
    const updatedBottles = [...showBottles];
    updatedBoxes[index] = false;
    updatedBottles[index] = true;
    setShowBoxes(updatedBoxes);
    setShowBottles(updatedBottles);
  };

  const handleMixColors = () => {
    if (isGameActive) return; // Disable color mixing if game is active
    generateColorSequence();
    setCanMixColors(false);
  };

  const handleGame = (status: "win" | "lose") => {
    console.log("GAME: ", status);

    if (intervalId) clearInterval(intervalId);
    setIsGameActive(false);
    setIsPaused(false);
    setTimeLeft(null);
    setModalMessage(status === "win" ? "FELICIDADES GANASTE" : "PERDISTE"); // Set message for the modal
    setIsModalOpen(true); // Open the modal
    setCanMixColors(true); // Allow color mixing again
    if (clockAudioRef.current) {
      clockAudioRef.current.pause(); // Stop clock sound
      clockAudioRef.current.currentTime = 0; // Reset playback position
    }
    playSound(`/sounds/${status === "win" ? "tada.mp3" : "risa.mp3"}`); // Play win or lose sound
  };

  return (
    <div className="h-full min-h-screen w-full bg-[#000a1dc9] overflow-auto">
      <div className="w-64 flex flex-col space-y-4 p-4 fixed right-0 top-0 bg-gray-800 z-10 overflow-auto">
        <button
          className="bg-blue-600 w-full py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          onClick={handleStartGame}
        >
          Start Game
        </button>
        <button
          className="bg-red-600 w-full py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          onClick={() => handleStopGame()}
        >
          Stop Game
        </button>
        <button
          className="bg-red-600 w-full py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          onClick={() => handleGame("lose")}
        >
          Lose Game
        </button>
        <button
          className="bg-green-600 w-full py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          onClick={() => handleGame("win")}
        >
          Win Game
        </button>
        <button
          className="bg-yellow-600 w-full py-2 rounded-lg shadow-md hover:bg-yellow-700 transition duration-300"
          onClick={handleGenerateDuration}
        >
          Generate Duration
        </button>
        <button
          className={`bg-${
            isPaused ? "green" : "yellow"
          }-600 w-full py-2 rounded-lg shadow-md hover:bg-${
            isPaused ? "green" : "yellow"
          }-700 transition duration-300`}
          onClick={isPaused ? handleResumeGame : handlePauseGame}
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          className={`bg-${
            canMixColors ? "blue" : "gray"
          }-600 w-full py-2 rounded-lg shadow-md hover:bg-${
            canMixColors ? "blue" : "gray"
          }-700 transition duration-300`}
          onClick={handleMixColors}
        >
          Mix Colors
        </button>
        <input
          type="number"
          value={typeof multiplo === "number" ? multiplo : ""}
          onChange={(e) => setMultiplo(Number(e.target.value) || "")}
          placeholder="Multiplicador"
          className="p-2 border rounded-lg w-full"
        />
        <input
          type="number"
          value={typeof verbotellas === "number" ? verbotellas : ""}
          onChange={(e) => setVerbotellas(Number(e.target.value) || "")}
          placeholder="VER BOTELLAS / Def: 3"
          className="p-2 border rounded-lg w-full"
        />
        <select
          className="p-2 border rounded-lg w-full"
          value={selectedLevel}
          onChange={handleLevelChange}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="flex flex-row z-0 gap-1">
        {colorSequence.map((color, index) => (
          <div key={index} className="">
            {showBoxes[index] ? (
              <Box onClick={() => handleBoxClick(index)} />
            ) : (
              <Bottle color={color} />
            )}
          </div>
        ))}
      </div>

      <div className="text-[300px] font-bold text-white bg-[#000a1d66] px-10 py-0 w-full text-center fixed bottom-10">
        {timeLeft !== null ? timeLeft : 0}
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          message={modalMessage}
        />
      )}
      {showConfetti && <ConfettiBackground />}
    </div>
  );
}
