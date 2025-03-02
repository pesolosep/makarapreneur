"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "../ui/button"
import aboutus from "@/assets/makarapreneur/aboutus.jpg"
import aboutus2 from "@/assets/makarapreneur/aboutus2.jpg"
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

    const textPrimary = [
        `Makarapreneur adalah program di bawah naungan HIPMI PT Universitas Indonesia (UI) Periode 2024/2025 yang bertujuan untuk membentuk wirausahawan muda yang inovatif dan kompetitif. Nama "Makarapreneur" terinspirasi dari perpaduan kata "Makara", simbol kebanggaan UI, dan "Entrepreneur", yang mencerminkan semangat kewirausahaan.`,
    ]

    const textSecondary = [
        `Makarapreneur adalah program di bawah naungan HIPMI PT Universitas Indonesia (UI) Periode 2024/2025 yang bertujuan untuk membentuk wirausahawan muda yang inovatif dan kompetitif. Nama "Makarapreneur" terinspirasi dari perpaduan kata "Makara", simbol kebanggaan UI, dan "Entrepreneur", yang mencerminkan semangat kewirausahaan.`,
        `Dengan visi memberikan kesempatan bagi mahasiswa Universitas Indonesia dan perguruan tinggi lainnya untuk mengembangkan potensi mereka dalam dunia bisnis, Makarapreneur hadir sebagai wadah bagi generasi muda untuk menciptakan solusi kreatif, beradaptasi dengan tantangan industri, dan membangun bisnis yang berkelanjutan.`,
        `Sebagai bagian dari program ini, kompetisi bisnis Makarapreneur menjadi ajang bagi para inovator muda untuk mengasah ide dan strategi bisnis mereka. Mengusung tema "Beyond Survival: Thriving as an Entrepreneur in a World of Uncertainty", program ini berfokus pada pengembangan keterampilan wirausaha yang tidak hanya mampu bertahan, tetapi juga tumbuh dan berkembang di tengah ketidakpastian.`,
        `Melalui berbagai kegiatan, mentoring, dan networking, Makarapreneur berkomitmen untuk menciptakan ekosistem bisnis yang mendorong kreativitas, kolaborasi, dan daya saing tinggi. Bersama Makarapreneur, saatnya menciptakan peluang, berinovasi, dan menjadi bagian dari generasi entrepreneur masa depan!`,
    ]
    const text = isSecondary ? textSecondary : textPrimary

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setIsActive(true)
                    setHasAnimated(true)
                }
            },
            { threshold: 0.1 } // Reduced threshold for mobile
        )

        const currentSectionRef = sectionRef.current;
        if (currentSectionRef) {
            observer.observe(currentSectionRef)
        }

        return () => {
            if (currentSectionRef) {
                observer.unobserve(currentSectionRef)
            }
        }
    }, [hasAnimated])

    const containerStyle = {
        height: isActive ? height || "max-content" : 200,
        transition: "all 1000ms ease-in-out",
    }

    if (!isSecondary) {
        return (
            <section
                ref={sectionRef}
                id="about-section"
                className="text-linen w-full bg-signalBlack relative"
            >
                <div
                    style={containerStyle}
                    className="container mx-auto px-6 relative backdrop-blur-sm flex items-center justify-center"
                >
                    <div className="flex flex-wrap gap-12 items-center py-16 w-full px-6 justify-center">
                        <div className="space-y-8 max-w-[600px]">
                            <h1
                                className={twMerge(
                                    "text-2xl lg:text-4xl font-bold transition-all duration-1000 opacity-0 bg-gradient-to-r from-cornflowerBlue to-cornflowerBlue/80 px-8 rounded-2xl py-3 inline-block",
                                    isActive && "opacity-100"
                                )}
                            >
                                ABOUT US
                            </h1>
                            <div className="space-y-6">
                                {text.map((paragraph, index) => (
                                    <p
                                        key={index}
                                        className={twMerge(
                                            "text-base lg:text-lg leading-relaxed opacity-0 transition-opacity duration-1000",
                                            isActive && "opacity-100",
                                            isActive && `delay-[${(index + 1) * 200}ms]`
                                        )}
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
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
                        </div>

                        <div
                            className={twMerge(
                                "relative h-full flex items-center justify-center opacity-0 transition-all duration-1000 group",
                                isActive && "opacity-100 delay-700"
                            )}
                        >
                            <Image
                                src={aboutus}
                                alt="About Us Illustration"
                                className="object-contain w-full max-h-[500px] max-w-[500px] rounded-md transition-transform duration-300 group-hover:rotate-3"
                            />
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    // Magazine style for secondary mode
    return (
        <section
            ref={sectionRef}
            id="about-section"
            className={twMerge(
                "text-signalBlack bg-linen w-full overflow-hidden",
                isActive && "animate-fadeIn"
            )}
        >
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-4 py-16 w-full px-6 justify-center max-w-[1200px] mx-auto">
                    {/* Left Column - Main Content */}
                    <div className={twMerge(
                        "lg:col-span-7 space-y-4 max-w-[600px] opacity-0 translate-x-8",
                        isActive && "animate-slideFromRight"
                    )}>
                        <h1 className={twMerge(
                            "text-2xl lg:text-4xl font-bold opacity-0 transition-all duration-1000 border-b-2 border-signalBlack/20 pb-4 transform translate-y-4",
                            isActive && "opacity-100 translate-y-0"
                        )}>
                            ABOUT US
                        </h1>

                        {/* First Paragraph - Larger */}
                        <p className={twMerge(
                            "text-lg lg:text-xl text-justify font-medium leading-relaxed opacity-0 transition-all duration-1000 delay-200 transform translate-y-4",
                            isActive && "opacity-100 translate-y-0"
                        )}>
                            {textSecondary[0]}
                        </p>

                        {/* Two Column Layout for Middle Paragraphs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-justify">
                            <p className={twMerge(
                                "text-base lg:text-lg leading-relaxed opacity-0 transition-all duration-1000 delay-300 transform translate-y-4",
                                isActive && "opacity-100 translate-y-0"
                            )}>
                                {textSecondary[1]}
                            </p>
                            <p className={twMerge(
                                "text-base lg:text-lg leading-relaxed opacity-0 transition-all duration-1000 delay-400 transform translate-y-4",
                                isActive && "opacity-100 translate-y-0"
                            )}>
                                {textSecondary[2]}
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Quote and Image */}
                    <div className={twMerge(
                        "lg:col-span-5 space-y-8 opacity-0 -translate-x-8",
                        isActive && "animate-slideFromLeft"
                    )}>
                        <div className={twMerge(
                            "opacity-0 transition-all duration-1000 delay-500",
                            isActive && "opacity-100"
                        )}>
                            <div className={twMerge(
                                "transform scale-95 transition-all duration-700 delay-600",
                                isActive && "scale-100"
                            )}>
                                <Image
                                    src={aboutus2}
                                    alt="About Us Illustration"
                                    className="object-contain w-full max-h-[500px] max-w-[500px] rounded-md transition-transform duration-300 group-hover:rotate-3"
                                />
                            </div>
                            <blockquote className={twMerge(
                                "mt-4 text-base italic border-l-4 border-signalBlack/20 pl-4 opacity-0 transform translate-y-4 transition-all duration-700 delay-700",
                                isActive && "opacity-100 translate-y-0"
                            )}>
                                {`"Beyond Survival: Thriving as an Entrepreneur in a World of Uncertainty"`}
                            </blockquote>
                        </div>
                    </div>

                    {/* Full Width Bottom Paragraph */}
                    <div className="lg:col-span-12">
                        <p className={twMerge(
                            "text-base lg:text-lg leading-relaxed opacity-0 transform translate-y-4 transition-all duration-1000 delay-800",
                            isActive && "opacity-100 translate-y-0"
                        )}>
                            {textSecondary[3]}
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes slideFromRight {
                    0% {
                        opacity: 0;
                        transform: translateX(2rem);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideFromLeft {
                    0% {
                        opacity: 0;
                        transform: translateX(-2rem);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .animate-slideFromRight {
                    animation: slideFromRight 1s ease-out forwards;
                }

                .animate-slideFromLeft {
                    animation: slideFromLeft 1s ease-out forwards;
                }

                .animate-fadeIn {
                    animation: fadeIn 1s ease-out forwards;
                }
            `}</style>
        </section>
    )
}