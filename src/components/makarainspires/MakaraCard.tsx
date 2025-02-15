import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

export default function MakaraCard() {
    return (
        <Card className="w-[290px] bg-linen text-signalBlack">
            <CardContent className="pt-6 pb-1">
                <Image
                    src={"https://picsum.photos/280/220"}
                    alt="image"
                    width={280}
                    height={220}
                    className="rounded-lg"
                />
            </CardContent>
            <CardHeader className="py-2">
                <CardTitle className="">
                    Mykonos: Leading the Way in Indonesia&apos;s Local Fragrance
                    Market
                </CardTitle>
                <CardDescription className="py-0 text-xs">
                    Who doesn&apos;t know Mykonos? A proudly Indonesian
                    fragrance brand founded in 2019 that has captivated
                </CardDescription>
            </CardHeader>
            <CardContent className="py-0 pb-2">
                <Link href={"/makarainspires/1"}><Button className="text-sm">Read More</Button></Link>
            </CardContent>
            <CardFooter className="pb-4">
                <p className="text-xs font-medium">24 December 2024</p>
            </CardFooter>
        </Card>
    );
}
