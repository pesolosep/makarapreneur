/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useRef, useState } from "react";
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
import { Quote } from "lucide-react";

export default function Testimonial() {
    const [isVisible, setIsVisible] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [api, setApi] = useState<any>();
    const sectionRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const startAutoSlide = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            api?.scrollNext();
        }, 5000);
    };

    useEffect(() => {
        if (!api || !isVisible) return;

        startAutoSlide();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [api, isVisible]);

    const handlePrevClick = () => {
        api?.scrollPrev();
        startAutoSlide();
    };

    const handleNextClick = () => {
        api?.scrollNext();
        startAutoSlide();
    };

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "CEO at TechVision",
            company: "TechVision Inc.",
            content: "The competition provided an incredible platform for innovation and growth. The challenges pushed our boundaries and helped us develop cutting-edge solutions.",
        },
        {
            name: "Michael Chen",
            role: "Startup Founder",
            company: "InnovateLab",
            content: "Participating in this program opened doors to invaluable networking opportunities and mentorship. It was a game-changing experience for our startup journey.",
        },
        {
            name: "Emma Williams",
            role: "Project Lead",
            company: "Future Solutions",
            content: "The collaborative environment and expert guidance helped us refine our business strategy. The insights gained were instrumental in our success.",
        },
    ];

    return (
        <div 
            ref={sectionRef} 
            className="bg-signalBlack py-20 relative overflow-hidden"
        >
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className={`
                    absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(186,222,79,0.03),transparent_50%)]
                    transition-transform duration-1000
                    ${isVisible ? 'scale-100' : 'scale-150'}
                `} />
                <div className={`
                    absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(100,149,237,0.03),transparent_50%)]
                    transition-all duration-1000 delay-300
                    ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}
                `} />
            </div>

            <div className="max-w-6xl mx-auto px-6 lg:px-8">
                <div className={`
                    relative transition-all duration-1000
                    ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-12 scale-90'}
                `}>
                    <h2 className="headerText text-juneBud text-center text-3xl lg:text-4xl font-bold">
                        WHY SHOULD I JOIN?
                    </h2>
                    <div className={`
                        absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24
                        transition-all duration-1000 delay-300
                        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                    `}>
                        <div className="absolute inset-0 bg-gradient-to-r from-juneBud to-cornflowerBlue opacity-20 blur-2xl rounded-full" />
                    </div>
                </div>

                <div className={`
                    mt-16 transition-all duration-1000 delay-300
                    ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}
                `}>
                    <Carousel
                        setApi={setApi}
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem key={index}>
                                    <Card className="border-0 bg-transparent">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center max-w-4xl mx-auto">
                                                {/* Profile Section - Left Side */}
                                                <div className={`
                                                    flex items-center gap-6 lg:w-[300px]
                                                    transition-all duration-700 delay-500
                                                    ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}
                                                `}>
                                                    <div className={`
                                                        w-20 h-20 rounded-full overflow-hidden flex-shrink-0
                                                        transition-all duration-700 delay-700
                                                        ${isVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90'}
                                                    `}>
                                                        <div className="w-full h-full relative rounded-full p-[3px] bg-gradient-to-br from-cornflowerBlue via-juneBud to-cornflowerBlue animate-gradient-rotate">
                                                            <div className="w-full h-full rounded-full overflow-hidden bg-signalBlack p-[2px]">
                                                                <div className="w-full h-full rounded-full overflow-hidden relative">
                                                                    <Image
                                                                        src={aboutUsDummy}
                                                                        alt={testimonial.name}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`
                                                        transition-all duration-700 delay-800
                                                        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
                                                    `}>
                                                        <p className="text-cornflowerBlue font-semibold text-lg">
                                                            {testimonial.name}
                                                        </p>
                                                        <p className="text-linen/80 text-sm mt-1">
                                                            {testimonial.role}
                                                        </p>
                                                        <p className="text-juneBud text-sm mt-1">
                                                            {testimonial.company}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Testimonial Content - Right Side */}
                                                <div className={`
                                                    relative flex-1
                                                    transition-all duration-700 delay-1000
                                                    ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
                                                `}>
                                                    <Quote className={`
                                                        w-12 h-12 text-juneBud/20 absolute -top-6 -left-6
                                                        transition-all duration-700 delay-1200
                                                        ${isVisible ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-45 scale-50'}
                                                    `} />
                                                    <p className="text-linen text-lg lg:text-xl leading-relaxed pl-8">
                                                        {testimonial.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className={`
                            flex justify-center gap-4 mt-8
                            transition-all duration-700 delay-1200
                            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                        `}>
                            <CarouselPrevious 
                                onClick={handlePrevClick}
                                className="relative static border-2 border-linen text-linen bg-signalBlack 
                                         hover:bg-linen/20 hover:text-linen transition-colors
                                         hover:scale-110" 
                            />
                            <CarouselNext 
                                onClick={handleNextClick}
                                className="relative static border-2 border-linen text-linen bg-signalBlack 
                                         hover:bg-linen/20 hover:text-linen transition-colors
                                         hover:scale-110" 
                            />
                        </div>
                    </Carousel>
                </div>
            </div>
        </div>
    );
}