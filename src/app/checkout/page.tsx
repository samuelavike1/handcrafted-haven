"use client"

import Image from "next/image"
import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import {
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react"
import { toast } from "sonner"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { clearCart, type CartItem, readCart } from "@/lib/cart"

type CheckoutForm = {
  name: string
  email: string
  street: string
  apartment: string
  city: string
  postalCode: string
}

type CurrentUser = {
  name: string
  email: string
  role: "buyer" | "seller" | "admin"
}

const initialForm: CheckoutForm = {
  name: "",
  email: "",
  street: "",
  apartment: "",
  city: "",
  postalCode: "",
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [form, setForm] = useState(initialForm)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet">("card")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    const timeout = window.setTimeout(() => setItems(readCart()), 0)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    let active = true

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" })
        const data = await response.json()
        if (active) {
          setUser(data.user)
          if (data.user?.email) {
            setForm((current) => ({
              ...current,
              name: current.name || data.user.name || "",
              email: current.email || data.user.email,
            }))
          }
        }
      } catch {
        if (active) setUser(null)
      } finally {
        if (active) setIsAuthLoading(false)
      }
    }

    loadUser()
    return () => {
      active = false
    }
  }, [])

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shipping = subtotal > 150 ? 0 : 12
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const placeOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage("")
    setOrderId("")

    if (user && user.role !== "buyer" && user.role !== "admin") {
      setMessage("Use a buyer account or continue without signing in.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          paymentMethod,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? "Please review your checkout details.")
      }

      clearCart()
      setItems([])
      setOrderId(data.order.id)
      toast.success("Order placed", {
        description: `Order ${data.order.id} is processing.`,
      })
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Order could not be created."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />

      <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-5 lg:px-6">
        <div className="mb-5">
          <p className="text-xs font-black text-[#9a4d10] uppercase">
            Encrypted checkout
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-[#063f34]">
            Complete your purchase
          </h1>
          <p className="mt-2 text-sm text-[#53615c]">
            A refined checkout for meaningful objects and independent makers.
          </p>
        </div>

        {!isAuthLoading && !user && (
          <section className="mb-4 rounded-lg border border-[#d8dfdc] bg-white p-4">
            <h2 className="font-black text-[#063f34]">
              Checkout as guest or sign in
            </h2>
            <p className="mt-1 text-sm font-semibold text-[#53615c]">
              Guest checkout is available. Sign in first if you want this order
              attached to your buyer account immediately.
            </p>
            <Link
              href="/login"
              className="mt-3 inline-flex rounded-lg border border-[#063f34] px-4 py-2 text-sm font-black text-[#063f34] focus:ring-4 focus:ring-[#063f34]/20 focus:outline-none"
            >
              Sign in
            </Link>
          </section>
        )}

        {!isAuthLoading &&
          user &&
          user.role !== "buyer" &&
          user.role !== "admin" && (
            <section className="mb-4 rounded-lg border border-[#f1c9a5] bg-[#fff8f1] p-4">
              <h2 className="font-black text-[#7a3907]">Buyer checkout only</h2>
              <p className="mt-1 text-sm font-semibold text-[#7a5a40]">
                Seller accounts cannot place marketplace orders while signed in.
                Sign out or use a buyer account.
              </p>
              <Link
                href="/login"
                className="mt-3 inline-flex rounded-lg bg-[#063f34] px-4 py-2 text-sm font-black text-white focus:ring-4 focus:ring-[#063f34]/20 focus:outline-none"
              >
                Sign in as buyer
              </Link>
            </section>
          )}

        {orderId ? (
          <section className="rounded-lg border border-[#d8dfdc] bg-white p-6">
            <h2 className="text-2xl font-black text-[#063f34]">
              Order received
            </h2>
            <p className="mt-2 text-sm text-[#53615c]">
              {orderId} is now saved to MongoDB. Create or sign in to a buyer
              account with {form.email || "the checkout email"} to track this
              order later.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {user ? (
                <Link
                  href={`/account/orders/${orderId}`}
                  className="inline-flex justify-center rounded-lg bg-[#063f34] px-4 py-2 text-sm font-black text-white focus:ring-4 focus:ring-[#063f34]/20 focus:outline-none"
                >
                  View order details
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="inline-flex justify-center rounded-lg bg-[#063f34] px-4 py-2 text-sm font-black text-white focus:ring-4 focus:ring-[#063f34]/20 focus:outline-none"
                >
                  Create account to track
                </Link>
              )}
              <Link
                href="/browse"
                className="inline-flex justify-center rounded-lg border border-[#063f34] px-4 py-2 text-sm font-black text-[#063f34] focus:ring-4 focus:ring-[#063f34]/20 focus:outline-none"
              >
                Continue shopping
              </Link>
            </div>
          </section>
        ) : (
          <form
            onSubmit={placeOrder}
            className="grid gap-4 lg:grid-cols-[1fr_300px]"
          >
            <section className="space-y-5">
              <div className="rounded-lg border border-[#d8dfdc] bg-white p-4">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#063f34] text-sm font-black text-white">
                    1
                  </span>
                  <h2 className="text-lg font-black text-[#063f34]">
                    Shipping address
                  </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["name", "Full name"],
                    ["email", "Email"],
                    ["street", "Street address"],
                    ["apartment", "Apartment / suite"],
                    ["city", "City"],
                    ["postalCode", "ZIP / postal code"],
                  ].map(([field, label], index) => (
                    <label
                      key={field}
                      className={index === 2 ? "sm:col-span-2" : ""}
                    >
                      <span className="mb-2 block text-sm font-bold text-[#53615c]">
                        {label}
                      </span>
                      <input
                        required={field !== "apartment"}
                        type={field === "email" ? "email" : "text"}
                        value={form[field as keyof CheckoutForm]}
                        onChange={(event) =>
                          updateField(
                            field as keyof CheckoutForm,
                            event.target.value
                          )
                        }
                        className="h-9 w-full rounded-lg border border-[#d8dfdc] bg-[#fbfbf8] px-3 outline-none focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/10"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-[#d8dfdc] bg-white p-4">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#063f34] text-sm font-black text-white">
                    2
                  </span>
                  <h2 className="text-lg font-black text-[#063f34]">
                    Payment method
                  </h2>
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setPaymentMethod("card")}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      setPaymentMethod("card")
                    }
                  }}
                  className={`w-full rounded-lg border-2 p-4 text-left ${
                    paymentMethod === "card"
                      ? "border-[#063f34] bg-[#f6faf8]"
                      : "border-[#d8dfdc] bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3 font-black text-[#063f34]">
                    <CreditCard size={20} /> Credit or debit card
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <input
                      className="h-9 rounded-lg border border-[#d8dfdc] bg-white px-3 outline-none sm:col-span-2"
                      placeholder="Cardholder name"
                    />
                    <input
                      className="h-9 rounded-lg border border-[#d8dfdc] bg-white px-3 outline-none sm:col-span-2"
                      placeholder="0000 0000 0000 0000"
                    />
                    <input
                      className="h-9 rounded-lg border border-[#d8dfdc] bg-white px-3 outline-none"
                      placeholder="MM / YY"
                    />
                    <input
                      className="h-9 rounded-lg border border-[#d8dfdc] bg-white px-3 outline-none"
                      placeholder="CVV"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("wallet")}
                  className={`mt-3 flex w-full items-center gap-3 rounded-lg border p-4 font-bold ${
                    paymentMethod === "wallet"
                      ? "border-[#063f34] bg-[#f6faf8] text-[#063f34]"
                      : "border-[#d8dfdc] text-[#53615c]"
                  }`}
                >
                  <Wallet size={20} /> Digital wallet
                </button>
              </div>

              <div className="rounded-lg border border-[#d8dfdc] bg-white p-4">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#063f34] text-sm font-black text-white">
                    3
                  </span>
                  <h2 className="text-lg font-black text-[#063f34]">
                    Review order
                  </h2>
                </div>
                <div className="space-y-3">
                  {items.length ? (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 border-b border-[#d8dfdc] pb-3 last:border-0"
                      >
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-[#edf2ef]">
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-[#063f34]">
                            {item.name}
                          </p>
                          <p className="text-sm text-[#53615c]">
                            Qty {item.quantity}
                            {item.seller ? ` · ${item.seller}` : ""}
                          </p>
                        </div>
                        <p className="font-black">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm font-semibold text-[#53615c]">
                      Your cart is empty.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <aside className="h-fit rounded-lg border border-[#d8dfdc] bg-[#063f34] p-4 text-white lg:sticky lg:top-24">
              <h2 className="text-lg font-black">Order summary</h2>
              <div className="mt-4 space-y-4 text-white/76">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <strong className="text-white">${subtotal.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <strong className="text-white">
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Estimated tax</span>
                  <strong className="text-white">${tax.toFixed(2)}</strong>
                </div>
              </div>
              <div className="mt-4 border-t border-white/20 pt-4">
                <p className="text-xs font-bold text-white/62 uppercase">
                  Total
                </p>
                <p className="mt-1 text-2xl font-black">${total.toFixed(2)}</p>
              </div>
              {message && (
                <p className="mt-4 rounded-lg bg-white/10 p-3 text-sm font-semibold text-white">
                  {message}
                </p>
              )}
              <button
                disabled={
                  !items.length ||
                  isSubmitting ||
                  isAuthLoading ||
                  Boolean(
                    user && user.role !== "buyer" && user.role !== "admin"
                  )
                }
                className="mt-5 flex h-9 w-full items-center justify-center rounded-lg bg-[#f28a35] font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 animate-spin" size={18} />
                ) : (
                  <Lock className="mr-2" size={18} />
                )}
                Place order
              </button>
              <div className="mt-4 grid gap-3 text-sm font-semibold text-white/78">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={17} /> Secure encrypted checkout
                </span>
                <span className="flex items-center gap-2">
                  <Truck size={17} /> Delivery estimate: 3-5 business days
                </span>
              </div>
            </aside>
          </form>
        )}
      </main>

      <Footer />
    </div>
  )
}
