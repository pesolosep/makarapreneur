"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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

interface CarouselWrapperProps {
    items: Array<{ id?: string; name: string; imageUrl: string }>;
    className?: string;
}

function CarouselWrapper({ items, className = "" }: CarouselWrapperProps) {
    const plugin = Autoplay({ delay: 2000, stopOnInteraction: false });

    return (
        <div className="w-full max-w-7xl mx-auto">
            <Carousel
                plugins={[plugin]}
                className="w-full"
                opts={{
                    align: "start",
                    loop: true,
                }}
            >
                <CarouselContent className="-ml-2 md:-ml-4">
                    {items.map((item, index) => (
                        <CarouselItem key={`${item.id}-${index}`} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                            <Card className={`bg-linen backdrop-blur-sm hover:bg-linen/80 transition-colors ${className}`}>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        width={200}
                                        height={200}
                                    />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
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
                    <CarouselWrapper
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
                    <CarouselWrapper
                        items={mediaPartners}
                        className="border-juneBud/20 hover:border-juneBud/40"
                    />
                </div>
            </div>
        </div>
    );
}
