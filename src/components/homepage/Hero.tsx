"use client"
import team from "@/assets/teamCompressed.jpg"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

export default function Hero() {
    const scrollToAbout = () => {
        const aboutSection = document.getElementById('about-section')
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <div className="bg-signalBlack text-signalBlack flex flex-col items-center text-center justify-center h-screen relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center animate-fade-in">
                <h1 className="font-semibold text-2xl lg:text-5xl tracking-widest mb-4 lg:mb-6 z-20 bg-juneBud px-8 py-4 animate-slide-down">
                    MAKARAPRENEUR
                </h1>
                <h2 className="font-medium z-20 bg-cornflowerBlue text-linen text-base lg:text-lg px-6 py-3 animate-slide-up">
                    #ForTheFuture
                </h2>
            </div>
            
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image 
                    src={team} 
                    alt="team" 
                    className="object-cover w-full h-screen blur-[0.5px]"
                    priority
                    placeholder="blur"
                />
            </div>

            {/* Overlay gradient - made stronger for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 z-10"></div>

            {/* Scroll indicator */}
            <button 
                onClick={scrollToAbout}
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 text-linen hover:text-juneBud transition-all hover:scale-110"
                aria-label="Scroll to about section"
            >
                <ChevronDown className="w-12 h-12 animate-bounce" />
            </button>
        </div>
    )
}