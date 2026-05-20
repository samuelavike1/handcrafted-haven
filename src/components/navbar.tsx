"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Bell, Menu, Search, ShoppingBag, X } from "lucide-react"
import appLogo from "../../Logo.jpg"

const navItems = [
  { label: "Browse", href: "/browse" },
  { label: "Sell", href: "/sell" },
  { label: "Stories", href: "/stories" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8dfdc] bg-[#fbfbf8]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1080px] items-center gap-4 px-4 sm:px-5 lg:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative h-8 w-8 overflow-hidden rounded-md border border-[#d8dfdc] bg-white">
            <Image
              src={appLogo}
              alt="Handcrafted Haven logo"
              fill
              className="object-cover"
              sizes="32px"
              priority
            />
          </span>
          <span className="text-base leading-none font-bold text-[#063f34]">
            Handcrafted Haven
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-lg border border-[#d8dfdc] bg-white p-1 md:flex">
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
                    : "text-[#4d5b56] hover:bg-[#edf2ef] hover:text-[#063f34]"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="relative ml-auto hidden w-[260px] lg:block">
          <Search
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[#6d7a75]"
            size={16}
          />
          <input
            className="h-9 w-full rounded-md border border-[#d8dfdc] bg-white pr-3 pl-9 text-xs transition outline-none focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/10"
            placeholder={
              pathname === "/sell"
                ? "Search listings, orders..."
                : "Search handmade goods..."
            }
          />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#063f34] transition hover:bg-[#edf2ef] lg:hidden"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <Link
            href="/cart"
            className="relative flex h-8 w-8 items-center justify-center rounded-md text-[#063f34] transition hover:bg-[#edf2ef]"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#c8651b]" />
          </Link>
          <button
            className="hidden h-8 w-8 items-center justify-center rounded-md text-[#063f34] transition hover:bg-[#edf2ef] sm:flex"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
          <button
            className="relative hidden h-8 w-8 overflow-hidden rounded-md border border-[#d8dfdc] sm:block"
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
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#063f34] transition hover:bg-[#edf2ef] md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#d8dfdc] bg-[#fbfbf8] px-4 py-4 md:hidden">
          <div className="relative mb-4">
            <Search
              className="absolute top-1/2 left-3 -translate-y-1/2 text-[#6d7a75]"
              size={18}
            />
            <input
              className="h-9 w-full rounded-md border border-[#d8dfdc] bg-white pr-3 pl-9 text-sm outline-none"
              placeholder="Search handmade goods..."
            />
          </div>
          <div className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-semibold text-[#063f34] hover:bg-[#edf2ef]"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
