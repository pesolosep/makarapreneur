'use client'

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import profile from "@/assets/profile.svg"
import { twMerge } from "tailwind-merge"

const speakers = [
    {
        name: "Lorem ipsum",
        role: "Lorem ipsum dolor sit amet.",
        image: profile
    },
    {
        name: "Lorem ipsum",
        role: "Lorem ipsum dolor sit amet.",
        image: profile
    },
    {
        name: "Lorem ipsum",
        role: "Lorem ipsum dolor sit amet.",
        image: profile
    }
]

export default function Speakers() {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.2 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current)
            }
        }
    }, [])

    return (
        <div 
            ref={sectionRef}
            className="relative bg-gradient-to-b from-juneBud to-juneBud/90 flex flex-col items-center justify-center py-16 px-6 lg:px-12 overflow-hidden"
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(110,142,236,0.1),transparent_50%)]" />
            
            <h2 className={twMerge(
                "text-2xl lg:text-4xl font-bold text-center text-linen mb-12 transition-all duration-700 [text-shadow:0px_0px_20px_rgba(110,142,236,0.5)]",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
                PREVIOUS SPEAKERS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl w-full">
                {speakers.map((speaker, index) => (
                    <div 
                    key={index}
                    className={twMerge(
                        "group relative transition-all duration-700", // Durasi ditingkatkan
                        isVisible 
                            ? "opacity-100 translate-y-0" 
                            : "opacity-0 translate-y-32", // Jarak translate ditingkatkan
                        `delay-[${(index + 1) * 200}ms]` // Delay diperbesar dan index + 1 agar lebih terasa bertahap
                    )}
                    >
                        <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:scale-105">
                            {/* Speaker Image */}
                            <div className="relative mb-4">
                                <div className="relative z-10">
                                    <Image
                                        src={speaker.image}
                                        alt={speaker.name}
                                        className="w-full max-w-[280px] mx-auto"
                                    />
                                </div>
                                <div className="absolute -bottom-2 right-2 w-full h-[90%] bg-gradient-to-br from-cornflowerBlue/80 to-cornflowerBlue rounded-xl" />
                            </div>

                            {/* Speaker Info */}
                            <div className="relative z-10 text-center space-y-1">
                                <h3 className="text-lg font-semibold text-linen transition-colors duration-300">
                                    {speaker.name}
                                </h3>
                                <p className="text-sm text-linen/90">
                                    {speaker.role}
                                </p>
                            </div>

                            {/* Hover effect overlay */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-cornflowerBlue/0 to-cornflowerBlue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}