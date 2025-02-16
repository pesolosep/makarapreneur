'use client'

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "../ui/button"
import aboutUsDummy from "@/assets/aboutUsDummy.svg"
import { twMerge } from "tailwind-merge"
import Link from "next/link"

interface Variant {
    variant?: string
    height?: number
}

export default function AboutUs({ variant, height }: Variant) {
    const isSecondary = variant === "secondary"
    const [isActive, setIsActive] = useState(false)
    const [hasAnimated, setHasAnimated] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setIsActive(true)
                    setHasAnimated(true)
                }
            },
            { threshold: 0.7 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current)
            }
        }
    }, [hasAnimated])

    const isAutoHeight = !height

    return (
        <section
            ref={sectionRef}
            id="about-section"
            className={twMerge(
                "text-linen w-full bg-signalBlack relative",
                isSecondary && "text-signalBlack bg-linen"
            )}
        >
            <div className={twMerge(
                "container mx-auto px-6 relative transition-all duration-1000 ease-in-out overflow-hidden backdrop-blur-sm",
                isActive ? isAutoHeight? "h-[700px]" : `h-[${height}px]` : "h-[200px]"
            )}>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h1
                                className={twMerge(
                                    "text-2xl lg:text-4xl font-bold transition-all duration-1000 opacity-0",
                                    !isSecondary && "bg-gradient-to-r from-cornflowerBlue to-cornflowerBlue/80 px-8 rounded-2xl py-3 inline-block",
                                    isActive && "opacity-100"
                                )}
                            >
                                ABOUT US
                            </h1>
                            <p className={twMerge(
                                "text-base lg:text-lg leading-relaxed opacity-0 transition-opacity duration-1000 delay-300",
                                isActive && "opacity-100"
                            )}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                do eiusmod tempor incididunt ut labore et dolore magna
                                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea.
                            </p>
                            {!isSecondary && (
                                <div className={twMerge(
                                    "transition-opacity duration-1000 delay-500 opacity-0",
                                    isActive && "opacity-100"
                                )}>
                                    <Link href="/aboutus">
                                        <Button className="rounded-full px-8 py-6 text-base hover:scale-105 transition-transform">
                                            Learn More
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className={twMerge(
                            "relative h-full flex items-center justify-center opacity-0 transition-all duration-1000 group",
                            isActive && "opacity-100 delay-700"
                        )}>
                            <Image
                                src={aboutUsDummy}
                                alt="About Us Illustration"
                                className="object-contain w-full max-h-[500px] rounded-md transition-transform duration-300 group-hover:rotate-3"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}