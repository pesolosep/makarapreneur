import Image from "next/image";
import profile from "@/assets/profile.svg";

export default function Speakers() {
    return (
        <div className="bg-juneBud flex flex-col items-center justify-center py-16 px-12">
            <h2 className="headerText text-center text-linen [text-shadow:0px_0px_10px_#6E8EEC;]">
                PREVIOUS SPEAKERS
            </h2>
            <div className="flex gap-12 mt-8 flex-wrap justify-evenly">
                <div className="flex flex-col items-center">
                    <div className="relative mt-5">
                        <Image
                            src={profile}
                            alt="profile"
                            className="z-10 relative"
                        />
                        <div
                            className="absolute bg-cornflowerBlue w-[150px] h-[200px] bottom-0 z-0 left-4
                            [background:linear-gradient(121deg,_#D0D6E9_0%,#6E8EEC_100%)]"
                        ></div>
                    </div>
                    <div className="flex flex-col items-center gap-1 mt-4 font-medium">
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum dolor sit amet.</p>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="relative mt-5">
                        <Image
                            src={profile}
                            alt="profile"
                            className="z-10 relative"
                        />
                        <div
                            className="absolute bg-cornflowerBlue w-[150px] h-[200px] bottom-0 z-0 left-4
                            [background:linear-gradient(121deg,_#D0D6E9_0%,#6E8EEC_100%)]"
                        ></div>
                    </div>
                    <div className="flex flex-col items-center gap-1 mt-4 font-medium">
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum dolor sit amet.</p>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="relative mt-5">
                        <Image
                            src={profile}
                            alt="profile"
                            className="z-10 relative"
                        />
                        <div
                            className="absolute bg-cornflowerBlue w-[150px] h-[200px] bottom-0 z-0 left-4
                            [background:linear-gradient(121deg,_#D0D6E9_0%,#6E8EEC_100%)]"
                        ></div>
                    </div>
                    <div className="flex flex-col items-center gap-1 mt-4 font-medium">
                        <p>Lorem ipsum</p>
                        <p>Lorem ipsum dolor sit amet.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
