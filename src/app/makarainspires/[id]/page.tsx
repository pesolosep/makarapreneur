'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import Footer from "@/components/Footer";
import ShowArticle from "@/components/makarainspires/ShowArticle";
import Navbar from "@/components/Navbar";
import { Article } from '@/models/Article';
import { useParams } from 'next/navigation'


export default function ArticlePage() {
    const params = useParams<{ id: string }>()
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            const docRef = doc(db, 'articles', params.id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                setArticle({
                    id: docSnap.id,
                    ...docSnap.data(),
                    createdAt: docSnap.data().createdAt?.toDate(),
                    updatedAt: docSnap.data().updatedAt?.toDate()
                } as Article);
            }
            setLoading(false);
        };

        fetchArticle();
    }, [params.id]);

    if (loading) return <div>Loading...</div>;
    if (!article) return <div>Article not found</div>;

    return (
        <div className="font-poppins">
            <Navbar />
            <ShowArticle article={article} />
            <Footer />
        </div>
    );
}