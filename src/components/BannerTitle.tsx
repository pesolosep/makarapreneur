// BannerTitle.tsx (Client Component)
'use client';

import { useEffect, useRef, useState } from 'react';

interface BannerTitleProps {
    title: string;
}

export function BannerTitle({ title }: BannerTitleProps) {
    const [isVisible, setIsVisible] = useState(false);
    const titleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const element = titleRef.current;
        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, []);

    return (
        <div 
            ref={titleRef}
            className="relative z-20 px-6 lg:px-12 max-w-4xl mt-12"
        >
            <h2 
                className={`
                    text-4xl lg:text-5xl font-bold text-linen
                    transition-all duration-1000 ease-out
                    [text-shadow:_0px_0px_20px_#BADE4F]
                    ${isVisible 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-8'
                    }
                `}
            >
                {title.split(' ').map((word, index) => (
                    <span 
                        key={index}
                        className={`
                            inline-block mr-3
                            transition-all duration-700
                            ${isVisible 
                                ? 'opacity-100 translate-y-0' 
                                : 'opacity-0 translate-y-8'
                            }
                        `}
                        style={{ 
                            transitionDelay: `${index * 100}ms`
                        }}
                    >
                        {word}
                    </span>
                ))}
            </h2>
        </div>
    );
}
