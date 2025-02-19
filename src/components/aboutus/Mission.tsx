'use client';

import { useRef, useState, useEffect } from 'react';

export default function Mission() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const textMission = ["Memfasilitasi realisasi ide dan konsep inovatif dari para wirausahawan muda.",
        "Menjembatani para wirausahawan muda dengan peluang untuk mendapatkan pendanaan bagi bisnis mereka.",
        "Meningkatkan pengetahuan dan keterampilan bagi para wirausahawan muda untuk mengembangkan usaha mereka dari usaha kecil menjadi perusahaan publik.",
        "Menginspirasi dan membekali para wirausahawan muda untuk berkembang dan sukses di tengah persaingan bisnis dan tantangan eksternal."
    ]

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

    return (
        <div 
            ref={sectionRef}
            className="relative bg-linen px-6 lg:px-12 py-24 overflow-hidden"
        >
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className={`
                    absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(100,149,237,0.08),transparent_50%)]
                    transition-transform duration-1000
                    ${isVisible ? 'scale-100' : 'scale-150'}
                `} />
                <div className={`
                    absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(186,222,79,0.08),transparent_50%)]
                    transition-all duration-1000 delay-300
                    ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}
                `} />
            </div>

            <div className={`
                relative transition-all duration-1000
                ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-12 scale-90'}
            `}>
                <h2 className="text-2xl lg:text-4xl font-bold text-center text-signalBlack mb-4">
                    MISSION
                </h2>
            </div>

            <div className="flex items-center gap-8 lg:gap-12 mt-16 w-full justify-center flex-wrap">
                {[1, 2, 3, 4].map((_, index) => (
                    <div 
                        key={index}
                        className={`
                            group relative
                            w-[280px] h-[320px] lg:w-[320px] lg:h-[360px]
                            bg-signalBlack rounded-3xl overflow-hidden
                            transition-all duration-500 cursor-pointer
                            hover:shadow-2xl hover:-translate-y-2
                            ${isVisible 
                                ? 'opacity-100 translate-y-0 rotate-0' 
                                : 'opacity-0 translate-y-12 rotate-6'
                            }
                        `}
                        style={{
                            transitionDelay: `${(index + 1) * 200}ms`
                        }}
                    >
                        {/* Enhanced gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-b from-cornflowerBlue/10 via-transparent to-cornflowerBlue/5" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Content container */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-between">
                            {/* Top content area */}
                            <div className="space-y-6">
                                <div className={`
                                    w-12 h-12 rounded-2xl bg-gradient-to-br from-cornflowerBlue to-juneBud
                                    flex items-center justify-center text-xl font-bold text-signalBlack
                                    transition-all duration-500 group-hover:scale-110 group-hover:rotate-6
                                `}>
                                    {index + 1}
                                </div>
                                <h3 className="text-linen text-2xl lg:text-3xl font-bold">
                                    Mission {index + 1}
                                </h3>
                                <p className="text-linen text-sm lg:text-md leading-relaxed">
                                    {textMission[index]}
                                </p>
                            </div>

                        </div>

                        {/* Enhanced bottom border */}
                        <div className="absolute bottom-0 left-0 w-full">
                            <div className="h-1 bg-gradient-to-r from-cornflowerBlue via-juneBud to-cornflowerBlue opacity-30 group-hover:opacity-100 transition-all duration-500" />
                            <div className="h-1 bg-gradient-to-r from-transparent via-juneBud to-transparent w-0 group-hover:w-full transition-all duration-700 -translate-y-1" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}