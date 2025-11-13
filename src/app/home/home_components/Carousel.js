"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const carouselImages = [
  "/carousel/tcb_8.jpg",
  "/carousel/tcb_2.png",
  "/carousel/tcb_3.png",
  "/carousel/tcb_11.jpeg",
  "/carousel/tcb_4.jpeg",
  "/carousel/tcb_5.jpeg",
  "/carousel/tcb_6.jpeg",
  "/carousel/tcb_7.jpeg",
  "/carousel/tcb_9.jpeg",
  "/carousel/tcb_10.jpeg",
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef(null);
  const length = carouselImages.length;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % length);
  // const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + length) % length);

  // Detect screen size for responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    timeoutRef.current = setTimeout(nextSlide, 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex]);

  const getPositionStyle = (index) => {
    const diff = (index - currentIndex + length) % length;

    if (isMobile) {
      // Simpler mobile layout — centered card, fade transitions
      if (diff === 0) {
        return { x: 0, scale: 1, zIndex: 30, opacity: 1 };
      }
      if (diff === 1 || diff === length - 1) {
        return { x: 100 * (diff === 1 ? 1 : -1), scale: 0.9, zIndex: 20, opacity: 0.6 };
      }
      return { x: 0, scale: 0.8, zIndex: 0, opacity: 0 };
    }

    // === Desktop layout (unchanged) ===
    if (diff === 0) {
      return { x: 0, scale: 1.1, zIndex: 30, blur: "blur-0", opacity: 1 };
    }
    if (diff === length - 1) {
      return { x: -380, scale: 0.9, zIndex: 20, blur: "[filter:blur(1.3px)]", opacity: 0.6 };
    }
    if (diff === 1) {
      return { x: 400, scale: 0.9, zIndex: 20, blur: "[filter:blur(1.3px)]", opacity: 0.6 };
    }
    return { x: 0, scale: 0.7, zIndex: 0, blur: "blur-lg", opacity: 0 };
  };

  return (
    <div
      className={`relative w-full flex items-center justify-center ${isMobile ? "p-2" : "p-12"
        } bg-black overflow-hidden`}
    >
      {/* Left Arrow */}
      {/* <button
        onClick={prevSlide}
        className={`absolute z-50 w-10 h-10 rounded-full bg-gradient-to-r from-teal-300 to-teal-900 text-white flex items-center justify-center transition hover:scale-110 ${
          isMobile ? "left-4 top-1/2 -translate-y-1/2 w-8 h-8 text-sm" : "left-22"
        }`}
      >
        &#8592;
      </button> */}

      {/* Carousel */}
      <div
        className={`relative flex items-center justify-center w-full ${isMobile ? "max-w-xs h-[220px] overflow-visible" : "max-w-8xl h-[400px]"
          }`}
      >
        {carouselImages.map((src, index) => {
          const { x, scale, zIndex, blur, opacity } = getPositionStyle(index);

          return (
            <motion.div
              key={index}
              className="absolute"
              style={{
                zIndex,
                opacity,
                clipPath: "inset(0 round 12px)"  // ★ rounded corners ALWAYS applied here
              }}
              animate={{ x, scale, opacity }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
            >

              <div className="rounded-2xl overflow-hidden">
                <div className={`${blur || ""} w-full h-full`}>
                  <div
                    className="relative"
                    style={{
                      width: isMobile ? "clamp(140px, 55vw, 260px)" : "clamp(200px, 28vw, 520px)",
                      height: isMobile ? "clamp(90px, 35vw, 160px)" : "clamp(140px, 18vw, 320px)",
                      borderRadius: "16px",
                      overflow: "hidden",
                      clipPath: "inset(0 round 16px)"
                    }}
                  >

                    <Image
                      src={src}
                      alt={`carousel-${index}`}
                      fill
                      style={{
                        objectFit: "cover",
                        clipPath: "inset(0 round 12px)"  // ★ ensures perfect corners on real pixels
                      }}
                    />

                  </div>
                </div>
              </div>
            </motion.div>

          );
        })}
      </div>

      {/* Right Arrow */}
      {/* <button
        onClick={nextSlide}
        className={`absolute z-50 w-10 h-10 rounded-full bg-gradient-to-r from-teal-300 to-teal-900 text-white flex items-center justify-center transition hover:scale-110 ${
          isMobile ? "right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-sm" : "right-17"
        }`}
      >
        &#8594;
      </button> */}
    </div>
  );
}
