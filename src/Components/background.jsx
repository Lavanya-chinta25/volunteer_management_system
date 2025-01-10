import React, { useState, useEffect } from "react";
import robo1 from "../assets/robo1.png";
import robo2 from "../assets/robo2.png";
import robo3 from "../assets/robo3.png";
import robo4 from "../assets/robo4.png";
import robo5 from "../assets/robo5.png";
import robo6 from "../assets/robo6.png";

const RoboAnimationWithBubbles = () => {
  const roboImages = [robo1, robo2, robo3, robo4, robo5, robo6];

  // Fixed positions for Robo images
  const roboPositions = [
    { top: "15%", left: "17%" },
    { top: "70%", left: "70%" },
    { top: "50%", left: "37%" },
    { top: "30%", left: "85%" },
    { top: "70%", left: "5%" },
    { top: "5%", left: "55%" },
  ];

  // Precompute bubble positions and styles for consistency across refreshes
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const generateBubbles = (num) => {
      const bubbleData = [];
      for (let i = 0; i < num; i++) {
        bubbleData.push({
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          size: `${Math.random() * 5 + 5}px`,
          animationDelay: `${Math.random() * 2}s`,
        });
      }
      return bubbleData;
    };

    setBubbles(generateBubbles(50)); // Generate 30 bubbles
  }, []);

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      {/* Robo Images */}
      {roboImages.map((robo, index) => (
        <img
          key={index}
          src={robo}
          alt={`Robot ${index + 1}`}
          className="absolute animate-float w-16 h-16 lg:w-24 lg:h-24 drop-shadow-[0_0_10px_rgba(135,206,250,0.5)] filter-glass"
          style={{
            ...roboPositions[index],
            animationDelay: `${index * 0.5}s`,
          }}
        />
      ))}

      {/* Bubbles */}
      {bubbles.map((bubble, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-gray-300 opacity-10 drop-shadow-[0_0_10px_rgba(135,206,250,0.4)] animate-bubble filter-glass"
          style={{
            top: bubble.top,
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            animationDelay: bubble.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

export default RoboAnimationWithBubbles;
