import React, { useRef, useLayoutEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useTransform,
} from "framer-motion";

interface ScrollVelocityProps {
  texts: string[];
  velocity?: number;
  className?: string;
  numCopies?: number;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
  side?: "left" | "right";
}

function useElementWidth<T extends HTMLElement>(
  ref: React.RefObject<T | null>
): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);

  return width;
}

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  texts = [],
  velocity = 100,
  className = "",
  numCopies = 6,
  parallaxClassName,
  scrollerClassName,
  parallaxStyle,
  scrollerStyle,
  side = "left",
}) => {
  const baseX = useMotionValue(0);
  const copyRef = useRef<HTMLSpanElement>(null);
  const copyWidth = useElementWidth(copyRef);

  function wrap(min: number, max: number, v: number): number {
    const range = max - min;
    if (range === 0) return min;
    const mod = (((v - min) % range) + range) % range;
    return mod + min;
  }

  const x = useTransform(baseX, (v) => {
    if (copyWidth === 0) return "0px";
    return `${wrap(-copyWidth, 0, v)}px`;
  });

  // Constant smooth animation
  useAnimationFrame((t, delta) => {
    const moveBy = velocity * (delta / 1000);
    baseX.set(baseX.get() - moveBy);
  });

  const spans = [];
  for (let i = 0; i < numCopies; i++) {
    spans.push(
      <span
        className={`inline-block px-2 sm:px-3 md:px-4 ${className}`}
        key={i}
        ref={i === 0 ? copyRef : null}
      >
        {texts[0]}
      </span>
    );
  }

  return (
    <div
      className={`${parallaxClassName} fixed top-0 ${
        side === "left" ? "left-0" : "right-0"
      } w-20 sm:w-26 md:w-36 lg:w-48 xl:w-48 h-full overflow-hidden flex items-center justify-center `}
      style={parallaxStyle}
    >
      <div
        className={`${
          side === "left" ? "-rotate-90" : "rotate-90"
        } origin-center h-screen w-screen flex items-center justify-center `}
      >
        <motion.div
          className={`${scrollerClassName} flex flex-row whitespace-nowrap  text-[clamp(70px,15vw,200px)] font-extrabold`}
          style={{ x, ...scrollerStyle }}
        >
          {spans}
        </motion.div>
      </div>
    </div>
  );
};

export default ScrollVelocity;