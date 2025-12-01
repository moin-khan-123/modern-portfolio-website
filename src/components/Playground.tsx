"use client";

import React from "react";
import Hero from "./Hero";
import About from "./About";
import Loader from "./Loader";

const Playground: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      {/* Main content */}
      <div>
        <Loader />
        <Hero />
        <About />
      </div>
    </div>
  );
};

export default Playground;