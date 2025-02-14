import Image from "next/image";
import { Button } from "../ui/button";
import aboutUsDummy from "@/assets/aboutUsDummy.svg";
import { twMerge } from "tailwind-merge";

interface Variant {
    variant?: string;
}

export default function AboutUs({ variant }: Variant) {
    const isSecondary = variant === "secondary";

    return (
        <div
            className={twMerge(
                "text-linen p-12 flex justify-evenly items-center bg-signalBlack flex-wrap gap-y-10",
                isSecondary && "text-signalBlack bg-linen py-12"
            )}
        >
            <div className="flex flex-col w-[500px] gap-8">
                <h1
                    className={twMerge(
                        "headerText text-2xl w-min text-nowrap",
                        !isSecondary &&
                            "bg-gradient-to-r from-cornflowerBlue px-8 rounded-2xl py-2 text-lg"
                    )}
                >
                    ABOUT US
                </h1>
                <p className="text-sm max-w-[380px]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
                <div
                    className={`${
                        variant === "secondary" ? "hidden" : "block"
                    }`}
                >
                    <Button className="rounded-3xl px-6">Learn More</Button>
                </div>
            </div>
            <div>
                <Image
                    src={aboutUsDummy}
                    alt="aboutUsDummy"
                    className={`${variant === "secondary" ? "h-[300px]" : "w-[350px]"}`}
                />
            </div>
        </div>
    );
}
