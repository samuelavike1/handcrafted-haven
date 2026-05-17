import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import {
  categories,
  featuredSeller,
  products,
  storyPosts,
} from "@/lib/market-data"
import { images } from "@/lib/images"

const featuredProducts = products.slice(0, 4)

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={images.heroArtisan}
              alt=""
              fill
              priority
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,45,37,0.92)_0%,rgba(4,45,37,0.78)_42%,rgba(4,45,37,0.22)_100%)]" />
          </div>

          <div className="relative mx-auto grid min-h-[560px] max-w-[1180px] items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/12 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
                <Sparkles size={16} /> Curated handmade goods from verified
                artisans
              </div>
              <h1 className="max-w-2xl text-4xl leading-tight font-black text-white sm:text-5xl lg:text-[56px]">
                Objects with soul, made by real hands.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/82">
                Discover ceramics, textiles, woodwork, jewelry, and custom
                pieces from independent makers who value craft, story, and
                sustainability.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/browse"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-[#f28a35] px-5 text-sm font-black text-white transition hover:bg-[#dc7624]"
                >
                  Explore the marketplace{" "}
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link
                  href="/sell"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-white/70 px-5 text-sm font-black text-white transition hover:bg-white hover:text-[#063f34]"
                >
                  Open a seller studio
                </Link>
              </div>

              <div className="mt-9 grid max-w-xl grid-cols-3 gap-4 text-white">
                {[
                  ["4.9/5", "average rating"],
                  ["3.2k+", "artisan listings"],
                  ["92%", "plastic-free shipping"],
                ].map(([value, label]) => (
                  <div key={label} className="border-l border-white/30 pl-4">
                    <p className="text-xl font-black">{value}</p>
                    <p className="mt-1 text-sm text-white/72">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden rounded-xl border border-white/20 bg-white/16 p-3 shadow-2xl backdrop-blur-xl lg:block">
              <div className="rounded-lg bg-[#fbfbf8] p-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                  <Image
                    src={products[0].image}
                    alt={products[0].name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-md bg-[#edf2ef] px-2.5 py-1 text-[11px] font-black text-[#063f34] uppercase">
                      Featured drop
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold text-[#1b211f]">
                      <Star
                        size={15}
                        className="fill-[#c8651b] text-[#c8651b]"
                      />{" "}
                      4.9
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-[#063f34]">
                    {products[0].name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#53615c]">
                    {products[0].description}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-xl font-black">
                      ${products[0].price.toFixed(2)}
                    </p>
                    <Link
                      href="/product/moonlight-vase"
                      className="rounded-lg bg-[#063f34] px-4 py-2.5 text-sm font-black text-white"
                    >
                      View piece
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black text-[#9a4d10] uppercase">
                Shop by craft
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#063f34]">
                Find the right kind of handmade.
              </h2>
            </div>
            <Link
              href="/browse"
              className="inline-flex items-center font-black text-[#063f34]"
            >
              Browse all categories <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/browse?category=${category.slug}`}
                className={`group relative min-h-[240px] overflow-hidden rounded-lg ${
                  index === 0 ? "md:col-span-2" : ""
                }`}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#042d25]/85 via-[#042d25]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xl font-black">{category.name}</p>
                  <p className="mt-1 text-sm text-white/78">{category.count}</p>
                  <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/82">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-[#f0f3ef] py-12">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black text-[#9a4d10] uppercase">
                  Collector favorites
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#063f34]">
                  Handpicked pieces with provenance.
                </h2>
              </div>
              <div className="relative w-full sm:w-[320px]">
                <Search
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-[#6d7a75]"
                  size={18}
                />
                <input
                  className="h-10 w-full rounded-lg border border-[#d8dfdc] bg-white pr-4 pl-12 text-sm outline-none"
                  placeholder="Search vases, throws, trays..."
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} showAction />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1180px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="overflow-hidden rounded-lg bg-[#063f34] text-white">
            <div className="relative h-64">
              <Image
                src={featuredSeller.cover}
                alt={featuredSeller.name}
                fill
                className="object-cover opacity-80"
                unoptimized
              />
            </div>
            <div className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-lg border-4 border-white">
                  <Image
                    src={featuredSeller.avatar}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-xl font-black">{featuredSeller.name}</p>
                  <p className="text-sm text-white/72">
                    {featuredSeller.location}
                  </p>
                </div>
              </div>
              <p className="leading-relaxed text-white/82">
                {featuredSeller.story}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-black text-[#9a4d10] uppercase">
              Seller profiles
            </p>
            <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-[#063f34]">
              Give artisans a studio, not just a storefront.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#53615c]">
              Sellers can tell their story, publish detailed product listings,
              build trust through reviews, and connect with customers who care
              about materials, origin, and process.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Users, label: "Dedicated profiles" },
                { icon: BadgeCheck, label: "Verified craft" },
                { icon: ShieldCheck, label: "Secure commerce" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-[#d8dfdc] bg-white p-4"
                >
                  <item.icon className="text-[#063f34]" />
                  <p className="mt-4 font-black text-[#063f34]">{item.label}</p>
                </div>
              ))}
            </div>
            <Link
              href="/sell"
              className="mt-8 inline-flex w-fit items-center rounded-lg bg-[#063f34] px-5 py-3 text-sm font-black text-white"
            >
              Visit seller dashboard <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </section>

        <section className="border-t border-[#d8dfdc] bg-white py-12">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black text-[#9a4d10] uppercase">
                  Community journal
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#063f34]">
                  Stories behind the work.
                </h2>
              </div>
              <Link
                href="/stories"
                className="inline-flex items-center font-black text-[#063f34]"
              >
                Read all stories <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {storyPosts.map((story) => (
                <Link
                  key={story.id}
                  href={`/stories/${story.id}`}
                  className="group overflow-hidden rounded-lg border border-[#d8dfdc] bg-[#fbfbf8]"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-[11px] font-black text-[#9a4d10] uppercase">
                      {story.category}
                    </p>
                    <h3 className="mt-3 text-xl leading-tight font-black text-[#063f34]">
                      {story.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#53615c]">
                      {story.excerpt}
                    </p>
                    <p className="mt-5 text-sm font-semibold text-[#53615c]">
                      {story.readTime} · {story.date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
