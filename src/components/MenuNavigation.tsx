// MenuNavigation.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoMenuSharp, IoCloseSharp, IoFunnelSharp } from "react-icons/io5";

// Interface for shuffle element with custom properties
interface ShuffleElement extends HTMLElement {
  _shuffleTimeout?: NodeJS.Timeout;
  _shuffleInterval?: NodeJS.Timeout;
  _shuffleHandler?: (event: MouseEvent) => void;
}

export default function MenuNavigation() {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const menuLogoRef = useRef<HTMLDivElement>(null);
  const menuLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const menuContentRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuActive) {
        setIsMenuActive(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuActive]);

  // Animate menu items
  useEffect(() => {
    if (isMenuActive) {
      menuItemsRef.current.forEach((item, index) => {
        if (item) {
          setTimeout(() => {
            item.style.transform = "translateX(0)";
            item.style.opacity = "1";
          }, 100 + index * 80);
        }
      });
    } else {
      menuItemsRef.current.forEach((item, index) => {
        if (item) {
          setTimeout(() => {
            item.style.transform = "translateX(-30px)";
            item.style.opacity = "0";
          }, index * 30);
        }
      });
    }
  }, [isMenuActive]);

  // Fix: Ensure menu logo stays above everything when menu is open
  useEffect(() => {
    if (menuLogoRef.current) {
      if (isMenuActive) {
        menuLogoRef.current.style.zIndex = "9999";
      } else {
        menuLogoRef.current.style.zIndex = "";
      }
    }
  }, [isMenuActive]);

  // Character shuffle effect (from original code)
  const addShuffleEffect = (element: HTMLElement) => {
    const text = element.textContent || "";
    const chars = Array.from(text);

    // Create character elements if not exists
    if (!element.querySelector(".char")) {
      element.innerHTML = "";
      chars.forEach((char, _index) => {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = char;
        span.style.display = "inline-block";
        span.style.transition =
          "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
        element.appendChild(span);
      });
    }

    const charElements = element.querySelectorAll(".char");
    if (!charElements.length) return;

    const originalText = Array.from(charElements).map(
      (char: Element) => char.textContent || ""
    );
    const shuffleInterval = 15;
    const resetDelay = 100;
    const additionalDelay = 50;

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
      }, shuffleInterval);

      char._shuffleTimeout = setTimeout(() => {
        if (char._shuffleInterval) clearInterval(char._shuffleInterval);
        char.textContent = originalText[index];
        char.style.color = originalColor;

        char.style.transform = "translateY(-5px)";
        setTimeout(() => {
          char.style.transform = "translateY(0)";
        }, 150);
      }, resetDelay + index * additionalDelay);
    });
  };

  // Setup hover effects when menu opens
  useEffect(() => {
    if (isMenuActive) {
      // Add shuffle effect to main menu items
      setTimeout(() => {
        menuLinkRefs.current.forEach((link) => {
          if (link) {
            // Split text into characters
            const text = link.textContent || "";
            if (!link.querySelector(".char")) {
              link.innerHTML = "";
              text.split("").forEach((char, _index) => {
                const span = document.createElement("span");
                span.className = "char";
                span.textContent = char;
                span.style.display = "inline-block";
                span.style.transition =
                  "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
                link.appendChild(span);
              });
            }

            // Add hover event
            const handleMouseEnter = () => {
              addShuffleEffect(link);
            };

            link.addEventListener("mouseenter", handleMouseEnter);
            // Store the handler for cleanup
            (link as ShuffleElement)._shuffleHandler = handleMouseEnter;
          }
        });

        // Add shuffle effect to bottom menu items (discord, Opensea, 2024)
        menuContentRefs.current.forEach((content) => {
          if (content) {
            // Split text into characters
            const text = content.textContent || "";
            if (!content.querySelector(".char")) {
              content.innerHTML = "";
              text.split("").forEach((char, _index) => {
                const span = document.createElement("span");
                span.className = "char";
                span.textContent = char;
                span.style.display = "inline-block";
                span.style.transition =
                  "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
                content.appendChild(span);
              });
            }

            // Add hover event
            const handleMouseEnter = () => {
              addShuffleEffect(content);
            };

            content.addEventListener("mouseenter", handleMouseEnter);
            // Store the handler for cleanup
            (content as ShuffleElement)._shuffleHandler = handleMouseEnter;
          }
        });
      }, 500);
    } else {
      // Clean up event listeners
      menuLinkRefs.current.forEach((link) => {
        const shuffleLink = link as ShuffleElement;
        if (shuffleLink && shuffleLink._shuffleHandler) {
          shuffleLink.removeEventListener(
            "mouseenter",
            shuffleLink._shuffleHandler
          );
          delete shuffleLink._shuffleHandler;
        }
      });

      menuContentRefs.current.forEach((content) => {
        const shuffleContent = content as ShuffleElement;
        if (shuffleContent && shuffleContent._shuffleHandler) {
          shuffleContent.removeEventListener(
            "mouseenter",
            shuffleContent._shuffleHandler
          );
          delete shuffleContent._shuffleHandler;
        }
      });
    }
  }, [isMenuActive]);

  const menuItems = [
    { label: "Story", active: false },
    { label: "protocol", active: false },
    { label: "journal", active: false },
    { label: "Contact", active: false },
    { label: "Gallery", active: true },
    { label: "About", active: false },
  ];

  return (
    <>
      {/* Add the cursor trail component */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap");

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body {
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          font-family: "Roboto Mono", monospace;
          background-color: #f4f4f4;
        }

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
      `}</style>

      {/* Main wrapper with margin */}
      <div
        className="m-8"
        style={{ width: "calc(100% - 4rem)", height: "calc(100vh - 4rem)" }}
      >
        {/* Navigation Bar */}
        <nav
          className="fixed bg-amber-400 h-auto flex justify-between items-center z-98"
          style={{
            top: "1rem",
            left: "1rem",
            right: "1rem",
            padding: "1rem 2rem 1rem 2rem",
            borderRadius: "8px",
          }}
        >
          <div
            ref={menuLogoRef}
            className="p-5 cursor-pointer transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:translate-x-[5px]"
            onClick={() => setIsMenuActive(true)}
          >
            <IoMenuSharp className="text-[32px]" />
          </div>
          <p className="uppercase leading-[100%] cursor-pointer tracking-[3px] text-[14px]">
            collection
          </p>
        </nav>

        {/* FIX: Added backdrop to prevent interaction issues */}
        {isMenuActive && (
          <div
            className="fixed inset-0 z-97"
            onClick={() => setIsMenuActive(false)}
            style={{ background: "transparent" }}
          />
        )}

        {/* Menu Panel */}
        <div
          className={`fixed p-6 w-[45%] h-[96.5%] flex justify-center items-center z-9998 transition-all duration-600 ${
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
            className={`w-full h-full bg-black text-white rounded-[20px] p-8 flex overflow-hidden transition-all duration-500 ${
              isMenuActive
                ? "translate-x-0 opacity-100"
                : "-translate-x-5 opacity-0"
            }`}
            style={{
              transition:
                "transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
            }}
          >
            {/* Menu Main */}
            <div className="flex-5  flex flex-col justify-between border border-white/12.5">
              {/* Menu Top */}
              <div
                className="flex border-t border-white/12.5"
                style={{ padding: " 1rem 2rem " }}
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
                  <p className="text-[14px] tracking-[3px] uppercase">
                    discover
                  </p>
                </div>
                <div className="flex-4 flex flex-col">
                  {menuItems.map((item, index) => (
                    <div
                      key={index}
                      ref={(el) => {
                        menuItemsRef.current[index] = el;
                      }}
                      className={`relative opacity-0 -translate-x-[50px] transition-all duration-400 group ${
                        item.active ? "menu-item-active" : ""
                      }`}
                      style={{
                        transition:
                          "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        marginTop: index === 0 ? "60px" : "0",
                        marginBottom:
                          index === menuItems.length - 1 ? "0" : "10px",
                          marginLeft:"20px"
                      }}
                    >
                      <div className="relative">
                        <div
                          className={`absolute top-0 left-0 h-full w-0 bg-white opacity-0 z-0 transition-all duration-400 group-hover:w-[calc(90%)] group-hover:opacity-100 ${
                            item.active
                              ? "bg-amber-400! w-[calc(90%)]! opacity-100!"
                              : ""
                          }`}
                          style={{
                            clipPath:
                              "polygon(0 0, 100% 0, 100% 80%, 95% 100%, 0 100%)",
                            transition:
                              "width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s",
                          }}
                        />
                        <a
                          ref={(el) => {
                            menuLinkRefs.current[index] = el;
                          }}
                          href="#"
                          className={`relative no-underline text-white text-[48px] tracking-[-2px] font-bold pl-2.5 z-2 transition-all duration-300 group-hover:text-black group-hover:tracking-[-1.5px] ${
                            item.active ? "text-black!" : ""
                          }`}
                          style={{
                            transition:
                              "color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), letter-spacing 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                            lineHeight: "1.2",
                            // Add padding to all items except first
                            paddingTop: index === 0 ? "0" : "10px",
                            paddingBottom: index === 0 ? "0" : "10px",
                            paddingLeft: "20px",
                          }}
                        >
                          {item.label}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Menu Bottom */}
              <div className="flex flex-col">
                {[
                  { title: "connect", content: "discord" },
                  { title: "Buy On", content: "Opensea" },
                  { title: "US-EN", content: "2024" },
                ].map((subItem, index) => (
                  <div
                    key={index}
                    className={`w-full flex gap-4 border-t border-white/12.5 p-4 px-8 transition-all duration-400 ${
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
                    <div className="flex-1">
                      <p
                        className="text-[14px] tracking-[3px] uppercase"
                        style={{ padding: " .3rem 2rem " }}
                      >
                        {subItem.title}
                      </p>
                    </div>
                    <div className="flex-4 pl-8">
                      <p
                        ref={(el) => {
                          menuContentRefs.current[index] = el;
                        }}
                        style={{ padding: " .3rem .8rem " }}
                        className="relative w-max  text-[14px] tracking-[3px] uppercase transition-transform duration-300 after:content-[''] after:absolute after:top-0 after:left-0 after:w-0 after:h-full after:bg-white after:mix-blend-difference hover:after:w-full after:transition-all after:duration-600"
                      >
                        {subItem.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Sidebar */}
            <div
              className="flex-[0.2] flex flex-col justify-between"
              style={{ padding: "1rem" }}
            >
              <div
                className=" cursor-pointer flex justify-center items-center transition-all duration-400 relative overflow-hidden group before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-0 before:h-0  before:rounded-full before:-translate-x-1/2 before:-translate-y-1/2 hover:before:w-[200%] hover:before:h-[200%] before:transition-all before:duration-600"
                onClick={() => setIsMenuActive(false)}
              >
                <IoCloseSharp
                  className={`text-[40px] transition-all duration-400 relative z-1 group-hover:rotate-90 group-hover:scale-110 group-hover:text-amber-400 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] ${
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
                <IoFunnelSharp className="text-[24px] transition-transform duration-300 hover:rotate-15 hover:scale-110" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .menu-container {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
