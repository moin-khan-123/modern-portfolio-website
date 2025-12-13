"use client";
import { useRef, useEffect } from "react";

interface MouseEvent {
  movementY: number;
  clientX: number;
}

export default function Line() {
  const path = useRef<SVGPathElement>(null);
  let progress = 0;
  let x = 0.5;
  let time = Math.PI / 2;
  let reqId: number | null = null;

  useEffect(() => {
    setPath(progress);
  }, []);

  const setPath = (progress: number) => {
    if (!path.current) return;

    const width = window.innerWidth;
    const container = path.current.closest(".line-container");
    const containerWidth = container ? container.clientWidth : width;

    path.current.setAttributeNS(
      null,
      "d",
      `M0 0 Q${containerWidth * x} ${progress}, ${containerWidth} 0`
    );
  };

  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

  const manageMouseEnter = () => {
    if (reqId) {
      cancelAnimationFrame(reqId);
      resetAnimation();
    }
  };

  const manageMouseMove = (e: MouseEvent) => {
    const { movementY, clientX } = e;
    const pathBound = path.current?.getBoundingClientRect();

    if (pathBound) {
      x = (clientX - pathBound.left) / pathBound.width;
      progress += movementY;
      setPath(progress);
    }
  };

  const manageMouseLeave = () => {
    animateOut();
  };

  const animateOut = () => {
    const newProgress = progress * Math.sin(time);
    progress = lerp(progress, 0, 0.025);
    time += 0.2;
    setPath(newProgress);

    if (Math.abs(progress) > 0.75) {
      reqId = requestAnimationFrame(animateOut);
    } else {
      resetAnimation();
    }
  };

  const resetAnimation = () => {
    time = Math.PI / 2;
    progress = 0;
  };

  return (
    <div className="line-container w-full h-20 relative">
      {/* Mouse interaction area - full width and positioned correctly */}
      <div
        onMouseEnter={manageMouseEnter}
        onMouseMove={manageMouseMove}
        onMouseLeave={manageMouseLeave}
        className="absolute top-0 left-0 w-full h-20 z-20 cursor-pointer"
      />

      {/* SVG Line */}
      <svg
        className="absolute top-0 left-0 w-full h-20 overflow-visible"
        preserveAspectRatio="none"
      >
        <path
          ref={path}
          className="stroke-current text-black stroke-[1px] fill-none"
          d="M0 10 L100 10" // Initial straight line
        />
      </svg>
    </div>
  );
}
