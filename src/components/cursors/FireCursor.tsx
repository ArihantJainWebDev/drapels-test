"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from "@/hooks/use-media-query";
import { useCursor } from "@/context/CursorContext";

interface Circle extends HTMLDivElement {
  x: number;
  y: number;
}

function getHoverTarget(el: HTMLElement | null): HTMLElement | null {
  if (!el) return null;
  if (el.classList.contains('cursor-can-hover')) return el;
  if (el.parentElement?.classList.contains('cursor-can-hover')) return el.parentElement as HTMLElement;
  if (el.parentElement?.parentElement?.classList.contains('cursor-can-hover')) return el.parentElement.parentElement as HTMLElement;
  return null;
}

const FireCursor: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { fireEnabled } = useCursor();
  const containerRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef({ x: 0, y: 0 });
  const circlesRef = useRef<Circle[]>([]);
  const animationRef = useRef<number>();
  const currentHoverElRef = useRef<HTMLElement | null>(null);

  // Fire gradient colors from orange to dark red
  const colors = [
    "#ffb56b", "#fdaf69", "#f89d63", "#f59761", "#ef865e", "#ec805d",
    "#e36e5c", "#df685c", "#d5585c", "#d1525c", "#c5415d", "#c03b5d",
    "#b22c5e", "#ac265e", "#9c155f", "#950f5f", "#830060", "#7c0060",
    "#680060", "#60005f", "#48005f", "#3d005e"
  ];

  useEffect(() => {
    if (isMobile || !fireEnabled) return;
    const prev = document.body.style.cursor;
    document.body.style.cursor = "none";
    return () => {
      document.body.style.cursor = prev;
    };
  }, [isMobile, fireEnabled]);

  useEffect(() => {
    if (isMobile || !fireEnabled || !containerRef.current) return;

    // Inject forced orange/black hover override
    const styleId = 'fire-hover-style';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = `
        .cursor-can-hover.fire-hover-override {
          background: linear-gradient(135deg, #ffb56b, #ff7a1a) !important;
          color: #000 !important;
          border-color: #ff7a1a !important;
          box-shadow: 0 8px 24px #ff7a1a55, 0 0 0 1px #ffb56b99 inset !important;
          transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease !important;
        }
        .cursor-can-hover.fire-hover-override span,
        .cursor-can-hover.fire-hover-override p,
        .cursor-can-hover.fire-hover-override h1,
        .cursor-can-hover.fire-hover-override h2,
        .cursor-can-hover.fire-hover-override h3,
        .cursor-can-hover.fire-hover-override h4,
        .cursor-can-hover.fire-hover-override h5,
        .cursor-can-hover.fire-hover-override h6,
        .cursor-can-hover.fire-hover-override div:not([class*="icon"]):not([class*="svg"]),
        .cursor-can-hover.fire-hover-override button {
          color: #000 !important;
        }
      `;
      document.head.appendChild(styleEl);
    }

    // Create circles
    const circles: Circle[] = [];
    for (let i = 0; i < 20; i++) {
      const circle = document.createElement('div') as Circle;
      circle.className = 'fire-circle';
      circle.x = 0;
      circle.y = 0;
      
      Object.assign(circle.style, {
        height: '32px',
        width: '32px',
        borderRadius: '50%',
        backgroundColor: colors[i % colors.length],
        position: 'fixed',
        top: '0',
        left: '0',
        pointerEvents: 'none',
        zIndex: '9999999',
        boxShadow: `0 0 ${6 + i}px ${colors[i % colors.length]}60, inset 0 0 ${3 + i}px ${colors[i % colors.length]}30`,
        filter: 'blur(0.5px)',
        transition: 'all 0.1s ease-out',
      });
      
      containerRef.current.appendChild(circle);
      circles.push(circle);
    }
    
    circlesRef.current = circles;

    const handleMouseMove = (e: MouseEvent) => {
      coordsRef.current.x = e.clientX;
      coordsRef.current.y = e.clientY;

      const target = getHoverTarget(e.target as HTMLElement);
      if (target) {
        if (currentHoverElRef.current !== target) {
          if (currentHoverElRef.current) {
            currentHoverElRef.current.classList.remove('fire-hover-override');
          }
          target.classList.add('fire-hover-override');
          currentHoverElRef.current = target;
        }
      } else if (currentHoverElRef.current) {
        currentHoverElRef.current.classList.remove('fire-hover-override');
        currentHoverElRef.current = null;
      }
    };

    const handleScroll = () => {
      if (currentHoverElRef.current) {
        currentHoverElRef.current.classList.remove('fire-hover-override');
        currentHoverElRef.current = null;
      }
    };

    const animateCircles = () => {
      let x = coordsRef.current.x;
      let y = coordsRef.current.y;
      
      circlesRef.current.forEach((circle, index) => {
        circle.style.left = x - 16 + "px";
        circle.style.top = y - 16 + "px";
        
        const scale = (circlesRef.current.length - index) / circlesRef.current.length;
        circle.style.transform = `scale(${scale})`;
        
        const glowIntensity = Math.max(0.2, scale * 0.7);
        circle.style.boxShadow = `
          0 0 ${8 * glowIntensity}px ${colors[index % colors.length]}60,
          0 0 ${16 * glowIntensity}px ${colors[index % colors.length]}30,
          inset 0 0 ${4 * glowIntensity}px ${colors[index % colors.length]}40
        `;
        
        const rotation = (Date.now() * 0.001 + index * 0.5) % (Math.PI * 2);
        circle.style.filter = `blur(${0.5 + Math.sin(rotation) * 0.3}px) brightness(${1 + Math.sin(rotation) * 0.2})`;
        
        circle.x = x;
        circle.y = y;

        const nextCircle = circlesRef.current[index + 1] || circlesRef.current[0];
        x += (nextCircle.x - x) * 0.3;
        y += (nextCircle.y - y) * 0.3;
      });
      
      animationRef.current = requestAnimationFrame(animateCircles);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    animateCircles();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      circlesRef.current.forEach(circle => {
        if (circle.parentNode) {
          circle.parentNode.removeChild(circle);
        }
      });
      circlesRef.current = [];

      if (currentHoverElRef.current) {
        currentHoverElRef.current.classList.remove('fire-hover-override');
        currentHoverElRef.current = null;
      }
    };
  }, [isMobile, fireEnabled, colors]);

  if (isMobile || !fireEnabled) return null;

  return (
    <div 
      ref={containerRef}
      className="fire-cursor-container"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999999
      }}
    />
  );
};

export default FireCursor;
