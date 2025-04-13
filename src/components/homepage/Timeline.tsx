'use client'

import { useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"

const timelineData = [
    {
        title: "NETWORKING NIGHT",
        description: "HIPMI PT UI WITH HIPMI NETWORK",
        date: "17 APRIL 2024"
    },
    {
        title: "HIPMI TALKS UI",
        description: "",
        date: "17 APRIL 2025"
    },
    {
        title: "HIPMI UI CLASS",
        description: "EPISODE 1",
        date: "2nd & 3rd week of April"
    },
    {
        title: "HIPMI UI CLASS",
        description: "EPISODE 2",
        date: "4th & 5th week of April"
    },
    {
        title: "HIPMI UI CLASS",
        description: "EPISODE 3",
        date: "1st & 2nd week of May"
    },
    {
        title: "AWARDING NIGHT",
        description: "",
        date: "17 MAY 2025"
    }
]

export default function Timeline() {
    const [isActive, setIsActive] = useState(false)
    const [activeCards, setActiveCards] = useState<boolean[]>(new Array(timelineData.length).fill(false))
    const sectionRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const observers = cardsRef.current.map((card, index) => {
            return new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        setActiveCards(prev => {
                            const newState = [...prev]
                            newState[index] = true
                            return newState
                        })
                    }
                },
                { threshold: 0.5 }
            )
        })

        const mainObserver = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsActive(true)
                }
            },
            { threshold: 0.2 }
        )

        if (sectionRef.current) {
            mainObserver.observe(sectionRef.current)
        }

        cardsRef.current.forEach((card, index) => {
            if (card) observers[index].observe(card)
        })

        return () => {
            observers.forEach(observer => observer.disconnect())
            mainObserver.disconnect()
        }
    }, [])

    const setCardRef = (el: HTMLDivElement | null, index: number) => {
        cardsRef.current[index] = el
    }

    return (
        <div 
            ref={sectionRef}
            className="bg-linen text-signalBlack px-6 lg:px-12 flex flex-col justify-center items-center py-12 relative text-sm"
        >
            <h1 className="headerText bg-juneBud text-center px-8 py-3 rounded-xl font-semibold text-2xl lg:text-4xl mb-8">
                TIMELINE
            </h1>

            {/* Main timeline line */}
            <div 
                className={twMerge(
                    "absolute left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-cornflowerBlue to-juneBud transition-all duration-1000",
                    isActive ? "h-[calc(100%-8rem)]" : "h-0"
                )}
                style={{
                    top: "10.4rem",
                }}
            />

            <div className="mt-2 max-w-6xl w-full space-y-0">
                {timelineData.map((item, index) => (
                    <div 
                        key={index}
                        ref={(el) => setCardRef(el, index)}
                        className={twMerge(
                            "relative mb-1 opacity-0 transition-all duration-700",
                            activeCards[index] && "opacity-100",
                            index % 2 === 0 ? "ml-[50%] pl-6" : "mr-[50%] pr-6 text-right"
                        )}
                    >
                        {/* Dot indicator */}
                        <div className={twMerge(
                            "absolute top-3 w-4 h-4 rounded-full transition-all duration-500 z-10",
                            index % 2 === 0 ? "-left-2" : "-right-2",
                            activeCards[index]
                                ? "bg-juneBud scale-100" 
                                : "bg-transparent scale-0"
                        )}>
                            <div className="absolute inset-0 rounded-full bg-juneBud/50 animate-ping" />
                        </div>

                        {/* Content card */}
                        <div className={twMerge(
                            "space-y-2 bg-signalBlack px-4 py-3 rounded-xl relative transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
                            index % 2 === 0 
                                ? "transform -translate-x-6"
                                : "transform translate-x-6",
                            activeCards[index] && "translate-x-0"
                        )}>
                            <h2 className="text-juneBud text-base font-semibold">{item.title}</h2>
                            <p className="text-linen text-sm leading-relaxed">{item.description}</p>
                            <p className="text-cornflowerBlue text-xs">{item.date}</p>
                            
                            {/* Arrow connector */}
                            <div className={twMerge(
                                "absolute w-4 h-4 bg-signalBlack rotate-45 top-3",
                                index % 2 === 0 ? "-left-2" : "-right-2"
                            )} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}