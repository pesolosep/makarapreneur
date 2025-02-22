import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Article } from "@/models/Article"

interface MakaraCardProps {
    article: Article;
}

export default function MakaraCard({ article }: MakaraCardProps) {
    return (
        <Card className="group grow w-full  md:w-[320px] h-full bg-white xself-stretch hover:bg-white transition-all duration-300 
        hover:shadow-xl hover:-translate-y-1 flex flex-col">
    <div className="flex-1 flex flex-col w-full">
        <CardContent className="relative pt-6 pb-1 overflow-hidden">
            <div className="relative rounded-lg overflow-hidden">
                <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={320}
                    height={240}
                    className="transform transition-transform duration-500 group-hover:scale-105 object-cover w-full h-[240px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
        </CardContent>

        <CardHeader className="py-3">
            <CardTitle className="line-clamp-2 text-xl transition-colors duration-300 group-hover:text-cornflowerBlue">
                {article.title}
            </CardTitle>
            <CardDescription className="py-1 text-sm line-clamp-2">
                {article.content.replace(/<[^>]*>/g, '')}
            </CardDescription>
        </CardHeader>
    </div>

    <div className="mt-auto">
        <CardContent className="py-0 pb-2">
            <Link href={`/makarainspires/${article.id}`}>
                <Button className="group/btn relative overflow-hidden text-sm font-medium transition-all duration-300 group-hover/btn:pr-12">
                    <span className="relative z-10 transition-transform duration-300 group-hover/btn:-translate-x-2">
                        Read More
                    </span>
                    <ArrowRight className="absolute z-10 right-2 h-4 w-4 transition-all duration-300 transform opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 translate-x-4" />
                    <div className="absolute inset-0 bg-cornflowerBlue transform transition-transform duration-300 origin-left scale-x-0 group-hover/btn:scale-x-100" />
                </Button>
            </Link>
        </CardContent>

        <CardFooter className="pb-4">
            <p className="text-xs font-medium text-gray-600">
                {article.createdAt?.toLocaleDateString()}
            </p>
        </CardFooter>
    </div>
</Card>
    )
}