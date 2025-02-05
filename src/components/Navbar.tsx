import Link from "next/link";
import logo from "@/assets/logoMakarapreneur.svg";
import Image from "next/image";

export default function Navbar() {
    return (
        <header>
            <nav className="flex justify-between items-center p-4 bg-signalBlack text-linen font-medium min-h-[83px] text-md px-8">
                <Link href={"/"} className="link flex gap-3 items-center">
                    <h1 className="text-juneBud text-xl">Makarapreneur</h1>
                    <Image src={logo} alt="logo" />
                </Link>
                <ul className="flex gap-10">
                    <Link href={"#"} className="link">
                        <li>Home</li>
                    </Link>
                    <Link href={"#"} className="link">
                        <li>About</li>
                    </Link>
                    <Link href={"#"} className="link">
                        <li>Competition</li>
                    </Link>
                    <Link href={"#"} className="link">
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
