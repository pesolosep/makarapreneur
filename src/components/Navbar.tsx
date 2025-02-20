"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { twMerge } from "tailwind-merge"

const competitionItems = [
  { name: "Competitions", href: "/competition" },
  { name: "BPC - SMA", href: "/competition/bpc-sma" },
  { name: "BPC - Mahasiswa", href: "/competition/bpc-mahasiswa" },
  { name: "BCC - Mahasiswa", href: "/competition/bcc-mahasiswa" },
]

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/aboutus" },
  {
    name: "Competition",
    href: "/competition",
    items: competitionItems,
  },
  { name: "Event", href: "/event" },
  { name: "Makara Inspires", href: "/makarainspires" },
  { name: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 0)
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 left-0 w-full transition-all duration-500 transform ${
        isScrolled ? "bg-zinc-900" : "bg-zinc-900/80 backdrop-blur-sm"
      }`}
    >
      <nav
        className={`mx-auto flex duration-500 ${
          isScrolled ? "h-20" : "h-24"
        } items-center justify-between px-6 lg:px-8`}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image src="/icon.svg" alt="logo" width={40} height={40} className="mr-2" />
          <h1 className="text-2xl font-bold text-juneBud transition-colors hover:text-juneBud/80">Makarapreneur</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.name} >
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger
                        className={twMerge(
                          "h-12 px-3 text-md relative font-medium text-linen hover:bg-white/10 data-[state=open]:bg-white/10 bg-inherit hover:text-linen focus:bg-inherit focus:text-linen",
                          pathname.startsWith(item.href) &&
                            "after:absolute after:bottom-0 after:left-1/2 after:h-1 after:w-2/3 after:-translate-x-1/2 after:bg-juneBud",
                        )}
                      >
                        {item.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="">
                        <div className="w-max bg-zinc-900 p-2 text-linen">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={twMerge(
                                "block rounded-md px-4 py-2 text-sm text-linen hover:bg-white/10",
                                pathname === subItem.href && "bg-white/5 text-juneBud",
                              )}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={twMerge(
                          "group relative inline-flex h-12 w-max items-center justify-center rounded-md px-3 py-2 text-md font-medium text-linen transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                          pathname === item.href &&
                            "after:absolute after:bottom-0 after:left-1/2 after:h-1 after:w-2/3 after:-translate-x-1/2 after:bg-juneBud",
                        )}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Separated Login Button */}
          <Link
            href="/authentication/login"
            className="ml-8 px-6 py-2.5 bg-juneBud hover:bg-juneBud/90 text-zinc-900 font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Login
          </Link>
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
                <h2 className="text-2xl font-bold text-juneBud font-poppins">Menu</h2>
                <SheetTrigger asChild>
                  <button className="rounded-md p-3 text-linen hover:bg-white/10">
                    <X className="h-8 w-8" />
                  </button>
                </SheetTrigger>
              </div>
              <div className="px-6 flex flex-col gap-4">
                {navigationItems.map((item) =>
                  item.items ? (
                    <Collapsible key={item.name}>
                      <CollapsibleTrigger
                        className={twMerge(
                          "flex w-full items-center justify-between rounded-md px-4 py-3 font-poppins text-base font-medium text-linen transition-colors hover:bg-white/10",
                          pathname.startsWith(item.href) && "bg-white/5 text-juneBud",
                        )}
                      >
                        {item.name}
                        <ChevronDown className="h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 font-poppins">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={twMerge(
                              "block rounded-md px-4 py-2 mt-1 text-sm text-linen hover:bg-white/10",
                              pathname === subItem.href && "bg-white/5 text-juneBud",
                            )}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={twMerge(
                        "rounded-md px-4 py-3 font-poppins text-base font-medium text-linen transition-colors hover:bg-white/10",
                        pathname === item.href && "bg-white/5 text-juneBud",
                      )}
                    >
                      {item.name}
                    </Link>
                  ),
                )}
                <Link
                  href="/authentication/login"
                  className="bg-juneBud text-zinc-900 rounded-full px-4 py-3 font-poppins text-base font-medium hover:bg-linen transition-colors text-center"
                >
                  Login
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

