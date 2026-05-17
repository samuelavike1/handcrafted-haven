"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Bell, Menu, Search, ShoppingBag, Sprout, X } from "lucide-react"

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
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-6 px-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#063f34] text-white">
            <Sprout size={20} />
          </span>
          <span className="text-[22px] font-bold leading-none text-[#063f34]">
            Handcrafted Haven
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-[#d8dfdc] bg-white p-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || (pathname === "/" && item.href === "/browse")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
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

        <div className="relative ml-auto hidden w-[360px] lg:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6d7a75]" size={18} />
          <input
            className="h-12 w-full rounded-full border border-[#d8dfdc] bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/10"
            placeholder={pathname === "/sell" ? "Search listings, orders..." : "Search handmade goods..."}
          />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#063f34] transition hover:bg-[#edf2ef] lg:hidden" aria-label="Search">
            <Search size={20} />
          </button>
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#063f34] transition hover:bg-[#edf2ef]"
            aria-label="Cart"
          >
            <ShoppingBag size={21} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#c8651b]" />
          </Link>
          <button className="hidden h-10 w-10 items-center justify-center rounded-full text-[#063f34] transition hover:bg-[#edf2ef] sm:flex" aria-label="Notifications">
            <Bell size={20} />
          </button>
          <button className="relative hidden h-10 w-10 overflow-hidden rounded-full border border-[#d8dfdc] sm:block" aria-label="Account">
            <Image src="/product_teapot_1779021133816.png" alt="" fill className="object-cover" unoptimized />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#063f34] transition hover:bg-[#edf2ef] md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#d8dfdc] bg-[#fbfbf8] px-5 py-4 md:hidden">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6d7a75]" size={18} />
            <input
              className="h-12 w-full rounded-full border border-[#d8dfdc] bg-white pl-12 pr-4 text-sm outline-none"
              placeholder="Search handmade goods..."
            />
          </div>
          <div className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 font-semibold text-[#063f34] hover:bg-[#edf2ef]"
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
