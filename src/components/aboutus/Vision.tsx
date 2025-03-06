"use client";

import vision from "@/assets/makarapreneur/vision.jpg"
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

export default function Vision() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        const currentSectionRef = sectionRef.current;
        if (currentSectionRef) {
            observer.observe(currentSectionRef);
        }

        return () => {
            if (currentSectionRef) {
                observer.unobserve(currentSectionRef);
            }
        };
    }, []);

    return (
        <div
            ref={sectionRef}
            className="relative bg-signalBlack px-6 lg:px-12 py-20 text-linen min-h-[400px] flex justify-evenly items-center flex-wrap gap-y-12"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(186,222,79,0.03),transparent_70%)]" />

            <div className="flex flex-col gap-8 relative z-10">
                <h2
                    className={`
                        text-2xl lg:text-4xl font-bold text-juneBud
                        transition-all duration-700
                        ${
                            isVisible
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-8"
                        }
                        [text-shadow:0px_0px_20px_rgba(186,222,79,0.3)]
                    `}
                >
                    VISION
                </h2>
                <p
                    className={`
                        max-w-[450px] text-base lg:text-lg text-linen/90 leading-relaxed
                        transition-all duration-700 delay-200
                        ${
                            isVisible
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-8"
                        }
                    `}
                >
                    Memberdayakan wirausahawan muda dalam mengubah ide dan
                    konsep mereka menjadi kenyataan, serta menjembatani mereka
                    menuju pertumbuhan dan kesuksesan yang berdampak.
                </p>
                <div
                    className={`
                        max-w-[450px] h-[2px] bg-gradient-to-r from-cornflowerBlue via-cornflowerBlue to-transparent
                        transition-all duration-1000 delay-400
                        ${
                            isVisible
                                ? "opacity-100 scale-x-100"
                                : "opacity-0 scale-x-0"
                        }
                        origin-left
                    `}
                />
            </div>

            <div
                className={`
                    relative z-10 transition-all duration-700 delay-300
                    ${
                        isVisible
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-8"
                    }
                `}
            >
                <div className="relative group">
                    <Image
                        src={vision}
                        alt="Vision illustration"
                        className="w-[420px] transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-juneBud/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
                </div>
            </div>
        </div>
    );
}
