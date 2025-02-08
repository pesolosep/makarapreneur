import Image from "next/image";
import { Button } from "../ui/button";
import aboutUsDummy from "@/assets/aboutUsDummy.svg";
import { twMerge } from "tailwind-merge";

interface VariantProps {
    variant?: string;
}

export default function Description({ variant }: VariantProps) {
    const secondary = variant === "secondary";

    return (
        <div
            className={twMerge(
                "bg-juneBud flex justify-between items-center py-12 px-12",
                secondary && "flex-row-reverse bg-signalBlack text-linen",
            )}
        >
            <div className="space-y-8">
                <p className="headerText text-lg">Lorem ipsum dolor sit amet</p>
                <p className="w-[400px] text-sm font-medium">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <Button className="rounded-2xl h-8">Register Now</Button>
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex gap-5">
                    <Image
                        src={aboutUsDummy}
                        alt="image"
                        className="w-[240px] rounded-lg"
                    />
                    <Image
                        src={aboutUsDummy}
                        alt="image"
                        className="w-[240px] rounded-lg"
                    />
                </div>
                <div className="flex gap-5">
                    <Image
                        src={aboutUsDummy}
                        alt="image"
                        className="w-[240px] rounded-lg"
                    />
                    <Image
                        src={aboutUsDummy}
                        alt="image"
                        className="w-[240px] rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}
