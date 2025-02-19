"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/contexts/AuthContext";

const navigationItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/aboutus" },
    { name: "Competition", href: "/competition" },
    { name: "Event", href: "/event" },
    { name: "Makara Inspires", href: "/makarainspires" },
    { name: "Contact", href: "/contact" },
];

type NavbarProps = {
    notTransparent?: boolean

}
export default function Navbar({notTransparent}: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { user , loading} = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 0);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header
            className={`fixed top-0 z-50 left-0 w-full transition-all duration-500 transform ${
                (isScrolled || notTransparent )? "bg-zinc-900" : "bg-zinc-900/80 backdrop-blur-sm"
            }`}
        >
            <nav
                className={`mx-auto flex duration-500 ${
                    isScrolled ? "h-20" : "h-24"
                } items-center justify-between px-6 lg:px-8`}
            >
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/icon.svg"
                        alt="logo"
                        width={40}
                        height={40}
                        className="mr-2"
                    />
                    <h1 className="text-2xl font-bold text-juneBud transition-colors hover:text-juneBud/80">
                        Makarapreneur
                    </h1>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:items-center">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-2">
                            {navigationItems.map((item) => (
                                <NavigationMenuItem key={item.name}>
                                    <Link
                                        href={item.href}
                                        legacyBehavior
                                        passHref
                                    >
                                        <NavigationMenuLink
                                            className={twMerge(
                                                "group relative inline-flex h-12 w-max items-center justify-center rounded-md px-3 py-2 text-md font-medium text-linen transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                                                pathname === item.href &&
                                                    "after:absolute after:bottom-0 after:left-1/2 after:h-1 after:w-2/3 after:-translate-x-1/2 after:bg-juneBud"
                                            )}
                                        >
                                            {item.name}
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                    
                    {/* Desktop Login Button */}
                    {!loading && !user && (
                        <Link
                            href="/authentication/login"
                            className="ml-8 px-6 py-2.5 bg-juneBud hover:bg-juneBud/90 text-zinc-900 font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Login
                        </Link>
                    )}


                </div>

                {/* Mobile Navigation */}
                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="rounded-md p-3 text-linen hover:bg-white/10">
                                <Menu className="h-8 w-8" />
                            </button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="[&>button:first-child]:hidden w-80 border-0 bg-zinc-900 text-linen p-0 [&_[data-radix-collection-item]]:hidden"
                        >
                            <VisuallyHidden>
                                <SheetTitle>Menu</SheetTitle>
                            </VisuallyHidden>
                            <div className="flex h-24 items-center justify-between px-6">
                                <h2 className="text-2xl font-bold text-juneBud font-poppins">
                                    Menu
                                </h2>
                                <SheetTrigger asChild>
                                    <button className="rounded-md p-3 text-linen hover:bg-white/10">
                                        <X className="h-8 w-8" />
                                    </button>
                                </SheetTrigger>
                            </div>
                            <div className="px-6 flex flex-col gap-4">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={twMerge(
                                            "rounded-md px-4 py-3 font-poppins text-base font-medium text-linen transition-colors hover:bg-white/10",
                                            pathname === item.href &&
                                                "bg-white/5 text-juneBud"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                {/* Mobile Login Button */}
                                {!loading && !user && (
                                    <Link
                                        href="/authentication/login"
                                        className="bg-juneBud text-zinc-900 rounded-full px-4 py-3 font-poppins text-base font-medium hover:bg-linen transition-colors text-center"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}
