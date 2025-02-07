import Image from "next/image";
import dummyBanner from '@/assets/dummyBanner.svg';

interface BannerProp {
    title: string;
}

export default function Banner({ title }: BannerProp) {
    return (
        <div className=" flex items-center h-[200px]">
            <h2 className="z-20 text-linen px-12 headerText [text-shadow:_0px_0px_10px_#BADE4F;]">{title}</h2>
            <Image className="object-cover w-full h-[200px] absolute z-0" src={dummyBanner} alt="banner"/>
        </div>
    );
}
