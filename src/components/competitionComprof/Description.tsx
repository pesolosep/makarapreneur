import Image from "next/image";
import { Button } from "../ui/button";
import aboutUsDummy from "@/assets/aboutUsDummy.svg";
import { twMerge } from "tailwind-merge";

interface VariantProps {
    variant?: string;
    number: number;
}

export default function Description({ variant, number }: VariantProps) {
    const secondary = variant === "secondary";

    return (
        <div
            className={twMerge(
                "bg-juneBud flex justify-evenly gap-x-6 items-center py-12 px-12 flex-wrap gap-y-10",
                secondary && "flex-row-reverse bg-signalBlack text-linen",
            )}

            id={number.toString()}
        >
            <div className="space-y-8">
                <p className="headerText text-lg">Lorem ipsum dolor sit amet</p>
                <p className="max-w-[400px] text-sm font-medium">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <Button className="rounded-2xl h-8">Register Now</Button>
            </div>
            <div className="flex flex-wrap gap-5 w-[500px] justify-center">
                    <Image
                        src={aboutUsDummy}
                        alt="image"
                        className="w-[220px] rounded-lg"
                    />
                    <Image
                        src={aboutUsDummy}
                        alt="image"
                        className="w-[220px] rounded-lg"
                    />
                    <Image
                        src={aboutUsDummy}
                        alt="image"
                        className="w-[220px] rounded-lg"
                    />
                    <Image
                        src={aboutUsDummy}
                        alt="image"
                        className="w-[220px] rounded-lg"
                    />
            </div>
        </div>
    );
}
