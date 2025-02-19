"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import aboutUsDummy from "@/assets/aboutUsDummy.svg";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

interface Variant {
    variant?: string;
    height?: number;
}

export default function AboutUs({ variant, height }: Variant) {
    const isSecondary = variant === "secondary";
    const [isActive, setIsActive] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const textPrimary = [
        "Makarapreneur adalah program di bawah naungan HIPMI PT Universitas Indonesia (UI) Periode 2024/2025 yang bertujuan untuk membentuk wirausahawan muda yang inovatif dan kompetitif. Nama “Makarapreneur” terinspirasi dari perpaduan kata “Makara”, simbol kebanggaan UI, dan “Entrepreneur”, yang mencerminkan semangat kewirausahaan.",
    ];
    const textSecondary = [
        "Makarapreneur adalah program di bawah naungan HIPMI PT Universitas Indonesia (UI) Periode 2024/2025 yang bertujuan untuk membentuk wirausahawan muda yang inovatif dan kompetitif. Nama “Makarapreneur” terinspirasi dari perpaduan kata “Makara”, simbol kebanggaan UI, dan “Entrepreneur”, yang mencerminkan semangat kewirausahaan.",
        "Dengan visi memberikan kesempatan bagi mahasiswa Universitas Indonesia dan perguruan tinggi lainnya untuk mengembangkan potensi mereka dalam dunia bisnis, Makarapreneur hadir sebagai wadah bagi generasi muda untuk menciptakan solusi kreatif, beradaptasi dengan tantangan industri, dan membangun bisnis yang berkelanjutan.",
        "Sebagai bagian dari program ini, kompetisi bisnis Makarapreneur menjadi ajang bagi para inovator muda untuk mengasah ide dan strategi bisnis mereka. Mengusung tema “Beyond Survival: Thriving as an Entrepreneur in a World of Uncertainty”, program ini berfokus pada pengembangan keterampilan wirausaha yang tidak hanya mampu bertahan, tetapi juga tumbuh dan berkembang di tengah ketidakpastian.",
        "Melalui berbagai kegiatan, mentoring, dan networking, Makarapreneur berkomitmen untuk menciptakan ekosistem bisnis yang mendorong kreativitas, kolaborasi, dan daya saing tinggi. Bersama Makarapreneur, saatnya menciptakan peluang, berinovasi, dan menjadi bagian dari generasi entrepreneur masa depan!",
    ];
    const text = isSecondary ? textSecondary : textPrimary;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setIsActive(true);
                    setHasAnimated(true);
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
    }, [hasAnimated]);

    const containerStyle = {
        height: isActive ? height || "max-content" : 200,
        transition: "all 1000ms ease-in-out",
    };

    return (
        <section
            ref={sectionRef}
            id="about-section"
            className={twMerge(
                "text-linen w-full bg-signalBlack relative",
                isSecondary && "text-signalBlack bg-linen"
            )}
        >
            <div
                style={containerStyle}
                className="container mx-auto px-6 relative backdrop-blur-sm flex items-center justify-center"
            >
                <div className="flex flex-wrap gap-12 items-center py-16 w-full px-6 justify-center">
                    <div
                        className="space-y-8 max-w-[600px]"
                    >
                        <h1
                            className={twMerge(
                                "text-2xl lg:text-4xl font-bold transition-all duration-1000 opacity-0",
                                !isSecondary &&
                                    "bg-gradient-to-r from-cornflowerBlue to-cornflowerBlue/80 px-8 rounded-2xl py-3 inline-block",
                                isActive && "opacity-100"
                            )}
                        >
                            ABOUT US
                        </h1>
                        <div className="space-y-3">
                            {text.map((paragraph, index) => (
                                <p
                                    key={index}
                                    className={twMerge(
                                        "text-base lg:text-lg leading-relaxed opacity-0 transition-opacity duration-1000 delay-300",
                                        isActive && "opacity-100",
                                        isSecondary && "lg:text-sm"
                                    )}
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {!isSecondary && (
                            <div
                                className={twMerge(
                                    "transition-opacity duration-1000 delay-500 opacity-0",
                                    isActive && "opacity-100"
                                )}
                            >
                                <Link href="/aboutus">
                                    <Button className="rounded-full px-8 py-6 text-base hover:scale-105 transition-transform">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div
                        className={twMerge(
                            "relative h-full flex items-center justify-center opacity-0 transition-all duration-1000 group",
                            isActive && "opacity-100 delay-700"
                        )}
                    >
                        <Image
                            src={aboutUsDummy}
                            alt="About Us Illustration"
                            className="object-contain w-full max-h-[500px] rounded-md transition-transform duration-300 group-hover:rotate-3"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
