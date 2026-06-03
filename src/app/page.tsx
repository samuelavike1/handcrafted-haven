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
import ShimmerImage from "@/components/ui/shimmer-image"
import { getProducts } from "@/lib/server-products"

async function getHomepageProducts() {
  try {
    return await getProducts()
  } catch {
    return []
  }
}

export default async function HomePage() {
  const dbProducts = await getHomepageProducts()
  const featuredProducts = dbProducts
    .filter((product) => product.status !== "Draft")
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating
      return b.reviews - a.reviews
    })
    .slice(0, 4)
  const fallbackProducts = products.slice(0, 4)
  const homepageProducts = featuredProducts.length
    ? featuredProducts
    : fallbackProducts
  const heroProduct = homepageProducts[0] ?? products[0]

  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <ShimmerImage
              src={images.heroArtisan}
              alt=""
              fill
              priority
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,45,37,0.92)_0%,rgba(4,45,37,0.78)_42%,rgba(4,45,37,0.22)_100%)]" />
          </div>

          <div className="relative mx-auto grid min-h-[460px] max-w-[1080px] items-center gap-6 px-4 py-8 sm:px-5 lg:grid-cols-[1fr_320px] lg:px-6">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/12 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                <Sparkles size={16} /> Curated handmade goods from verified
                artisans
              </div>
              <h1 className="max-w-2xl text-3xl leading-tight font-black text-white sm:text-4xl lg:text-[44px]">
                Objects with soul, made by real hands.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/82">
                Discover ceramics, textiles, woodwork, jewelry, and custom
                pieces from independent makers who value craft, story, and
                sustainability.
              </p>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  href="/browse"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-[#f28a35] px-4 text-xs font-black text-white transition hover:bg-[#dc7624]"
                >
                  Explore the marketplace{" "}
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link
                  href="/sell"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-white/70 px-4 text-xs font-black text-white transition hover:bg-white hover:text-[#063f34]"
                >
                  Open a seller studio
                </Link>
              </div>

              <div className="mt-6 grid max-w-xl grid-cols-3 gap-4 text-white">
                {[
                  ["4.9/5", "average rating"],
                  ["3.2k+", "artisan listings"],
                  ["92%", "plastic-free shipping"],
                ].map(([value, label]) => (
                  <div key={label} className="border-l border-white/30 pl-4">
                    <p className="text-lg font-black">{value}</p>
                    <p className="mt-1 text-sm text-white/72">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden rounded-lg border border-white/20 bg-white/16 p-2.5 shadow-2xl backdrop-blur-xl lg:block">
              <div className="rounded-lg bg-[#fbfbf8] p-2.5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                  <ShimmerImage
                    src={heroProduct.image}
                    alt={heroProduct.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-3">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="rounded-md bg-[#edf2ef] px-2.5 py-1 text-[11px] font-black text-[#063f34] uppercase">
                      Featured drop
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold text-[#1b211f]">
                      <Star
                        size={15}
                        className="fill-[#c8651b] text-[#c8651b]"
                      />{" "}
                      {heroProduct.rating}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-[#063f34]">
                    {heroProduct.name}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-[#53615c]">
                    {heroProduct.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-black">
                      ${heroProduct.price.toFixed(2)}
                    </p>
                    <Link
                      href={`/product/${heroProduct.id}`}
                      className="rounded-md bg-[#063f34] px-3 py-2 text-xs font-black text-white"
                    >
                      View piece
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1080px] px-4 py-6 sm:px-5 lg:px-6">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black text-[#9a4d10] uppercase">
                Shop by craft
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#063f34]">
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
                className={`group relative min-h-[190px] overflow-hidden rounded-lg ${
                  index === 0 ? "md:col-span-2" : ""
                }`}
              >
                <ShimmerImage
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#042d25]/85 via-[#042d25]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-lg font-black">{category.name}</p>
                  <p className="mt-1 text-sm text-white/78">{category.count}</p>
                  <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/82">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-[#f0f3ef] py-6">
          <div className="mx-auto max-w-[1080px] px-4 sm:px-5 lg:px-6">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black text-[#9a4d10] uppercase">
                  Collector favorites
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#063f34]">
                  Handpicked pieces with provenance.
                </h2>
              </div>
              <form action="/browse" className="relative w-full sm:w-[320px]">
                <Search
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-[#6d7a75]"
                  size={18}
                />
                <input
                  name="q"
                  className="h-9 w-full rounded-lg border border-[#d8dfdc] bg-white pr-4 pl-12 text-sm outline-none"
                  placeholder="Search vases, throws, trays..."
                />
              </form>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {homepageProducts.map((product) => (
                <ProductCard key={product.id} product={product} showAction />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1080px] gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="overflow-hidden rounded-lg bg-[#063f34] text-white">
            <div className="relative h-36">
              <ShimmerImage
                src={featuredSeller.cover}
                alt={featuredSeller.name}
                fill
                className="object-cover opacity-80"
                unoptimized
              />
            </div>
            <div className="p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg border-4 border-white">
                  <ShimmerImage
                    src={featuredSeller.avatar}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-lg font-black">{featuredSeller.name}</p>
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
            <h2 className="mt-2 max-w-2xl text-2xl font-black tracking-tight text-[#063f34]">
              Give artisans a studio, not just a storefront.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#53615c]">
              Sellers can tell their story, publish detailed product listings,
              build trust through reviews, and connect with customers who care
              about materials, origin, and process.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
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
              className="mt-5 inline-flex w-fit items-center rounded-md bg-[#063f34] px-4 py-2 text-sm font-black text-white"
            >
              Start selling <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </section>

        <section className="border-t border-[#d8dfdc] bg-white py-6">
          <div className="mx-auto max-w-[1080px] px-4 sm:px-5 lg:px-6">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black text-[#9a4d10] uppercase">
                  Community journal
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#063f34]">
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
            <div className="grid gap-4 md:grid-cols-3">
              {storyPosts.map((story) => (
                <article
                  key={story.id}
                  className="overflow-hidden rounded-lg border border-[#d8dfdc] bg-[#fbfbf8]"
                >
                  <div className="relative h-36 overflow-hidden">
                    <ShimmerImage
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] font-black text-[#9a4d10] uppercase">
                      {story.category}
                    </p>
                    <h3 className="mt-3 text-lg leading-tight font-black text-[#063f34]">
                      {story.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#53615c]">
                      {story.excerpt}
                    </p>
                    <p className="mt-5 text-sm font-semibold text-[#53615c]">
                      {story.readTime} · {story.date}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
