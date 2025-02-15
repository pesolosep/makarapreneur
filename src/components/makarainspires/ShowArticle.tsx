import Image from "next/image";
import MakaraCard from "./MakaraCard";

export default function ShowArticle() {
    return (
        <div className="w-full min-h-[700px] flex justify-center py-12 px-12 gap-3">
            <div className="flex flex-col gap-5 max-w-[700px]">
                <h2 className="font-semibold text-xl text-center">
                    Mykonos: Leading the Way in Indonesia&apos;s Local Fragrance
                    Market
                </h2>
                <p className="max-w-[700px] text-center text-base">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Reiciendis aperiam consequatur eaque cum aut, delectus
                    recusandae.
                </p>
                <div className="w-full h-[1px] bg-signalBlack"></div>
                <div className="flex justify-center py-6">
                    <Image
                        src={"https://picsum.photos/300/400"}
                        alt="image"
                        width={300}
                        height={400}
                        className="rounded-lg"
                    />
                </div>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Suscipit, facilis maiores voluptates consequuntur aspernatur
                    laboriosam perferendis! Soluta vitae ratione consequatur
                    blanditiis. Nesciunt ratione, laudantium culpa quam sint
                    rerum quis error.
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Suscipit, facilis maiores voluptates consequuntur aspernatur
                    laboriosam perferendis! Soluta vitae ratione consequatur
                    blanditiis. Nesciunt ratione, laudantium culpa quam sint
                    rerum quis error.
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Suscipit, facilis maiores voluptates consequuntur aspernatur
                    laboriosam perferendis! Soluta vitae ratione consequatur
                    blanditiis. Nesciunt ratione, laudantium culpa quam sint
                    rerum quis error.
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Suscipit, facilis maiores voluptates consequuntur aspernatur
                    laboriosam perferendis! Soluta vitae ratione consequatur
                    blanditiis. Nesciunt ratione, laudantium culpa quam sint
                    rerum quis error.
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Suscipit, facilis maiores voluptates consequuntur aspernatur
                    laboriosam perferendis! Soluta vitae ratione consequatur
                    blanditiis. Nesciunt ratione, laudantium culpa quam sint
                    rerum quis error.
                </p>
                <div className="w-full h-[1px] bg-signalBlack my-6"></div>
                <div className="flex flex-wrap gap-5 justify-center">
                    <MakaraCard/>
                    <MakaraCard/>
                </div>
            </div>
        </div>
    );
}
