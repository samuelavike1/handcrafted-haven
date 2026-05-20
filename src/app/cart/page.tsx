"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  Trash2,
  Truck,
} from "lucide-react"
import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { products } from "@/lib/market-data"

export default function CartPage() {
  const [items, setItems] = useState([
    { ...products[0], qty: 1 },
    { ...products[2], qty: 1 },
  ])

  const updateQty = (id: string, delta: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    )
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = subtotal > 150 ? 0 : 12
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />

      <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-5 lg:px-6">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black text-[#9a4d10] uppercase">
              Secure cart
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#063f34]">
              Your selected pieces
            </h1>
          </div>
          <Link
            href="/browse"
            className="inline-flex items-center font-black text-[#063f34]"
          >
            <ArrowLeft className="mr-2" size={18} /> Continue browsing
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <section className="space-y-5">
            {items.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 rounded-lg border border-[#d8dfdc] bg-white p-4 sm:grid-cols-[104px_1fr_auto]"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-[#edf2ef]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-[11px] font-black text-[#9a4d10] uppercase">
                    {item.category}
                  </p>
                  <h2 className="mt-1 text-lg font-black text-[#063f34]">
                    {item.name}
                  </h2>
                  <p className="mt-2 text-sm text-[#53615c]">
                    by <span className="font-bold">{item.seller}</span>
                  </p>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#53615c]">
                    {item.description}
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <p className="text-lg font-black">${item.price.toFixed(2)}</p>
                  <div className="flex h-9 items-center rounded-lg border border-[#d8dfdc]">
                    <button
                      className="px-3"
                      onClick={() => updateQty(item.id, -1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="min-w-8 text-center font-black">
                      {item.qty}
                    </span>
                    <button
                      className="px-3"
                      onClick={() => updateQty(item.id, 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      setItems((current) =>
                        current.filter((product) => product.id !== item.id)
                      )
                    }
                    className="inline-flex items-center gap-1 text-sm font-bold text-[#9a2f18]"
                  >
                    <Trash2 size={15} /> Remove
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="h-fit rounded-lg border border-[#d8dfdc] bg-white p-4 shadow-[0_12px_28px_rgba(18,40,33,0.08)] lg:sticky lg:top-24">
            <h2 className="text-lg font-black text-[#063f34]">Order summary</h2>
            <div className="mt-4 space-y-4 text-[#53615c]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <strong className="text-[#1b211f]">
                  ${subtotal.toFixed(2)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <strong className="text-[#1b211f]">
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Estimated tax</span>
                <strong className="text-[#1b211f]">${tax.toFixed(2)}</strong>
              </div>
            </div>
            <div className="mt-4 border-t border-[#d8dfdc] pt-4">
              <div className="flex items-end justify-between">
                <span className="text-lg font-black text-[#063f34]">Total</span>
                <span className="text-2xl font-black text-[#063f34]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-5 flex h-9 items-center justify-center rounded-lg bg-[#f28a35] font-black text-white transition hover:bg-[#dc7624]"
            >
              Secure checkout <Lock className="ml-2" size={18} />
            </Link>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-[#53615c]">
              <span className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-[#063f34]" /> Encrypted
                payments
              </span>
              <span className="flex items-center gap-2">
                <Truck size={17} className="text-[#063f34]" /> Tracked artisan
                shipping
              </span>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
