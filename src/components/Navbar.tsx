'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/aboutus' },
  { name: 'Competition', href: '/competition' },
  { name: 'Event', href: '/event' },
  { name: 'Makara Inspires', href: '/makarainspires' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastScrollY, setLastScrollY] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasScrolled, setHasScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null
    let lastKnownScrollY = window.scrollY
    let ticking = false

    const resetScrollState = () => {
      setHasScrolled(false)
      setIsVisible(true)
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Jangan proses kalau masih "ticking"
      if (ticking) return

      // Set flag ticking
      ticking = true

      // Update di next frame
      requestAnimationFrame(() => {
        // Reset ticking
        ticking = false

        // Update state scroll
        setIsScrolled(currentScrollY > 0)
        setHasScrolled(true)

        // Logic untuk show/hide navbar
        if (currentScrollY < 100) {
          setIsVisible(true)
        } else if (currentScrollY > lastKnownScrollY) {
          setIsVisible(false)
        } else if (currentScrollY < lastKnownScrollY) {
          setIsVisible(true)
        }

        // Update last known scroll position
        lastKnownScrollY = currentScrollY
        setLastScrollY(currentScrollY)

        // Clear existing timeout
        if (timeoutId) {
          clearTimeout(timeoutId)
        }

        // Set new timeout untuk reset state
        timeoutId = setTimeout(resetScrollState, 150)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 left-0 w-full transition-all duration-500 transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? 'bg-zinc-900'
          : 'bg-zinc-900/80 backdrop-blur-sm'
      }`}
    >
      <nav className="mx-auto flex h-24 items-center justify-between px-6 lg:px-8">
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
        <div className="hidden lg:flex lg:items-center lg:gap-8">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`group relative inline-flex h-12 w-max items-center justify-center rounded-md px-6 py-3 text-lg font-medium text-linen transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none disabled:pointer-events-none disabled:opacity-50
                        ${pathname === item.href ? 'after:absolute after:bottom-0 after:left-1/2 after:h-1 after:w-2/3 after:-translate-x-1/2 after:bg-juneBud' : ''}`}
                    >
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
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
                <SheetTitle>
                  Menu
                </SheetTitle>
              </VisuallyHidden>
              <div className="flex h-24 items-center justify-between px-6">
                <h2 className="text-2xl font-bold text-juneBud">
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
                    className={`rounded-md px-4 py-3 text-base font-medium text-linen transition-colors hover:bg-white/10
                      ${pathname === item.href ? 'bg-white/5 text-juneBud' : ''}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}