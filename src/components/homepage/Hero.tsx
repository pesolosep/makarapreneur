import team from "@/assets/teamCompressed.jpg";
import Image from "next/image";

export default function Hero() {
    return (
        <div className="bg-signalBlack text-signalBlack flex flex-col items-center text-center justify-center min-h-[450px]">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                <h1 className="font-semibold text-4xl tracking-widest mb-5 z-20 bg-juneBud">
                    MAKARAPRENEUR
                </h1>
                <h2 className="w-min font-medium z-20 bg-cornflowerBlue text-linen">#ForTheFuture</h2>
            </div>
            <Image src={team} alt="team" className="object-cover w-full h-[450px] [filter:blur(0.5px)]"/>
        </div>
    );
}
