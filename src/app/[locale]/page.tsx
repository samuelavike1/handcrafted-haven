import { getTranslations } from "next-intl/server"
import {
  ArrowRight,
  BadgeCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react"
import { Link } from "@/i18n/navigation"
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

const featuredProducts = products.slice(0, 4)

export default async function HomePage() {
  const t = await getTranslations("home")
  const tCat = await getTranslations("categories")
  const tProd = await getTranslations("products")
  const tStories = await getTranslations("stories")
  const tFeatured = await getTranslations("featuredSeller")

  // Pre-translate card data so child components receive the correct language
  const translatedCategories = categories.map((cat) => ({
    ...cat,
    name: tCat(`${cat.slug}.name` as Parameters<typeof tCat>[0]),
    count: tCat(`${cat.slug}.count` as Parameters<typeof tCat>[0]),
    description: tCat(`${cat.slug}.description` as Parameters<typeof tCat>[0]),
  }))

  const translatedFeaturedProducts = featuredProducts.map((p) => ({
    ...p,
    name: tProd(`${p.id}.name` as Parameters<typeof tProd>[0]),
    description: tProd(`${p.id}.description` as Parameters<typeof tProd>[0]),
    badge: tProd(`${p.id}.badge` as Parameters<typeof tProd>[0]),
    category: tProd(`${p.id}.category` as Parameters<typeof tProd>[0]),
    materials: [
      tProd(`${p.id}.material` as Parameters<typeof tProd>[0]),
      ...(p.materials?.slice(1) ?? []),
    ],
  }))

  const translatedStories = storyPosts.map((s) => ({
    ...s,
    title: tStories(`${s.id}.title` as Parameters<typeof tStories>[0]),
    excerpt: tStories(`${s.id}.excerpt` as Parameters<typeof tStories>[0]),
    category: tStories(`${s.id}.category` as Parameters<typeof tStories>[0]),
    readTime: tStories(`${s.id}.readTime` as Parameters<typeof tStories>[0]),
  }))

  const translatedSellerStory = tFeatured("story")

  const sellerFeatures = [
    { icon: Users, label: t("dedicatedProfiles") },
    { icon: BadgeCheck, label: t("verifiedCraft") },
    { icon: ShieldCheck, label: t("secureCom") },
  ]

  const stats: [string, string][] = [
    ["4.9/5", t("rating")],
    ["3.2k+", t("listings")],
    ["92%", t("shipping")],
  ]

  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://handcrafted-haven.vercel.app"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Handcrafted Haven",
    description:
      "Discover curated artisan treasures from independent makers worldwide.",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/en/browse?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <div className="min-h-screen bg-hh-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main>
        <section aria-label="Hero banner" className="relative overflow-hidden">
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
                <Sparkles size={16} /> {t("heroBadge")}
              </div>
              <h1 className="max-w-2xl text-3xl leading-tight font-black text-white sm:text-4xl lg:text-[44px]">
                {t("heroTitle")}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/82">
                {t("heroDesc")}
              </p>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  href="/browse"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-[#f28a35] px-4 text-xs font-black text-white transition hover:bg-[#dc7624]"
                >
                  {t("exploreBtn")} <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link
                  href="/sell"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-white/70 px-4 text-xs font-black text-white transition hover:bg-white hover:text-[#063f34]"
                >
                  {t("sellBtn")}
                </Link>
              </div>

              <div className="mt-6 grid max-w-xl grid-cols-3 gap-4 text-white">
                {stats.map(([value, label]) => (
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
                    src={products[0].image}
                    alt={products[0].name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-3">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="rounded-md bg-[#edf2ef] px-2.5 py-1 text-[11px] font-black text-[#063f34] uppercase">
                      {t("featuredDrop")}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold text-[#1b211f]">
                      <Star
                        size={15}
                        className="fill-[#c8651b] text-[#c8651b]"
                      />{" "}
                      4.9
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-[#063f34]">
                    {translatedFeaturedProducts[0].name}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-[#53615c]">
                    {translatedFeaturedProducts[0].description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-black">
                      ${products[0].price.toFixed(2)}
                    </p>
                    <Link
                      href="/product/moonlight-vase"
                      className="rounded-md bg-[#063f34] px-3 py-2 text-xs font-black text-white"
                    >
                      {t("viewPiece")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Shop by category" className="mx-auto max-w-[1080px] px-4 py-6 sm:px-5 lg:px-6">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black text-[#9a4d10] uppercase">
                {t("shopByCraft")}
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-hh-heading">
                {t("findHandmade")}
              </h2>
            </div>
            <Link
              href="/browse"
              className="inline-flex items-center font-black text-hh-heading"
            >
              {t("browseAll")} <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {translatedCategories.map((category, index) => (
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

        <section aria-label="Featured products" className="bg-hh-surface py-6">
          <div className="mx-auto max-w-[1080px] px-4 sm:px-5 lg:px-6">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black text-[#9a4d10] uppercase">
                  {t("collectorFav")}
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-hh-heading">
                  {t("handpicked")}
                </h2>
              </div>
              <form action="/browse" className="relative w-full sm:w-[320px]">
                <Search
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-hh-muted"
                  size={18}
                />
                <input
                  className="h-9 w-full rounded-lg border border-hh-border bg-hh-card pr-4 pl-12 text-sm outline-none"
                  name="q"
                  placeholder={t("searchPlaceholder")}
                />
              </form>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {translatedFeaturedProducts.map((product) => (
                <ProductCard key={product.id} product={product} showAction />
              ))}
            </div>
          </div>
        </section>

        <section aria-label="Featured seller" className="mx-auto grid max-w-[1080px] gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
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
                {translatedSellerStory}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-black text-[#9a4d10] uppercase">
              {t("sellerProfiles")}
            </p>
            <h2 className="mt-2 max-w-2xl text-2xl font-black tracking-tight text-hh-heading">
              {t("sellerTitle")}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-hh-muted">
              {t("sellerDesc")}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {sellerFeatures.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-hh-border bg-hh-card p-4"
                >
                  <item.icon className="text-hh-heading" />
                  <p className="mt-4 font-black text-hh-heading">{item.label}</p>
                </div>
              ))}
            </div>
            <Link
              href="/sell"
              className="mt-5 inline-flex w-fit items-center rounded-md bg-[#063f34] px-4 py-2 text-sm font-black text-white"
            >
              {t("startSelling")} <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </section>

        <section aria-label="Community journal" className="border-t border-hh-border bg-hh-card py-6">
          <div className="mx-auto max-w-[1080px] px-4 sm:px-5 lg:px-6">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black text-[#9a4d10] uppercase">
                  {t("commJournal")}
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-hh-heading">
                  {t("storiesTitle")}
                </h2>
              </div>
              <Link
                href="/stories"
                className="inline-flex items-center font-black text-hh-heading"
              >
                {t("readAll")} <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {translatedStories.map((story) => (
                <Link
                  key={story.id}
                  href={`/stories/${story.id}`}
                  className="group overflow-hidden rounded-lg border border-hh-border bg-hh-canvas"
                >
                  <div className="relative h-36 overflow-hidden">
                    <ShimmerImage
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] font-black text-[#9a4d10] uppercase">
                      {story.category}
                    </p>
                    <h3 className="mt-3 text-lg leading-tight font-black text-hh-heading">
                      {story.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-hh-muted">
                      {story.excerpt}
                    </p>
                    <p className="mt-5 text-sm font-semibold text-hh-muted">
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
