"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

const Loader = () => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const splitOverlayRef = useRef<HTMLDivElement>(null);
  const tagsOverlayRef = useRef<HTMLDivElement>(null);
  const screenSize = useRef<"mobileS" | "mobileM" | "mobileL" | "phone" | "tablet" | "laptop" | "desktop">(
    "desktop"
  );

  useEffect(() => {
    gsap.registerPlugin(CustomEase, SplitText);

    CustomEase.create("hop", ".8, 0, .3, 1");

    const width = window.innerWidth;
    if (width <= 320) {
      screenSize.current = "mobileS";
    } else if (width <= 375) {
      screenSize.current = "mobileM";
    } else if (width <= 425) {
      screenSize.current = "mobileL";
    } else if (width <= 640) {
      screenSize.current = "phone";
    } else if (width <= 1000) {
      screenSize.current = "tablet";
    } else if (width <= 1400) {
      screenSize.current = "laptop";
    } else {
      screenSize.current = "desktop";
    }

    const config = {
      mobileS: {
        firstCharX: "3rem",
        firstCharY: "-3rem",
        outroCharX: "1rem",
        outroFontSize: "4rem",
        firstCharAnimX: "-1rem",
        firstCharFinalX: "-2rem",
        firstCharFinalY: "0rem",
      },
      mobileM: {
        firstCharX: "3.5rem",
        firstCharY: "-3.5rem",
        outroCharX: "1.2rem",
        outroFontSize: "5rem",
        firstCharAnimX: "7rem",
        firstCharFinalX: "3.5rem",
        firstCharFinalY: "-1rem",
      },
      mobileL: {
        firstCharX: "2rem",
        firstCharY: "-4rem",
        outroCharX: "1rem",
        outroFontSize: "5rem",
        firstCharAnimX: "6rem",
        firstCharFinalX: "3.5rem",
        firstCharFinalY: "-1rem",
      },
      phone: {
        firstCharX: "5rem",
        firstCharY: "-5rem",
        outroCharX: "-2rem",
        outroFontSize: "4rem",
        firstCharAnimX: "6rem",
        firstCharFinalX: "5rem",
        firstCharFinalY: "-0.75rem",
      },
      tablet: {
        firstCharX: "-10rem",
        firstCharY: "-3rem",
        outroCharX: "-4rem",
        outroFontSize: "10rem",
        firstCharAnimX: "13rem",
        firstCharFinalX: "6.5rem",
        firstCharFinalY: "-2rem",
      },
      laptop: {
        firstCharX: "-14rem",
        firstCharY: "-2.5rem",
        outroCharX: "-6rem",
        outroFontSize: "11rem",
        firstCharAnimX: "18.5rem",
        firstCharFinalX: "13.5rem",
        firstCharFinalY: "-2.5rem",
      },
      desktop: {
        firstCharX: "-18rem",
        firstCharY: "-2.75rem",
        outroCharX: "-8rem",
        outroFontSize: "14rem",
        firstCharAnimX: "24rem",
        firstCharFinalX: "18rem",
        firstCharFinalY: "-2.75rem",
      },
    };

    const currentConfig = config[screenSize.current];

    const splitTextElements = (
      selector: string,
      type: "words" | "chars" | "words,chars" | "chars,words" = "words,chars",
      addFirstChar = false
    ) => {
      const elements = document.querySelectorAll(selector);

      elements.forEach((element) => {
        const splitText = new SplitText(element, {
          type,
          wordsClass: "word",
          charsClass: "char",
        });

        if (type.includes("chars") && splitText.chars) {
          splitText.chars.forEach((char: Element, index: number) => {
            const charElement = char as HTMLElement;
            const originalText = charElement.textContent;
            charElement.innerHTML = `<span>${originalText}</span>`;
            if (addFirstChar && index === 0) {
              charElement.classList.add("first-char");
            }
          });
        }
      });
    };

    splitTextElements(".intro-title h1", "words,chars", true);
    splitTextElements(".outro-title h1");
    splitTextElements(".tag p", "words");

    gsap.set(
      [
        ".split-overlay .intro-title .first-char span",
        ".split-overlay .outro-title .char span",
      ],
      { y: "0%" }
    );

    gsap.set(".split-overlay .intro-title .first-char", {
      x: currentConfig.firstCharX,
      y: currentConfig.firstCharY,
      fontWeight: "900",
      scale: 0.75,
    });

    gsap.set(".split-overlay .outro-title .char", {
      x: currentConfig.outroCharX,
      fontSize: currentConfig.outroFontSize,
    });

    const tl = gsap.timeline({ defaults: { ease: "hop" } });
    const tags = gsap.utils.toArray<HTMLElement>(".tag");

    tags.forEach((tag: HTMLElement, index: number) => {
      tl.to(
        tag.querySelectorAll<HTMLElement>("p .word"),
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
          x: currentConfig.firstCharAnimX,
        },
        3.5
      )
      .to(
        ".preloader .outro-title .char",
        {
          x: currentConfig.outroCharX,
        },
        3.5
      )
      .to(
        ".preloader .intro-title .first-char",
        {
          x: currentConfig.firstCharFinalX,
          y: currentConfig.firstCharFinalY,
          fontWeight: "900",
          scale: 0.75,
          duration: 0.75,
        },
        4.5
      )
      .to(
        ".preloader .outro-title .char",
        {
          x: currentConfig.outroCharX,
          fontSize: currentConfig.outroFontSize,
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

    tags.forEach((tag: HTMLElement, index: number) => {
      tl.to(
        tag.querySelectorAll<HTMLElement>("p .word"),
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
        y: (i: number) => (i === 0 ? "-50%" : "50%"),
        duration: 1,
      },
      6
    ).to(
      ".container",
      { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", duration: 1 },
      6
    );

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
        <div className="intro-title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center px-4">
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold uppercase leading-none">
            Moin&apos;s Portfolio
          </h1>
        </div>
        <div className="outro-title absolute top-1/2 left-1/2 xs:left-[calc(50%+2rem)] sm:left-[calc(100%-6rem)] md:left-[calc(100%-18rem)] lg:left-[calc(100%-22rem)] xl:left-[calc(100%-48rem)] transform -translate-x-1/2 -translate-y-1/2 w-max">
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold uppercase leading-none whitespace-nowrap">
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
        <div className="intro-title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center px-4">
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold uppercase leading-none">
            Moin&apos;s Portfolio
          </h1>
        </div>
        <div className="outro-title absolute top-1/2 left-1/2 xs:left-[calc(50%+2rem)] sm:left-[calc(100%-6rem)] md:left-[calc(100%-18rem)] lg:left-[calc(100%-22rem)] xl:left-[calc(100%-48rem)] transform -translate-x-1/2 -translate-y-1/2 w-max">
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold uppercase leading-none whitespace-nowrap">
            100%
          </h1>
        </div>
      </div>

      {/* Tags Overlay */}
      <div
        ref={tagsOverlayRef}
        className="tags-overlay fixed w-screen h-svh z-50 pointer-events-none"
      >
        <div className="tag tag-1 absolute top-1/5 left-[5%] xs:left-[8%] sm:left-1/10 text-gray-500 overflow-hidden">
          <p className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl font-semibold">
            2026
          </p>
        </div>
        <div className="tag tag-2 absolute top-[70%] left-[8%] xs:left-[12%] sm:left-[15%] text-gray-500 overflow-hidden">
          <p className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-[1.65rem] xl:text-3xl font-medium">
            Portfolio
          </p>
        </div>
        <div className="tag tag-3 absolute top-1/3 right-[5%] xs:right-[8%] sm:right-1/10 text-gray-500 overflow-hidden">
          <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-[2.25rem] xl:text-4xl font-semibold">
            Website
          </p>
        </div>
        <div className="tag tag-4 absolute top-[85%] right-[12%] xs:right-[18%] sm:right-[20%] text-gray-500 overflow-hidden">
          <p className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-semibold">
            Modern
          </p>
        </div>
      </div>
    </>
  );
};

export default Loader;