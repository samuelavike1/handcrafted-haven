import Image from "next/image"
import { CreditCard, Lock, ShieldCheck, Truck, Wallet } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { products } from "@/lib/market-data"

const reviewItems = [
  { ...products[0], qty: 1 },
  { ...products[2], qty: 1 },
]

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-hh-canvas">
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

        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <section className="space-y-5">
            <div className="rounded-lg border border-hh-border bg-hh-card p-4 lg:p-4">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#063f34] text-sm font-black text-white">
                  1
                </span>
                <h2 className="text-lg font-black text-hh-heading">
                  Shipping address
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Full name",
                  "Email",
                  "Street address",
                  "Apartment / suite",
                  "City",
                  "ZIP / postal code",
                ].map((label, index) => (
                  <label
                    key={label}
                    className={index === 2 ? "sm:col-span-2" : ""}
                  >
                    <span className="mb-2 block text-sm font-bold text-hh-muted">
                      {label}
                    </span>
                    <input className="h-9 w-full rounded-lg border border-hh-border bg-hh-canvas px-3 outline-none focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/10" />
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-hh-border bg-hh-card p-4 lg:p-4">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#063f34] text-sm font-black text-white">
                  2
                </span>
                <h2 className="text-lg font-black text-hh-heading">
                  Payment method
                </h2>
              </div>
              <div className="rounded-lg border-2 border-[#063f34] bg-hh-subtle p-4">
                <div className="flex items-center gap-3 font-black text-[#063f34]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#063f34]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#063f34]" />
                  </span>
                  <CreditCard size={20} /> Credit or debit card
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input
                    className="h-9 rounded-lg border border-hh-border bg-hh-card px-3 outline-none sm:col-span-2"
                    placeholder="Cardholder name"
                  />
                  <input
                    className="h-9 rounded-lg border border-hh-border bg-hh-card px-3 outline-none sm:col-span-2"
                    placeholder="0000 0000 0000 0000"
                  />
                  <input
                    className="h-9 rounded-lg border border-hh-border bg-hh-card px-3 outline-none"
                    placeholder="MM / YY"
                  />
                  <input
                    className="h-9 rounded-lg border border-hh-border bg-hh-card px-3 outline-none"
                    placeholder="CVV"
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-hh-border p-4 font-bold text-hh-muted">
                <span className="h-5 w-5 rounded-full border border-[#cfd9d4]" />
                <Wallet size={20} /> Digital wallet
              </div>
            </div>

            <div className="rounded-lg border border-hh-border bg-hh-card p-4 lg:p-4">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#063f34] text-sm font-black text-white">
                  3
                </span>
                <h2 className="text-lg font-black text-hh-heading">
                  Review order
                </h2>
              </div>
              <div className="space-y-3">
                {reviewItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 border-b border-hh-border pb-3 last:border-0"
                  >
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-hh-subtle">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-hh-heading">{item.name}</p>
                      <p className="text-sm text-hh-muted">
                        Qty {item.qty} · {item.seller}
                      </p>
                    </div>
                    <p className="font-black">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-lg border border-[#d8dfdc] bg-[#063f34] p-4 text-white lg:sticky lg:top-24">
            <h2 className="text-lg font-black">Order summary</h2>
            <div className="mt-4 space-y-4 text-white/76">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <strong className="text-white">$202.00</strong>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <strong className="text-white">FREE</strong>
              </div>
              <div className="flex justify-between">
                <span>Estimated tax</span>
                <strong className="text-white">$16.16</strong>
              </div>
            </div>
            <div className="mt-4 border-t border-white/20 pt-4">
              <p className="text-xs font-bold text-white/62 uppercase">Total</p>
              <p className="mt-1 text-2xl font-black">$218.16</p>
            </div>
            <button className="mt-5 flex h-9 w-full items-center justify-center rounded-lg bg-[#f28a35] font-black text-white">
              Place order <Lock className="ml-2" size={18} />
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
        </div>
      </main>

      <Footer />
    </div>
  )
}
