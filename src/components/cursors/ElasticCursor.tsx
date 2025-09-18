"use client";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMouse } from "@/hooks/use-mouse";
import { useCursor } from "@/context/CursorContext";

function useTicker(callback: gsap.TickerCallback | null, paused: boolean) {
  useEffect(() => {
    if (!paused && callback) gsap.ticker.add(callback);
    return () => {
      if (callback) gsap.ticker.remove(callback);
    };
  }, [callback, paused]);
}

const EMPTY = {} as {
  x: Function;
  y: Function;
  r?: Function;
  width?: Function;
  sx?: Function;
  sy?: Function;
};

function useInstance<T extends Record<string, any>>(value: T | (() => T) = {} as T) {
  const ref = useRef<any>(EMPTY);
  if (ref.current === EMPTY) {
    ref.current = typeof value === "function" ? (value as any)() : value;
  }
  return ref.current as T;
}

function getScale(dx: number, dy: number) {
  const d = Math.hypot(dx, dy);
  return Math.min(d / 735, 0.35);
}

function getAngle(dx: number, dy: number) {
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function getHoverRect(el: HTMLElement | null) {
  if (!el) return null;
  if (el.classList.contains("cursor-can-hover")) return el.getBoundingClientRect();
  if (el.parentElement?.classList.contains("cursor-can-hover")) return el.parentElement.getBoundingClientRect();
  if (el.parentElement?.parentElement?.classList.contains("cursor-can-hover")) return el.parentElement.parentElement.getBoundingClientRect();
  return null;
}

const CURSOR_DIAMETER = 50;

export const ElasticCursor = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { elasticEnabled } = useCursor();
  const jellyRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorMoved, setCursorMoved] = useState(false);
  const { x, y } = useMouse();

  useEffect(() => {
    if (isMobile || !elasticEnabled) return;
    const prev = document.body.style.cursor;
    document.body.style.cursor = "none";
    return () => {
      document.body.style.cursor = prev;
    };
  }, [isMobile, elasticEnabled]);

  const pos = useInstance(() => ({ x: 0, y: 0 }));
  const vel = useInstance(() => ({ x: 0, y: 0 }));
  const set = useInstance(() => ({} as any));

  useLayoutEffect(() => {
    if (!jellyRef.current || !elasticEnabled) return;
    set.x = gsap.quickSetter(jellyRef.current, "x", "px");
    set.y = gsap.quickSetter(jellyRef.current, "y", "px");
    set.r = gsap.quickSetter(jellyRef.current, "rotate", "deg");
    set.sx = gsap.quickSetter(jellyRef.current, "scaleX");
    set.sy = gsap.quickSetter(jellyRef.current, "scaleY");
    set.width = gsap.quickSetter(jellyRef.current, "width", "px");
  }, [elasticEnabled]);

  const loop = useCallback(() => {
    if (!elasticEnabled || !set.width || !set.sx || !set.sy || !set.r) return;
    const rotation = getAngle(+vel.x, +vel.y);
    const scale = getScale(+vel.x, +vel.y);
    if (!isHovering) {
      set.x(pos.x);
      set.y(pos.y);
      set.width(50 + scale * 300);
      set.r(rotation);
      set.sx(1 + scale);
      set.sy(1 - scale * 2);
    } else {
      set.r(0);
    }
  }, [isHovering, elasticEnabled]);

  useLayoutEffect(() => {
    if (isMobile || !elasticEnabled) return;
    const onMove = (e: MouseEvent) => {
      if (!jellyRef.current) return;
      if (!cursorMoved) setCursorMoved(true);

      const hoverRect = getHoverRect(e.target as HTMLElement);
      if (hoverRect) {
        const rect = hoverRect;
        setIsHovering(true);
        gsap.to(jellyRef.current, { rotate: 0, duration: 0 });
        gsap.to(jellyRef.current, {
          width: rect.width + 20,
          height: rect.height + 20,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          borderRadius: 10,
          duration: 1.5,
          ease: "elastic.out(1, 0.3)",
        });
      } else {
        gsap.to(jellyRef.current, {
          borderRadius: 50,
          width: CURSOR_DIAMETER,
          height: CURSOR_DIAMETER,
        });
        setIsHovering(false);
      }

      const mx = e.clientX;
      const my = e.clientY;
      gsap.to(pos, {
        x: mx,
        y: my,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        onUpdate: () => {
          vel.x = (mx - pos.x) * 1.2;
          vel.y = (my - pos.y) * 1.2;
        },
      });

      loop();
    };

    const onScroll = () => {
      if (!jellyRef.current) return;
      
      gsap.to(jellyRef.current, {
        borderRadius: 50,
        width: CURSOR_DIAMETER,
        height: CURSOR_DIAMETER,
        duration: 0.3,
        ease: "power2.out",
      });
      setIsHovering(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isMobile, cursorMoved, loop, elasticEnabled]);

  useTicker(loop, !cursorMoved || isMobile || !elasticEnabled);
  if (isMobile || !elasticEnabled) return null;

  return (
    <>
      <div
        ref={jellyRef}
        id="jelly-id"
        className={cn(
          `w-[${CURSOR_DIAMETER}px] h-[${CURSOR_DIAMETER}px] border-2 border-black dark:border-white`,
          "jelly-blob fixed left-0 top-0 rounded-lg z-[999] pointer-events-none will-change-transform",
          "translate-x-[-50%] translate-y-[-50%]"
        )}
        style={{
          zIndex: 9999,
          backdropFilter: "invert(100%)",
        }}
      />
      <div
        className="w-3 h-3 rounded-full fixed translate-x-[-50%] translate-y-[-50%] pointer-events-none"
        style={{
          top: y,
          left: x,
          backdropFilter: "invert(100%)",
          zIndex: 9999,
        }}
      />
    </>
  );
};

export default ElasticCursor;
