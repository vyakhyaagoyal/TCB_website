"use client";
import React, { useEffect, useRef, useState } from "react";
import { Oxanium, Montserrat } from "next/font/google";
import Image from "next/image";
import gsap from "gsap";
import Capsule from "./home_components/Capsule";
import Bento from "./home_components/Bento";
import Carousel from "./home_components/Carousel";
import Who_we_are from "./home_components/Who_we_are";

// Font imports
const oxanium = Oxanium({
    subsets: ["latin"],
    weight: ["700"],
});

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "700"],
});

export default function Home() {
    const [activeTab, setActiveTab] = useState("tech");
    const [isMobile, setIsMobile] = useState(false);
    const iconRefs = useRef([]);

    // ✅ Detect mobile view
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ✅ Positions (Desktop untouched, Mobile locked inside viewport)
    const desktopIcons = [
        { src: "/icons/react.svg", x: -450, y: 50 },
        { src: "/icons/nodejs.svg", x: 550, y: -120 },
        { src: "/icons/python.svg", x: -300, y: 250 },
        { src: "/icons/figma.svg", x: 650, y: 250 },
        { src: "/icons/rust.svg", x: -100, y: -100 },
        { src: "/icons/java.svg", x: 350, y: 380 },
    ];

    // ✅ Simplified, viewport-safe mobile layout
    const mobileIcons = [
        { src: "/icons/react.svg", x: -110, y: -60 },
        { src: "/icons/nodejs.svg", x: 80, y: -140 },
        { src: "/icons/python.svg", x: -70, y: 130 },
        { src: "/icons/figma.svg", x: 130, y: 200 },
        // { src: "/icons/rust.svg", x: -10, y: -100 },
        { src: "/icons/java.svg", x: 150, y: 40 },
    ];

    const icons = isMobile ? mobileIcons : desktopIcons;

    useEffect(() => {
        iconRefs.current.forEach((el, i) => {
            if (!el) return;
            gsap.killTweensOf(el); // ensure clean slate before animating

            // Start from center
            gsap.set(el, { x: 0, y: 0, opacity: 0, scale: 0 });

            // Fly to final position
            gsap.to(el, {
                x: icons[i].x,
                y: icons[i].y,
                opacity: 1,
                scale: 1,
                delay: i * 0.1,
                duration: 0.8,
                ease: "back.out(1.7)",
                onComplete: () => {
                    if (isMobile) {
                        // ✅ Subtle breathing motion (non-drifting)
                        gsap.to(el, {
                            y: "+=2",
                            rotation: 0.3,
                            duration: 2,
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut",
                        });
                    } else {
                        // ✅ Desktop full float animation (unchanged)
                        const float = () => {
                            gsap.to(el, {
                                x: desktopIcons[i].x + gsap.utils.random(-10, 10),
                                y: desktopIcons[i].y + gsap.utils.random(-10, 10),
                                rotation: gsap.utils.random(-5, 5),
                                duration: 2.5 + Math.random() * 1.5,
                                ease: "sine.inOut",
                                onComplete: float,
                            });
                        };
                        float();
                    }
                },
            });

            // Hover scaling (desktop only)
            if (!isMobile) {
                el.addEventListener("mouseenter", () =>
                    gsap.to(el, { scale: 1.1, duration: 0.3 })
                );
                el.addEventListener("mouseleave", () =>
                    gsap.to(el, { scale: 1, duration: 0.3 })
                );
            }
        });
    }, [isMobile]);

    return (
        <>
            {/* === HERO SECTION === */}
            <main
                className={`relative flex items-center justify-center ${isMobile ? "h-[90vh]" : "h-screen"
                    } bg-black overflow-hidden text-white ${isMobile ? "bg-contain" : "bg-cover"
                    } bg-center`}
                style={{
                    backgroundImage: "url('/bg_hero.svg')",
                }}
            >
                {/* Floating Tech Icons */}
                <div className="absolute w-full h-full flex items-center justify-center overflow-hidden">
                    {icons.map((icon, i) => (
                        <div
                            key={i}
                            ref={(el) => (iconRefs.current[i] = el)}
                            className="absolute will-change-transform"
                            style={{ transformOrigin: "center center" }}
                        >
                            <Image
                                src={icon.src}
                                alt="icon"
                                width={isMobile ? 110 : 300}
                                height={isMobile ? 110 : 300}
                                className="drop-shadow-lg opacity-85 select-none"
                                draggable="false"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>

                {/* Hero Text */}
                <div className="text-center z-10 px-6 sm:px-4">
                    <h1
                        className={`${oxanium.className} ${isMobile ? "text-4xl leading-snug" : "text-7xl md:text-8xl"
                            } font-bold tracking-tight bg-[linear-gradient(to_right,_#02232A,_#C1C1C1,_#C1C1C1,_#02232A)] bg-clip-text text-transparent`}
                    >
                        The Codebreakers Club
                    </h1>
                    <p
                        className={`${montserrat.className} ${isMobile ? "text-base" : "text-xl md:text-2xl"
                            } text-[#C1C1C1] mt-4 font-semibold`}
                    >
                        Breaking Codes, Creating Minds
                    </p>

                    <button
                        onClick={() => {
                            const section = document.getElementById("domains");
                            section?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="bg-white/10 backdrop-blur-md border border-white/30 rounded-full px-6 py-2 text-white font-semibold hover:bg-white/20 transition duration-300 ease-in-out mt-8"
                    >
                        Explore Now
                    </button>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none"></div>
            </main>

            {/* === WHO WE ARE === */}
            <Who_we_are />

            {/* === DOMAINS SECTION === */}
            <section className="py-16 sm:py-16 bg-black text-[#C1C1C1] text-center overflow-hidden" id="domains">
                <h1
                    className={`${oxanium.className} text-4xl sm:text-5xl font-bold mb-2`}
                >
                    Explore Domains at TheCodeBreakers
                </h1>
                <p
                    className={`${montserrat.className} text-sm sm:text-base md:text-xl mx-auto font-semibold bg-gradient-to-b from-[#C1C1C1] via-[#C1C1C1] to-gray-900 bg-clip-text text-transparent max-w-full sm:max-w-[700px] px-4`}
                >
                    A vibrant space for every passion—whether you’re a coder, designer,
                    writer, or event wizard.
                </p>

                <Capsule activeTab={activeTab} setActiveTab={setActiveTab} />

                <Bento
                    key={activeTab}
                    enableStars
                    enableSpotlight
                    enableBorderGlow
                    enableTilt
                    enableMagnetism
                    clickEffect
                    spotlightRadius={isMobile ? 200 : 300}
                    particleCount={isMobile ? 8 : 12}
                    glowColor="21, 231, 225"
                    activeTab={activeTab}
                />
            </section>

            {/* === MOMENTS SECTION === */}
            <section className="py-16 sm:py-20 bg-black text-[#C1C1C1] text-center overflow-hidden">
                <h1
                    className={`${oxanium.className} text-4xl sm:text-5xl font-bold mb-2`}
                >
                    Moments at TheCodeBreakers
                </h1>
                <div className="w-full px-4 sm:px-8">
                    <Carousel />
                </div>
            </section>
        </>
    );
}
