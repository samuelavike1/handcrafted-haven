import Image from "next/image"
import Link from "next/link"
import {
  BadgeCheck,
  BarChart3,
  Edit3,
  Eye,
  MapPin,
  MoreHorizontal,
  PackagePlus,
  Star,
  Truck,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { featuredSeller, products } from "@/lib/market-data"

export default function SellerDashboardPage() {
  const listings = products.slice(0, 4)
  const stats = [
    {
      label: "Total revenue",
      value: "$12,480",
      hint: "+14% this month",
      icon: BarChart3,
    },
    {
      label: "Active listings",
      value: "42",
      hint: "8 need updates",
      icon: PackagePlus,
    },
    {
      label: "Unfulfilled orders",
      value: "8",
      hint: "Ship by Friday",
      icon: Truck,
    },
    { label: "Shop visits", value: "2.4k", hint: "Last 30 days", icon: Eye },
  ]

  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />

      <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-5 lg:px-6">
        <section className="overflow-hidden rounded-lg border border-[#d8dfdc] bg-white">
          <div className="relative h-40">
            <Image
              src={featuredSeller.cover}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          </div>
          <div className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:p-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative -mt-12 h-20 w-20 shrink-0 overflow-hidden rounded-lg border-4 border-white shadow-xl">
                <Image
                  src={featuredSeller.avatar}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
                <span className="absolute right-1.5 bottom-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-[#063f34] text-white">
                  <BadgeCheck size={14} />
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#063f34]">
                  {featuredSeller.name}
                </h1>
                <div className="mt-2 flex flex-wrap gap-4 text-sm font-semibold text-[#53615c]">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} /> {featuredSeller.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star size={15} className="fill-[#c8651b] text-[#c8651b]" />{" "}
                    {featuredSeller.rating} ({featuredSeller.reviews} reviews)
                  </span>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-[#53615c]">
                  {featuredSeller.story}
                </p>
              </div>
            </div>
            <div className="flex gap-3 md:self-start">
              <button className="rounded-lg border border-[#063f34] px-3 py-2 text-sm font-black text-[#063f34]">
                Edit profile
              </button>
              <Link
                href="/browse"
                className="rounded-lg bg-[#f28a35] px-3 py-2 text-sm font-black text-white"
              >
                View public shop
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-4">
          {stats.map(({ label, value, hint, icon: Icon }, index) => (
            <div
              key={label}
              className={`rounded-lg border p-4 ${index === 0 ? "border-[#063f34] bg-[#063f34] text-white" : "border-[#d8dfdc] bg-white"}`}
            >
              <Icon
                size={22}
                className={index === 0 ? "text-white/70" : "text-[#063f34]"}
              />
              <p
                className={`mt-4 text-xs font-black uppercase ${index === 0 ? "text-white/62" : "text-[#9a4d10]"}`}
              >
                {label}
              </p>
              <p className="mt-2 text-2xl font-black">{value}</p>
              <p
                className={`mt-2 text-sm ${index === 0 ? "text-white/72" : "text-[#53615c]"}`}
              >
                {hint}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-4 rounded-lg border border-[#d8dfdc] bg-white">
          <div className="flex flex-col gap-4 border-b border-[#d8dfdc] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black text-[#9a4d10] uppercase">
                Seller tools
              </p>
              <h2 className="text-2xl font-black text-[#063f34]">
                Product listings
              </h2>
            </div>
            <button className="inline-flex items-center justify-center rounded-lg bg-[#063f34] px-3 py-2 text-sm font-black text-white">
              <PackagePlus className="mr-2" size={18} /> Add product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-[#f0f3ef] text-xs font-black tracking-[0.12em] text-[#53615c] uppercase">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d8dfdc]">
                {listings.map((product, index) => (
                  <tr key={product.id} className="hover:bg-[#fbfbf8]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-[#edf2ef]">
                          <Image
                            src={product.image}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="font-black text-[#1b211f]">
                            {product.name}
                          </p>
                          <p className="text-sm text-[#53615c]">
                            {product.category} · {product.materials?.[0]}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-black ${index === 3 ? "bg-[#fff4e8] text-[#9a4d10]" : "bg-[#e6f3ef] text-[#063f34]"}`}
                      >
                        {index === 3 ? "Low stock" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#53615c]">
                      {index === 3 ? 2 : 12 - index * 2} in stock
                    </td>
                    <td className="px-4 py-3 font-black">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="rounded-lg p-2 text-[#53615c] hover:bg-[#edf2ef]">
                          <Edit3 size={17} />
                        </button>
                        <button className="rounded-lg p-2 text-[#53615c] hover:bg-[#edf2ef]">
                          <MoreHorizontal size={18} />
                        </button>
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
