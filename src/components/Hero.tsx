import Image from "next/image";
import About from "./About";
import { useEffect, useState } from "react";
import ScrollVelocity from "./ScrollVelocity";

export default function Hero() {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    const update = () =>
      setWindowWidth(typeof window !== "undefined" ? window.innerWidth : null);
    update();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
    return () => {};
  }, []);

  const scrollingText = `Moin khan Full stack developer `;

  // Decide velocity / copies based on recorded window width (fallbacks provided)
  const isMobile = windowWidth !== null ? windowWidth < 768 : false;
  const leftRightVelocity = isMobile ? 20 : 30;
  const leftRightNumCopies = isMobile ? 6 : 10;

  return (
    <div className="relative min-h-screen tracking-tighter">   
      {/* Left Sidebar - Scrolling Up */}
      <ScrollVelocity
        texts={[scrollingText]}
        velocity={leftRightVelocity}
        numCopies={leftRightNumCopies}
        side="left"
        parallaxClassName="z-20"
        scrollerClassName="text-[#ebebeb00] leading-none text-center whitespace-nowrap tracking-tighter text-gradient"
        damping={80}
        stiffness={200}
        velocityMapping={{ input: [0, 1000], output: [0, 2] }}
      />

      {/* Right Sidebar - Scrolling Down */}
      <ScrollVelocity
        texts={[scrollingText]}
        velocity={leftRightVelocity}
        numCopies={leftRightNumCopies}
        side="right"
        parallaxClassName="z-20"
        scrollerClassName=" text-[#ebebeb00] leading-none text-center whitespace-nowrap tracking-tight text-gradient"
        damping={80}
        stiffness={200}
        velocityMapping={{ input: [0, 1000], output: [0, 2] }}
      />

      {/* Main content */}
      <div>

      </div>
    </div>
  );
}
