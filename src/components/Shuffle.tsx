// components/Shuffle.tsx
import React, { useRef, useEffect, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { JSX } from "react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export interface ShuffleProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  shuffleDirection?: "left" | "right";
  duration?: number;
  maxDelay?: number;
  ease?: string | ((t: number) => number);
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: React.CSSProperties["textAlign"];
  onShuffleComplete?: () => void;
  shuffleTimes?: number;
  animationMode?: "random" | "evenodd";
  loop?: boolean;
  loopDelay?: number;
  stagger?: number;
  scrambleCharset?: string;
  colorFrom?: string;
  colorTo?: string;
  triggerOnce?: boolean;
  respectReducedMotion?: boolean;
  triggerOnHover?: boolean;
  autoInterval?: number;
}

const Shuffle: React.FC<ShuffleProps> = ({
  text,
  className = "",
  style = {},
  shuffleDirection = "right",
  duration = 0.35,
  maxDelay = 0,
  ease = "power3.out",
  threshold = 0.1,
  rootMargin = "-100px",
  tag = "p",
  textAlign = "center",
  onShuffleComplete,
  shuffleTimes = 1,
  animationMode = "evenodd",
  loop = false,
  loopDelay = 0,
  stagger = 0.03,
  scrambleCharset = "",
  colorFrom,
  colorTo,
  triggerOnce = true,
  respectReducedMotion = true,
  triggerOnHover = true,
  autoInterval = 8, // Default: 8 seconds
}) => {
  const ref = useRef<HTMLElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [hasHovered, setHasHovered] = useState(false);

  const splitRef = useRef<GSAPSplitText | null>(null);
  const wrappersRef = useRef<HTMLElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const playingRef = useRef(false);
  const hoverHandlerRef = useRef<((e: Event) => void) | null>(null);
  const leaveHandlerRef = useRef<((e: Event) => void) | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInViewportRef = useRef(false);

  useEffect(() => {
    if ("fonts" in document) {
      if (document.fonts.status === "loaded") setFontsLoaded(true);
      else document.fonts.ready.then(() => setFontsLoaded(true));
    } else setFontsLoaded(true);
  }, []);

  const scrollTriggerStart = useMemo(() => {
    const startPct = (1 - threshold) * 100;
    const mm = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin || "");
    const mv = mm ? parseFloat(mm[1]) : 0;
    const mu = mm ? mm[2] || "px" : "px";
    const sign =
      mv === 0 ? "" : mv < 0 ? `-=${Math.abs(mv)}${mu}` : `+=${mv}${mu}`;
    return `top ${startPct}%${sign}`;
  }, [threshold, rootMargin]);

  // Function to check if element is in viewport
  const checkInViewport = () => {
    if (!ref.current) return false;
    const rect = ref.current.getBoundingClientRect();
    return (
      rect.top <= window.innerHeight &&
      rect.bottom >= 0 &&
      rect.left <= window.innerWidth &&
      rect.right >= 0
    );
  };

  // Function to start/stop auto animation based on viewport
  const updateAutoAnimation = () => {
    const isInViewport = checkInViewport();

    if (isInViewport !== isInViewportRef.current) {
      isInViewportRef.current = isInViewport;

      if (isInViewport) {
        // Start auto animation interval
        if (autoInterval && autoInterval > 0) {
          intervalRef.current = setInterval(() => {
            if (!playingRef.current && !hasHovered) {
              triggerAnimation();
            }
          }, autoInterval * 1000);
        }
      } else {
        // Stop auto animation interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }
  };

  // Trigger animation function
  const triggerAnimation = () => {
    if (!ref.current || !text || !fontsLoaded || playingRef.current) return;
    if (
      respectReducedMotion &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      onShuffleComplete?.();
      return;
    }

    const build = () => {
      // Clean up existing animation
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
      if (wrappersRef.current.length) {
        wrappersRef.current.forEach((wrap) => {
          const inner = wrap.firstElementChild as HTMLElement | null;
          const orig = inner?.querySelector(
            '[data-orig="1"]'
          ) as HTMLElement | null;
          if (orig && wrap.parentNode) wrap.parentNode.replaceChild(orig, wrap);
        });
        wrappersRef.current = [];
      }
      try {
        splitRef.current?.revert();
      } catch {}
      splitRef.current = null;

      // Build animation
      const el = ref.current as HTMLElement;
      const computedFont = getComputedStyle(el).fontFamily;

      splitRef.current = new GSAPSplitText(el, {
        type: "chars",
        charsClass: "shuffle-char",
        wordsClass: "shuffle-word",
        linesClass: "shuffle-line",
        smartWrap: true,
        reduceWhiteSpace: false,
      });

      const chars = (splitRef.current.chars || []) as HTMLElement[];
      wrappersRef.current = [];

      const rolls = Math.max(1, Math.floor(shuffleTimes));
      const rand = (set: string) =>
        set.charAt(Math.floor(Math.random() * set.length)) || "";

      chars.forEach((ch) => {
        const parent = ch.parentElement;
        if (!parent) return;

        // Get character dimensions
        const originalDisplay = getComputedStyle(ch).display;
        const originalLineHeight = getComputedStyle(ch).lineHeight;
        const originalHeight = getComputedStyle(ch).height;

        // Preserve original position and size
        gsap.set(ch, {
          display: "inline-block",
          lineHeight: originalLineHeight,
          height: originalHeight,
        });

        const rect = ch.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height || parseInt(originalHeight) || 0;

        // Create wrapper with normalized height
        const wrap = document.createElement("span");
        wrap.className =
          "inline-block overflow-hidden align-baseline text-left leading-none";
        Object.assign(wrap.style, {
          width: w + "px",
          height: h + "px",
          lineHeight: originalLineHeight,
          verticalAlign: "baseline",
        });

        const inner = document.createElement("span");
        inner.className =
          "inline-block whitespace-nowrap will-change-transform origin-left transform-gpu leading-none";
        Object.assign(inner.style, {
          lineHeight: originalLineHeight,
          height: "100%",
        });

        parent.insertBefore(wrap, ch);
        wrap.appendChild(inner);

        const firstOrig = ch.cloneNode(true) as HTMLElement;
        firstOrig.className = "inline-block text-left leading-none";
        Object.assign(firstOrig.style, {
          width: w + "px",
          fontFamily: computedFont,
          lineHeight: originalLineHeight,
          height: "100%",
          verticalAlign: "baseline",
        });

        ch.setAttribute("data-orig", "1");
        ch.className = "inline-block text-left leading-none";
        Object.assign(ch.style, {
          width: w + "px",
          fontFamily: computedFont,
          lineHeight: originalLineHeight,
          height: "100%",
          verticalAlign: "baseline",
        });

        inner.appendChild(firstOrig);
        for (let k = 0; k < rolls; k++) {
          const c = ch.cloneNode(true) as HTMLElement;
          if (scrambleCharset) c.textContent = rand(scrambleCharset);
          c.className = "inline-block text-left leading-none";
          Object.assign(c.style, {
            width: w + "px",
            fontFamily: computedFont,
            lineHeight: originalLineHeight,
            height: "100%",
            verticalAlign: "baseline",
          });
          inner.appendChild(c);
        }
        inner.appendChild(ch);

        const steps = rolls + 1;
        let startX = 0;
        let finalX = -steps * w;
        if (shuffleDirection === "right") {
          const firstCopy = inner.firstElementChild as HTMLElement | null;
          const real = inner.lastElementChild as HTMLElement | null;
          if (real) inner.insertBefore(real, inner.firstChild);
          if (firstCopy) inner.appendChild(firstCopy);
          startX = -steps * w;
          finalX = 0;
        }

        gsap.set(inner, {
          x: startX,
          force3D: true,
          lineHeight: originalLineHeight,
        });
        if (colorFrom) (inner.style as any).color = colorFrom;

        inner.setAttribute("data-final-x", String(finalX));
        inner.setAttribute("data-start-x", String(startX));

        wrappersRef.current.push(wrap);
      });
    };

    const inners = () =>
      wrappersRef.current.map((w) => w.firstElementChild as HTMLElement);

    const randomizeScrambles = () => {
      if (!scrambleCharset) return;
      wrappersRef.current.forEach((w) => {
        const strip = w.firstElementChild as HTMLElement;
        if (!strip) return;
        const kids = Array.from(strip.children) as HTMLElement[];
        for (let i = 1; i < kids.length - 1; i++) {
          kids[i].textContent = scrambleCharset.charAt(
            Math.floor(Math.random() * scrambleCharset.length)
          );
        }
      });
    };

    const cleanupToStill = () => {
      wrappersRef.current.forEach((w) => {
        const strip = w.firstElementChild as HTMLElement;
        if (!strip) return;
        const real = strip.querySelector(
          '[data-orig="1"]'
        ) as HTMLElement | null;
        if (!real) return;

        // Restore original display style
        real.style.removeProperty("width");
        real.style.removeProperty("height");
        real.style.removeProperty("vertical-align");
        real.classList.remove("inline-block");
        real.classList.add("inline");

        strip.replaceChildren(real);
        strip.style.transform = "none";
        strip.style.willChange = "auto";
      });
    };

    const play = () => {
      const strips = inners();
      if (!strips.length) return;

      playingRef.current = true;

      const tl = gsap.timeline({
        smoothChildTiming: true,
        repeat: loop ? -1 : 0,
        repeatDelay: loop ? loopDelay : 0,
        onRepeat: () => {
          if (scrambleCharset) randomizeScrambles();
          gsap.set(strips, {
            x: (i, t: HTMLElement) =>
              parseFloat(t.getAttribute("data-start-x") || "0"),
          });
          onShuffleComplete?.();
        },
        onComplete: () => {
          playingRef.current = false;
          if (!loop) {
            cleanupToStill();
            if (colorTo) gsap.set(strips, { color: colorTo });
            onShuffleComplete?.();
          }
        },
      });

      const addTween = (targets: HTMLElement[], at: number) => {
        tl.to(
          targets,
          {
            x: (i, t: HTMLElement) =>
              parseFloat(t.getAttribute("data-final-x") || "0"),
            duration,
            ease,
            force3D: true,
            stagger: animationMode === "evenodd" ? stagger : 0,
          },
          at
        );
        if (colorFrom && colorTo)
          tl.to(targets, { color: colorTo, duration, ease }, at);
      };

      if (animationMode === "evenodd") {
        const odd = strips.filter((_, i) => i % 2 === 1);
        const even = strips.filter((_, i) => i % 2 === 0);
        const oddTotal = duration + Math.max(0, odd.length - 1) * stagger;
        const evenStart = odd.length ? oddTotal * 0.7 : 0;
        if (odd.length) addTween(odd, 0);
        if (even.length) addTween(even, evenStart);
      } else {
        strips.forEach((strip) => {
          const d = Math.random() * maxDelay;
          tl.to(
            strip,
            {
              x: parseFloat(strip.getAttribute("data-final-x") || "0"),
              duration,
              ease,
              force3D: true,
            },
            d
          );
          if (colorFrom && colorTo)
            tl.fromTo(
              strip,
              { color: colorFrom },
              { color: colorTo, duration, ease },
              d
            );
        });
      }

      tlRef.current = tl;
    };

    // Build and play the animation
    build();
    if (scrambleCharset) randomizeScrambles();
    play();
  };

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;

      // Initial animation on load
      triggerAnimation();
      setReady(true);

      // Set up viewport checker
      updateAutoAnimation();
      window.addEventListener("scroll", updateAutoAnimation);
      window.addEventListener("resize", updateAutoAnimation);

      // Set up hover handlers
      const removeHover = () => {
        if (hoverHandlerRef.current && ref.current) {
          ref.current.removeEventListener(
            "mouseenter",
            hoverHandlerRef.current
          );
        }
        if (leaveHandlerRef.current && ref.current) {
          ref.current.removeEventListener(
            "mouseleave",
            leaveHandlerRef.current
          );
        }
        hoverHandlerRef.current = null;
        leaveHandlerRef.current = null;
      };

      if (triggerOnHover) {
        removeHover();

        const handleMouseEnter = () => {
          if (!playingRef.current) {
            setHasHovered(true);
            triggerAnimation();
          }
        };

        const handleMouseLeave = () => {
          setHasHovered(false);
        };

        hoverHandlerRef.current = handleMouseEnter;
        leaveHandlerRef.current = handleMouseLeave;

        ref.current.addEventListener("mouseenter", handleMouseEnter);
        ref.current.addEventListener("mouseleave", handleMouseLeave);
      }

      // Set up scroll trigger if needed
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: scrollTriggerStart,
        once: triggerOnce,
        onEnter: () => {
          // Already triggered on load, but can re-trigger if needed
          if (triggerOnce) return;
          triggerAnimation();
        },
      });

      return () => {
        // Cleanup
        st.kill();
        removeHover();
        window.removeEventListener("scroll", updateAutoAnimation);
        window.removeEventListener("resize", updateAutoAnimation);

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        if (tlRef.current) {
          tlRef.current.kill();
          tlRef.current = null;
        }
        if (wrappersRef.current.length) {
          wrappersRef.current.forEach((wrap) => {
            const inner = wrap.firstElementChild as HTMLElement | null;
            const orig = inner?.querySelector(
              '[data-orig="1"]'
            ) as HTMLElement | null;
            if (orig && wrap.parentNode)
              wrap.parentNode.replaceChild(orig, wrap);
          });
          wrappersRef.current = [];
        }
        try {
          splitRef.current?.revert();
        } catch {}
        splitRef.current = null;
        playingRef.current = false;
      };
    },
    {
      dependencies: [
        text,
        duration,
        maxDelay,
        ease,
        scrollTriggerStart,
        fontsLoaded,
        shuffleDirection,
        shuffleTimes,
        animationMode,
        loop,
        loopDelay,
        stagger,
        scrambleCharset,
        colorFrom,
        colorTo,
        triggerOnce,
        respectReducedMotion,
        triggerOnHover,
        autoInterval,
        onShuffleComplete,
      ],
      scope: ref,
    }
  );

  const baseTw =
    "inline-block whitespace-normal break-words will-change-transform uppercase leading-none"; // Removed text-2xl
  const userHasFont = useMemo(
    () => className && /font[-[]/i.test(className),
    [className]
  );

  const fallbackFont = useMemo(
    () => (userHasFont ? {} : { fontFamily: `'Press Start 2P', sans-serif` }),
    [userHasFont]
  );

  const commonStyle = useMemo(
    () => ({
      textAlign,
      ...fallbackFont,
      ...style,
      lineHeight: 1, // Force line height to 1
      margin: 0, // Remove any margins
      padding: 0, // Remove any padding
    }),
    [textAlign, fallbackFont, style]
  );

  const classes = useMemo(
    () => `${baseTw} ${ready ? "visible" : "invisible"} ${className}`.trim(),
    [baseTw, ready, className]
  );
  const Tag = (tag || "p") as keyof JSX.IntrinsicElements;

  return React.createElement(
    Tag,
    { ref: ref as any, className: classes, style: commonStyle },
    text
  );
};

export default Shuffle;
