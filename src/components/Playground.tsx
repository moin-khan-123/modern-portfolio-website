"use client";

import React from "react";
import Hero from "./Hero";
import About from "./About";
import Loader from "./Loader";
import MenuNavigation from "./MenuNavigation";

const Playground: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      {/* Main content */}
        <Loader />
      <div>
        <MenuNavigation/>
        <Hero />
        <About />
      </div>
    </div>
  );
};

export default Playground;