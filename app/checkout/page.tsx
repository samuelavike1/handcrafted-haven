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
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />

      <main className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9a4d10]">Encrypted checkout</p>
          <h1 className="mt-2 text-5xl font-black tracking-tight text-[#063f34]">Complete your purchase</h1>
          <p className="mt-3 text-lg text-[#53615c]">A refined checkout for meaningful objects and independent makers.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-[#d8dfdc] bg-white p-6 lg:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#063f34] font-black text-white">1</span>
                <h2 className="text-2xl font-black text-[#063f34]">Shipping address</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {["Full name", "Email", "Street address", "Apartment / suite", "City", "ZIP / postal code"].map((label, index) => (
                  <label key={label} className={index === 2 ? "sm:col-span-2" : ""}>
                    <span className="mb-2 block text-sm font-bold text-[#53615c]">{label}</span>
                    <input className="h-12 w-full rounded-2xl border border-[#d8dfdc] bg-[#fbfbf8] px-4 outline-none focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/10" />
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#d8dfdc] bg-white p-6 lg:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#063f34] font-black text-white">2</span>
                <h2 className="text-2xl font-black text-[#063f34]">Payment method</h2>
              </div>
              <div className="rounded-3xl border-2 border-[#063f34] bg-[#f6faf8] p-5">
                <div className="flex items-center gap-3 font-black text-[#063f34]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#063f34]"><span className="h-2.5 w-2.5 rounded-full bg-[#063f34]" /></span>
                  <CreditCard size={20} /> Credit or debit card
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <input className="h-12 rounded-2xl border border-[#d8dfdc] bg-white px-4 outline-none sm:col-span-2" placeholder="Cardholder name" />
                  <input className="h-12 rounded-2xl border border-[#d8dfdc] bg-white px-4 outline-none sm:col-span-2" placeholder="0000 0000 0000 0000" />
                  <input className="h-12 rounded-2xl border border-[#d8dfdc] bg-white px-4 outline-none" placeholder="MM / YY" />
                  <input className="h-12 rounded-2xl border border-[#d8dfdc] bg-white px-4 outline-none" placeholder="CVV" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 rounded-3xl border border-[#d8dfdc] p-5 font-bold text-[#53615c]">
                <span className="h-5 w-5 rounded-full border border-[#cfd9d4]" />
                <Wallet size={20} /> Digital wallet
              </div>
            </div>

            <div className="rounded-3xl border border-[#d8dfdc] bg-white p-6 lg:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#063f34] font-black text-white">3</span>
                <h2 className="text-2xl font-black text-[#063f34]">Review order</h2>
              </div>
              <div className="space-y-4">
                {reviewItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b border-[#d8dfdc] pb-4 last:border-0">
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-[#edf2ef]">
                      <Image src={item.image} alt="" fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-[#063f34]">{item.name}</p>
                      <p className="text-sm text-[#53615c]">Qty {item.qty} · {item.seller}</p>
                    </div>
                    <p className="font-black">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-[#d8dfdc] bg-[#063f34] p-6 text-white lg:sticky lg:top-28">
            <h2 className="text-2xl font-black">Order summary</h2>
            <div className="mt-6 space-y-4 text-white/76">
              <div className="flex justify-between"><span>Subtotal</span><strong className="text-white">$202.00</strong></div>
              <div className="flex justify-between"><span>Shipping</span><strong className="text-white">FREE</strong></div>
              <div className="flex justify-between"><span>Estimated tax</span><strong className="text-white">$16.16</strong></div>
            </div>
            <div className="mt-6 border-t border-white/20 pt-6">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-white/62">Total</p>
              <p className="mt-1 text-5xl font-black">$218.16</p>
            </div>
            <button className="mt-7 flex h-14 w-full items-center justify-center rounded-full bg-[#f28a35] font-black text-white">
              Place order <Lock className="ml-2" size={18} />
            </button>
            <div className="mt-6 grid gap-3 text-sm font-semibold text-white/78">
              <span className="flex items-center gap-2"><ShieldCheck size={17} /> Secure encrypted checkout</span>
              <span className="flex items-center gap-2"><Truck size={17} /> Delivery estimate: 3-5 business days</span>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
