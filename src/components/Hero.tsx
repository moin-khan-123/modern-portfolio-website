// components/Hero.tsx
import About from "./About";
import { useEffect, useState } from "react";
import ScrollVelocity from "./ScrollVelocity";
import Shuffle from "./Shuffle";

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
    mobile: 15, // < 640px (phones)
    tablet: 25, // 640px - 1024px (tablets)
    laptop: 35, // 1024px - 1440px (laptops)
    desktop: 45, // >= 1440px (large screens)
  };

  // Number of copies for different screen sizes
  const copiesConfig = {
    mobile: 6, // < 640px
    tablet: 8, // 640px - 1024px
    laptop: 10, // 1024px - 1440px
    desktop: 12, // >= 1440px
  };

  // PaddingLeft configuration for different screen sizes (in rem)
  const paddingLeftConfig = {
    smallPhone: "1rem", // < 400px
    mobile: "2rem", // 400px - 640px
    tablet: "7rem", // 640px - 1024px
    laptop: "8rem", // 1024px - 1440px
    desktop: "16rem", // >= 1440px
  };

  // Font size configuration for different screen sizes
  const fontSizeConfig = {
    smallPhone: "2.5rem", // < 400px (text-4xl)
    mobile: "3rem", // 400px - 640px (text-5xl)
    tablet: "4.5rem", // 640px - 1024px (text-7xl)
    laptop: "6rem", // 1024px - 1440px (text-8xl)
    desktop: "8rem", // >= 1440px (text-9xl)
  };

  // Emoji font size configuration
  const emojiFontSizeConfig = {
    smallPhone: "1.5rem", // < 400px
    mobile: "2rem", // 400px - 640px
    tablet: "2rem", // 640px - 1024px
    laptop: "2rem", // 1024px - 1440px
    desktop: "3rem", // >= 1440px
  };

  // Emoji size configuration (width & height)
  const emojiSizeConfig = {
    smallPhone: { width: "3rem", height: "3rem" }, // < 400px
    mobile: { width: "4rem", height: "4rem" }, // 400px - 640px
    tablet: { width: "6rem", height: "6rem" }, // 640px - 1024px
    laptop: { width: "10rem", height: "8rem" }, // 1024px - 1440px
    desktop: { width: "13rem", height: "8rem" }, // >= 1440px
  };

  const getEmojiContent = () => {
    if (windowWidth === null) return "(●'◡'●)";

    if (windowWidth < 640) {
      return "'◡'";
    } else if (windowWidth >= 640 && windowWidth < 1024) {
      return "●'◡'●";
    } else {
      return "(●'◡'●)";
    }
  };
  // In Hero.tsx, update the shuffleConfig:
  const shuffleConfig = {
    shuffleDirection: "right" as const,
    duration: 0.35,
    animationMode: "evenodd" as const,
    shuffleTimes: 1,
    ease: "power3.out",
    stagger: 0.03,
    threshold: 0.1,
    triggerOnce: false,
    triggerOnHover: true,
    respectReducedMotion: true,
    textAlign: "start" as React.CSSProperties["textAlign"],
    autoInterval: 8,
  };

  const getResponsiveValues = () => {
    if (windowWidth === null) {
      return {
        velocity: speedConfig.laptop,
        numCopies: copiesConfig.laptop,
        paddingLeft: paddingLeftConfig.laptop,
        fontSize: fontSizeConfig.laptop,
        emojiFontSize: emojiFontSizeConfig.laptop,
        emojiSize: emojiSizeConfig.laptop,
        emojiContent: getEmojiContent(),
      };
    }

    if (windowWidth < 400) {
      return {
        velocity: speedConfig.mobile,
        numCopies: copiesConfig.mobile,
        paddingLeft: paddingLeftConfig.smallPhone,
        fontSize: fontSizeConfig.smallPhone,
        emojiFontSize: emojiFontSizeConfig.smallPhone,
        emojiSize: emojiSizeConfig.smallPhone,
        emojiContent: getEmojiContent(),
      };
    } else if (windowWidth >= 400 && windowWidth < 640) {
      return {
        velocity: speedConfig.mobile,
        numCopies: copiesConfig.mobile,
        paddingLeft: paddingLeftConfig.mobile,
        fontSize: fontSizeConfig.mobile,
        emojiFontSize: emojiFontSizeConfig.mobile,
        emojiSize: emojiSizeConfig.mobile,
        emojiContent: getEmojiContent(),
      };
    } else if (windowWidth >= 640 && windowWidth < 1024) {
      return {
        velocity: speedConfig.tablet,
        numCopies: copiesConfig.tablet,
        paddingLeft: paddingLeftConfig.tablet,
        fontSize: fontSizeConfig.tablet,
        emojiFontSize: emojiFontSizeConfig.tablet,
        emojiSize: emojiSizeConfig.tablet,
        emojiContent: getEmojiContent(),
      };
    } else if (windowWidth >= 1024 && windowWidth < 1440) {
      return {
        velocity: speedConfig.laptop,
        numCopies: copiesConfig.laptop,
        paddingLeft: paddingLeftConfig.laptop,
        fontSize: fontSizeConfig.laptop,
        emojiFontSize: emojiFontSizeConfig.laptop,
        emojiSize: emojiSizeConfig.laptop,
        emojiContent: getEmojiContent(),
      };
    } else {
      return {
        velocity: speedConfig.desktop,
        numCopies: copiesConfig.desktop,
        paddingLeft: paddingLeftConfig.desktop,
        fontSize: fontSizeConfig.desktop,
        emojiFontSize: emojiFontSizeConfig.desktop,
        emojiSize: emojiSizeConfig.desktop,
        emojiContent: getEmojiContent(),
      };
    }
  };

  const {
    velocity,
    numCopies,
    paddingLeft,
    fontSize,
    emojiFontSize,
    emojiSize,
    emojiContent,
  } = getResponsiveValues();

  return (
    <div className="relative min-h-screen tracking-tighter">
      <ScrollVelocity
        texts={[scrollingText]}
        velocity={velocity}
        numCopies={numCopies}
        side="left"
        parallaxClassName="z-20"
        scrollerClassName="text-[#ebebeb00] leading-none text-center whitespace-nowrap tracking-tighter text-gradient"
      />

      <ScrollVelocity
        texts={[scrollingText]}
        velocity={velocity}
        numCopies={numCopies}
        side="right"
        parallaxClassName="z-20"
        scrollerClassName="text-[#ebebeb00] leading-none text-center whitespace-nowrap tracking-tight text-gradient"
      />

      <div className="h-screen w-full flex items-center">
        <div
          className="font-black uppercase leading-none text-[#393e49] text-start"
          style={{
            paddingLeft: paddingLeft,
            fontSize: fontSize,
            lineHeight: 1,
            margin: 0,
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <div className="mb-0" style={{ lineHeight: 1 }}>
            <Shuffle
              text="WE CREATE"
              {...shuffleConfig}
              tag="div"
              style={{
                fontSize: "inherit",
                fontFamily: "inherit",
                lineHeight: "inherit",
                display: "block",
                textAlign: "start",
                margin: 0,
                padding: 0,
              }}
              className="font-black uppercase text-start leading-none"
            />
          </div>

          <div
            className="flex items-center gap-0 mb-0"
            style={{ lineHeight: 1 }}
          >
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

          <div style={{ lineHeight: 1 }}>
            <Shuffle
              text="PRESENTATIONS"
              {...shuffleConfig}
              tag="div"
              style={{
                fontSize: "inherit",
                fontFamily: "inherit",
                lineHeight: "inherit",
                display: "block",
                textAlign: "start",
                margin: 0,
                padding: 0,
              }}
              className="font-black uppercase text-start leading-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
