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
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

    const startAutoSlide = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            api?.scrollNext();
        }, 5000);
    };

    // Auto-slide functionality
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

    const cardContent = [
        { title: 'BUSINESS CASE COMPETITION - SMA', description: 'Dirancang untuk menginspirasi siswa dalam menciptakan ide bisnis yang kreatif, inovatif, dan praktis, serta membangun pemahaman dasar tentang kewirausahaan.' },
        { title: 'BUSINESS CASE COMPETITION - MAHASISWA', description: 'Platform bagi mahasiswa untuk mengasah keterampilan dalam perencanaan dan pelaksanaan bisnis, dengan fokus pada strategi pertumbuhan dan keberlanjutan.' },
        { title: 'BUSINESS PLAN COMPETITION', description: 'Menantang peserta untuk menganalisis dan memberikan solusi strategis terhadap permasalahan bisnis di dunia nyata, mengasah kemampuan berpikir kritis, inovatif, dan berbasis data.'},
        { title: 'HIPMI TALKS', description: 'HIPMI Talks UI 2025 adalah acara pra-event untuk Makarapreneur 2025 yang bertujuan memberikan wawasan berharga dan menginspirasi generasi muda dalam dunia kewirausahaan.' },
        { title: 'INTERNAL BUSINESS CLASS', description: 'Internal Business Class (IBC) 2025 adalah workshop kewirausahaan yang dirancang khusus untuk fungsionaris dan anggota HIPMI PT UI.' },
        { title: 'NETWORKING NIGHT', description: 'Networking Night 2025 merupakan salah satu rangkaian acara dalam Makarapreneur 2025 yang bertujuan untuk menyatukan individu dari berbagai sektor bisnis dan wilayah.' }
    ]

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
                        {Array.from({ length: 6 }).map((_, index) => (
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
                                                <p className="text-lg lg:text-3xl font-bold text-linen mb-2 text-center [text-shadow:0px_0px_20px_rgba(186,222,79,0.3)]">
                                                    {cardContent[index].title}
                                                </p>
                                                <p className="text-center hidden sm:block lg:block text-signalBlack bg-juneBud/90 backdrop-blur-sm font-medium text-base lg:text-lg px-6 py-2 rounded-lg mx-2 lg:mx-20 transition-all duration-500 group-hover:bg-juneBud">
                                                    {cardContent[index].description}
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
                    <CarouselPrevious 
                        onClick={handlePrevClick}
                        className="border-2 border-linen text-linen bg-signalBlack hover:bg-linen/20 hover:text-linen transition-colors" 
                    />
                    <CarouselNext 
                        onClick={handleNextClick}
                        className="border-2 border-linen text-linen bg-signalBlack hover:bg-linen/20 hover:text-linen transition-colors" 
                    />
                </Carousel>
            </div>
        </div>
    );
}