'use client';

import { useRef, useState, useEffect } from 'react';

export default function Mission() {
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

    return (
        <div 
            ref={sectionRef}
            className="relative bg-linen px-6 lg:px-12 py-20"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(100,149,237,0.05),transparent_50%)]" />

            <p className={`
                text-2xl lg:text-4xl font-bold text-center text-signalBlack
                transition-all duration-700
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                [text-shadow:0px_0px_20px_rgba(100,149,237,0.2)]
            `}>
                MISSION
            </p>

            <div className="flex items-center gap-6 lg:gap-8 mt-12 w-full justify-center flex-wrap">
                {[1, 2, 3].map((_, index) => (
                    <div 
                        key={index}
                        className={`
                            group relative
                            w-[210px] lg:w-[240px] h-[210px] lg:h-[240px] 
                            bg-signalBlack rounded-xl overflow-hidden
                            transition-all duration-700
                            hover:scale-105 hover:shadow-xl
                            ${isVisible 
                                ? 'opacity-100 translate-y-0' 
                                : 'opacity-0 translate-y-12'
                            }
                        `}
                        style={{
                            transitionDelay: `${(index + 1) * 200}ms`
                        }}
                    >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-cornflowerBlue/0 to-cornflowerBlue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Bottom border animation */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cornflowerBlue via-juneBud to-cornflowerBlue opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    </div>
                ))}
            </div>
        </div>
    );
}
