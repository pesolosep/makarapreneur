/* eslint-disable @typescript-eslint/no-unused-vars */
// components/homepage/Inspires.tsx
'use client'
import { useRef, useState, useEffect } from "react"
import { twMerge } from "tailwind-merge"
import MakaraCard from "../makarainspires/MakaraCard"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase"
import { Article } from "@/models/Article"

interface InspireProps {
    variant?: string
}

export default function Inspires({ variant }: InspireProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [articles, setArticles] = useState<Article[]>([])
    const sectionRef = useRef<HTMLDivElement>(null)
    const secondary = variant === "secondary"

    useEffect(() => {
        const fetchArticles = async () => {
            const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const articlesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate()
            })) as Article[];
            setArticles(articlesData);
        };
        fetchArticles();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.2 }
        )

        const currentSectionRef = sectionRef.current;
        if (currentSectionRef) {
            observer.observe(currentSectionRef);
        }

        return () => {
            if (currentSectionRef) {
                observer.unobserve(currentSectionRef);
            }
        }
    }, [])

    return (
        <div ref={sectionRef} className={twMerge(/* existing classes */)}>
            {/* Background decoration */}
            {!secondary && (
                <>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(110,142,236,0.15),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(110,142,236,0.1),transparent_50%)]" />
                </>
            )}

            {!secondary && (
                <h2 className={twMerge(/* existing classes */)}>
                    MAKARA INSPIRES
                </h2>
            )}

            <div className={twMerge(/* existing classes */)}>
                {articles.map((article, index) => (
                    <div key={article.id} className={twMerge(/* existing classes */)}>
                        <MakaraCard article={article} />
                    </div>
                ))}
            </div>
        </div>
    )
}
