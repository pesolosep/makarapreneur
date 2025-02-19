"use client"
import Image from "next/image";
import MakaraCard from "./MakaraCard";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function ShowArticle() {
    const [isVisible, setIsVisible] = useState(false);
    const articleRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (articleRef.current) {
            observer.observe(articleRef.current);
        }

        return () => {
            if (articleRef.current) {
                observer.unobserve(articleRef.current);
            }
        };
    }, []);

    return (
        <article ref={articleRef} className="w-full bg-[#F5F3F0]">
            {/* Hero Section */}
            <div className="w-full h-[60vh] relative bg-signalBlack overflow-hidden shadow-lg">
                <div className={twMerge(
                    "absolute inset-0 opacity-0 transition-all duration-1000",
                    isVisible && "opacity-100"
                )}>
                    <Image
                        src={"https://picsum.photos/1920/1080"}
                        alt="Mykonos fragrance hero image"
                        width={1920}
                        height={1080}
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-signalBlack via-signalBlack/50 to-signalBlack/30" />
                </div>
                
                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-linen">
                    <div className="max-w-4xl mx-auto">
                        <div className={twMerge(
                            "space-y-4 opacity-0 transform translate-y-8 transition-all duration-1000 delay-300",
                            isVisible && "opacity-100 translate-y-0"
                        )}>
                            <div className="flex items-center gap-4 text-sm md:text-base">
                                <span className="px-3 py-1 bg-cornflowerBlue text-linen rounded-full">Local Brand</span>
                                <span className="bg-signalBlack/20 px-3 py-1 rounded-full">5 min read</span>
                                <span className="bg-signalBlack/20 px-3 py-1 rounded-full">July 15, 2024</span>
                            </div>
                            <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl leading-tight">
                                Mykonos: Leading the Way in Indonesia&apos;s Local Fragrance Market
                            </h1>
                            <p className="text-xl md:text-2xl text-linen/80 max-w-3xl">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                Reiciendis aperiam consequatur eaque cum aut, delectus
                                recusandae.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Author Info */}
                <div className={twMerge(
                    "flex items-center gap-4 pb-8 mb-8 border-b border-signalBlack/10 opacity-0 transition-all duration-1000 delay-500",
                    isVisible && "opacity-100"
                )}>
                    <Image 
                        src="https://picsum.photos/100/100" 
                        alt="John Doe profile picture"
                        width={48}
                        height={48}
                        className="rounded-full object-cover w-12 h-12"
                    />
                    <div>
                        <div className="font-medium">John Doe</div>
                        <div className="text-sm text-signalBlack/60">Senior Editor at Makarapreneur</div>
                    </div>
                </div>

                {/* Article Body */}
                <div className="prose prose-lg max-w-none">
                    <div className={twMerge(
                        "opacity-0 transition-all duration-1000 delay-700",
                        isVisible && "opacity-100"
                    )}>
                        {/* First Paragraph - Large */}
                        <p className="text-xl leading-relaxed mb-8">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Suscipit, facilis maiores voluptates consequuntur aspernatur
                            laboriosam perferendis! Soluta vitae ratione consequatur
                            blanditiis. Nesciunt ratione, laudantium culpa quam sint
                            rerum quis error.
                        </p>

                        {/* Featured Image with Caption */}
                        <figure className="my-12">
                            <div className="relative aspect-video overflow-hidden rounded-lg">
                                <Image
                                    src={"https://picsum.photos/800/450"}
                                    alt="Detailed product shot"
                                    width={800}
                                    height={450}
                                    className="object-cover w-full transition-transform duration-700 hover:scale-105 brightness-75"
                                />
                            </div>
                            <figcaption className="mt-3 text-center text-base text-signalBlack/60 italic">
                                The Mykonos signature collection showcases the brand's attention to detail
                            </figcaption>
                        </figure>

                        {/* Article Text */}
                        <div className="space-y-6 text-lg leading-relaxed">
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                Suscipit, facilis maiores voluptates consequuntur aspernatur
                                laboriosam perferendis! Soluta vitae ratione consequatur
                                blanditiis. Nesciunt ratione, laudantium culpa quam sint
                                rerum quis error.
                            </p>

                            {/* Pull Quote */}
                            <blockquote className="text-2xl italic font-serif border-l-4 border-cornflowerBlue pl-6 my-8">
                                {"Innovation in fragrance isn't just about the scent—it's about creating an experience that resonates with the modern Indonesian consumer."}
                            </blockquote>

                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                Suscipit, facilis maiores voluptates consequuntur aspernatur
                                laboriosam perferendis! Soluta vitae ratione consequatur
                                blanditiis. Nesciunt ratione, laudantium culpa quam sint
                                rerum quis error.
                            </p>

                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                Suscipit, facilis maiores voluptates consequuntur aspernatur
                                laboriosam perferendis! Soluta vitae ratione consequatur
                                blanditiis. Nesciunt ratione, laudantium culpa quam sint
                                rerum quis error.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tags Section */}
                <div className={twMerge(
                    "mt-12 pt-8 border-t border-signalBlack/10 opacity-0 transition-all duration-1000 delay-1000",
                    isVisible && "opacity-100"
                )}>
                    <h2 className="text-2xl font-bold mb-6">Article Tags</h2>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-4 py-2 bg-cornflowerBlue text-linen rounded-full text-sm">Local Brand</span>
                        <span className="px-4 py-2 bg-cornflowerBlue text-linen rounded-full text-sm">Fragrance</span>
                        <span className="px-4 py-2 bg-cornflowerBlue text-linen rounded-full text-sm">Innovation</span>
                        <span className="px-4 py-2 bg-cornflowerBlue text-linen rounded-full text-sm">Business</span>
                    </div>
                </div>

                {/* Related Articles */}
                <div className={twMerge(
                    "mt-16 pt-12 border-t border-signalBlack/10 opacity-0 transition-all duration-1000 delay-1000",
                    isVisible && "opacity-100"
                )}>
                    <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
                    <div className="flex flex-col md:flex-row  md:flex-wrap gap-8 items-center md:justify-start w-full mx-auto">
                        <MakaraCard />
                        <MakaraCard />
                    </div>
                </div>
            </div>
        </article>
    );
}