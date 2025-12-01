"use client";

import React, { useEffect, useState } from "react";
import { useScrollPosition } from "../hooks/useScrollPosition";
// import About from './About';
import Hero from "./Hero";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
import ScrollVelocity from "./ScrollVelocity";

import About from "./About";
import Loader from "./Loader";



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
