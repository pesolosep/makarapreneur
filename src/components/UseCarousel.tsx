import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import aboutUsDummy from "@/assets/aboutUsDummy.svg";
import { Button } from "./ui/button";

export default function Slideshow() {
    return (
        <div className="px-12 bg-signalBlack text-linen py-12">
            <div className="w-full flex justify-center items-center px-4">
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full max-w-xl text-signalBlack"
                >
                    <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem
                                key={index}
                                className="basis-full bg-signalBlack"
                            >
                                <div>
                                    <Card className="border-0 shadow-none bg-signalBlack">
                                        <CardContent className="flex aspect-video items-center justify-center p-6 relative">
                                            <div className="z-10 flex flex-col items-center gap-2 justify-center">
                                                <p className="headerText text-linen">
                                                    COMPETITION
                                                </p>
                                                <p className="text-center text-signalBlack bg-juneBud font-medium text-sm mx-2 lg:mx-20">
                                                    Lorem ipsum dolor sit amet
                                                    consectetur adipisicing
                                                    elit. Quisquam soluta.
                                                </p>
                                                <Button>Learn More</Button>
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
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    );
}
