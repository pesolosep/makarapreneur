'use client';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import aboutUsDummy from "@/assets/aboutUsDummy.svg";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Slideshow() {
    const [isVisible, setIsVisible] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [api, setApi] = useState<any>();
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.7 }
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

    // Auto-slide functionality
    useEffect(() => {
        if (!api || !isVisible) return;

        const interval = setInterval(() => {
            api.scrollNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [api, isVisible]);

    return (
        <div 
            ref={sectionRef}
            className="px-6 lg:px-12 bg-signalBlack text-linen py-20 relative overflow-hidden"
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(186,222,79,0.03),transparent_70%)]" />
            
            <div className={`
                w-full flex justify-center items-center px-4
                transition-all duration-1000
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
            `}>
                <Carousel
                    setApi={setApi}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full max-w-3xl"
                >
                    <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem
                                key={index}
                                className={`
                                    basis-full
                                    transition-all duration-700
                                    ${isVisible 
                                        ? 'opacity-100 translate-y-0' 
                                        : 'opacity-0 translate-y-12'
                                    }
                                `}
                                style={{
                                    transitionDelay: `${(index + 1) * 200}ms`
                                }}
                            >
                                <div>
                                    <Card className="border-0 shadow-none bg-transparent">
                                        <CardContent className="flex aspect-video items-center justify-center p-6 relative rounded-2xl overflow-hidden group">
                                            {/* Content */}
                                            <div className="z-10 flex flex-col items-center gap-4 justify-center transition-transform duration-500 group-hover:scale-105">
                                                <p className="text-2xl lg:text-4xl font-bold text-linen mb-2 [text-shadow:0px_0px_20px_rgba(186,222,79,0.3)]">
                                                    COMPETITION
                                                </p>
                                                <p className="text-center text-signalBlack bg-juneBud/90 backdrop-blur-sm font-medium text-base lg:text-lg px-6 py-2 rounded-lg mx-2 lg:mx-20 transition-all duration-500 group-hover:bg-juneBud">
                                                    Lorem ipsum dolor sit amet
                                                    consectetur adipisicing
                                                    elit. Quisquam soluta.
                                                </p>
                                                <Button 
                                                                                className="group/btn relative overflow-hidden bg-transparent border-linen text-linen hover:text-white transition-all duration-300 hover:pr-12"
                                                                            >
                                                                                <span className="relative z-10 transition-transform duration-300 group-hover/btn:-translate-x-2">
                                                                                    Learn More
                                                                                </span>
                                                                                <ArrowRight 
                                                                                    className="absolute z-10 right-4 h-4 w-4 transition-all duration-300 transform opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 translate-x-4" 
                                                                                />
                                                                                <div className="absolute inset-0 bg-cornflowerBlue transform transition-transform duration-300 origin-left scale-x-0 group-hover/btn:scale-x-100" />
                                                                            </Button>
                                            </div>

                                            {/* Background Image */}
                                            <Image
                                                src={aboutUsDummy}
                                                alt="image"
                                                className="object-cover absolute rounded-2xl transition-all duration-700 group-hover:scale-105 brightness-[0.3] group-hover:brightness-[0.4]"
                                                fill
                                                priority
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="border-2 border-linen text-linen bg-signalBlack hover:bg-linen/20 hover:text-linen transition-colors" />
<CarouselNext className="border-2 border-linen text-linen bg-signalBlack hover:bg-linen/20 hover:text-linen transition-colors" />
                </Carousel>
            </div>
        </div>
    );
}