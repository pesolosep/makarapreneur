'use client'

import { useRef, useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"

const sponsors = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    name: `Sponsor ${i + 1}`
}))

const mediaPartners = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    name: `Media Partner ${i + 1}`
}))

interface ScrollingWrapperProps {
    items: Array<{ id: number; name: string }>
    className?: string
}

function ScrollingWrapper({ items, className = "" }: ScrollingWrapperProps) {
    const [shouldAnimate, setShouldAnimate] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current && contentRef.current) {
            const containerWidth = containerRef.current.offsetWidth
            const contentWidth = contentRef.current.scrollWidth / 2 // Dibagi 2 karena konten diduplikasi
            setShouldAnimate(contentWidth > containerWidth)
        }
    }, [items])

    // Duplikasi items untuk memastikan transisi mulus
    const duplicatedItems = [...items, ...items, ...items]

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
                style={{
                    // Menambahkan CSS variable untuk mengontrol animasi
                    '--scroll-width': `${-100}%`
                } as React.CSSProperties}
            >
                {duplicatedItems.map((item, index) => (
                    <Card 
                        key={`${item.id}-${index}`}
                        className={`flex-shrink-0 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors ${className}`}
                    >
                        <CardContent className="flex aspect-square items-center justify-center p-6 w-[140px] lg:w-[200px]">
                            <span className="text-2xl font-semibold text-linen">
                                {item.id}
                            </span>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default function Sponsors() {
    return (
        <div className="bg-signalBlack text-linen">
            <div className="flex flex-col justify-center items-center py-12">
                <h2 className="headerText text-juneBud text-2xl lg:text-4xl">
                    SPONSORS
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
    )
}