"use client";
import { Oxanium, Montserrat } from "next/font/google";

const oxanium = Oxanium({
    subsets: ["latin"],
    weight: ["700"],
});
const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "700"],
});

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
                        The CodeBreakers is a passionate student community empowering members across all backgrounds to discover, learn, and shine in tech and creative fields. Whether you’re into coding, design, content, or event planning, you’ll find your place—and your people—right here.
                    </p>

                    <button className="bg-gradient-to-r from-white/10 to-black/20 backdrop-blur-md border border-white/30 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-white font-semibold hover:bg-white/20 transition duration-300 ease-in-out">
                        Learn More →
                    </button>
                </div>

                {/* Image Section */}
                <div className="flex-1 flex justify-center md:justify-end w-full">
                    <div className="h-44 w-44 sm:h-56 sm:w-56 md:h-72 md:w-72 rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src="/carousel/sample_img.png"
                            alt="Who We Are"
                            className="h-full w-full object-cover scale-105 hover:scale-110 transition-transform duration-500 ease-in-out"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
