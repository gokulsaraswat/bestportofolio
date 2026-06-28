"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useMounted } from "@/hooks/use-mounted";

// ─── Magnetic Cursor with Dot + Delayed Circle ────────────────
// Inner dot: 6px, follows mouse directly
// Outer circle: 40px, follows with 150ms delay via lerp
// Magnetic snap: outer circle pulls toward interactive elements
// Edge snap: outer circle hugs card/block borders

interface CursorState {
  x: number;
  y: number;
  circleX: number;
  circleY: number;
  isHovering: boolean;
  circleSize: number;
  isHidden: boolean;
}

const DOT_SIZE = 6;
const DEFAULT_CIRCLE_SIZE = 40;
const HOVER_CIRCLE_SIZE = 60;
const MAGNETIC_STRENGTH = 0.35;
const LERP_SPEED = 0.12;
const SNAP_THRESHOLD = 8;
const SNAP_STRENGTH = 0.6;

function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<CursorState>({
    x: -100,
    y: -100,
    circleX: -100,
    circleY: -100,
    isHovering: false,
    circleSize: DEFAULT_CIRCLE_SIZE,
    isHidden: true,
  });
  
  const rafRef = useRef<number>(0);
  const mounted = useMounted();

  useEffect(() => {

    // Don't show custom cursor on touch devices
    if (typeof window !== "undefined" && "ontouchstart" in window) return;

    const dot = dotRef.current;
    const circle = circleRef.current;
    if (!dot || !circle) return;

    const state = stateRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      state.x = e.clientX;
      state.y = e.clientY;
      state.isHidden = false;

      // Dot follows immediately
      dot.style.transform = `translate(${e.clientX - DOT_SIZE / 2}px, ${e.clientY - DOT_SIZE / 2}px)`;
      dot.style.opacity = "1";
      circle.style.opacity = "1";
    };

    const handleMouseEnterInteractive = (e: Event) => {
      state.isHovering = true;
      state.circleSize = HOVER_CIRCLE_SIZE;
      dot.style.transform += " scale(0.5)";
      dot.style.opacity = "0.5";
    };

    const handleMouseLeaveInteractive = () => {
      state.isHovering = false;
      state.circleSize = DEFAULT_CIRCLE_SIZE;
      dot.style.opacity = "1";
    };

    const handleMouseLeave = () => {
      state.isHidden = true;
      dot.style.opacity = "0";
      circle.style.opacity = "0";
    };

    // Animation loop for the delayed circle
    const animate = () => {
      const targetX = state.x;
      const targetY = state.y;

      // Lerp the circle toward the mouse
      state.circleX = lerp(state.circleX, targetX, LERP_SPEED);
      state.circleY = lerp(state.circleY, targetY, LERP_SPEED);

      // Magnetic pull toward hovered element center
      let snapX = 0;
      let snapY = 0;
      let snapScale = 1;

      if (state.isHovering) {
        const hovered = document.querySelector(":hover") as HTMLElement;
        if (hovered && hovered !== document.body && hovered !== document.documentElement) {
          const rect = hovered.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // Pull circle toward element center
          const dx = centerX - state.circleX;
          const dy = centerY - state.circleY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 1) {
            snapX = (dx / dist) * dist * MAGNETIC_STRENGTH;
            snapY = (dy / dist) * dist * MAGNETIC_STRENGTH;
          }

          // Edge snap: if circle is close to element border, snap to it
          const edgeDist = Math.min(
            Math.abs(state.circleY - rect.top),
            Math.abs(state.circleY - rect.bottom),
            Math.abs(state.circleX - rect.left),
            Math.abs(state.circleX - rect.right)
          );

          if (edgeDist < SNAP_THRESHOLD) {
            snapScale = 1.2;
            // Snap circle to the nearest edge
            const distances = [
              { d: Math.abs(state.circleY - rect.top), axis: "top" },
              { d: Math.abs(state.circleY - rect.bottom), axis: "bottom" },
              { d: Math.abs(state.circleX - rect.left), axis: "left" },
              { d: Math.abs(state.circleX - rect.right), axis: "right" },
            ];
            distances.sort((a, b) => a.d - b.d);
            const nearest = distances[0];

            if (nearest.axis === "top") snapY = -SNAP_STRENGTH * 15;
            else if (nearest.axis === "bottom") snapY = SNAP_STRENGTH * 15;
            else if (nearest.axis === "left") snapX = -SNAP_STRENGTH * 15;
            else if (nearest.axis === "right") snapX = SNAP_STRENGTH * 15;
          }
        }
      }

      const finalX = state.circleX + snapX;
      const finalY = state.circleY + snapY;
      const halfSize = state.circleSize / 2;

      circle.style.transform = `translate(${finalX - halfSize}px, ${finalY - halfSize}px) scale(${snapScale})`;
      circle.style.width = `${state.circleSize}px`;
      circle.style.height = `${state.circleSize}px`;

      rafRef.current = requestAnimationFrame(animate);
    };

    // Event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Observe interactive elements for hover
    const interactiveSelector = 'a, button, [role="button"], input, textarea, select, [tabindex]:not([tabindex="-1"]), [data-cursor-hover], .cursor-hover';

    const attachHoverListeners = () => {
      document.querySelectorAll(interactiveSelector).forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnterInteractive);
        el.addEventListener("mouseleave", handleMouseLeaveInteractive);
      });
    };

    // Initial attach + observe DOM changes
    attachHoverListeners();
    const observer = new MutationObserver(() => {
      attachHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Start animation
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
    };
  }, []);

  // Don't render on SSR or touch devices
  if (!mounted) return null;

  return (
    <>
      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none opacity-0"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: "50%",
          backgroundColor: "var(--cursor-dot, #000)",
          mixBlendMode: "difference",
          transition: "opacity 0.3s, transform 0.15s ease-out",
          willChange: "transform",
        }}
      />
      {/* Outer Circle */}
      <div
        ref={circleRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none opacity-0"
        style={{
          width: DEFAULT_CIRCLE_SIZE,
          height: DEFAULT_CIRCLE_SIZE,
          borderRadius: "50%",
          border: "1.5px solid var(--cursor-circle, #000)",
          backgroundColor: "transparent",
          mixBlendMode: "difference",
          transition: "opacity 0.3s, width 0.3s ease-out, height 0.3s ease-out",
          willChange: "transform",
        }}
      />
      {/* Hide default cursor globally */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        @media (pointer: coarse) {
          * {
            cursor: auto !important;
          }
        }
        /* Ensure text selection cursor still works conceptually */
        ::selection {
          background-color: rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </>
  );
}