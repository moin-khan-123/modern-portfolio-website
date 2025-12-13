// components/Hero.tsx
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import ScrollVelocity from "./ScrollVelocity";
import Shuffle from "./Shuffle";

export default function Hero() {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const svgRef1 = useRef<SVGSVGElement>(null);
  const svgRef2 = useRef<SVGSVGElement>(null);
  const animationRef1 = useRef<gsap.core.Tween | null>(null);
  const animationRef2 = useRef<gsap.core.Tween | null>(null);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // This effect runs once on component mount and updates when window resizes
  // It captures the current window width for responsive calculations
  useEffect(() => {
    const update = () =>
      setWindowWidth(typeof window !== "undefined" ? window.innerWidth : null);
    update(); // Initial call to set window width
    if (typeof window !== "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
    return () => {};
  }, []);

  const scrollingText = `Moin khan Full stack developer `;

  // SPEED CONFIGURATION - Controls the animation velocity for different devices
  // IMPORTANT: These values are in pixels per second
  // If you increase these values online, the scrolling will become faster
  // If you decrease them, the scrolling will slow down
  const speedConfig = {
    mobile: 15, // < 640px - Kept slower for mobile to save battery and prevent motion sickness
    tablet: 25, // 640px - 1024px - Moderate speed for tablets
    laptop: 35, // 1024px - 1440px - Faster for laptops where users expect smooth animations
    desktop: 45, // >= 1440px - Fastest for large screens with better GPUs
  };

  // NUMBER OF COPIES CONFIG - Controls how many times text repeats in the marquee
  // More copies = longer continuous scrolling, but uses more memory
  const copiesConfig = {
    mobile: 6, // < 640px - Fewer copies on mobile to save performance
    tablet: 8, // 640px - 1024px - More copies for wider screens
    laptop: 10, // 1024px - 1440px - Even more for laptops
    desktop: 12, // >= 1440px - Most copies for largest screens
  };

  // ROTATION SPEED CONFIG - Controls SVG rotation speed (seconds per full rotation)
  // Lower number = faster rotation, Higher number = slower rotation
  // This affects both rotating SVGs equally
  const rotationSpeedConfig = {
    mobile: 8, // Slower on mobile (8 seconds per rotation) - Prevents motion sickness
    tablet: 6, // Moderate speed for tablets
    laptop: 5, // Standard speed for laptops
    desktop: 7, // Faster on desktop - Looks impressive on large screens
  };

  // SVG SIZE CONFIG - Controls the physical dimensions of rotating SVGs
  // These values are in pixels (width x height)
  const svgSizeConfig = {
    mobile: { width: 40, height: 40 }, // Small on mobile to not overwhelm small screens
    tablet: { width: 60, height: 60 }, // Medium on tablets
    laptop: { width: 80, height: 80 }, // Standard size for laptops
    desktop: { width: 100, height: 100 }, // Large on desktop for visual impact
  };

  // SVG POSITIONING CONFIG - Controls where SVGs appear relative to text
  // First SVG appears between "WE" and "CREATE"
  // Second SVG appears after "PRESENTATIONS"
  const svgPositionConfig = {
    // First SVG (between WE and CREATE)
    firstSvg: {
      mobile: { top: "2rem", left: "4rem" }, // Positioned for mobile screens
      tablet: { top: "2rem", left: "6rem" }, // Adjusted for tablet
      laptop: { top: "1rem", left: "8rem" }, // Optimized for laptop
      desktop: { top: "0.5rem", left: "10rem" }, // Final position for desktop
    },
    // Second SVG (after PRESENTATIONS)
    secondSvg: {
      mobile: { top: "12rem", right: "1rem" }, // Bottom right on mobile
      tablet: { top: "10rem", right: "2rem" }, // Moved up on tablet
      laptop: { top: "8rem", right: "4rem" }, // Higher on laptop
      desktop: { top: "6rem", right: "6rem" }, // Final desktop position
    },
  };

  // PADDING LEFT CONFIG - Controls left spacing of main text block
  // Important: These values are in rem units (1rem = 16px typically)
  // Adjusting these changes the horizontal position of entire text section
  const paddingLeftConfig = {
    smallPhone: "1rem", // < 400px - Minimal padding for tiny screens
    mobile: "1.2rem", // 400px - 640px - Moderate padding
    tablet: "7rem", // 640px - 1024px - More padding for tablets
    laptop: "8rem", // 1024px - 1440px - Standard desktop padding
    desktop: "16rem", // >= 1440px - Large padding for wide screens
  };

  // FONT SIZE CONFIG - Controls main text size
  // Design considerations:
  // - Mobile: Larger text for readability on small screens
  // - Desktop: Giant text for visual impact
  const fontSizeConfig = {
    smallPhone: "2.5rem", // < 400px (text-4xl equivalent)
    mobile: "3rem", // 400px - 640px (text-5xl equivalent)
    tablet: "4.5rem", // 640px - 1024px (text-7xl equivalent)
    laptop: "6rem", // 1024px - 1440px (text-8xl equivalent)
    desktop: "8rem", // >= 1440px (text-9xl equivalent)
  };

  // EMOJI FONT SIZE CONFIG - Controls text size inside emoji circle
  // This is separate from the circle container size
  const emojiFontSizeConfig = {
    smallPhone: "1.5rem", // < 400px - Small text for small circle
    mobile: "2rem", // 400px - 640px - Slightly larger
    tablet: "2rem", // 640px - 1024px - Same as mobile for tablets
    laptop: "2rem", // 1024px - 1440px - Consistent size
    desktop: "3rem", // >= 1440px - Larger on big screens
  };

  // EMOJI SIZE CONFIG - Controls the container size for the emoji
  // This is the yellow circle that contains the emoji text
  const emojiSizeConfig = {
    smallPhone: { width: "3rem", height: "3rem" }, // < 400px - Small circle
    mobile: { width: "4rem", height: "4rem" }, // 400px - 640px - Medium circle
    tablet: { width: "7rem", height: "6rem" }, // 640px - 1024px - Oval shape
    laptop: { width: "10rem", height: "8rem" }, // 1024px - 1440px - Wide oval
    desktop: { width: "13rem", height: "8rem" }, // >= 1440px - Very wide oval
  };

  // DYNAMIC EMOJI CONTENT - Changes emoji based on screen size
  // This creates progressive enhancement:
  // - Mobile: Simple emoji to save space
  // - Tablet: Medium complexity
  // - Desktop: Full emoji for best experience
  const getEmojiContent = () => {
    if (windowWidth === null) return "(●'◡'●)"; // Default fallback

    if (windowWidth < 640) {
      return "'◡'"; // Simple smile for mobile
    } else if (windowWidth >= 640 && windowWidth < 1024) {
      return "●'◡'●"; // Medium complexity for tablet
    } else {
      return "(●'◡'●)"; // Full emoji for desktop
    }
  };

  // SHUFFLE ANIMATION CONFIG - Controls the text shuffle animation
  // Key parameters you can adjust:
  // - duration: How long the shuffle animation lasts (in seconds)
  // - stagger: Delay between each character animation
  // - autoInterval: Time between automatic shuffles
  const shuffleConfig = {
    shuffleDirection: "right" as const, // Direction characters move during shuffle
    duration: 0.35, // Animation duration in seconds
    animationMode: "evenodd" as const, // Pattern for character animation
    shuffleTimes: 1, // Number of times to shuffle
    ease: "power3.out", // Animation easing function
    stagger: 0.03, // Delay between each character animation
    threshold: 0.1, // Intersection Observer threshold
    triggerOnce: false, // Whether animation happens only once
    triggerOnHover: true, // Triggers animation on hover
    respectReducedMotion: true, // Respects user's motion preferences
    textAlign: "start" as React.CSSProperties["textAlign"], // Text alignment
    autoInterval: 8, // Time between automatic shuffles (seconds)
  };

  // RESPONSIVE VALUE CALCULATOR
  // This function determines which set of values to use based on screen width
  // The design adapts at these breakpoints:
  // - < 400px: Small phones (iPhone SE, small Android)
  // - 400px - 640px: Standard mobile phones
  // - 640px - 1024px: Tablets and small laptops
  // - 1024px - 1440px: Laptops and desktops
  // - >= 1440px: Large desktops and monitors
  const getResponsiveValues = () => {
    if (windowWidth === null) {
      // Default values before window width is known (server-side rendering)
      return {
        velocity: speedConfig.laptop,
        numCopies: copiesConfig.laptop,
        paddingLeft: paddingLeftConfig.laptop,
        fontSize: fontSizeConfig.laptop,
        emojiFontSize: emojiFontSizeConfig.laptop,
        emojiSize: emojiSizeConfig.laptop,
        emojiContent: getEmojiContent(),
        rotationSpeed: rotationSpeedConfig.laptop,
        svgSize: svgSizeConfig.laptop,
        firstSvgPosition: svgPositionConfig.firstSvg.laptop,
        secondSvgPosition: svgPositionConfig.secondSvg.laptop,
      };
    }

    // Small phones (iPhone SE, small Android devices)
    if (windowWidth < 400) {
      return {
        velocity: speedConfig.mobile,
        numCopies: copiesConfig.mobile,
        paddingLeft: paddingLeftConfig.smallPhone,
        fontSize: fontSizeConfig.smallPhone,
        emojiFontSize: emojiFontSizeConfig.smallPhone,
        emojiSize: emojiSizeConfig.smallPhone,
        emojiContent: getEmojiContent(),
        rotationSpeed: rotationSpeedConfig.mobile,
        svgSize: svgSizeConfig.mobile,
        firstSvgPosition: svgPositionConfig.firstSvg.mobile,
        secondSvgPosition: svgPositionConfig.secondSvg.mobile,
      };
    }
    // Standard mobile phones (most smartphones)
    else if (windowWidth >= 400 && windowWidth < 640) {
      return {
        velocity: speedConfig.mobile,
        numCopies: copiesConfig.mobile,
        paddingLeft: paddingLeftConfig.mobile,
        fontSize: fontSizeConfig.mobile,
        emojiFontSize: emojiFontSizeConfig.mobile,
        emojiSize: emojiSizeConfig.mobile,
        emojiContent: getEmojiContent(),
        rotationSpeed: rotationSpeedConfig.mobile,
        svgSize: svgSizeConfig.mobile,
        firstSvgPosition: svgPositionConfig.firstSvg.mobile,
        secondSvgPosition: svgPositionConfig.secondSvg.mobile,
      };
    }
    // Tablets and small laptops (iPad, small screens)
    else if (windowWidth >= 640 && windowWidth < 1024) {
      return {
        velocity: speedConfig.tablet,
        numCopies: copiesConfig.tablet,
        paddingLeft: paddingLeftConfig.tablet,
        fontSize: fontSizeConfig.tablet,
        emojiFontSize: emojiFontSizeConfig.tablet,
        emojiSize: emojiSizeConfig.tablet,
        emojiContent: getEmojiContent(),
        rotationSpeed: rotationSpeedConfig.tablet,
        svgSize: svgSizeConfig.tablet,
        firstSvgPosition: svgPositionConfig.firstSvg.tablet,
        secondSvgPosition: svgPositionConfig.secondSvg.tablet,
      };
    }
    // Laptops and standard desktops (most common screen size)
    else if (windowWidth >= 1024 && windowWidth < 1440) {
      return {
        velocity: speedConfig.laptop,
        numCopies: copiesConfig.laptop,
        paddingLeft: paddingLeftConfig.laptop,
        fontSize: fontSizeConfig.laptop,
        emojiFontSize: emojiFontSizeConfig.laptop,
        emojiSize: emojiSizeConfig.laptop,
        emojiContent: getEmojiContent(),
        rotationSpeed: rotationSpeedConfig.laptop,
        svgSize: svgSizeConfig.laptop,
        firstSvgPosition: svgPositionConfig.firstSvg.laptop,
        secondSvgPosition: svgPositionConfig.secondSvg.laptop,
      };
    }
    // Large desktops and monitors (4K screens, ultrawides)
    else {
      return {
        velocity: speedConfig.desktop,
        numCopies: copiesConfig.desktop,
        paddingLeft: paddingLeftConfig.desktop,
        fontSize: fontSizeConfig.desktop,
        emojiFontSize: emojiFontSizeConfig.desktop,
        emojiSize: emojiSizeConfig.desktop,
        emojiContent: getEmojiContent(),
        rotationSpeed: rotationSpeedConfig.desktop,
        svgSize: svgSizeConfig.desktop,
        firstSvgPosition: svgPositionConfig.firstSvg.desktop,
        secondSvgPosition: svgPositionConfig.secondSvg.desktop,
      };
    }
  };

  // Get responsive values
  const {
    velocity,
    numCopies,
    paddingLeft,
    fontSize,
    emojiFontSize,
    emojiSize,
    emojiContent,
    rotationSpeed,
    svgSize,
    firstSvgPosition,
    secondSvgPosition,
  } = getResponsiveValues();

  // Initialize GSAP animations for SVG rotation
  useEffect(() => {
    if (svgRef1.current && svgRef2.current) {
      // Create rotation animations
      animationRef1.current = gsap.to(svgRef1.current, {
        rotation: 360,
        duration: rotationSpeed,
        ease: "linear",
        repeat: -1,
      });

      animationRef2.current = gsap.to(svgRef2.current, {
        rotation: 360,
        duration: rotationSpeed,
        ease: "linear",
        repeat: -1,
      });
    }
    // Clean up animations on unmount
    return () => {
      if (animationRef1.current) animationRef1.current.kill();
      if (animationRef2.current) animationRef2.current.kill();
    };
  }, [rotationSpeed]);

  // Handle scroll wheel event to speed up rotation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Speed up both SVGs to double speed
      if (animationRef1.current) {
        animationRef1.current.timeScale(4);
      }
      if (animationRef2.current) {
        animationRef2.current.timeScale(4);
      }

      // Clear previous timeout
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }

      // Reset to normal speed after 1 second of no scrolling
      wheelTimeoutRef.current = setTimeout(() => {
        if (animationRef1.current) {
          animationRef1.current.timeScale(1);
        }
        if (animationRef2.current) {
          animationRef2.current.timeScale(1);
        }
      }, 1000);
    };

    // Add wheel event listener
    window.addEventListener('wheel', handleWheel, { passive: true });

    // Clean up event listener
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, []);

  // Handle hover events for SVG speed control
  const handleSvgHover = (svgNumber: number, isHovering: boolean) => {
    if (svgNumber === 1 && animationRef1.current) {
      animationRef1.current.timeScale(isHovering ? 4 : 1);
    }
    if (svgNumber === 2 && animationRef2.current) {
      animationRef2.current.timeScale(isHovering ? 4 : 1);
    }
  };

  return (
    <div className="relative min-h-screen tracking-tighter overflow-hidden">
      {/* TOP SCROLLING TEXT - Creates parallax effect */}
      <ScrollVelocity
        texts={[scrollingText]}
        velocity={velocity}
        numCopies={numCopies}
        side="left"
        parallaxClassName="z-20"
        scrollerClassName="text-[#ebebeb00] leading-none text-center whitespace-nowrap tracking-tighter text-gradient"
      />

      {/* BOTTOM SCROLLING TEXT - Mirrors top for symmetry */}
      <ScrollVelocity
        texts={[scrollingText]}
        velocity={velocity}
        numCopies={numCopies}
        side="right"
        parallaxClassName="z-20"
        scrollerClassName="text-[#ebebeb00] leading-none text-center whitespace-nowrap tracking-tight text-gradient"
      />

      {/* MAIN CONTENT SECTION */}
      <div className="h-screen w-full flex items-center">
        <div
          className="font-black uppercase leading-none text-[#393e49] text-start relative"
          style={{
            paddingLeft: paddingLeft,
            fontSize: fontSize,
            lineHeight: 1,
            margin: 0,
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          {/* LINE 1: WE (SVG 1) CREATE */}
          <div
            className="mb-0 flex items-center relative"
            style={{ lineHeight: 1 }}
          >
            {/* "WE" Text with Shuffle Animation */}
            <Shuffle
              text="WE"
              {...shuffleConfig}
              tag="span"
              style={{
                fontSize: "inherit",
                fontFamily: "inherit",
                lineHeight: "inherit",
                display: "inline-block",
                textAlign: "start",
                margin: 0,
                padding: 0,
              }}
              className="font-black uppercase text-start leading-none"
            />

            {/* First Rotating SVG - Positioned between WE and CREATE */}
            <div
              className="relative mx-2 flex items-center justify-center"
              style={{
                width: svgSize.width,
                height: svgSize.height,
              }}
              onMouseEnter={() => handleSvgHover(1, true)}
              onMouseLeave={() => handleSvgHover(1, false)}
            >
              <svg
                ref={svgRef1}
                style={{
                  width: svgSize.width,
                  height: svgSize.height,
                }}
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* SVG Paths - All paths form the sunburst/compass design */}
                <path
                  d="M29.9744 20.88C26.804 20.88 24.21 18.288 24.21 15.12V0H35.6909V15.12C35.7389 18.288 33.1929 20.88 29.9744 20.88Z"
                  fill="#ffb900"
                />
                <path
                  d="M29.9744 39.1201C26.804 39.1201 24.21 41.7121 24.21 44.8801V60.0001H35.6909V44.8801C35.7389 41.6641 33.1929 39.1201 29.9744 39.1201Z"
                  fill="#ffb900"
                />
                <path
                  d="M23.5357 23.5677C21.2779 25.8237 17.6751 25.8237 15.4174 23.5677L4.70508 12.8637L12.8234 4.75171L23.5357 15.4557C25.7934 17.6637 25.7934 21.3117 23.5357 23.5677Z"
                  fill="#ffb900"
                />
                <path
                  d="M36.458 36.4315C34.2002 38.6875 34.2002 42.2875 36.458 44.5435L47.1703 55.2475L55.2886 47.1355L44.5763 36.4315C42.3185 34.1755 38.6677 34.1755 36.458 36.4315Z"
                  fill="#ffb900"
                />
                <path
                  d="M20.8962 29.9996C20.8962 33.1676 18.3022 35.7596 15.1317 35.7596H0V24.2876H15.1317C18.3022 24.2396 20.8962 26.8316 20.8962 29.9996Z"
                  fill="#ffb900"
                />
                <path
                  d="M39.1035 29.9996C39.1035 33.1676 41.6975 35.7596 44.868 35.7596H59.9997V24.2876H44.868C41.6975 24.2396 39.1035 26.8316 39.1035 29.9996Z"
                  fill="#ffb900"
                />
                <path
                  d="M23.5357 36.4315C25.7934 38.6875 25.7934 42.2875 23.5357 44.5435L12.8234 55.2475L4.70508 47.1355L15.4174 36.4315C17.6751 34.1755 21.2779 34.1755 23.5357 36.4315Z"
                  fill="#ffb900"
                />
                <path
                  d="M36.458 23.5677C38.7157 25.8237 42.3185 25.8237 44.5763 23.5677L55.2886 12.8637L47.1703 4.75171L36.458 15.4557C34.2002 17.6637 34.2002 21.3117 36.458 23.5677Z"
                  fill="#ffb900"
                />
              </svg>
            </div>

            {/* "CREATE" Text with Shuffle Animation */}
            <Shuffle
              text="CREATE"
              {...shuffleConfig}
              tag="span"
              style={{
                fontSize: "inherit",
                fontFamily: "inherit",
                lineHeight: "inherit",
                display: "inline-block",
                textAlign: "start",
                margin: 0,
                padding: 0,
              }}
              className="font-black uppercase text-start leading-none"
            />
          </div>

          {/* LINE 2: (●'◡'●) EYE OPENING */}
          <div
            className="flex items-center gap-0 mb-0"
            style={{ lineHeight: 1 }}
          >
            {/* Emoji Circle - Responsive container with emoji text */}
            <span
              className="bg-amber-400 text-white mr-4 font-light flex items-center justify-center rounded-2xl text-start leading-none"
              style={{
                fontSize: emojiFontSize,
                width: emojiSize.width,
                height: emojiSize.height,
                lineHeight: 1,
              }}
            >
              {emojiContent}
            </span>
            {/* "EYE OPENING" Text with Shuffle Animation */}
            <Shuffle
              text="EYE OPENING"
              {...shuffleConfig}
              tag="span"
              style={{
                fontSize: "inherit",
                fontFamily: "inherit",
                lineHeight: "inherit",
                display: "inline-block",
                textAlign: "start",
                margin: 0,
                padding: 0,
              }}
              className="font-black uppercase text-start leading-none"
            />
          </div>

          {/* LINE 3: PRESENTATIONS (SVG 2) */}
          <div className="flex items-center relative" style={{ lineHeight: 1 }}>
            {/* "PRESENTATIONS" Text with Shuffle Animation */}
            <Shuffle
              text="PRESENTATIONS"
              {...shuffleConfig}
              tag="span"
              style={{
                fontSize: "inherit",
                fontFamily: "inherit",
                lineHeight: "inherit",
                display: "inline-block",
                textAlign: "start",
                margin: 0,
                padding: 0,
              }}
              className="font-black uppercase text-start leading-none"
            />

            {/* Second Rotating SVG - Positioned after PRESENTATIONS */}
            <div
              className="relative ml-4 flex items-center justify-center"
              style={{
                width: svgSize.width * 1.25, // 25% larger than first SVG
                height: svgSize.height * 1.25,
              }}
              onMouseEnter={() => handleSvgHover(2, true)}
              onMouseLeave={() => handleSvgHover(2, false)}
            >
              <svg
                ref={svgRef2}
                style={{
                  width: svgSize.width * 1.25,
                  height: svgSize.height * 1.25,
                }}
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* SVG Paths - All paths form the sunburst/compass design */}
                <path
                  d="M29.9744 20.88C26.804 20.88 24.21 18.288 24.21 15.12V0H35.6909V15.12C35.7389 18.288 33.1929 20.88 29.9744 20.88Z"
                  fill="#ffb900"
                />
                <path
                  d="M29.9744 39.1201C26.804 39.1201 24.21 41.7121 24.21 44.8801V60.0001H35.6909V44.8801C35.7389 41.6641 33.1929 39.1201 29.9744 39.1201Z"
                  fill="#ffb900"
                />
                <path
                  d="M23.5357 23.5677C21.2779 25.8237 17.6751 25.8237 15.4174 23.5677L4.70508 12.8637L12.8234 4.75171L23.5357 15.4557C25.7934 17.6637 25.7934 21.3117 23.5357 23.5677Z"
                  fill="#ffb900"
                />
                <path
                  d="M36.458 36.4315C34.2002 38.6875 34.2002 42.2875 36.458 44.5435L47.1703 55.2475L55.2886 47.1355L44.5763 36.4315C42.3185 34.1755 38.6677 34.1755 36.458 36.4315Z"
                  fill="#ffb900"
                />
                <path
                  d="M20.8962 29.9996C20.8962 33.1676 18.3022 35.7596 15.1317 35.7596H0V24.2876H15.1317C18.3022 24.2396 20.8962 26.8316 20.8962 29.9996Z"
                  fill="#ffb900"
                />
                <path
                  d="M39.1035 29.9996C39.1035 33.1676 41.6975 35.7596 44.868 35.7596H59.9997V24.2876H44.868C41.6975 24.2396 39.1035 26.8316 39.1035 29.9996Z"
                  fill="#ffb900"
                />
                <path
                  d="M23.5357 36.4315C25.7934 38.6875 25.7934 42.2875 23.5357 44.5435L12.8234 55.2475L4.70508 47.1355L15.4174 36.4315C17.6751 34.1755 21.2779 34.1755 23.5357 36.4315Z"
                  fill="#ffb900"
                />
                <path
                  d="M36.458 23.5677C38.7157 25.8237 42.3185 25.8237 44.5763 23.5677L55.2886 12.8637L47.1703 4.75171L36.458 15.4557C34.2002 17.6637 34.2002 21.3117 36.458 23.5677Z"
                  fill="#ffb900"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* BOTTOM RIGHT DECORATIVE CIRCLE - Background visual element */}
        <span className="absolute bottom-0 right-0">
          <svg
            width="452"
            height="382"
            viewBox="0 0 452 382"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="465.95"
              cy="465.95"
              r="405.95"
              transform="matrix(-1 0 0 1 923.517 0)"
              stroke="#393e49"
              strokeOpacity="0.06"
              strokeWidth="120"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
