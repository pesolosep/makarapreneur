'use client';

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import aboutUsDummy from "@/assets/aboutUsDummy.svg";
import { Button } from "./ui/button";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ShowCardProps {
    title: string;
    variant?: string;
}

export default function ShowCard({ title, variant }: ShowCardProps) {
    const isSecondary = variant === "secondary";
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

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const cards = [
        { id: 1, title: "BUSINESS CASE COMPETITION", link: isSecondary ? "/event/1" : "#1" },
        { id: 2, title: "STARTUP INNOVATION CHALLENGE", link: isSecondary ? "/event/2" : "#2" },
        { id: 3, title: "LEADERSHIP DEVELOPMENT PROGRAM", link: isSecondary ? "/event/3" : "#3" }
    ];

    return (
        <div
            ref={sectionRef}
            className={twMerge(
                "bg-linen py-20 relative overflow-hidden",
                isSecondary && "bg-signalBlack text-juneBud"
            )}
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(100,149,237,0.05),transparent_50%)]" />
            <div className={`
                absolute inset-0 opacity-20
                transition-transform duration-1000 delay-500
                ${isVisible ? 'scale-100' : 'scale-0'}
                bg-[radial-gradient(circle_at_50%_50%,rgba(186,222,79,0.1),transparent_70%)]
            `} />

            <h2 className={`
                headerText text-center text-2xl lg:text-4xl mb-16
                transition-all duration-1000
                ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-12 scale-90'}
            `}>
                {title}
            </h2>

            <div className="flex justify-center items-center gap-8 lg:gap-12 flex-wrap px-6 lg:px-12">
                {cards.map((card, index) => (
                    <Card 
                        key={card.id}
                        className={`
                            border-0 shadow-none bg-signalBlack 
                            w-[380px] lg:w-[420px] 
                            transition-all duration-700
                            group hover:shadow-2xl hover:scale-105
                            ${isVisible 
                                ? 'opacity-100 translate-y-0 rotate-0' 
                                : 'opacity-0 translate-y-24 rotate-6'
                            }
                        `}
                        style={{
                            transitionDelay: `${(index + 1) * 300}ms`
                        }}
                    >
                        <CardContent className="flex aspect-[16/10] items-center justify-center p-8 relative rounded-2xl overflow-hidden">
                            {/* Animated decorative elements */}
                            <div className="absolute inset-0">
                                <div className={`
                                    absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cornflowerBlue to-transparent
                                    transition-transform duration-700 origin-left
                                    ${isVisible ? 'scale-x-100' : 'scale-x-0'}
                                `} style={{ transitionDelay: `${(index + 1) * 400}ms` }} />
                                <div className={`
                                    absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-juneBud to-transparent
                                    transition-transform duration-700 origin-right
                                    ${isVisible ? 'scale-x-100' : 'scale-x-0'}
                                `} style={{ transitionDelay: `${(index + 1) * 400}ms` }} />
                            </div>

                            <div className="z-10 flex flex-col items-center gap-6 justify-center transition-all duration-500">
                                <p className={`
                                    headerText text-lg lg:text-xl text-linen text-center font-bold
                                    transition-all duration-700
                                    group-hover:text-cornflowerBlue
                                    [text-shadow:0px_0px_20px_rgba(186,222,79,0.3)]
                                `}>
                                    {card.title}
                                </p>
                                <Link href={card.link}>
                                    <Button 
                                        className="group/btn relative overflow-hidden bg-transparent border-linen text-linen 
                                                 hover:text-white transition-all duration-300 hover:pr-12
                                                 hover:border-cornflowerBlue"
                                    >
                                        <span className="relative z-10 transition-transform duration-300 group-hover/btn:-translate-x-2">
                                            Learn More
                                        </span>
                                        <ArrowRight 
                                            className="absolute z-10 right-4 h-4 w-4 transition-all duration-300 
                                                     transform opacity-0 group-hover/btn:opacity-100 
                                                     group-hover/btn:translate-x-0 translate-x-4" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-cornflowerBlue to-juneBud 
                                                      transform transition-transform duration-300 origin-left 
                                                      scale-x-0 group-hover/btn:scale-x-100" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Background Image with enhanced effects */}
                            <Image
                                src={aboutUsDummy}
                                alt="image"
                                className="object-cover absolute rounded-2xl transition-all duration-700 
                                         brightness-[0.3] group-hover:brightness-[0.4]
                                         group-hover:scale-110 group-hover:rotate-2
                                         blur-[1px] group-hover:blur-0"
                                fill
                                priority
                            />

                            {/* Advanced gradient overlays */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute inset-0 bg-gradient-to-t from-cornflowerBlue/20 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-b from-juneBud/10 to-transparent" />
                            </div>

                            {/* Corner accents */}
                            <div className={`
                                absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cornflowerBlue/50
                                transition-all duration-500 group-hover:w-12 group-hover:h-12 group-hover:border-cornflowerBlue
                            `} />
                            <div className={`
                                absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-juneBud/50
                                transition-all duration-500 group-hover:w-12 group-hover:h-12 group-hover:border-juneBud
                            `} />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}