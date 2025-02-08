import Link from "next/link";
import logo from "@/assets/logoMakarapreneur.svg";
import Image from "next/image";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50">
            <nav
                className="flex justify-between items-center p-4 bg-signalBlack text-linen font-medium min-h-[83px] text-md px-8
                w-full"
            >
                <Link href={"/"} className="link flex gap-3 items-center">
                    <h1 className="text-juneBud text-xl">Makarapreneur</h1>
                    <Image src={logo} alt="logo" />
                </Link>
                <ul className="flex gap-10">
                    <Link href={"/"} className="link">
                        <li>Home</li>
                    </Link>
                    <Link href={"/aboutus"} className="link">
                        <li>About</li>
                    </Link>
                    <Link href={"/competition"} className="link">
                        <li>Competition</li>
                    </Link>
                    <Link href={"/event"} className="link">
                        <li>Event</li>
                    </Link>
                    <Link href={"#"} className="link">
                        <li>Makara Inspires</li>
                    </Link>
                    <Link href={"#"} className="link">
                        <li>Contact</li>
                    </Link>
                </ul>
            </nav>
        </header>
    );
}
