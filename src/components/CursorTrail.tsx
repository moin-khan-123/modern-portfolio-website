// components/CursorTrail.tsx
"use client";

import { useEffect } from "react";

export default function CursorTrail() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const trail = document.createElement("div");
      trail.className = "cursor-trail-dot";
      trail.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: #ffb900;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${e.clientX - 3}px;
        top: ${e.clientY - 3}px;
      `;
      document.body.appendChild(trail);

      setTimeout(() => trail.remove(), 600);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return null; // This component doesn't render anything visible
}