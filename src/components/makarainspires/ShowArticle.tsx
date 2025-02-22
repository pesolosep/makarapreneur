"use client"
import Image from "next/image";
import MakaraCard from "./MakaraCard";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Article } from "@/models/Article";
import { getRandomArticles } from "@/lib/firebase/article";

interface Props {
    article: Article
}

export default function ShowArticle({ article }: Props) {
    const [isVisible, setIsVisible] = useState(false);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
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

    useEffect(() => {
        const fetchRelatedArticles = async () => {
            try {
                const randomArticles = await getRandomArticles(2);
                setRelatedArticles(randomArticles);
            } catch (error) {
                console.error('Error fetching related articles:', error);
                setRelatedArticles([]);
            }
        };

        fetchRelatedArticles();
    }, []);

    return (
        <article ref={articleRef} className="w-full bg-[#F5F3F0]">
            {/* Hero Section */}
            <div className="w-full bg-signalBlack">
                <div className="relative h-[60vh] max-w-4xl mx-auto">
                    {/* Container untuk gambar dan overlay */}
                    <div className={twMerge(
                        "absolute inset-0 opacity-0 transition-all duration-1000 overflow-hidden",
                        isVisible && "opacity-100"
                    )}>
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            width={1920}
                            height={1080}
                            className="object-cover w-full h-full rounded-lg"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-signalBlack via-signalBlack/50 to-signalBlack/30 rounded-lg" />
                    </div>
                    
                    {/* Hero Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-linen">
                        <div className={twMerge(
                            "space-y-4 opacity-0 transform translate-y-8 transition-all duration-1000 delay-300",
                            isVisible && "opacity-100 translate-y-0"
                        )}>
                            <div className="flex items-center gap-4 text-sm md:text-base">
                                <span className="bg-signalBlack/20 px-3 py-1 rounded-full">
                                    {article.createdAt?.toLocaleDateString()}
                                </span>
                            </div>
                            <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl leading-tight">
                                {article.title}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Article Body */}
                <div className="prose prose-lg max-w-none">
                    <div className={twMerge(
                        "opacity-0 transition-all duration-1000 delay-700",
                        isVisible && "opacity-100"
                    )}>
                        <div 
                            dangerouslySetInnerHTML={{ __html: article.content }}
                            className="space-y-6 text-lg leading-relaxed"
                        />
                    </div>
                </div>

                {/* Related Articles */}
                <div className={twMerge(
                    "mt-16 pt-12 border-t border-signalBlack/10 opacity-0 transition-all duration-1000 delay-1000",
                    isVisible && "opacity-100"
                )}>
                    <h2 className="text-2xl font-bold mb-8">Other Articles</h2>
                    <div className="flex flex-col md:grid grid-cols-2 gap-4 items-center md:justify-start w-full">
                        {relatedArticles.map((relatedArticle) => (
                            <div key={relatedArticle.id} className="flex w-full md:w-auto h-full">
                            <MakaraCard 
                            article={relatedArticle} 
                        />
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
}