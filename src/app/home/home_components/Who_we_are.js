"use client";
import { Oxanium, Montserrat } from "next/font/google";
import Image from "next/image";

const oxanium = Oxanium({
    subsets: ["latin"],
    weight: ["700"],
});
const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "700"],
});

const navigateToDomains=()=>{
    const domainsSection = document.getElementById('domains');
    if (domainsSection) {
        domainsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

export default function Who_we_are() {
    return (
        <section className="py-4 sm:py-4 bg-black text-[#C1C1C1] overflow-hidden mb-10">
            {/* Section Title */}
            <h1
                className={`${oxanium.className} text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 text-center`}
            >
                Who We Are
            </h1>

            {/* Content Box */}
            <div className="mx-auto max-w-6xl bg-white/10 border border-white/20 backdrop-blur-lg rounded-3xl flex flex-col-reverse md:flex-row items-center md:items-start md:justify-between p-5 sm:p-8 md:p-12 gap-10 sm:gap-12 md:gap-16 w-[92%] sm:w-[90%] md:w-full">
                {/* Text Section */}
                <div className="flex-[1.3] flex flex-col items-center md:items-start text-center md:text-left">
                    <p
                        className={`${montserrat.className} 
    text-sm sm:text-base md:text-xl 
    text-[#C1C1C1] font-medium md:font-semibold mb-6
    leading-relaxed md:leading-normal
    max-w-[800px] w-full
  `}
                    >
                        The CodeBreakers is not just a club  but it’s a community of dreamers, builders, and creators. It’s a space where ideas grow, skills evolve, and teamwork turns imagination into reality. Whether it’s coding, design, content, or event management here every member finds a place to explore, connect, and shine.
                    </p>

                    <button className="bg-gradient-to-r from-white/10 to-black/20 backdrop-blur-md border border-white/30 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-white font-semibold hover:bg-white/20 transition duration-300 ease-in-out"
                    onClick={navigateToDomains}>
                        Learn More →
                    </button>
                </div>

                {/* Image Section */}
                <div className="flex-1 flex justify-center w-full">
                    <div className="h-44 w-44 sm:h-56 sm:w-56 md:h-72 md:w-[300px] rounded-2xl overflow-visible shadow-lg">
                        <Image
                        height={1000}
                        width={1000}
                            src="/carousel/tcb_1.png"
                            alt="Who We Are"
                            className="h-full w-full object-contain scale-125 md:scale-150 hover:scale-[1.6] transition-transform duration-500 ease-in-out"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
