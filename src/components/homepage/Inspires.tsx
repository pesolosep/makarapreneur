'use client'

import { useRef, useState, useEffect } from "react"
import { twMerge } from "tailwind-merge"
import MakaraCard from "../makarainspires/MakaraCard"

interface InspireProps {
    variant?: string
}

export default function Inspires({ variant }: InspireProps) {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)
    const secondary = variant === "secondary"

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.2 }
        )

        const currentSectionRef = sectionRef.current;
        if (currentSectionRef) {
            observer.observe(currentSectionRef);
        }

        return () => {
            if (currentSectionRef) {
                observer.unobserve(currentSectionRef);
            }
        }
    }, [])

    return (
        <div
            ref={sectionRef}
            className={twMerge(
                "relative py-16 overflow-hidden",
                secondary 
                    ? "bg-signalBlack" 
                    : "bg-gradient-to-b from-juneBud via-juneBud/90 to-[#5E76BF]"
            )}
        >
            {/* Background decoration */}
            {!secondary && (
                <>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(110,142,236,0.15),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(110,142,236,0.1),transparent_50%)]" />
                </>
            )}

            {!secondary && (
                <h2 className={twMerge(
                    "text-2xl lg:text-4xl font-bold text-center text-cornflowerBlue mb-12 transition-all duration-700 [text-shadow:0px_0px_20px_rgba(110,142,236,0.3)]",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}>
                    MAKARA INSPIRES
                </h2>
            )}

            <div className={twMerge(
                "flex flex-wrap justify-center gap-10 px-6 lg:px-12 max-w-7xl mx-auto",
                secondary && "mt-0",
                isVisible && "animate-in zoom-in-50 duration-1000"
            )}>
                {[0, 1, 2].map((index) => (
                    <div
                        key={index}
                        className={twMerge(
                            "transition-all duration-700",
                            isVisible 
                                ? "opacity-100 translate-y-0" 
                                : "opacity-0 translate-y-16",
                            `delay-[${index * 200}ms]`
                        )}
                    >
                        <MakaraCard />
                    </div>
                ))}
            </div>
        </div>
    )
}