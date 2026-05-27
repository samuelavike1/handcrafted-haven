import Link from "next/link"
import { ArrowRight, BadgeCheck, BarChart3, PackagePlus } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ShimmerImage from "@/components/ui/shimmer-image"
import { images } from "@/lib/images"

export const metadata = {
  title: "Sell on Handcrafted Haven",
  description:
    "Open a seller studio, publish handcrafted listings, and manage your artisan business.",
}

export default function SellPage() {
  return (
    <div className="min-h-screen bg-hh-canvas">
      <Navbar />

      <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-5 lg:px-6">
        <section className="overflow-hidden rounded-lg border border-hh-border bg-hh-card">
          <div className="relative h-40">
            <Image
              src={featuredSeller.cover}
      <main>
        <section className="relative overflow-hidden border-b border-[#d8dfdc]">
          <div className="absolute inset-0">
            <ShimmerImage
              src={images.categoryPottery}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,45,37,0.92),rgba(4,45,37,0.62),rgba(4,45,37,0.18))]" />
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
                <h1 className="text-2xl font-black text-hh-heading">
                  {featuredSeller.name}
                </h1>
                <div className="mt-2 flex flex-wrap gap-4 text-sm font-semibold text-hh-muted">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} /> {featuredSeller.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star size={15} className="fill-[#c8651b] text-[#c8651b]" />{" "}
                    {featuredSeller.rating} ({featuredSeller.reviews} reviews)
                  </span>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-hh-muted">
                  {featuredSeller.story}
                </p>
              </div>
            </div>
            <div className="flex gap-3 md:self-start">
              <button className="rounded-lg border border-[#063f34] px-3 py-2 text-sm font-black text-hh-heading">
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
              className={`rounded-lg border p-4 ${index === 0 ? "border-[#063f34] bg-[#063f34] text-white" : "border-hh-border bg-hh-card"}`}
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
                className={`mt-2 text-sm ${index === 0 ? "text-white/72" : "text-hh-muted"}`}
              >
                {hint}

          <div className="relative mx-auto grid min-h-[390px] max-w-[1080px] items-center px-4 py-10 sm:px-5 lg:px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-black text-[#f7b071] uppercase">
                Seller program
              </p>
              <h1 className="mt-3 text-3xl leading-tight font-black text-white sm:text-4xl">
                Build a trusted storefront for your handcrafted work.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/82">
                Register your studio, publish product listings, track inventory,
                and prepare your shop for buyers who care about origin,
                materials, and craft.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sell/register"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-[#f28a35] px-4 text-sm font-black text-white"
                >
                  Start selling <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link
                  href="/sell/login"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-white/70 px-4 text-sm font-black text-white hover:bg-white hover:text-[#063f34]"
                >
                  Seller sign in
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-lg border border-hh-border bg-hh-card">
          <div className="flex flex-col gap-4 border-b border-hh-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black text-[#9a4d10] uppercase">
                Seller tools
              </p>
              <h2 className="text-2xl font-black text-hh-heading">
                Product listings
              </h2>
            </div>
            <button className="inline-flex items-center justify-center rounded-lg bg-[#063f34] px-3 py-2 text-sm font-black text-white">
              <PackagePlus className="mr-2" size={18} /> Add product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-hh-surface text-xs font-black tracking-[0.12em] text-hh-muted uppercase">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hh-border">
                {listings.map((product, index) => (
                  <tr key={product.id} className="hover:bg-hh-canvas">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-hh-subtle">
                          <Image
                            src={product.image}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="font-black text-hh-body">
                            {product.name}
                          </p>
                          <p className="text-sm text-hh-muted">
                            {product.category} · {product.materials?.[0]}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-black ${index === 3 ? "bg-[#fff4e8] text-[#9a4d10] dark:bg-[#2a1800] dark:text-[#e8a060]" : "bg-[#e6f3ef] text-[#063f34] dark:bg-[#0c2920] dark:text-[#7acfb9]"}`}
                      >
                        {index === 3 ? "Low stock" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-hh-muted">
                      {index === 3 ? 2 : 12 - index * 2} in stock
                    </td>
                    <td className="px-4 py-3 font-black">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="rounded-lg p-2 text-hh-muted hover:bg-hh-subtle">
                          <Edit3 size={17} />
                        </button>
                        <button className="rounded-lg p-2 text-hh-muted hover:bg-hh-subtle">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        <section className="mx-auto grid max-w-[1080px] gap-4 px-4 py-6 sm:px-5 md:grid-cols-3 lg:px-6">
          {[
            {
              icon: BadgeCheck,
              title: "Verified studio profile",
              text: "Show your craft story, location, and trust signals in one place.",
            },
            {
              icon: PackagePlus,
              title: "Product management",
              text: "Add listings with pricing, stock, materials, status, and buyer-ready details.",
            },
            {
              icon: BarChart3,
              title: "Seller dashboard",
              text: "Track inventory, orders, visits, and performance after signing in.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-lg border border-[#d8dfdc] bg-white p-4"
            >
              <Icon className="text-[#063f34]" size={22} />
              <h2 className="mt-4 text-lg font-black text-[#063f34]">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#53615c]">{text}</p>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  )
}
