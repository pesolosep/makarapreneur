'use client'

import Link from "next/link";
import logo from "@/assets/logoMakarapreneur.svg";
import Image from "next/image";
import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLUListElement>(null);

    useEffect(() => { 
        const handleClickOutside = (e: MouseEvent) => { 
            if (ref.current && !ref.current.contains(e.target as Node)) { 
                setIsOpen(false);
            }
        }
        window.addEventListener("click", handleClickOutside);

        return () => { 
            window.removeEventListener("click", handleClickOutside);
        }
    })
    
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

                {/* Mobile navbar */}
                <ul className="relative" ref={ref}>
                    <li className="block lg:hidden p-3 hover:bg-black/10 rounded-xl duration-200"
                    onClick={() => setIsOpen((prev) => !prev)}>
                        <RxHamburgerMenu className="text-juneBud text-2xl" />
                    </li>
                    {isOpen && <ul className="absolute bg-linen flex flex-col right-0 text-signalBlack py-2 gap-1 w-max rounded-lg">
                        <Link href={"/"} className="link hoverEffect px-4">
                            <li>Home</li>
                        </Link>
                        <Link href={"/aboutus"} className="link hoverEffect px-4">
                            <li>About</li>
                        </Link>
                        <Link href={"/competition"} className="link hoverEffect px-4">
                            <li>Competition</li>
                        </Link>
                        <Link href={"/event"} className="link hoverEffect px-4">
                            <li>Event</li>
                        </Link>
                        <Link href={"/makarainspires"} className="link hoverEffect px-4">
                            <li>Makara Inspires</li>
                        </Link>
                        <Link href={"/contact"} className="link hoverEffect px-4">
                            <li>Contact</li>
                        </Link>
                    </ul>}
                </ul>

                {/* Desktop Navbar */}
                <ul className="hidden lg:flex gap-10">
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
                    <Link href={"/makarainspires"} className="link">
                        <li>Makara Inspires</li>
                    </Link>
                    <Link href={"/contact"} className="link">
                        <li>Contact</li>
                    </Link>
                </ul>
            </nav>
        </header>
    );
}
