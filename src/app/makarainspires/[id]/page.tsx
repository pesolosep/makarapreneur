// app/makarainspires/[id]/page.tsx
import { Metadata } from "next";
import Footer from "@/components/Footer";
import ShowArticle from "@/components/makarainspires/ShowArticle";
import Navbar from "@/components/Navbar";
import { notFound } from 'next/navigation';
import { getArticle } from "@/lib/firebase/article";

interface Props {
    params: {
        id: Promise<string>
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const id = await params.id;
        const article = await getArticle(id);
        
        if (!article) {
            return {
                title: 'Article Not Found | Makarapreneur',
                description: 'The article you are looking for could not be found.'
            };
        }

        return {
            title: `${article.title} | Makarapreneur`,
            description: article.content.replace(/<[^>]*>/g, '').slice(0, 155) + '...',
            openGraph: {
                title: article.title,
                description: article.content.replace(/<[^>]*>/g, '').slice(0, 155) + '...',
                images: [article.imageUrl]
            }
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Error | Makarapreneur',
            description: 'An error occurred while loading the article.'
        };
    }
}

export default async function ArticlePage({ params }: Props) {
    try {
        const id = await params.id;
        const article = await getArticle(id);

        if (!article) {
            notFound();
        }

        return (
            <div className="font-poppins">
                <Navbar/>
                <div className = "py-1"></div>
                <div className = "py-11"></div>
                <ShowArticle article={article}/>
                <Footer />
            </div>
        );
    } catch (error) {
        console.error('Error loading article:', error);
        return (
            <div className="font-poppins min-h-screen">
                <Navbar/>
                <div className="flex flex-col items-center justify-center min-h-[60vh] py-11 gap-4">
                    <h2 className="text-2xl font-bold">Error Loading Article</h2>
                    <p>An error occurred while loading the article.</p>
                </div>
                <Footer />
            </div>
        );
    }
}