"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, UserCircle, Shield, Home } from "lucide-react";
import { logoutUser } from "@/lib/firebase/authService";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { twMerge } from "tailwind-merge";

// Define admin navigation items
const adminNavigationItems = [
  { name: "Articles", href: "/admin/article", icon: "📝" },
  { name: "Competitions", href: "/admin/competition", icon: "🏆" },
  { name: "Email Manager", href: "/admin/email", icon: "📧" },
  { name: "Media Partners", href: "/admin/mediapartners", icon: "🤝" },
  { name: "Sponsors", href: "/admin/sponsors", icon: "💰" },
  { name: "Participants", href: "/admin/participants", icon: "👥" },
];

export default function AdminNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, userData, isAdmin, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

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

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, loading, router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="fixed top-0 z-50 w-full h-20 bg-zinc-900 flex items-center justify-center">
        <div className="animate-pulse text-juneBud">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <header
      className={`fixed top-0 z-50 left-0 w-full transition-all duration-500 transform ${
        isScrolled ? "bg-zinc-900 shadow-md" : "bg-zinc-900"
      }`}
    >
      <nav
        className={`mx-auto flex duration-500 ${
          isScrolled ? "h-16" : "h-20"
        } items-center justify-between px-6 lg:px-8`}
      >
        {/* Admin Logo and Title */}
        <Link href="/admin/competition" className="flex items-center gap-3">
          <div className="bg-juneBud text-signalBlack p-2 rounded-md">
            <Shield className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-juneBud">
            Admin Dashboard
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex lg:items-center space-x-6">
          {adminNavigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={twMerge(
                "relative px-3 py-2 text-sm font-medium text-linen rounded-md transition-colors hover:bg-white/10",
                pathname === item.href &&
                  "bg-white/5 text-juneBud after:absolute after:bottom-0 after:left-1/2 after:h-1 after:w-2/3 after:-translate-x-1/2 after:bg-juneBud"
              )}
            >
              <span className="flex items-center gap-2">
                <span>{item.icon}</span>
                {item.name}
              </span>
            </Link>
          ))}

          {/* Return to Main Site */}
          <Link
            href="/"
            className="px-3 py-2 text-sm font-medium text-linen rounded-md transition-colors hover:bg-white/10 flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Main Site
          </Link>

          {/* User/Logout Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-3 px-4 py-2 bg-juneBud hover:bg-juneBud/90 text-zinc-900 font-medium rounded-md transition-all duration-300 flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              <span className="max-w-[100px] truncate">{userData?.email || 'Admin'}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-zinc-900 text-linen border-zinc-800"
            >
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-white/10 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Navigation */}
        <div className="xl:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="rounded-md p-2 text-linen hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 border-0 bg-zinc-900 text-linen p-0"
            >
              <VisuallyHidden>
                <SheetTitle>Admin Menu</SheetTitle>
              </VisuallyHidden>
              <div className="flex h-20 items-center justify-between px-6 border-b border-zinc-800">
                <h2 className="text-xl font-bold text-juneBud">
                  Admin Panel
                </h2>
                <SheetTrigger asChild>
                  <button className="rounded-md p-2 text-linen hover:bg-white/10">
                    <X className="h-5 w-5" />
                  </button>
                </SheetTrigger>
              </div>
              <div className="px-4 py-6 flex flex-col gap-2">
                {adminNavigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={twMerge(
                      "rounded-md px-4 py-3 text-base font-medium text-linen transition-colors hover:bg-white/10 flex items-center gap-3",
                      pathname === item.href &&
                        "bg-white/5 text-juneBud border-l-2 border-juneBud"
                    )}
                  >
                    <span>{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
                
                {/* Divider */}
                <div className="h-px bg-zinc-800 my-3" />
                
                {/* Return to Main Site */}
                <Link
                  href="/"
                  className="rounded-md px-4 py-3 text-base font-medium text-linen transition-colors hover:bg-white/10 flex items-center gap-3"
                >
                  <Home className="h-5 w-5" />
                  Return to Main Site
                </Link>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="mt-4 w-full bg-red-500/20 text-red-400 rounded-md px-4 py-3 text-base font-medium hover:bg-red-500/30 transition-colors flex items-center gap-3"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}