import Image from "next/image";
import { Button } from "../ui/button";
import aboutUsDummy from "@/assets/aboutUsDummy.svg";

export default function AboutUs() {
    return (
        <div className="bg-signalBlack text-linen p-12 flex justify-between items-center">
            <div className="flex flex-col w-[500px] gap-8">
                <h1
                    className="headerText text-lg bg-gradient-to-r from-cornflowerBlue w-min text-nowrap py-2 rounded-2xl
                px-8"
                >
                    ABOUT US
                </h1>
                <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                </p>
                <div>
                    <Button className="rounded-3xl px-6">Learn More</Button>
                </div>
            </div>
            <div>
                <Image src={aboutUsDummy} alt="aboutUsDummy" />
            </div>
        </div>
    );
}
