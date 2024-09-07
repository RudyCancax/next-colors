// src/components/ConfettiBackground.tsx
import React, { useEffect, useState } from "react";

const ConfettiBackground: React.FC = () => {
  const [confettiElements, setConfettiElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const generateConfetti = () => {
      const confetti = [];
      for (let i = 0; i < 100; i++) {
        confetti.push(
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
              backgroundColor: `hsl(${Math.random() * 360}, 70%, 70%)`,
              width: `${Math.random() * 10 + 5}px`, // Random width between 5px and 15px
              height: `${Math.random() * 10 + 5}px`, // Random height between 5px and 15px
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: Math.random() * 0.5 + 0.5, // Random opacity between 0.5 and 1
            }}
          />
        );
      }
      setConfettiElements(confetti);
    };

    generateConfetti();
    // Regenerate confetti every 10 seconds
    const interval = setInterval(generateConfetti, 10000);
    return () => clearInterval(interval);
  }, []);

  return <div className="confetti-container">{confettiElements}</div>;
};

export default ConfettiBackground;
