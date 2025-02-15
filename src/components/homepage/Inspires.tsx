import { twJoin, twMerge } from "tailwind-merge";
import MakaraCard from "../makarainspires/MakaraCard";

interface inspireProps {
    variant?: string;
}

export default function Inspires({ variant }: inspireProps) {
    const secondary = variant === "secondary";

    return (
        <div
            className={twMerge(
                "bg-juneBud py-10 bg-gradient-to-b from-juneBud to-[#5E76BF]",
                secondary && "bg-signalBlack"
            )}
        >
            <h2
                className={twJoin(
                    "headerText text-cornflowerBlue text-center",
                    secondary && "hidden"
                )}
            >
                MAKARA INSPIRES
            </h2>
            <div
                className={twMerge(
                    "flex px-12 mt-8 w-full justify-center gap-8 flex-wrap",
                    secondary && "mt-0"
                )}
            >
                <MakaraCard />
                <MakaraCard />
                <MakaraCard />
            </div>
        </div>
    );
}
