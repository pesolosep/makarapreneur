import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function MakaraCard() {
    return (
        <Card className="group w-[320px] bg-white hover:bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardContent className="relative pt-6 pb-1 overflow-hidden">
                <div className="relative rounded-lg overflow-hidden">
                    <Image
                        src={"https://picsum.photos/320/240"}
                        alt="image"
                        width={320}
                        height={240}
                        className="transform transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            </CardContent>

            <CardHeader className="py-3">
                <CardTitle className="line-clamp-2 text-xl transition-colors duration-300 group-hover:text-cornflowerBlue">
                    Mykonos: Leading the Way in Indonesia&apos;s Local Fragrance Market
                </CardTitle>
                <CardDescription className="py-1 text-sm line-clamp-2">
                    Who doesn&apos;t know Mykonos? A proudly Indonesian
                    fragrance brand founded in 2019 that has captivated
                </CardDescription>
            </CardHeader>

            <CardContent className="py-0 pb-2">
                <Link href="/makarainspires/1">
                <Button 
                    className="group/btn relative overflow-hidden text-sm font-medium transition-all duration-300 group-hover/btn:pr-12"
                >
                    <span className="relative z-10 transition-transform duration-300 group-hover/btn:-translate-x-2">
                        Read More
                    </span>
                    <ArrowRight 
                        className="absolute z-10 right-2 h-4 w-4 transition-all duration-300 transform opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 translate-x-4"
                    />
                    <div className="absolute inset-0 bg-cornflowerBlue transform transition-transform duration-300 origin-left scale-x-0 group-hover/btn:scale-x-100" />
                </Button>
                </Link>
            </CardContent>

            <CardFooter className="pb-4">
                <p className="text-xs font-medium text-gray-600">24 December 2024</p>
            </CardFooter>
        </Card>
    )
}