// components/MenuNavigation.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { IoMenuSharp, IoCloseSharp, IoFunnelSharp } from "react-icons/io5";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ShuffleElement extends HTMLElement {
  _shuffleTimeout?: NodeJS.Timeout;
  _shuffleInterval?: NodeJS.Timeout;
  _shuffleHandler?: (event: MouseEvent) => void;
}

interface MenuItem {
  label: string;
  href: string;
}

interface BottomMenuItem {
  title: string;
  content: string;
}

// Updated MENU_ITEMS with href paths
const MENU_ITEMS: MenuItem[] = [
  { label: "Story", href: "/story" },
  { label: "protocol", href: "/protocol" },
  { label: "journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
];

const BOTTOM_MENU_ITEMS: BottomMenuItem[] = [
  { title: "connect", content: "discord" },
  { title: "Buy On", content: "Opensea" },
  { title: "US-EN", content: "2024" },
];

const ANIMATION_CONFIG = {
  menuItemDelay: 100,
  menuItemStagger: 80,
  menuItemExitStagger: 30,
  shuffleInterval: 15,
  resetDelay: 100,
  additionalDelay: 50,
  setupDelay: 500,
};

const TRANSITION_TIMINGS = {
  cubic: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  easeOutQuart: "cubic-bezier(0.165, 0.84, 0.44, 1)",
  bouncy: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
};

export default function MenuNavigation() {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const menuLogoRef = useRef<HTMLDivElement>(null);
  const menuLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const menuContentRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const pathname = usePathname();

  const closeMenu = useCallback(() => setIsMenuActive(false), []);
  const openMenu = useCallback(() => setIsMenuActive(true), []);

  // Add click handler for links to close menu
  const handleLinkClick = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuActive) {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuActive, closeMenu]);

  useEffect(() => {
    const animateMenuItems = () => {
      menuItemsRef.current.forEach((item, index) => {
        if (!item) return;

        const delay = isMenuActive
          ? ANIMATION_CONFIG.menuItemDelay +
            index * ANIMATION_CONFIG.menuItemStagger
          : index * ANIMATION_CONFIG.menuItemExitStagger;

        setTimeout(() => {
          item.style.transform = isMenuActive
            ? "translateX(0)"
            : "translateX(-30px)";
          item.style.opacity = isMenuActive ? "1" : "0";
        }, delay);
      });
    };

    animateMenuItems();
  }, [isMenuActive]);

  useEffect(() => {
    if (menuLogoRef.current) {
      menuLogoRef.current.style.zIndex = isMenuActive ? "9999" : "";
    }
  }, [isMenuActive]);

  const createCharacterSpans = (element: HTMLElement, text: string): void => {
    if (element.querySelector(".char")) return;

    element.innerHTML = "";
    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = char;
      span.style.display = "inline-block";
      span.style.transition = `transform 0.3s ${TRANSITION_TIMINGS.cubic}, color 0.3s ${TRANSITION_TIMINGS.cubic}`;
      element.appendChild(span);
    });
  };

  const addShuffleEffect = useCallback((element: HTMLElement) => {
    const text = element.textContent || "";
    createCharacterSpans(element, text);

    const charElements = element.querySelectorAll(".char");
    if (!charElements.length) return;

    const originalText = Array.from(charElements).map(
      (char: Element) => char.textContent || ""
    );

    charElements.forEach((charElement: Element, index: number) => {
      const char = charElement as ShuffleElement;
      const originalColor = (char.style as CSSStyleDeclaration).color;

      if (char._shuffleTimeout) clearTimeout(char._shuffleTimeout);
      if (char._shuffleInterval) clearInterval(char._shuffleInterval);

      char._shuffleInterval = setInterval(() => {
        char.textContent = String.fromCharCode(
          33 + Math.floor(Math.random() * 94)
        );
        char.style.color = "#000000";
      }, ANIMATION_CONFIG.shuffleInterval);

      char._shuffleTimeout = setTimeout(() => {
        if (char._shuffleInterval) clearInterval(char._shuffleInterval);
        char.textContent = originalText[index];
        char.style.color = originalColor;

        char.style.transform = "translateY(-5px)";
        setTimeout(() => {
          char.style.transform = "translateY(0)";
        }, 150);
      }, ANIMATION_CONFIG.resetDelay + index * ANIMATION_CONFIG.additionalDelay);
    });
  }, []);

  const setupShuffleEffects = useCallback(() => {
    const setupElement = (element: HTMLElement | null) => {
      if (!element) return;

      const text = element.textContent || "";
      createCharacterSpans(element, text);

      const handleMouseEnter = () => addShuffleEffect(element);
      element.addEventListener("mouseenter", handleMouseEnter);
      (element as ShuffleElement)._shuffleHandler = handleMouseEnter;
    };

    menuLinkRefs.current.forEach(setupElement);
    menuContentRefs.current.forEach(setupElement);
  }, [addShuffleEffect]);

  const cleanupShuffleEffects = useCallback(() => {
    const cleanup = (element: HTMLElement | null) => {
      const shuffleElement = element as ShuffleElement;
      if (shuffleElement?._shuffleHandler) {
        shuffleElement.removeEventListener(
          "mouseenter",
          shuffleElement._shuffleHandler
        );
        delete shuffleElement._shuffleHandler;
      }
    };

    menuLinkRefs.current.forEach(cleanup);
    menuContentRefs.current.forEach(cleanup);
  }, []);

  useEffect(() => {
    if (isMenuActive) {
      setTimeout(setupShuffleEffects, ANIMATION_CONFIG.setupDelay);
    } else {
      cleanupShuffleEffects();
    }
  }, [isMenuActive, setupShuffleEffects, cleanupShuffleEffects]);

  return (
    <>
      <style jsx global>{`
        .char {
          display: inline-block;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
            color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes fadeTrail {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }

        .cursor-trail-dot {
          animation: fadeTrail 0.6s forwards !important;
        }

        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
          }
        }

        .pulse-glow-animation {
          animation: pulse-glow 2s infinite 0.5s;
        }

        @media (max-width: 1024px) and (min-width: 481px) {
          .menu-panel {
            width: 80% !important;
          }

          .menu-panel.menu-inactive {
            left: -50% !important;
            transform: translate(-50%, -50%) !important;
          }

          .menu-panel.menu-active {
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
          }

          .menu-item-link {
            font-size: 40px !important;
            letter-spacing: -1.5px !important;
          }

          .menu-item-link:hover {
            letter-spacing: -1px !important;
          }

          nav {
            left: 2rem !important;
            right: 2rem !important;
          }

          .menu-wrapper {
            width: calc(100% - 3rem) !important;
            height: calc(100vh - 3rem) !important;
          }

          .menu-content-container {
            padding: 1rem 1.5rem !important;
          }

          .menu-item-container {
            margin-left: 15px !important;
          }

          .bottom-menu-item {
            padding: 0.75rem 1.5rem !important;
          }

          .bottom-menu-text {
            padding: 0.25rem 1.5rem !important;
          }

          .menu-content {
            padding: 0.25rem 0.6rem !important;
          }
        }

        @media (max-width: 550px) {
          .menu-panel {
            width: 92% !important;
            height: 97% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
          }

          .menu-panel.menu-inactive {
            left: -50% !important;
            transform: translate(-50%, -50%) !important;
          }

          .menu-panel.menu-active {
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
          }

          .menu-item-link {
            font-size: 32px !important;
            letter-spacing: -1px !important;
          }

          .menu-item-link:hover {
            letter-spacing: -0.5px !important;
          }

          nav {
            left: 1rem !important;
            right: 1rem !important;
            padding: 0.1rem 1rem !important;
            border-radius: 15px !important;
          }

          .menu-logo-icon {
            font-size: 24px !important;
            padding: 0.75rem !important;
          }

          .collection-text {
            font-size: 12px !important;
            letter-spacing: 2px !important;
          }

          .menu-wrapper {
            width: calc(100% - 2rem) !important;
            height: calc(100vh - 2rem) !important;
          }

          .menu-content-container {
            padding: 0.75rem 1rem !important;
          }

          .custom-phone-size {
            padding: 0px !important;
          }

          .bottom-menu-text {
            letter-spacing: 2px !important;
          }

          .menu-close-icon {
            font-size: 30px !important;
          }

          .menu-top-text {
            font-size: 14px !important;
            padding: 0.5rem 1rem !important;
            letter-spacing: 2px !important;
          }

          .menu-bottom-text {
            margin-top: 5rem !important;
          }

          .site-bar {
            padding: 0.5rem !important;
          }

          .menu-item-container {
            margin-top: 8px !important;
            margin-bottom: 8px !important;
            margin-left: 10px !important;
          }

          .menu-item-link {
            padding-left: 10px !important;
          }

          .bottom-menu-item {
            gap: 4rem !important;
          }

          .bottom-menu-left,
          .bottom-menu-right {
            width: 100% !important;
            padding-left: 0 !important;
          }

          .bottom-menu-text {
            padding: 0.2rem 1rem !important;
          }

          .menu-content {
            padding: 0.2rem 0.5rem !important;
            letter-spacing: 2px !important;
          }

          .menu-item-container .absolute {
            width: calc(95%) !important;
          }
        }

        @media (max-width: 320px) {
          .menu-item-link {
            font-size: 26px !important;
          }

          .menu-bottom-text {
            margin-top: 3.8rem !important;
          }

          .menu-panel {
            width: 95% !important;
          }
        }

        @media (max-height: 600px) and (max-width: 1024px) {
          .menu-panel {
            height: 98% !important;
          }

          .menu-item-link {
            font-size: 28px !important;
          }

          .menu-item-container {
            margin-top: 4px !important;
            margin-bottom: 4px !important;
          }

          .menu-content-container {
            padding: 0.5rem 1rem !important;
          }
        }

        .menu-panel {
          transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
        }

        .menu-panel > div {
          max-width: 100%;
          overflow-x: hidden;
        }
      `}</style>

      <div
        // className="menu-wrapper m-8"
        // style={{ width: "calc(100% - 4rem)", height: "calc(100vh - 4rem)" }}
      >
        <nav
          className="fixed bg-amber-400 h-auto flex justify-between items-center z-28"
          style={{
            top: "1rem",
            left: "2rem",
            right: "2rem",
            padding: "1rem 2rem 1rem 2rem",
            borderRadius: "15px",
          }}
        >
          <div
            ref={menuLogoRef}
            className="menu-logo-icon p-5 cursor-pointer transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 text-white"
            onClick={openMenu}
            role="button"
            aria-label="Open menu"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && openMenu()}
          >
            <IoMenuSharp className="text-[32px]" />
          </div>
          <p className="collection-text uppercase leading-[100%] cursor-pointer tracking-[3px] text-[14px]">
            collection
          </p>
        </nav>

        {isMenuActive && (
          <div
            className="fixed inset-0 z-27"
            onClick={closeMenu}
            style={{ background: "transparent" }}
            aria-hidden="true"
          />
        )}

        <div
          className={`menu-panel fixed p-6 w-[45%] h-[96.5%] flex justify-center items-center z-28 transition-all duration-600 ${
            isMenuActive
              ? "left-8 opacity-100 visible"
              : "-left-1/2 opacity-0 invisible"
          }`}
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            transition: isMenuActive
              ? "left 0.6s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) 0.2s, visibility 0s linear 0s"
              : "left 0.6s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), visibility 0s linear 0.6s",
          }}
        >
          <div
            className={`w-full h-full bg-black text-white rounded-[15px] p-8 flex overflow-hidden transition-all duration-500 ${
              isMenuActive
                ? "translate-x-0 opacity-100"
                : "-translate-x-5 opacity-0"
            }`}
            style={{
              transition:
                "transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
            }}
          >
            <div className="flex-5 flex flex-col justify-between border border-white/12.5">
              <div
                className="custom-phone-size flex border-t border-white/12.5"
                style={{ padding: "1rem 2rem" }}
              >
                <div
                  className={`flex-1 p-8 transition-all duration-500 ${
                    isMenuActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-5"
                  }`}
                  style={{
                    transition:
                      "transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) 0.3s, opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) 0.3s",
                  }}
                >
                  <p className="menu-top-text text-[14px] tracking-[3px] uppercase">
                    discover
                  </p>
                </div>
                <div className="menu-bottom-text flex-4 flex flex-col">
                  {MENU_ITEMS.map((item, index) => {
                    // Check if current page is this menu item's page
                    const isActive = pathname === item.href;
                    // Special case: If we're on home page (/), highlight Gallery
                    const shouldHighlight =
                      isActive ||
                      (item.label === "Gallery" && pathname === "/");

                    return (
                      <div
                        key={item.label}
                        ref={(el) => {
                          menuItemsRef.current[index] = el;
                        }}
                        className={`menu-item-container relative opacity-0 -translate-x-[50px] transition-all duration-400 group ${
                          shouldHighlight ? "menu-item-active" : ""
                        }`}
                        style={{
                          transition:
                            "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          marginTop: index === 0 ? "60px" : "5px",
                          marginBottom:
                            index === MENU_ITEMS.length - 1 ? "0" : "0",
                          marginLeft: "20px",
                        }}
                      >
                        <div className="relative">
                          <div
                            className={`absolute top-0 left-0 h-full w-0 bg-white opacity-0 z-0 transition-all duration-400 group-hover:w-[calc(90%)] group-hover:opacity-100 ${
                              shouldHighlight
                                ? "bg-amber-400! w-[calc(90%)]! opacity-100!"
                                : ""
                            }`}
                            style={{
                              clipPath:
                                "polygon(0 0, 100% 0, 100% 80%, 95% 100%, 0 100%)",
                              transition:
                                "width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s",
                              pointerEvents: "none",
                            }}
                          />
                          <Link
                            ref={(el) => {
                              menuLinkRefs.current[index] = el;
                            }}
                            href={item.href}
                            onClick={handleLinkClick}
                            className={`menu-item-link relative no-underline uppercase text-white text-[48px] tracking-[-2px] font-bold pl-2.5 z-2 transition-all duration-300 group-hover:text-black group-hover:tracking-[-1.5px] ${
                              shouldHighlight ? "text-black!" : ""
                            }`}
                            style={{
                              transition:
                                "color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), letter-spacing 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                              lineHeight: "1.2",
                              paddingLeft: "20px",
                              display: "block",
                            }}
                          >
                            {item.label}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col">
                {BOTTOM_MENU_ITEMS.map((subItem, index) => (
                  <div
                    key={subItem.title}
                    className={`bottom-menu-item w-full flex gap-4 border-t border-white/12.5 p-4 px-8 transition-all duration-400 ${
                      isMenuActive
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-5"
                    }`}
                    style={{
                      transition:
                        "transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)",
                      transitionDelay: isMenuActive
                        ? `${0.4 + index * 0.1}s`
                        : `${index * 0.1}s`,
                    }}
                  >
                    <div className="bottom-menu-left flex-1">
                      <p
                        className="bottom-menu-text text-[14px] tracking-[3px] uppercase whitespace-nowrap"
                        style={{ padding: "0.3rem 2rem" }}
                      >
                        {subItem.title}
                      </p>
                    </div>
                    <div className="bottom-menu-right flex-4 pl-8">
                      <p
                        ref={(el) => {
                          menuContentRefs.current[index] = el;
                        }}
                        style={{ padding: "0.3rem 0.8rem" }}
                        className="menu-content relative w-max text-[14px] tracking-[3px] uppercase transition-transform duration-300 after:content-[''] after:absolute after:top-0 after:left-0 after:w-0 after:h-full after:bg-white after:mix-blend-difference hover:after:w-full after:transition-all after:duration-600"
                      >
                        {subItem.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="site-bar flex-[0.2] flex flex-col justify-between"
              style={{ padding: "1rem" }}
            >
              <div
                className="cursor-pointer flex justify-center items-center transition-all duration-400 relative overflow-hidden group before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-0 before:h-0 before:rounded-full before:-translate-x-1/2 before:-translate-y-1/2 hover:before:w-[200%] hover:before:h-[200%] before:transition-all before:duration-600"
                onClick={closeMenu}
                role="button"
                aria-label="Close menu"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && closeMenu()}
              >
                <IoCloseSharp
                  className={`menu-close-icon text-[40px] transition-all duration-400 relative z-1 group-hover:rotate-90 group-hover:scale-110 group-hover:text-amber-400 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] ${
                    isMenuActive ? "pulse-glow-animation" : ""
                  }`}
                  style={{
                    transition:
                      "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                    transformOrigin: "center",
                  }}
                />
              </div>
              <div
                className={`p-6 transition-all duration-400 ${
                  isMenuActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
                style={{
                  transition:
                    "transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) 0.7s, opacity 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) 0.7s",
                }}
              >
                <IoFunnelSharp className="text-[24px] transition-transform duration-300 hover:rotate-15 hover:scale-110 " />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
