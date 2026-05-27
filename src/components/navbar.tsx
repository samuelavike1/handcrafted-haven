"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Bell, Menu, Moon, Search, ShoppingBag, Sun, X } from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname, useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  UserRound,
  X,
} from "lucide-react"
import { toast } from "sonner"
import appLogo from "../../Logo.jpg"
import { cartUpdatedEvent, readCart } from "@/lib/cart"
import ShimmerImage from "@/components/ui/shimmer-image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { label: "Browse", href: "/browse" },
  { label: "Sell", href: "/sell" },
  { label: "Stories", href: "/stories" },
]

type CurrentUser = {
  name: string
  email: string
  role: "buyer" | "seller" | "admin"
  studioName?: string
}

const dashboardHref = {
  buyer: "/account",
  seller: "/sell/dashboard",
  admin: "/admin",
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [search, setSearch] = useState("")
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    let active = true

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" })
        const data = await response.json()
        if (active) setUser(data.user)
      } catch {
        if (active) setUser(null)
      }
    }

    loadUser()
    return () => {
      active = false
    }
  }, [pathname])

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(readCart().reduce((sum, item) => sum + item.quantity, 0))
    }

    updateCartCount()
    window.addEventListener(cartUpdatedEvent, updateCartCount)
    window.addEventListener("storage", updateCartCount)
    return () => {
      window.removeEventListener(cartUpdatedEvent, updateCartCount)
      window.removeEventListener("storage", updateCartCount)
    }
  }, [])

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = search.trim()
    if (!query) return
    setMobileOpen(false)
    router.push(`/browse?q=${encodeURIComponent(query)}`)
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    toast.success("Signed out", {
      description: "You have been signed out of Handcrafted Haven.",
    })
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 border-b border-hh-border bg-hh-canvas/95 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1080px] items-center gap-4 px-4 sm:px-5 lg:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative h-8 w-8 overflow-hidden rounded-md border border-hh-border bg-hh-card">
            <Image
          <span className="relative h-9 w-9 overflow-hidden rounded-md border border-[#d8dfdc] bg-white p-0.5">
            <ShimmerImage
              src={appLogo}
              alt="Handcrafted Haven logo"
              fill
              className="object-contain"
              sizes="36px"
              priority
            />
          </span>
          <span className="text-base leading-none font-bold text-hh-heading">
            Handcrafted Haven
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-lg border border-hh-border bg-hh-card p-1 md:flex">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (pathname === "/" && item.href === "/browse")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-[#063f34] text-white"
                    : "text-hh-muted hover:bg-hh-subtle hover:text-hh-heading"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <form
          onSubmit={submitSearch}
          className="relative ml-auto hidden w-[260px] lg:block"
        >
          <Search
            className="absolute top-1/2 left-3 -translate-y-1/2 text-hh-muted"
            size={16}
          />
          <input
            className="h-9 w-full rounded-md border border-hh-border bg-hh-card pr-3 pl-9 text-xs transition outline-none focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/10"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-9 w-full rounded-md border border-[#d8dfdc] bg-white pr-3 pl-9 text-xs transition outline-none focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/10"
            placeholder={
              pathname === "/sell"
                ? "Search listings, orders..."
                : "Search handmade goods..."
            }
          />
        </form>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md text-hh-heading transition hover:bg-hh-subtle lg:hidden"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <Link
            href="/cart"
            className="relative flex h-8 w-8 items-center justify-center rounded-md text-hh-heading transition hover:bg-hh-subtle"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c8651b] px-1 text-[10px] font-black text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="hidden h-8 w-8 items-center justify-center rounded-md text-hh-heading transition hover:bg-hh-subtle sm:flex"
            onClick={() =>
              toast.info("No new notifications", {
                description: "Marketplace alerts will appear here.",
              })
            }
            className="hidden h-8 w-8 items-center justify-center rounded-md text-[#063f34] transition hover:bg-[#edf2ef] sm:flex"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
          <button
            onClick={() => mounted && setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex h-8 w-8 items-center justify-center rounded-md text-hh-heading transition hover:bg-hh-subtle"
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="relative hidden h-8 w-8 overflow-hidden rounded-md border border-hh-border sm:block"
            aria-label="Account"
          >
            <Image
              src="/product_teapot_1779021133816.png"
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="hidden h-8 w-8 items-center justify-center rounded-md border border-[#d8dfdc] bg-white text-[#063f34] transition hover:bg-[#edf2ef] sm:flex"
                  aria-label="Open account menu"
                >
                  <UserRound size={17} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 border border-[#cfd9d4] bg-white text-[#25332e] shadow-[0_16px_40px_rgba(18,40,33,0.18)]"
              >
                <DropdownMenuLabel className="text-[#53615c]">
                  <span className="block font-black text-[#063f34]">
                    {user.studioName ?? user.name}
                  </span>
                  <span className="block truncate text-xs">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={dashboardHref[user.role]}>
                    <LayoutDashboard size={15} />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {user.role === "seller" && (
                  <DropdownMenuItem asChild>
                    <Link href="/sell/dashboard">
                      <Store size={15} />
                      Seller studio
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <ShieldCheck size={15} />
                      Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} variant="destructive">
                  <LogOut size={15} />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="hidden h-8 items-center justify-center gap-1.5 rounded-md border border-[#d8dfdc] px-3 text-xs font-black text-[#063f34] transition hover:bg-[#edf2ef] sm:flex"
            >
              <UserRound size={15} />
              Sign in
            </Link>
          )}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md text-hh-heading transition hover:bg-hh-subtle md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-hh-border bg-hh-canvas px-4 py-4 md:hidden">
          <div className="relative mb-4">
        <div className="border-t border-[#d8dfdc] bg-[#fbfbf8] px-4 py-4 md:hidden">
          <form onSubmit={submitSearch} className="relative mb-4">
            <Search
              className="absolute top-1/2 left-3 -translate-y-1/2 text-hh-muted"
              size={18}
            />
            <input
              className="h-9 w-full rounded-md border border-hh-border bg-hh-card pr-3 pl-9 text-sm outline-none"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-9 w-full rounded-md border border-[#d8dfdc] bg-white pr-3 pl-9 text-sm outline-none"
              placeholder="Search handmade goods..."
            />
          </form>
          <div className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-semibold text-hh-heading hover:bg-hh-subtle"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={user ? dashboardHref[user.role] : "/login"}
              className="rounded-md px-3 py-2 text-sm font-semibold text-[#063f34] hover:bg-[#edf2ef]"
              onClick={() => setMobileOpen(false)}
            >
              {user ? "My account" : "Sign in"}
            </Link>
            {user && (
              <button
                className="rounded-md px-3 py-2 text-left text-sm font-semibold text-[#ba1a1a] hover:bg-[#fff4f4]"
                onClick={() => {
                  setMobileOpen(false)
                  logout()
                }}
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
