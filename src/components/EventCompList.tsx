import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import aboutUsDummy from "@/assets/aboutUsDummy.svg";
import { Button } from "./ui/button";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

interface ShowCardProps {
    title: string;
    variant?: string;
}

export default function ShowCard({ title, variant }: ShowCardProps) {
    const secondary = variant === "secondary";
    const link = secondary ? '/event/1' : '#';

    return (
        <div
            className={twMerge(
                "bg-linen py-12",
                secondary && "bg-signalBlack text-juneBud"
            )}
        >
            <h2 className="headerText text-center">{title}</h2>
            <div className="flex justify-center items-center gap-6 flex-wrap">
                <Card className="border-0 shadow-none bg-signalBlack mt-8 w-[310px]">
                    <CardContent className="flex aspect-video items-center justify-center p-6 relative">
                        <div className="z-10 flex flex-col items-center gap-2 justify-center">
                            <p className="headerText text-sm text-linen text-center">
                                BUSINESS CASE COMPETITION
                            </p>
                            <Link href={link}>
                                <Button className="text-xs h-7 rounded-xl">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                        <Image
                            src={aboutUsDummy}
                            alt="image"
                            className="object-cover absolute rounded-xl blur-[0.5px] brightness-50"
                            fill
                        />
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-none bg-signalBlack mt-8 w-[310px]">
                    <CardContent className="flex aspect-video items-center justify-center p-6 relative">
                        <div className="z-10 flex flex-col items-center gap-2 justify-center">
                            <p className="headerText text-sm text-linen text-center">
                                BUSINESS CASE COMPETITION
                            </p>
                            <Link href={link}>
                                <Button className="text-xs h-7 rounded-xl">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                        <Image
                            src={aboutUsDummy}
                            alt="image"
                            className="object-cover absolute rounded-xl blur-[0.5px] brightness-50"
                            fill
                        />
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-none bg-signalBlack mt-8 w-[310px]">
                    <CardContent className="flex aspect-video items-center justify-center p-6 relative">
                        <div className="z-10 flex flex-col items-center gap-2 justify-center">
                            <p className="headerText text-sm text-linen text-center">
                                BUSINESS CASE COMPETITION
                            </p>
                            <Link href={link}>
                                <Button className="text-xs h-7 rounded-xl">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                        <Image
                            src={aboutUsDummy}
                            alt="image"
                            className="object-cover absolute rounded-xl blur-[0.5px] brightness-50"
                            fill
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
