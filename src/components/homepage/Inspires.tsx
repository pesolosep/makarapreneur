'use client'
import { useRef, useState, useEffect } from "react"
import { twMerge } from "tailwind-merge"
import MakaraCard from "../makarainspires/MakaraCard"
import { Article } from "@/models/Article"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { getArticleCount, getArticles, getHomepageArticles } from "@/lib/firebase/article"

interface InspireProps {
    variant?: string
    showAll?: boolean
}

export default function Inspires({ variant, showAll }: InspireProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [articles, setArticles] = useState<Article[]>([])
    const [totalArticles, setTotalArticles] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const articlesPerPage = showAll ? 6 : 3
    const sectionRef = useRef<HTMLDivElement>(null)
    const secondary = variant === "secondary"

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                if (showAll) {
                    const articlesData = await getArticles();
                    setTotalArticles(articlesData.length);
                    setArticles(articlesData);
                } else {
                    const [homepageArticles, totalCount] = await Promise.all([
                        getHomepageArticles(),
                        getArticleCount()
                    ]);
                    setTotalArticles(totalCount);
                    setArticles(homepageArticles);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
                setArticles([]);
                setTotalArticles(0);
            }
        };
    
        fetchArticles();
    }, [showAll]);

    // Intersection Observer effect tetap sama
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.2 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current)
            }
        }
    }, [])

    // Get current articles for pagination
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(articles.length / articlesPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        // Scroll to top of section smoothly
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div
            ref={sectionRef}
            className={twMerge(
                "relative py-16 overflow-hidden",
                secondary
                    ? "bg-signalBlack"
                    : "bg-gradient-to-b from-juneBud via-juneBud/90 to-[#5E76BF]"
            )}
        >
            {/* Background decorations remain same */}
            {!secondary && (
                <>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(110,142,236,0.15),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(110,142,236,0.1),transparent_50%)]" />
                </>
            )}

            {/* Title remains same */}
            {!secondary && (
                <h2 className={twMerge(
                    "text-2xl lg:text-4xl font-bold text-center text-cornflowerBlue mb-12 transition-all duration-700 [text-shadow:0px_0px_20px_rgba(110,142,236,0.3)]",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}>
                    MAKARA INSPIRES
                </h2>
            )}

            {/* Articles grid */}
            <div className={twMerge(
                "flex flex-wrap justify-center gap-10 px-6 lg:px-12 max-w-7xl mx-auto",
                secondary && "mt-0",
                isVisible && "animate-in zoom-in-50 duration-1000"
            )}>
                {currentArticles.map((article, index) => (
                    <div
                        key={article.id}
                        className={twMerge(
                            "transition-all duration-700 flex  px-2 w-full md:w-auto",
                            isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-16",
                            `delay-[${index * 200}ms]`
                        )}
                    >
                        <MakaraCard article={article} />
                    </div>
                ))}
            </div>

            {/* Pagination controls */}
            {showAll && totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-12">
                    <Button
                        variant="outline"
                        className="rounded-full w-12 h-12 p-0 hover:bg-juneBud hover:text-white transition-colors"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                            key={i + 1}
                            variant={currentPage === i + 1 ? "default" : "outline"}
                            className={twMerge(
                                "rounded-full w-12 h-12 p-0 transition-colors",
                                currentPage === i + 1 ? "bg-juneBud text-white" : "hover:bg-juneBud hover:text-white"
                            )}
                            onClick={() => paginate(i + 1)}
                        >
                            {i + 1}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        className="rounded-full w-12 h-12 p-0 hover:bg-juneBud hover:text-white transition-colors"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </Button>
                </div>
            )}

            {/* See more button only shows in non-showAll mode */}
            {!showAll && totalArticles > 3 && (
                <div className={twMerge(
                    "flex justify-center mt-12 pb-12 transition-all duration-700",
                    isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                )}>
                    <Link href="/makarainspires">
                        <Button 
                            className="group/btn relative overflow-hidden rounded-full px-12 py-6 text-xl font-bold bg-juneBud text-white hover:shadow-[0_8px_30px_rgb(110,236,110,0.3)] hover:scale-105 transition-all duration-500"
                        >
                            <span className="relative z-10 transition-transform duration-500 group-hover/btn:-translate-x-4">
                                Explore More Articles
                            </span>
                            <ArrowRight className="absolute right-8 z-10 w-8 h-8 transition-all duration-500 transform opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 translate-x-4" />
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}