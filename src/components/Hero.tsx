// components/Hero.tsx
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
      {/* CHANGED: Removed w-screen and added w-full */}
      <div className="h-screen w-full flex items-center">
        {/* CHANGED: Added left margin directly to the content container */}
        <div className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase leading-none text-black"
          style={{ paddingLeft: "16rem" }}
         >
          <div className="mb-2">WE CREATE</div>
          <div className="flex items-center gap-0 mb-2">
            <span className=" w-16 h-16 md:w-24 md:h-24 lg:w-40 lg:h-32 bg-amber-400 text-white mr-4 font-light text-4xl flex items-center justify-center rounded-2xl">(●'◡'●)</span>
            <span>EYE OPENING</span>
          </div>
          <div>PRESENTATIONS</div>
        </div>
      </div>
    </div>
  );
}