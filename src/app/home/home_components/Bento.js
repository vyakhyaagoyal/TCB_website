import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { Montserrat } from "next/font/google";
import Image from 'next/image';

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "700"],
});

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '21, 231, 225';
const MOBILE_BREAKPOINT = 768;

const techDomains = [
    {
        title: "Web Development",
        desc: "Build and design interactive websites and web apps using modern technologies like React, Next.js, and Tailwind CSS.",
        //icon: './webdev.svg',
        bg: 'webdev.svg'
    },
    {
        title: "Competitive Programming",
        desc: "Solve coding challenges, boost problem-solving skills, and prepare for global tech contests.",
        //icon: './cp.svg',
        bg: 'cp.svg'
    },
    {
        title: "Machine Learning",
        desc: "Explore real-world AI with hands-on projects using Python, TensorFlow, and data-driven insights.",
        //icon:'./webdev.svg'
    },
    {
        title: "Blockchain",
        desc: "Learn the technology behind cryptocurrencies, decentralized apps, and smart contracts.",
        //icon:'./webdev.svg'
    },
];

const nonTechDomains = [
    {
        title: "Content Writing",
        desc: "Craft engaging stories and blogs that connect ideas with people.",
    },
    {
        title: "Event Management",
        desc: "Plan, organize, and execute exciting campus and tech events.",
    },
    {
        title: "Graphic Designing",
        desc: "Explore creativity with UI/UX and graphic design experiences.",
    },
    {
        title: "PR & Marketing",
        desc: "Promote events, engage audiences, and build strong community presence.",
    },
];

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
    const el = document.createElement('div');
    el.className = 'particle';
    el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
    return el;
};

const calculateSpotlightValues = radius => ({
    proximity: radius * 0.5,
    fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
    const rect = card.getBoundingClientRect();
    const relativeX = ((mouseX - rect.left) / rect.width) * 100;
    const relativeY = ((mouseY - rect.top) / rect.height) * 100;

    card.style.setProperty('--glow-x', `${relativeX}%`);
    card.style.setProperty('--glow-y', `${relativeY}%`);
    card.style.setProperty('--glow-intensity', glow.toString());
    card.style.setProperty('--glow-radius', `${radius}px`);
};

const ParticleCard = ({
    children,
    className = '',
    disableAnimations = false,
    style,
    particleCount = DEFAULT_PARTICLE_COUNT,
    glowColor = DEFAULT_GLOW_COLOR,
    enableTilt = true,
    clickEffect = false,
    enableMagnetism = false
}) => {
    const cardRef = useRef(null);
    const particlesRef = useRef([]);
    const timeoutsRef = useRef([]);
    const isHoveredRef = useRef(false);
    const memoizedParticles = useRef([]);
    const particlesInitialized = useRef(false);
    const magnetismAnimationRef = useRef(null);

    const initializeParticles = useCallback(() => {
        if (particlesInitialized.current || !cardRef.current) return;

        const { width, height } = cardRef.current.getBoundingClientRect();
        memoizedParticles.current = Array.from({ length: particleCount }, () =>
            createParticleElement(Math.random() * width, Math.random() * height, glowColor)
        );
        particlesInitialized.current = true;
    }, [particleCount, glowColor]);

    const clearAllParticles = useCallback(() => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
        magnetismAnimationRef.current?.kill();

        particlesRef.current.forEach(particle => {
            gsap.to(particle, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                ease: 'back.in(1.7)',
                onComplete: () => {
                    particle.parentNode?.removeChild(particle);
                }
            });
        });
        particlesRef.current = [];
    }, []);

    const animateParticles = useCallback(() => {
        if (!cardRef.current || !isHoveredRef.current) return;

        if (!particlesInitialized.current) {
            initializeParticles();
        }

        memoizedParticles.current.forEach((particle, index) => {
            const timeoutId = setTimeout(() => {
                if (!isHoveredRef.current || !cardRef.current) return;

                const clone = particle.cloneNode(true);
                cardRef.current.appendChild(clone);
                particlesRef.current.push(clone);

                gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

                gsap.to(clone, {
                    x: (Math.random() - 0.5) * 100,
                    y: (Math.random() - 0.5) * 100,
                    rotation: Math.random() * 360,
                    duration: 2 + Math.random() * 2,
                    ease: 'none',
                    repeat: -1,
                    yoyo: true
                });

                gsap.to(clone, {
                    opacity: 0.3,
                    duration: 1.5,
                    ease: 'power2.inOut',
                    repeat: -1,
                    yoyo: true
                });
            }, index * 100);

            timeoutsRef.current.push(timeoutId);
        });
    }, [initializeParticles]);

    useEffect(() => {
        if (disableAnimations || !cardRef.current) return;

        const element = cardRef.current;

        const handleMouseEnter = () => {
            isHoveredRef.current = true;
            animateParticles();

            if (enableTilt) {
                gsap.to(element, {
                    rotateX: 5,
                    rotateY: 5,
                    duration: 0.3,
                    ease: 'power2.out',
                    transformPerspective: 1000
                });
            }
        };

        const handleMouseLeave = () => {
            isHoveredRef.current = false;
            clearAllParticles();

            if (enableTilt) {
                gsap.to(element, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }

            if (enableMagnetism) {
                gsap.to(element, {
                    x: 0,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        };

        const handleMouseMove = e => {
            if (!enableTilt && !enableMagnetism) return;

            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            if (enableTilt) {
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;

                gsap.to(element, {
                    rotateX,
                    rotateY,
                    duration: 0.1,
                    ease: 'power2.out',
                    transformPerspective: 1000
                });
            }

            if (enableMagnetism) {
                const magnetX = (x - centerX) * 0.05;
                const magnetY = (y - centerY) * 0.05;

                magnetismAnimationRef.current = gsap.to(element, {
                    x: magnetX,
                    y: magnetY,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        };

        const handleClick = e => {
            if (!clickEffect) return;

            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const maxDistance = Math.max(
                Math.hypot(x, y),
                Math.hypot(x - rect.width, y),
                Math.hypot(x, y - rect.height),
                Math.hypot(x - rect.width, y - rect.height)
            );

            const ripple = document.createElement('div');
            ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

            element.appendChild(ripple);

            gsap.fromTo(
                ripple,
                {
                    scale: 0,
                    opacity: 1
                },
                {
                    scale: 1,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    onComplete: () => ripple.remove()
                }
            );
        };

        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('click', handleClick);

        return () => {
            isHoveredRef.current = false;
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('click', handleClick);
            clearAllParticles();
        };
    }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

    return (
        <div
            ref={cardRef}
            className={`${className} relative overflow-hidden`}
            style={{ ...style, position: 'relative', overflow: 'hidden' }}
        >
            {children}
        </div>
    );
};

const GlobalSpotlight = ({
    gridRef,
    disableAnimations = false,
    enabled = true,
    spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
    glowColor = DEFAULT_GLOW_COLOR
}) => {
    const spotlightRef = useRef(null);
    const isInsideSection = useRef(false);

    useEffect(() => {
        if (disableAnimations || !gridRef?.current || !enabled) return;

        const spotlight = document.createElement('div');
        spotlight.className = 'global-spotlight';
        spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
        document.body.appendChild(spotlight);
        spotlightRef.current = spotlight;

        const handleMouseMove = e => {
            if (!spotlightRef.current || !gridRef.current) return;

            const section = gridRef.current.closest('.bento-section');
            const rect = section?.getBoundingClientRect();
            const mouseInside =
                rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

            isInsideSection.current = mouseInside || false;
            const cards = gridRef.current.querySelectorAll('.card');

            if (!mouseInside) {
                gsap.to(spotlightRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                cards.forEach(card => {
                    card.style.setProperty('--glow-intensity', '0');
                });
                return;
            }

            const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
            let minDistance = Infinity;

            cards.forEach(card => {
                const cardElement = card;
                const cardRect = cardElement.getBoundingClientRect();
                const centerX = cardRect.left + cardRect.width / 2;
                const centerY = cardRect.top + cardRect.height / 2;
                const distance =
                    Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
                const effectiveDistance = Math.max(0, distance);

                minDistance = Math.min(minDistance, effectiveDistance);

                let glowIntensity = 0;
                if (effectiveDistance <= proximity) {
                    glowIntensity = 1;
                } else if (effectiveDistance <= fadeDistance) {
                    glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
                }

                updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
            });

            gsap.to(spotlightRef.current, {
                left: e.clientX,
                top: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });

            const targetOpacity =
                minDistance <= proximity
                    ? 0.8
                    : minDistance <= fadeDistance
                        ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
                        : 0;

            gsap.to(spotlightRef.current, {
                opacity: targetOpacity,
                duration: targetOpacity > 0 ? 0.2 : 0.5,
                ease: 'power2.out'
            });
        };

        const handleMouseLeave = () => {
            isInsideSection.current = false;
            gridRef.current?.querySelectorAll('.card').forEach(card => {
                card.style.setProperty('--glow-intensity', '0');
            });
            if (spotlightRef.current) {
                gsap.to(spotlightRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
        };
    }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

    return null;
};

const BentoCardGrid = ({ children, gridRef, activeTab }) => (
    <div
        className="bento-section w-full flex justify-center px-4 select-none relative"
        style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.5rem)' }}
        ref={gridRef}
    >
        {/* centered inner container with same max width as before */}
        <div className="max-w-[54rem] w-full">
            {children}
        </div>
    </div>
);

const useMobileDetection = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
};

const Bento = ({
    enableStars = true,
    enableSpotlight = true,
    enableBorderGlow = true,
    disableAnimations = false,
    spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
    particleCount = DEFAULT_PARTICLE_COUNT,
    enableTilt = false,
    glowColor = DEFAULT_GLOW_COLOR,
    clickEffect = true,
    enableMagnetism = true,
    activeTab
}) => {
    const gridRef = useRef(null);
    const isMobile = useMobileDetection();
    const shouldDisableAnimations = disableAnimations || isMobile;

    const renderCard = (card, index, width) => {
        const baseClassName = `card flex flex-col justify-center items-center relative border border-solid font-light overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] ${enableBorderGlow ? 'card--border-glow' : ''
            }`;

        const cardStyle = {
            backgroundColor: 'var(--background-dark)',
            borderColor: 'var(--border-color)',
            color: 'var(--white)',
            width,
            height: '260px',
        };

        if (enableStars) {
            return (
                <ParticleCard
                    key={index}
                    className={baseClassName}
                    style={cardStyle}
                    disableAnimations={shouldDisableAnimations}
                    particleCount={particleCount}
                    glowColor={glowColor}
                    enableTilt={enableTilt}
                    clickEffect={clickEffect}
                    enableMagnetism={enableMagnetism}
                >
                    <div className="flex flex-col justify-start h-full p-2">
                        <h3 className={`${montserrat.className} text-start m-5 text-3xl font-semibold `}>
                            {card.title}
                        </h3>
                        <p className={`text-sm text-start m-5 opacity-80 mt-2`}>
                            {card.desc}
                        </p>

                        {/* Render bg image only if it exists */}
                        {card.bg && (
                            <Image src={card.bg} alt="bg-image" className='absolute bottom-0 right-0 opacity-80 rounded-b-3xl' width={140} height={240} />
                        )}
                    </div>
                </ParticleCard>
            );
        }
    };


    // inside your existing Bento component (replace the return block with this 👇)
return (
  <>
    <style>
      {`
        .bento-section {
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-intensity: 0;
          --glow-radius: 200px;
          --glow-color: ${glowColor};
          --border-color: #392e4e;
          --background-dark: #060010;
          --white: hsl(0, 0%, 100%);
          --teal-primary: rgba(5, 74, 72, 1);
          --teal-glow: rgba(5, 74, 72, 0.2);
          --teal-border: rgba(5, 74, 72, 0.8);
        }

        .card-responsive {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 1rem;
        }

        .card {
          height: 250px !important;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .card--border-glow::after {
          content: '';
          position: absolute;
          inset: 0;
          padding: 6px;
          background: radial-gradient(
            var(--glow-radius) circle at var(--glow-x) var(--glow-y),
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
            transparent 60%
          );
          border-radius: inherit;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: subtract;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 1;
        }

        .card--border-glow:hover::after {
          opacity: 1;
        }

        .card--border-glow:hover {
          box-shadow: 0 4px 20px rgba(2, 37, 36, 0.4), 0 0 30px rgba(5, 74, 72, 0.2);
        }

        @media (max-width: 768px) {
          .bento-mobile {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 0 1rem;
            width: 100%;
          }
          .bento-desktop {
            display: none !important;
          }
          .bento-mobile .card {
            width: 100% !important;
            height: 200px !important;
            border-radius: 18px;
          }
        }

        @media (min-width: 769px) {
          .bento-desktop {
            display: block;
          }
          .bento-mobile {
            display: none;
          }
        }
      `}
    </style>

    {enableSpotlight && (
      <GlobalSpotlight
        gridRef={gridRef}
        disableAnimations={shouldDisableAnimations}
        enabled={enableSpotlight}
        spotlightRadius={spotlightRadius}
        glowColor={glowColor}
      />
    )}

    {/* ================== DESKTOP VIEW (UNCHANGED) ================== */}
    <div className="bento-desktop">
      {activeTab === "tech" && (
        <BentoCardGrid gridRef={gridRef} key="tech">
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="flex justify-center items-center gap-4">
              {techDomains.slice(0, 2).map((card, index) => {
                const width = index === 0 ? "650px" : "400px";
                return renderCard(card, index, width);
              })}
            </div>
            <div className="flex justify-center gap-4">
              {techDomains.slice(2, 4).map((card, index) => {
                const width = index === 0 ? "400px" : "650px";
                return renderCard(card, index + 2, width);
              })}
            </div>
          </div>
        </BentoCardGrid>
      )}

      {activeTab === "nontech" && (
        <BentoCardGrid gridRef={gridRef} key="nontech">
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="flex justify-center items-center gap-4">
              {nonTechDomains.slice(0, 2).map((card, index) => {
                const width = index === 0 ? "400px" : "650px";
                return renderCard(card, index, width);
              })}
            </div>
            <div className="flex justify-center gap-4">
              {nonTechDomains.slice(2, 4).map((card, index) => {
                const width = index === 0 ? "650px" : "400px";
                return renderCard(card, index + 2, width);
              })}
            </div>
          </div>
        </BentoCardGrid>
      )}
    </div>

    {/* ================== MOBILE VIEW (NEW SECTION) ================== */}
<div className="bento-mobile">
  {(activeTab === "tech" ? techDomains : nonTechDomains).map((card, i) => (
    <ParticleCard
      key={i}
      className={`card flex flex-col justify-center items-center relative border border-solid font-light overflow-hidden transition-all duration-300 ease-in-out ${
        enableBorderGlow ? "card--border-glow" : ""
      }`}
      style={{
        backgroundColor: "var(--background-dark)",
        borderColor: "rgba(57, 46, 78, 1)", // ✅ same as desktop border color
        color: "var(--white)",
        width: "100%",
        height: "220px",
        boxShadow:
          "0 4px 20px rgba(2, 37, 36, 0.4), 0 0 30px rgba(5, 74, 72, 0.2)", // ✅ same soft glow as desktop
      }}
      disableAnimations
      particleCount={DEFAULT_PARTICLE_COUNT}
      glowColor={DEFAULT_GLOW_COLOR}
      enableTilt={false}
      clickEffect={false}
      enableMagnetism={false}
    >
      <div className="flex flex-col justify-start h-full p-3 sm:p-4">
        <h3
          className={`${montserrat.className} text-start text-lg sm:text-xl font-semibold m-3 leading-tight`}
        >
          {card.title}
        </h3>
        <p className="text-xs sm:text-sm text-start opacity-80 m-3 mt-1 leading-snug">
          {card.desc}
        </p>
        {card.bg && (
          <Image
            src={card.bg}
            alt="bg"
            className="absolute bottom-0 right-0 opacity-70 rounded-b-3xl"
            width={100}
            height={160}
          />
        )}
      </div>
    </ParticleCard>
  ))}
</div>

  </>
);

};

export default Bento;