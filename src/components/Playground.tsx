"use client";

import React, { useEffect, useState } from "react";
import { useScrollPosition } from "../hooks/useScrollPosition";
// import About from './About';
import Hero from "./Hero";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
import ScrollVelocity from "./ScrollVelocity";

import About from "./About";



const Playground: React.FC = () => {
  // const scrollY = useScrollPosition();
  // const [serverMsg, setServerMsg] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);

  // Track window width in state so we don't call `window` during SSR/render
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

  // const scrollingText = `Joy Baba Rasel.com • Order now • Limited stock • We are the #1 Mehndi Brand 
  // in Bangladesh that delivers 100% organic henna to you using organic methods. We don't compromise our quality. 
  // If you want to order henna, you have to order a minimum of two henna. Our stock is always limited, so be the first to order.`;

  // // Decide velocity / copies based on recorded window width (fallbacks provided)
  // const isMobile = windowWidth !== null ? windowWidth < 768 : false;
  // const leftRightVelocity = isMobile ? 20 : 30;
  // const leftRightNumCopies = isMobile ? 6 : 10;

  return (
    <div className="relative min-h-screen">
      {/* Left Sidebar - Scrolling Up */}
      {/* <ScrollVelocity
        texts={[scrollingText]}
        velocity={leftRightVelocity}
        numCopies={leftRightNumCopies}
        side="left"
        parallaxClassName="z-20"
        scrollerClassName="text-white font-bold tracking-wider text-5xl"
        damping={80}
        stiffness={200}
        velocityMapping={{ input: [0, 1000], output: [0, 2] }}
      /> */}

      {/* Right Sidebar - Scrolling Down */}
      {/* <ScrollVelocity
        texts={[scrollingText]}
        velocity={leftRightVelocity}
        numCopies={leftRightNumCopies}
        side="right"
        parallaxClassName="z-20"
        scrollerClassName="text-white font-bold tracking-wider text-5xl"
        damping={80}
        stiffness={200}
        velocityMapping={{ input: [0, 1000], output: [0, 2] }}
      /> */}

      {/* Main content */}
      <div>
        <Hero />
        <About />
      </div>
    </div>
  );
};

export default Playground;
