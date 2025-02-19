'use client';

import { useRef, useState, useEffect } from 'react';

export default function Prinsip() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.9}
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
            className="relative bg-juneBud px-6 lg:px-12 py-28 lg:py-32 space-y-7 flex flex-col justify-center items-center overflow-hidden"
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(110,142,236,0.1),transparent_50%)]" />
            
            <p 
                className={`
                    text-lg font-semibold text-center 
                    bg-cornflowerBlue text-linen px-4 py-1.5
                    transition-all duration-700 transform
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                    [text-shadow:0px_0px_20px_rgba(110,142,236,0.5)]
                `}
            >
                Beyond Survival:
            </p>

            <p 
                className={`
                    text-2xl lg:text-4xl font-bold text-center max-w-4xl
                    transition-all duration-700 delay-200 transform
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                    [text-shadow:0px_0px_20px_rgba(110,142,236,0.5)]
                `}
            >
                Thriving as an Entrepreneur in a World of Uncertainty
            </p>

            {/* Optional decorative lines */}
            <div 
                className={`
                    absolute left-0 w-full h-[1px]
                    transition-all duration-1000 delay-300
                    ${isVisible ? 'opacity-100' : 'opacity-0'}
                `}
                style={{
                    top: '15%',
                    background: 'linear-gradient(to right, transparent, rgba(100,149,237,0.2), transparent)'
                }}
            />
            <div 
                className={`
                    absolute left-0 w-full h-[1px]
                    transition-all duration-1000 delay-300
                    ${isVisible ? 'opacity-100' : 'opacity-0'}
                `}
                style={{
                    bottom: '15%',
                    background: 'linear-gradient(to right, transparent, rgba(100,149,237,0.2), transparent)'
                }}
            />
        </div>
    );
}