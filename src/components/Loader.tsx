"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

const Loader = () => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const splitOverlayRef = useRef<HTMLDivElement>(null);
  const tagsOverlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(CustomEase, SplitText);

    // Create custom ease
    CustomEase.create("hop", ".8, 0, .3, 1");

    // Check mobile
    isMobile.current = window.innerWidth <= 1000;

    // Utility function to split text
    const splitTextElements = (
      selector: string,
      type = "words,chars" as any,
      addFirstChar = false
    ) => {
      const elements = document.querySelectorAll(selector);

      elements.forEach((element) => {
        const splitText = new SplitText(element, {
          type,
          wordsClass: "word",
          charsClass: "char",
        });

        if (type.includes("chars")) {
          splitText.chars.forEach((char: any, index: number) => {
            const originalText = char.textContent;
            char.innerHTML = `<span>${originalText}</span>`;
            if (addFirstChar && index === 0) {
              char.classList.add("first-char");
            }
          });
        }
      });
    };

    // Split text elements
    splitTextElements(".intro-title h1", "words,chars", true);
    splitTextElements(".outro-title h1");
    splitTextElements(".tag p", "words");

    // Set initial states
    gsap.set(
      [
        ".split-overlay .intro-title .first-char span",
        ".split-overlay .outro-title .char span",
      ],
      { y: "0%" }
    );

    gsap.set(".split-overlay .intro-title .first-char", {
      x: isMobile.current ? "7.5rem" : "-18rem",
      y: isMobile.current ? "-7.5rem" : "-2.75rem",
      fontWeight: "900",
      scale: 0.75,
    });

    gsap.set(".split-overlay .outro-title .char", {
      x: isMobile.current ? "-3rem" : "-8rem",
      fontSize: isMobile.current ? "6rem" : "14rem",
      fontWeight: "500",
    });

    // Create timeline
    const tl = gsap.timeline({ defaults: { ease: "hop" } });
    const tags = gsap.utils.toArray(".tag");

    tags.forEach((tag: any, index: number) => {
      tl.to(
        tag.querySelectorAll("p .word"),
        {
          y: "0%",
          duration: 0.75,
        },
        0.5 + index * 0.1
      );
    });

    tl.to(
      ".preloader .intro-title .char span",
      {
        y: "0%",
        duration: 0.75,
        stagger: 0.05,
      },
      0.5
    )
      .to(
        ".preloader .intro-title .char:not(.first-char) span",
        {
          y: "100%",
          duration: 0.75,
          stagger: 0.05,
        },
        2.0
      )
      .to(
        ".preloader .outro-title .char span",
        {
          y: "0%",
          duration: 0.75,
          stagger: 0.05,
        },
        2.5
      )
      .to(
        ".preloader .intro-title .first-char",
        {
          x: isMobile.current ? "9rem" : "21.25rem",
        },
        3.5
      )
      .to(
        ".preloader .outro-title .char",
        {
          x: isMobile.current ? "-3rem" : "-8rem",
        },
        3.5
      )
      .to(
        ".preloader .intro-title .first-char",
        {
          x: isMobile.current ? "7.5rem" : "18rem",
          y: isMobile.current ? "-1rem" : "-2.75rem",
          fontWeight: "900",
          scale: 0.75,
          duration: 0.75,
        },
        4.5
      )
      .to(
        ".preloader .outro-title .char",
        {
          x: isMobile.current ? "-3rem" : "-8rem",
          fontSize: isMobile.current ? "6rem" : "14rem",
          fontWeight: "500",
          duration: 0.75,
          onComplete: () => {
            gsap.set(".preloader", {
              clipPath: "polygon(0 0, 100% 0, 100% 50%, 0% 50%)",
            });
            gsap.set(".split-overlay", {
              clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0% 100%)",
            });
          },
        },
        4.5
      )
      .to(
        ".container",
        { clipPath: "polygon(0 48%, 100% 48%, 100% 52%, 0% 52%)" },
        5
      );

    tags.forEach((tag: any, index: number) => {
      tl.to(
        tag.querySelectorAll("p .word"),
        {
          y: "100%",
          duration: 0.75,
        },
        5.5 + index * 0.1
      );
    });

    tl.to(
      [".preloader", ".split-overlay"],
      {
        y: (i) => (i === 0 ? "-50%" : "50%"),
        duration: 1,
      },
      6
    ).to(
      ".container",
      { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", duration: 1 },
      6
    );

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      {/* Preloader */}
      <div
        ref={preloaderRef}
        className="preloader fixed w-screen h-svh bg-black text-gray-100 z-50"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}
      >
        <div className="intro-title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
          <h1 className="text-6xl md:text-9xl font-semibold uppercase leading-none">
            Moin Portfolio
          </h1>
        </div>
        <div className="outro-title absolute top-1/2 left-1/2 md:left-[calc(100%-50rem)] transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-6xl md:text-9xl font-semibold uppercase leading-none">
            100%
          </h1>
        </div>
      </div>

      {/* Split Overlay */}
      <div
        ref={splitOverlayRef}
        className="split-overlay fixed w-screen h-svh bg-black text-gray-100 z-40"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}
      >
        <div className="intro-title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
          <h1 className="text-6xl md:text-9xl font-semibold uppercase leading-none">
            Moin Portfolio
          </h1>
        </div>
        <div className="outro-title absolute top-1/2 left-1/2 md:left-[calc(100%-50rem)] transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-6xl md:text-9xl font-semibold uppercase leading-none">
            100%
          </h1>
        </div>
      </div>

      {/* Tags Overlay */}
      <div
        ref={tagsOverlayRef}
        className="tags-overlay fixed w-screen h-svh z-50 pointer-events-none"
      >
        <div className="tag tag-1 absolute top-1/5 left-1/10 text-gray-500 overflow-hidden">
          <p className="text-4xl md:text-5xl font-semibold">2026</p>
        </div>
        <div className="tag tag-2 absolute top-[70%] left-[15%] text-gray-500 overflow-hidden">
          <p className="text-xl md:text-2xl font-medium">Portfolio</p>
        </div>
        <div className="tag tag-3 absolute top-1/3 right-1/10 text-gray-500 overflow-hidden">
          <p className="text-3xl md:text-4xl font-semibold">Website</p>
        </div>
      </div>
    </>
  );
};

export default Loader;
