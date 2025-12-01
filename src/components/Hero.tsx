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

  // Speed configuration for different screen sizes (in pixels per second)
  const speedConfig = {
    mobile: 15,      // < 640px (phones)
    tablet: 25,      // 640px - 1024px (tablets)
    laptop: 35,      // 1024px - 1440px (laptops)
    desktop: 45,     // >= 1440px (large screens)
  };

  // Number of copies for different screen sizes
  const copiesConfig = {
    mobile: 6,       // < 640px
    tablet: 8,       // 640px - 1024px
    laptop: 10,      // 1024px - 1440px
    desktop: 12,     // >= 1440px
  };

  // Determine current screen size and get appropriate values
  const getResponsiveValues = () => {
    if (windowWidth === null) {
      return { velocity: speedConfig.laptop, numCopies: copiesConfig.laptop };
    }

    if (windowWidth < 640) {
      // Mobile
      return { velocity: speedConfig.mobile, numCopies: copiesConfig.mobile };
    } else if (windowWidth >= 640 && windowWidth < 1024) {
      // Tablet
      return { velocity: speedConfig.tablet, numCopies: copiesConfig.tablet };
    } else if (windowWidth >= 1024 && windowWidth < 1440) {
      // Laptop
      return { velocity: speedConfig.laptop, numCopies: copiesConfig.laptop };
    } else {
      // Desktop
      return { velocity: speedConfig.desktop, numCopies: copiesConfig.desktop };
    }
  };

  const { velocity, numCopies } = getResponsiveValues();

  return (
    <div className="relative min-h-screen tracking-tighter">   
      {/* Left Sidebar - Scrolling Up */}
      <ScrollVelocity
        texts={[scrollingText]}
        velocity={velocity}
        numCopies={numCopies}
        side="left"
        parallaxClassName="z-20"
        scrollerClassName="text-[#ebebeb00] leading-none text-center whitespace-nowrap tracking-tighter text-gradient"
      />

      {/* Right Sidebar - Scrolling Down */}
      <ScrollVelocity
        texts={[scrollingText]}
        velocity={velocity}
        numCopies={numCopies}
        side="right"
        parallaxClassName="z-20"
        scrollerClassName="text-[#ebebeb00] leading-none text-center whitespace-nowrap tracking-tight text-gradient"
      />

      {/* Main content */}
      <div>
        <About />
      </div>
    </div>
  );
}