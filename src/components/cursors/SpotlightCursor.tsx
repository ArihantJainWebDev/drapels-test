"use client";
import React, { useEffect, useState } from 'react';
import { useCursor } from "@/context/CursorContext";

const SpotlightCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { spotlightEnabled, spotlightSize } = useCursor();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (spotlightEnabled) {
      document.addEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'none';
      document.documentElement.style.cursor = 'none';
      
      const style = document.createElement('style');
      style.innerHTML = `
        *, *::before, *::after {
          cursor: none !important;
        }
      `;
      style.id = 'spotlight-cursor-style';
      document.head.appendChild(style);
    } else {
      document.body.style.cursor = 'auto';
      document.documentElement.style.cursor = 'auto';
      
      const existingStyle = document.getElementById('spotlight-cursor-style');
      if (existingStyle) {
        existingStyle.remove();
      }
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'auto';
      document.documentElement.style.cursor = 'auto';
      
      const existingStyle = document.getElementById('spotlight-cursor-style');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [spotlightEnabled]);

  if (!spotlightEnabled) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{
        background: `radial-gradient(circle ${spotlightSize}px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.75) 60%, rgba(0, 0, 0, 0.75) 100%)`,
        mixBlendMode: 'multiply',
      }}
    />
  );
};

export default SpotlightCursor;
