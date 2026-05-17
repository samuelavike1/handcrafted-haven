import Image from "next/image"
import Link from "next/link"
import { BadgeCheck, BarChart3, Edit3, Eye, MapPin, MoreHorizontal, PackagePlus, Star, Truck } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { featuredSeller, products } from "@/lib/market-data"

export default function SellerDashboardPage() {
  const listings = products.slice(0, 4)
  const stats = [
    { label: "Total revenue", value: "$12,480", hint: "+14% this month", icon: BarChart3 },
    { label: "Active listings", value: "42", hint: "8 need updates", icon: PackagePlus },
    { label: "Unfulfilled orders", value: "8", hint: "Ship by Friday", icon: Truck },
    { label: "Shop visits", value: "2.4k", hint: "Last 30 days", icon: Eye },
  ]

  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12">
        <section className="overflow-hidden rounded-[34px] border border-[#d8dfdc] bg-white">
          <div className="relative h-72">
            <Image src={featuredSeller.cover} alt="" fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          </div>
          <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:p-8">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="relative -mt-20 h-36 w-36 shrink-0 overflow-hidden rounded-3xl border-4 border-white shadow-xl">
                <Image src={featuredSeller.avatar} alt="" fill className="object-cover" unoptimized />
                <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#063f34] text-white">
                  <BadgeCheck size={17} />
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-black text-[#063f34]">{featuredSeller.name}</h1>
                <div className="mt-2 flex flex-wrap gap-4 text-sm font-semibold text-[#53615c]">
                  <span className="flex items-center gap-1.5"><MapPin size={15} /> {featuredSeller.location}</span>
                  <span className="flex items-center gap-1.5"><Star size={15} className="fill-[#c8651b] text-[#c8651b]" /> {featuredSeller.rating} ({featuredSeller.reviews} reviews)</span>
                </div>
                <p className="mt-4 max-w-3xl leading-relaxed text-[#53615c]">{featuredSeller.story}</p>
              </div>
            </div>
            <div className="flex gap-3 md:self-start">
              <button className="rounded-full border border-[#063f34] px-5 py-3 font-black text-[#063f34]">Edit profile</button>
              <Link href="/browse" className="rounded-full bg-[#f28a35] px-5 py-3 font-black text-white">View public shop</Link>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-4">
          {stats.map(({ label, value, hint, icon: Icon }, index) => (
            <div key={label} className={`rounded-3xl border p-6 ${index === 0 ? "border-[#063f34] bg-[#063f34] text-white" : "border-[#d8dfdc] bg-white"}`}>
              <Icon size={22} className={index === 0 ? "text-white/70" : "text-[#063f34]"} />
              <p className={`mt-5 text-sm font-black uppercase tracking-[0.12em] ${index === 0 ? "text-white/62" : "text-[#9a4d10]"}`}>{label}</p>
              <p className="mt-2 text-4xl font-black">{value}</p>
              <p className={`mt-2 text-sm ${index === 0 ? "text-white/72" : "text-[#53615c]"}`}>{hint}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[34px] border border-[#d8dfdc] bg-white">
          <div className="flex flex-col gap-4 border-b border-[#d8dfdc] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9a4d10]">Seller tools</p>
              <h2 className="text-3xl font-black text-[#063f34]">Product listings</h2>
            </div>
            <button className="inline-flex items-center justify-center rounded-full bg-[#063f34] px-5 py-3 font-black text-white">
              <PackagePlus className="mr-2" size={18} /> Add product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-[#f0f3ef] text-xs font-black uppercase tracking-[0.12em] text-[#53615c]">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d8dfdc]">
                {listings.map((product, index) => (
                  <tr key={product.id} className="hover:bg-[#fbfbf8]">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-[#edf2ef]">
                          <Image src={product.image} alt="" fill className="object-cover" unoptimized />
                        </div>
                        <div>
                          <p className="font-black text-[#1b211f]">{product.name}</p>
                          <p className="text-sm text-[#53615c]">{product.category} · {product.materials?.[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${index === 3 ? "bg-[#fff4e8] text-[#9a4d10]" : "bg-[#e6f3ef] text-[#063f34]"}`}>
                        {index === 3 ? "Low stock" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-semibold text-[#53615c]">{index === 3 ? 2 : 12 - index * 2} in stock</td>
                    <td className="px-6 py-5 font-black">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <button className="rounded-full p-2 text-[#53615c] hover:bg-[#edf2ef]"><Edit3 size={17} /></button>
                        <button className="rounded-full p-2 text-[#53615c] hover:bg-[#edf2ef]"><MoreHorizontal size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
