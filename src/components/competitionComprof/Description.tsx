'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import aboutUsDummy from "@/assets/aboutUsDummy.svg";
import { twMerge } from "tailwind-merge";
import { ArrowRight } from "lucide-react";

interface VariantProps {
    variant?: string;
    number: number;
    title: string;
    description: string;
    link:string;
}

export default function Description({ variant, number, title, description, link }: VariantProps) {
    const secondary = variant === "secondary";
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

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

    const images = [
        { id: 1, delay: 200 },
        { id: 2, delay: 400 },
        { id: 3, delay: 600 },
        { id: 4, delay: 800 }
    ];

    return (
        <div
            ref={sectionRef}
            className={twMerge(
                "relative overflow-hidden py-20 px-6 lg:px-12",
                secondary ? "bg-signalBlack text-linen" : "bg-juneBud"
            )}
            id={number.toString()}
        >
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className={`
                    absolute inset-0 
                    ${secondary 
                        ? "bg-[radial-gradient(circle_at_30%_50%,rgba(100,149,237,0.05),transparent_50%)]" 
                        : "bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0.03),transparent_50%)]"
                    }
                    transition-transform duration-1000
                    ${isVisible ? 'scale-100' : 'scale-150'}
                `} />
                <div className={`
                    absolute inset-0
                    ${secondary 
                        ? "bg-[radial-gradient(circle_at_70%_50%,rgba(186,222,79,0.05),transparent_50%)]" 
                        : "bg-[radial-gradient(circle_at_70%_50%,rgba(0,0,0,0.03),transparent_50%)]"
                    }
                    transition-all duration-1000 delay-300
                    ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}
                `} />
            </div>

            <div className={`
                max-w-7xl mx-auto
                flex justify-between items-center gap-12 lg:gap-16
                ${secondary ? 'flex-row-reverse' : 'flex-row'}
                flex-wrap
            `}>
                {/* Content Section */}
                <div className={`
                    space-y-8 flex-1 min-w-[300px]
                    transition-all duration-1000
                    ${isVisible 
                        ? 'opacity-100 translate-x-0' 
                        : `opacity-0 ${secondary ? 'translate-x-24' : '-translate-x-24'}`
                    }
                `}>
                    <p className="text-2xl lg:text-3xl font-bold">
                        {title}
                    </p>
                    <p className="text-base lg:text-lg leading-relaxed max-w-[500px] font-medium">
                        {description}
                    </p>
                    <Button 
                        onClick={() => router.push("/competition/" + link)}
                        className={`
                            group relative overflow-hidden rounded-2xl px-6 h-12
                            ${secondary 
                                ? 'bg-gradient-to-r from-cornflowerBlue to-juneBud hover:opacity-90' 
                                : 'bg-signalBlack text-linen hover:bg-signalBlack/90'
                            }
                            transition-all duration-300 hover:pr-12
                        `}
                    >
                        <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-2">
                            Register Now
                        </span>
                        <ArrowRight 
                            className="absolute z-10 right-4 h-5 w-5 transition-all duration-300 
                                     transform opacity-0 group-hover:opacity-100 
                                     group-hover:translate-x-0 translate-x-4" 
                        />
                    </Button>
                </div>

                {/* Images Grid */}
                <div className={`
                    grid grid-cols-2 gap-4 lg:gap-6
                    w-full max-w-[600px]
                    transition-all duration-1000 delay-300
                    ${isVisible 
                        ? 'opacity-100 translate-x-0' 
                        : `opacity-0 ${secondary ? '-translate-x-24' : 'translate-x-24'}`
                    }
                `}>
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className={`
                                relative overflow-hidden rounded-2xl group
                                transition-all duration-700
                                ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}
                            `}
                            style={{ transitionDelay: `${image.delay}ms` }}
                        >
                            <Image
                                src={aboutUsDummy}
                                alt="image"
                                className="w-full transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className={`
                                absolute inset-0 transition-opacity duration-500
                                ${secondary 
                                    ? 'bg-gradient-to-t from-cornflowerBlue/20 to-transparent' 
                                    : 'bg-gradient-to-t from-signalBlack/20 to-transparent'
                                }
                                opacity-0 group-hover:opacity-100
                            `} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}