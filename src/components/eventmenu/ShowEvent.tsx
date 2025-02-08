import Image from "next/image";
import { Button } from "../ui/button";

export default function ShowEvent() {
    return (
        <div className="bg-signalBlack px-12 py-12 flex justify-center items-center flex-col gap-6">
            <Image
                src={"https://picsum.photos/400/400"}
                alt="event"
                width={400}
                height={400}
                className="rounded-xl"
            />
            <Button>Register Now</Button>
        </div>
    );
}
