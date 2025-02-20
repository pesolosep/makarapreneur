// Banner.tsx (Server Component)
import Image from "next/image";
import { BannerTitle } from './BannerTitle';
import teamCompressed from '@/assets/teamCompressed.jpg';

interface BannerProps {
    title: string;
}

export default function Banner({ title }: BannerProps) {
    return (
        <div className="relative flex items-center h-[300px] overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 w-full h-full">
                <Image 
                    className="object-cover w-full h-full blur-[3px]" 
                    src={teamCompressed} 
                    alt="banner" 
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            </div>

            {/* Animated Title Component */}
            <BannerTitle title={title} />
        </div>
    );
}