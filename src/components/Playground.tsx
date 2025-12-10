// components/Playground.tsx
"use client";

import React, { ReactNode } from "react";
import Hero from "./Hero";
import About from "./About";
import Loader from "./Loader";
import MenuNavigation from "./MenuNavigation";
import CursorTrail from "./CursorTrail";

interface PlaygroundProps {
  children?: ReactNode;
}

const Playground: React.FC<PlaygroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      {/* Main content */}
      {/* <Loader /> */}
      <div>
        {/* <CursorTrail /> */}
        <MenuNavigation />
        {children}
        <Hero />
        <About />
      </div>
    </div>
  );
};

export default Playground;
