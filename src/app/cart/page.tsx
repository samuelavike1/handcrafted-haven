"use client"

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
import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { type CartItem, readCart, writeCart } from "@/lib/cart"
import ShimmerImage from "@/components/ui/shimmer-image"

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const timeout = window.setTimeout(() => setItems(readCart()), 0)
    return () => window.clearTimeout(timeout)
  }, [])

  const saveItems = (nextItems: CartItem[]) => {
    setItems(nextItems)
    writeCart(nextItems)
  }

  const updateQty = (id: string, delta: number) => {
    saveItems(
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shipping = subtotal > 150 ? 0 : 12
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen bg-hh-canvas">
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
            className="inline-flex items-center font-black text-hh-heading"
          >
            <ArrowLeft className="mr-2" size={18} /> Continue browsing
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <section className="space-y-5">
            {items.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 rounded-lg border border-hh-border bg-hh-card p-4 sm:grid-cols-[104px_1fr_auto]"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-hh-subtle">
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
                  <h2 className="mt-1 text-lg font-black text-hh-heading">
                    {item.name}
                  </h2>
                  <p className="mt-2 text-sm text-hh-muted">
                    by <span className="font-bold">{item.seller}</span>
                  </p>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-hh-muted">
                    {item.description}
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <p className="text-lg font-black">${item.price.toFixed(2)}</p>
                  <div className="flex h-9 items-center rounded-lg border border-hh-border">
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
            {items.length ? (
              items.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-lg border border-[#d8dfdc] bg-white p-4 sm:grid-cols-[104px_1fr_auto]"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-[#edf2ef]">
                    <ShimmerImage
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
                    {item.seller && (
                      <p className="mt-2 text-sm text-[#53615c]">
                        by <span className="font-bold">{item.seller}</span>
                      </p>
                    )}
                    {item.description && (
                      <p className="mt-3 max-w-xl text-sm leading-6 text-[#53615c]">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <p className="text-lg font-black">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex h-9 items-center rounded-lg border border-[#d8dfdc]">
                      <button
                        className="px-3"
                        onClick={() => updateQty(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="min-w-8 text-center font-black">
                        {item.quantity}
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
                        saveItems(
                          items.filter((product) => product.id !== item.id)
                        )
                      }
                      className="inline-flex items-center gap-1 text-sm font-bold text-[#9a2f18]"
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-lg border border-[#d8dfdc] bg-white p-6">
                <h2 className="text-lg font-black text-[#063f34]">
                  Your cart is empty
                </h2>
                <p className="mt-2 text-sm text-[#53615c]">
                  Add a handmade piece from the marketplace before checkout.
                </p>
                <Link
                  href="/browse"
                  className="mt-4 inline-flex rounded-lg bg-[#063f34] px-4 py-2 text-sm font-black text-white"
                >
                  Browse products
                </Link>
              </div>
            )}
          </section>

          <aside className="h-fit rounded-lg border border-hh-border bg-hh-card p-4 shadow-[0_12px_28px_rgba(18,40,33,0.08)] lg:sticky lg:top-24">
            <h2 className="text-lg font-black text-hh-heading">Order summary</h2>
            <div className="mt-4 space-y-4 text-hh-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <strong className="text-hh-body">
                  ${subtotal.toFixed(2)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <strong className="text-hh-body">
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Estimated tax</span>
                <strong className="text-hh-body">${tax.toFixed(2)}</strong>
              </div>
            </div>
            <div className="mt-4 border-t border-hh-border pt-4">
              <div className="flex items-end justify-between">
                <span className="text-lg font-black text-hh-heading">Total</span>
                <span className="text-2xl font-black text-hh-heading">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
            <Link
              href="/checkout"
              className={`mt-5 flex h-9 items-center justify-center rounded-lg font-black text-white transition ${
                items.length
                  ? "bg-[#f28a35] hover:bg-[#dc7624]"
                  : "pointer-events-none bg-[#d8dfdc]"
              }`}
            >
              Secure checkout <Lock className="ml-2" size={18} />
            </Link>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-hh-muted">
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
