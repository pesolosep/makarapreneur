"use client";

import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import bankMandiri from "@/assets/sponsorsLogo/bankMandiri.svg";
import gojek from "@/assets/sponsorsLogo/gojek.png";
import jasaMarga from "@/assets/sponsorsLogo/jasaMarga.png";
import jiwasraya from "@/assets/sponsorsLogo/jiwasraya.png";
import Image from "next/image";

import { getDocuments } from "@/lib/firebase/crud";
import { Medpar } from "@/models/Medpar";

const sponsorsLink = [
    bankMandiri,
    gojek,
    jasaMarga,
    jiwasraya,
    bankMandiri,
    gojek,
    jasaMarga,
    jiwasraya,
];

const sponsors = Array.from({ length: sponsorsLink.length }).map((_, i) => ({
    id: (i + 1).toString(),
    name: `Sponsor ${i + 1}`,
    imageUrl: sponsorsLink[i],
}));


interface ScrollingWrapperProps {
    items: Array<{ id?: string; name: string; imageUrl: string }>;
    className?: string;
}

function ScrollingWrapper({ items, className = "" }: ScrollingWrapperProps) {
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && contentRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const contentWidth = contentRef.current.scrollWidth / 2; // Dibagi 2 karena konten diduplikasi
            setShouldAnimate(contentWidth > containerWidth);
        }
    }, [items]);

    // Duplikasi items untuk memastikan transisi mulus
    const duplicatedItems = [...items, ...items, ...items, ...items];

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-7xl overflow-hidden mx-auto"
        >
            <div
                ref={contentRef}
                className={`flex gap-4 ${
                    shouldAnimate
                        ? "animate-infinite-scroll hover:[animation-play-state:paused]"
                        : "justify-center"
                }`}
                style={
                    {
                        // Menambahkan CSS variable untuk mengontrol animasi
                        "--scroll-width": `${-100}%`,
                    } as React.CSSProperties
                }
            >
                {duplicatedItems.map((item, index) => (
                    <Card
                        key={`${item.id}-${index}`}
                        className={`flex-shrink-0 bg-linen backdrop-blur-sm hover:bg-linen/80 transition-colors ${className}`}
                    >
                        <CardContent className="flex aspect-square items-center justify-center p-6 w-[140px] lg:w-[200px]">
                            <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={200}
                                height={200}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default function Sponsors() {
    const [mediaPartners, setMediaPartners] = useState<Medpar[]>([]);

    useEffect(() => {
        const fetchPartners = async () => {
            const partners = await getDocuments<Medpar>("mediaPartners")
            setMediaPartners(partners)
        }   
        fetchPartners()
    }, [])

    return (
        <div className="bg-signalBlack text-linen">
            <div className="flex flex-col justify-center items-center py-12">
                <h2 className="headerText text-juneBud text-2xl lg:text-4xl">
                    PAST SPONSORS
                </h2>
                <div className="mt-8 w-full px-6">
                    <ScrollingWrapper
                        items={sponsors}
                        className="border-juneBud/20 hover:border-juneBud/40"
                    />
                </div>
            </div>

            <div className="flex flex-col justify-center items-center pb-12">
                <h2 className="headerText text-cornflowerBlue text-2xl lg:text-4xl">
                    MEDIA PARTNERS
                </h2>
                <div className="mt-8 w-full px-6">
                    <ScrollingWrapper
                        items={mediaPartners}
                        className="border-juneBud/20 hover:border-juneBud/40"
                    />
                </div>
            </div>
        </div>
    );
}
