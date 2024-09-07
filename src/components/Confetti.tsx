"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

const Confetti = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const confettiInstance = confetti.create(canvas, { resize: true });

      // Function to start confetti
      const startConfetti = () => {
        confettiInstance({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      };

      // Start confetti effect
      startConfetti();

      // Optionally stop the confetti after some time
      // setTimeout(() => {
      //   confettiInstance.reset();
      // }, 5000); // 5 seconds duration

      return () => {
        // Clean up function
        confettiInstance.reset();
      };
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-[-1]"
    />
  );
};

export default Confetti;
